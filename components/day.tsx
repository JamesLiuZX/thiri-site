"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/site"
import { PHONE_QUERY, usePastHero } from "./after-hero"

type RGB = [number, number, number]
type Stop = {
  /** Minutes after midnight. */
  t: number
  /** The sky, top to bottom. */
  sky: [RGB, RGB, RGB]
  /** 0 by day, 1 at night (stars, the lamp, light text on the arc). */
  night: number
  /** Window light: strength, sideways drift (vw), skew and tilt (deg). */
  light: number
  drift: number
  skew: number
  tilt: number
  /** Glows: dawn blush, noon white, golden apricot, night lamp. */
  glow: [number, number, number, number]
}

/*
 * The day's light, taken from her covers:
 *   dawn       the blush of her pink-makeup GRWMs
 *   morning    a soft sage cream
 *   noon       sea glass, from her island boat day and the clifftop
 *   afternoon  café latte
 *   golden     the apricot of her golden-hour beaches
 *   dusk       rose, like the pink sparkles on her covers
 *   evening    violet city dusk, then espresso ink with a lamp on
 */
const STOPS: Stop[] = [
  { t: 360, sky: [[224, 210, 226], [242, 223, 221], [249, 236, 228]], night: 0.15, light: 0.5, drift: 30, skew: 32, tilt: -6, glow: [0.8, 0, 0, 0] },
  { t: 450, sky: [[246, 217, 207], [250, 232, 222], [253, 244, 236]], night: 0, light: 0.85, drift: 26, skew: 28, tilt: -5, glow: [1, 0, 0, 0] },
  { t: 570, sky: [[236, 240, 231], [247, 245, 238], [252, 250, 245]], night: 0, light: 1, drift: 14, skew: 18, tilt: -3, glow: [0.35, 0.7, 0, 0] },
  { t: 720, sky: [[220, 239, 235], [245, 250, 247], [255, 253, 249]], night: 0, light: 0.75, drift: 0, skew: 4, tilt: 0, glow: [0, 1, 0, 0] },
  { t: 900, sky: [[242, 232, 219], [249, 243, 234], [252, 248, 241]], night: 0, light: 1, drift: -10, skew: -14, tilt: 2, glow: [0, 0.6, 0.4, 0] },
  { t: 1065, sky: [[246, 209, 165], [249, 225, 197], [252, 239, 224]], night: 0, light: 1, drift: -24, skew: -28, tilt: 5, glow: [0, 0, 1, 0] },
  { t: 1140, sky: [[231, 180, 185], [239, 203, 200], [246, 224, 217]], night: 0.05, light: 0.55, drift: -30, skew: -34, tilt: 6, glow: [0.3, 0, 0.8, 0] },
  { t: 1230, sky: [[95, 79, 104], [140, 112, 131], [185, 143, 150]], night: 0.5, light: 0, drift: -34, skew: -36, tilt: 6, glow: [0, 0, 0.25, 0.6] },
  { t: 1320, sky: [[29, 26, 33], [38, 33, 38], [46, 39, 41]], night: 1, light: 0, drift: -34, skew: -36, tilt: 6, glow: [0, 0, 0, 1] },
  { t: 1440, sky: [[23, 21, 27], [30, 27, 32], [36, 32, 34]], night: 1, light: 0, drift: -34, skew: -36, tilt: 6, glow: [0, 0, 0, 0.8] },
]

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const mix = (a: number, b: number, p: number) => a + (b - a) * p

function at(minutes: number): Stop {
  const m = clamp(minutes, STOPS[0].t, STOPS[STOPS.length - 1].t)
  let i = 0
  while (i < STOPS.length - 2 && STOPS[i + 1].t <= m) i++
  const a = STOPS[i]
  const b = STOPS[i + 1]
  const p = clamp((m - a.t) / (b.t - a.t))
  const rgb = (x: RGB, y: RGB) => x.map((v, k) => Math.round(mix(v, y[k], p))) as RGB
  return {
    t: m,
    sky: [rgb(a.sky[0], b.sky[0]), rgb(a.sky[1], b.sky[1]), rgb(a.sky[2], b.sky[2])],
    night: mix(a.night, b.night, p),
    light: mix(a.light, b.light, p),
    drift: mix(a.drift, b.drift, p),
    skew: mix(a.skew, b.skew, p),
    tilt: mix(a.tilt, b.tilt, p),
    glow: a.glow.map((v, k) => mix(v, b.glow[k], p)) as Stop["glow"],
  }
}

/** "HH:MM" to minutes; later sections that read earlier (00:00) roll past midnight. */
const minutesOf = (time: string) => {
  const [h, m] = time.split(":").map(Number)
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : NaN
}

