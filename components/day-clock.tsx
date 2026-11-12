"use client"

import { useEffect, useRef, useState } from "react"
import { Moon, Sun, Sunrise, Sunset } from "lucide-react"
import { cn } from "@/lib/site"
import { PHONE_QUERY, usePastHero } from "./after-hero"

type Moment = { id: string; time: string; label: string; light: string }

const icon = (light: string) => (light === "night" ? Moon : light === "golden" || light === "dusk" ? Sunset : light === "morning" ? Sunrise : Sun)

/**
 * The page keeps time like one of her vlogs: a timestamp in the corner
 * reads the hour of the section you are in, from 07:30 to after midnight.
 * Tap it for the day's running order. Sections opt in with data-time,
 * data-moment and data-light; the portfolio updates its own time per tab.
 * On phones it fades in only once the hero's stats have scrolled past.
 */
export default function DayClock() {
  const [moments, setMoments] = useState<Moment[]>([])
  const [current, setCurrent] = useState<Moment | null>(null)
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const past = usePastHero()

  useEffect(() => {
    if (!past && window.matchMedia(PHONE_QUERY).matches) setOpen(false)
  }, [past])

  useEffect(() => {
    const read = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-time]")).map((el) => ({
        id: el.id,
        time: el.dataset.time ?? "",
        label: el.dataset.moment ?? "",
        light: el.dataset.light ?? "noon",
        el,
      }))
    let sections = read()
    setMoments(sections.map(({ el: _el, ...moment }) => moment))
    let frame = 0
    let last = ""
    const paint = () => {
      frame = 0
      const line = window.innerHeight * 0.45
      let pick = sections[0]
      for (const section of sections) if (section.el.getBoundingClientRect().top <= line) pick = section
      const key = pick ? `${pick.id}-${pick.el.dataset.time}-${pick.el.dataset.moment}` : ""
      if (pick && key !== last) {
        last = key
        setCurrent({ id: pick.id, time: pick.el.dataset.time ?? "", label: pick.el.dataset.moment ?? "", light: pick.el.dataset.light ?? "noon" })
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }
    const refresh = () => {
      sections = read()
      setMoments(sections.map(({ el: _el, ...moment }) => moment))
      last = ""
      schedule()
    }
    paint()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule, { passive: true })
    window.addEventListener("daytime:update", refresh)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
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

  if (!current) return null
  const Icon = icon(current.light)
  const dark = current.light === "night"

  return (
    <div ref={root} className={cn("after-hero no-print fixed bottom-4 left-4 z-[60] md:bottom-6 md:left-6", past && "is-past")}>
      {open && (
        <nav aria-label="The day, section by section" className="enter mb-3 w-64 rounded-[22px] bg-surface/95 p-3 text-fg shadow-lift backdrop-blur" style={{ ["--dur" as string]: "0.35s", ["--enter-y" as string]: "8px" }}>
          <ol>
            {moments.map((moment) => (
              <li key={moment.id}>
                <a
                  href={`#${moment.id}`}
                  onClick={() => setOpen(false)}
                  className={cn("flex items-baseline gap-3 rounded-xl px-3 py-2 text-[14px] transition-colors hover:bg-oat", moment.id === current.id && "bg-oat")}
                >
                  <span className="w-[4.25rem] shrink-0 font-hand text-[1.25rem] leading-none text-rose">{moment.time}</span>
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
        aria-label={`It's ${current.time}: ${current.label}. Show the day's running order.`}
        className={cn(
          "flex items-center gap-2.5 rounded-full px-4 py-2.5 shadow-lift backdrop-blur transition-colors duration-500",
          dark ? "bg-lamp/90 text-night" : "bg-surface/90 text-fg",
        )}
      >
        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
        <span key={`${current.time}${current.label}`} className="tick-in flex items-baseline gap-2">
          <span className="font-hand text-[1.35rem] leading-none">{current.time}</span>
          <span className="hidden text-[12.5px] sm:inline">{current.label}</span>
        </span>
      </button>
    </div>
  )
}
