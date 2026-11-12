import type { CSSProperties } from "react"
import PlayButton from "@/components/play-button"
import SampleTag from "@/components/sample-tag"
import type { Frame, Video } from "@/content/profile"
import { site } from "@/content/site"
import { moment, views } from "@/lib/day"
import { cn } from "@/lib/site"

/**
 * A marker loop around a box (percent of the cover), drawn the way a hand
 * draws one: a little more than once around, wobbling, with an overshoot.
 */
function loop({ x, y, w, h }: Frame["mark"]) {
  const cx = x + w / 2
  const cy = y + h / 2
  const rx = w / 2 + 4
  const ry = h / 2 + 4
  const n = 16
  const points: [number, number][] = []
  for (let k = 0; k <= n; k++) {
    const angle = (-0.85 + (k / n) * 2.12) * Math.PI
    const wobble = 1 + 0.07 * Math.sin(k * 1.9) + (k > n - 3 ? 0.05 : 0)
    points.push([cx + rx * wobble * Math.cos(angle), cy + ry * wobble * Math.sin(angle)])
  }
  const f = (n: number) => n.toFixed(1)
  let d = `M${f(points[0][0])} ${f(points[0][1])}`
  for (let k = 0; k < points.length - 1; k++) {
    const p0 = points[Math.max(0, k - 1)]
    const p1 = points[k]
    const p2 = points[k + 1]
    const p3 = points[Math.min(points.length - 1, k + 2)]
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`
  }
  return d
}

// Per frame: its tilt, how far it drops, and which way its note's arrow points.
const LAYOUT = [
  { tilt: -2.5, drop: "lg:mt-0", note: "note-up" },
  { tilt: 1.8, drop: "lg:mt-24", note: "note-up-right" },
  { tilt: -1.2, drop: "lg:mt-10", note: "note-up-left" },
]

/**
 * 14:00. Why brands book her, shown rather than listed: three of her real
 * covers, marked up in pen like a creative's notes. A loop around the hook,
 * the product and the call to action, an arrow and a line on each, then the
 * reason it sells.
 */
export default function Anatomy() {
  const frames = site.anatomy
    .map((frame) => ({ frame, video: site.videos.find((video) => video.id === frame.videoId) }))
    .filter((item): item is { frame: Frame; video: Video } => Boolean(item.video))
  if (frames.length === 0) return null

  return (
    <section id="why" {...moment("14:00", "Why it works", "afternoon")} aria-labelledby="why-title" className="relative overflow-hidden py-20 md:py-28">
      <div className="shell">
        <header className="reveal relative max-w-3xl">
          <h2 id="why-title" className="font-hand text-[clamp(2.5rem,5.4vw,4.4rem)] leading-[0.92] tracking-[-0.01em]">
            how my videos sell, <span className="marker-under">frame by frame</span>
          </h2>
          <p className="mt-4 flex flex-wrap items-center gap-3 text-[15px] text-muted">
            Three of my covers, marked up.
            <SampleTag slots={["anatomy"]} />
          </p>
        </header>

        <ol className="observe anatomy mt-14 grid gap-20 md:mt-20 lg:grid-cols-3 lg:gap-12">
          {frames.map(({ frame, video }, i) => {
            const layout = LAYOUT[i % LAYOUT.length]
            return (
              <li
                key={frame.videoId}
                className={cn("anatomy-frame relative mx-auto w-[72%] max-w-[23rem] sm:w-[56%] lg:w-full", layout.drop, i % 2 === 1 && "max-lg:mr-2 max-lg:ml-auto")}
                style={{ "--i": i, "--r": `${layout.tilt}deg` } as CSSProperties}
              >
                <span aria-hidden="true" className="absolute -left-3 -top-9 z-10 font-script text-[4.2rem] leading-none text-berry/90 lg:-left-6">
                  {i + 1}
                </span>
                <figure className="relative">
                  <PlayButton video={video} label={`Play: ${video.title}`} className="frame-shot relative block w-full text-left">
                    {video.poster && <img src={video.poster} alt="" loading="lazy" className="aspect-[3/4] w-full rounded-[20px] object-cover shadow-lift ring-1 ring-black/5" />}
                    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="frame-mark pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                      <path d={loop(frame.mark)} vectorEffect="non-scaling-stroke" />
                    </svg>
                  </PlayButton>
                  <figcaption className={cn("frame-note relative mt-5 font-hand text-[1.6rem] leading-[1.05] text-berry", layout.note)}>
                    <svg aria-hidden="true" viewBox="0 0 64 64" className="frame-arrow">
                      <path d="M8 56 C 14 34, 30 18, 52 10" pathLength={1} />
                      <path d="M38 8 L 53 9.5 L 47 23" pathLength={1} />
                    </svg>
                    <span className="frame-note-text">{frame.note}</span>
                  </figcaption>
                </figure>
                <div className="mt-6">
                  <p className="label text-berry">{frame.stage}</p>
                  <h3 className="mt-2 font-display text-[clamp(1.7rem,2.3vw,2.1rem)] font-light leading-[1.08]">{frame.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{frame.body}</p>
                  {video.result && (
                    <p className="mt-3 text-[12.5px] text-fg/70">
                      ▷ {views(video.result)} views · {video.title}
                    </p>
                  )}
                </div>
                {i < frames.length - 1 && (
                  <svg aria-hidden="true" viewBox="0 0 120 60" className="frame-then hidden lg:block">
                    <path d="M4 40 C 30 6, 80 4, 112 30" pathLength={1} />
                    <path d="M100 18 L 113 31 L 96 36" pathLength={1} />
                  </svg>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