const clock = (minutes: number) => {
  const m = Math.floor(minutes) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`
}

/** Where the sun (06:30 to 19:30) or the moon (after) sits on the arc, 0 to π. */
const arcAngle = (minutes: number) =>
  minutes < 1170 ? Math.PI * clamp((minutes - 390) / 780) : Math.PI * clamp((minutes - 1185) / 420) * 0.8

type Anchor = { el: HTMLElement; id: string; time: string; label: string; t: number }

/**
 * The day, felt rather than labelled. As the reader scrolls, the page's
 * light moves through one day: the sky changes colour, the sun's glow
 * travels from the left at dawn to the right at golden hour, window light
 * drifts and leans across the page, and at night a lamp comes on and the
 * stars come out. Sections set the hour they belong to with data-time.
 *
 * In the corner, the sun (then the moon) moves along an arc, with the
 * time it is in the day so far; tap it for the running order. On phones
 * it waits until the hero's stats have scrolled past.
 */
export default function Day() {
  const [anchors, setAnchors] = useState<Omit<Anchor, "el">[]>([])
  const [current, setCurrent] = useState<Omit<Anchor, "el"> | null>(null)
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLSpanElement>(null)
  const sunRef = useRef<SVGCircleElement>(null)
  const past = usePastHero()

  useEffect(() => {
    if (!past && window.matchMedia(PHONE_QUERY).matches) setOpen(false)
  }, [past])

  useEffect(() => {
    const html = document.documentElement
    const read = (): Anchor[] => {
      let last = -Infinity
      return Array.from(document.querySelectorAll<HTMLElement>("main [data-time], body > footer[data-time]")).flatMap((el) => {
        let t = minutesOf(el.dataset.time ?? "")
        if (!Number.isFinite(t)) return []
        if (t < last) t += 1440
        last = t
        return [{ el, id: el.id, time: el.dataset.time ?? "", label: el.dataset.moment ?? "", t }]
      })
    }
    let list = read()
    setAnchors(list.map(({ el: _el, ...rest }) => rest))

    const written: Record<string, string> = {}
    const write = (name: string, value: string) => {
      if (written[name] === value) return
      written[name] = value
      html.style.setProperty(name, value)
    }

    let frame = 0
    let lastId = ""
    const paint = () => {
      frame = 0
      if (list.length === 0) return
      const line = window.innerHeight * 0.5
      // Distance of each section's top above the line; the first counts from the page's top.
      const d = list.map((anchor, i) => (i === 0 ? -window.scrollY : anchor.el.getBoundingClientRect().top - line))
      let i = 0
      while (i < list.length - 1 && d[i + 1] <= 0) i++
      const next = list[i + 1]
      const p = next ? clamp(-d[i] / Math.max(1, d[i + 1] - d[i])) : 0
      const minutes = next ? mix(list[i].t, next.t, p) : list[i].t
      const s = at(minutes)

      write("--sky-1", s.sky[0].join(" "))
      write("--sky-2", s.sky[1].join(" "))
      write("--sky-3", s.sky[2].join(" "))
      write("--dark", s.night.toFixed(3))
      write("--light", s.light.toFixed(3))
      write("--light-drift", `${s.drift.toFixed(2)}vw`)
      write("--light-skew", `${s.skew.toFixed(2)}deg`)
      write("--light-tilt", `${s.tilt.toFixed(2)}deg`)
      s.glow.forEach((value, k) => write(`--glow-${k}`, value.toFixed(3)))
      // The sun's glow rides a wide arc over the page: low left, high, low right.
      const theta = Math.PI * clamp((minutes - 400) / 760)
      write("--sun-x", `${(50 - 46 * Math.cos(theta)).toFixed(2)}vw`)
      write("--sun-y", `${(96 - 104 * Math.sin(theta)).toFixed(2)}vh`)
      const part = s.night >= 0.5 ? "night" : "day"
      if (html.dataset.daypart !== part) html.dataset.daypart = part

      if (timeRef.current) timeRef.current.textContent = clock(minutes)
      if (sunRef.current) {
        const angle = arcAngle(minutes)
        sunRef.current.setAttribute("cx", (30 - 24 * Math.cos(angle)).toFixed(2))
        sunRef.current.setAttribute("cy", (30 - 24 * Math.sin(angle)).toFixed(2))
      }
      const here = list[i]
      if (here.id !== lastId) {
        lastId = here.id
        setCurrent({ id: here.id, time: here.time, label: here.label, t: here.t })
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }
    const refresh = () => {
      list = read()
      setAnchors(list.map(({ el: _el, ...rest }) => rest))
      lastId = ""
      schedule()
    }
    paint()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule, { passive: true })
    window.addEventListener("load", schedule)
    window.addEventListener("daytime:update", refresh)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("load", schedule)
      window.removeEventListener("daytime:update", refresh)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", close)
    document.addEventListener("keydown", close)
    return () => {
      document.removeEventListener("mousedown", close)
      document.removeEventListener("keydown", close)
    }
  }, [open])

  return (
    <>
      {/* The light itself: behind the page, then over it. */}
      <div aria-hidden="true" className="sky" />
      <div aria-hidden="true" className="glow glow-dawn" />
      <div aria-hidden="true" className="glow glow-noon" />
      <div aria-hidden="true" className="glow glow-gold" />
      <div aria-hidden="true" className="glow-lamp" />
      <div aria-hidden="true" className="stars" />
      <WindowLight />

      {current && (
        <div ref={root} className={cn("after-hero no-print fixed bottom-4 left-4 z-[60] md:bottom-6 md:left-6", past && "is-past")}>
          {open && (
            <nav
              aria-label="The day, section by section"
              className="enter mb-3 w-64 rounded-[22px] bg-surface/95 p-3 text-fg shadow-lift backdrop-blur"
              style={{ ["--dur" as string]: "0.35s", ["--enter-y" as string]: "8px" }}
            >
              <ol>
                {anchors.map((moment) => (
                  <li key={moment.id}>
                    <a
                      href={`#${moment.id}`}
                      onClick={() => setOpen(false)}
                      className={cn("flex items-baseline gap-3 rounded-xl px-3 py-2 text-[14px] transition-colors hover:bg-oat", moment.id === current.id && "bg-oat")}
                    >
                      <span className="w-12 shrink-0 font-hand text-[1.25rem] leading-none text-berry">{moment.time}</span>
                      <span className="truncate">{moment.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={`${current.label}, around ${current.time}. Show the day's running order.`}
            className="day-arc flex items-center gap-2 rounded-full py-1.5 pl-2.5 pr-4 shadow-lift backdrop-blur transition-colors duration-700"
          >
            <svg viewBox="0 0 60 34" aria-hidden="true" className="h-7 w-12 overflow-visible">
              <path d="M6 30 A24 24 0 0 1 54 30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 3" strokeLinecap="round" opacity="0.45" />
              <line x1="1" y1="30.5" x2="59" y2="30.5" stroke="currentColor" strokeWidth="1" opacity="0.3" />
              <circle ref={sunRef} cx="6" cy="30" r="4.2" className="day-arc-sun" />
            </svg>
            <span ref={timeRef} aria-hidden="true" className="w-[2.6rem] font-hand text-[1.3rem] leading-none tabular-nums">
              {current.time}
            </span>
          </button>
        </div>
      )}
    </>
  )
}

/**
 * Sunlight through a window, as the page's shadows: a warm patch of light,
 * the soft cross of the window bars, and a palm frond outside. Only the
 * shadows are drawn, so the layer has no edges to show as it leans,
 * drifts and fades with the hour (--light-*). By night it is gone.
 */
function WindowLight() {
  return (
    <div aria-hidden="true" className="window-light">
      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="h-full w-full overflow-visible">
        <defs>
          <filter id="wl-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="46" />
          </filter>
          <filter id="wl-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="13" />
          </filter>
          <filter id="wl-leaf" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        <rect x="430" y="120" width="740" height="760" rx="18" fill="rgb(255 241 222)" fillOpacity="0.3" filter="url(#wl-glow)" />
        <g filter="url(#wl-soft)" fill="rgb(96 60 40)" fillOpacity="0.085">
          <rect x="786" y="110" width="30" height="780" rx="6" />
          <rect x="420" y="486" width="760" height="28" rx="6" />
        </g>
        <g filter="url(#wl-leaf)" fill="rgb(96 60 40)" fillOpacity="0.075">
          <path d="M1250 40 C1160 170 1080 290 1010 450" fill="none" stroke="rgb(96 60 40)" strokeOpacity="0.075" strokeWidth="9" strokeLinecap="round" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => {
            const x = 1232 - k * 25
            const y = 74 + k * 42
            return (
              <g key={k}>
                <ellipse cx={x - 58} cy={y + 6} rx={74 - k * 3} ry="12" transform={`rotate(${26 + k * 3} ${x - 58} ${y + 6})`} />
                <ellipse cx={x + 44} cy={y + 30} rx={66 - k * 3} ry="11" transform={`rotate(${-40 + k * 2} ${x + 44} ${y + 30})`} />
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
