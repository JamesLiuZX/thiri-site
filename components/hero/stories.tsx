"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Pause, Play, Volume2 } from "lucide-react"
import type { Video } from "@/content/profile"
import EmbedFace from "@/components/work/embed-face"
import { usePlayer } from "@/components/providers"
import { views } from "@/lib/day"
import { cn } from "@/lib/site"

const SECONDS = 5

/**
 * Her covers, played as stories: progress bars along the top, her avatar,
 * a REC dot and the running timecode, and under each cover what it is and
 * how many watched it. Tap the right side for the next one and the left
 * for the last, hold to pause, or watch it with sound.
 *
 * Stories advance only while they are on screen and the tab is visible, and
 * pause while the player is open. Reduced motion starts them paused.
 */
export default function Stories({
  stories,
  avatar,
  handle,
  pillars,
  className,
}: {
  stories: Video[]
  avatar?: string
  handle: string
  /** Pillar id to its tab name, shown beside her handle. */
  pillars: Record<string, string>
  className?: string
}) {
  const open = usePlayer()
  const [index, setIndex] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [visible, setVisible] = useState(false)
  const [paused, setPaused] = useState(false)
  const [held, setHeld] = useState(false)
  const [away, setAway] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const holdTimer = useRef(0)
  const wasHeld = useRef(false)

  const running = visible && !paused && !held && !away

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true)
    const el = root.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 })
    observer.observe(el)
    const onVisibility = () => setAway(document.hidden)
    const onOpen = () => setAway(true)
    const onClose = () => setAway(document.hidden)
    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener("player:open", onOpen)
    window.addEventListener("player:close", onClose)
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("player:open", onOpen)
      window.removeEventListener("player:close", onClose)
    }
  }, [])

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => setElapsed((seconds) => Math.min(SECONDS, seconds + 1)), 1000)
    return () => window.clearInterval(id)
  }, [running, index])

  if (stories.length === 0) return null
  const current = stories[index]

  const go = (step: number) => {
    setPrev(index)
    setElapsed(0)
    setIndex((i) => (i + step + stories.length) % stories.length)
  }

  const onDown = () => {
    wasHeld.current = false
    window.clearTimeout(holdTimer.current)
    holdTimer.current = window.setTimeout(() => {
      wasHeld.current = true
      setHeld(true)
    }, 220)
  }
  const onUp = () => {
    window.clearTimeout(holdTimer.current)
    if (wasHeld.current) setHeld(false)
  }
  const onTap = (step: number) => () => {
    if (wasHeld.current) {
      wasHeld.current = false
      return
    }
    go(step)
  }
  const zone = "absolute inset-y-0 z-10 cursor-pointer touch-manipulation [-webkit-touch-callout:none] focus-visible:outline-offset-[-6px]"

  return (
    <div
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${handle}'s stories`}
      className={cn("story relative aspect-[3/4] w-full select-none overflow-hidden rounded-[28px] bg-ink text-white shadow-lift", className)}
      onContextMenu={(event) => event.preventDefault()}
    >
      {stories.map((video, i) => (
        <div
          key={video.id}
          aria-hidden={i !== index}
          className={cn("story-slide absolute inset-0", i === index && "is-active", i === prev && i !== index && "was-active", i === index && running && "is-running")}
        >
          {video.poster ? (
            <img src={video.poster} alt="" draggable={false} loading={i < 2 ? "eager" : "lazy"} className="h-full w-full object-cover" />
          ) : (
            <EmbedFace video={video} />
          )}
        </div>
      ))}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-32 bg-gradient-to-b from-black/50 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[55%] bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

      <button
        type="button"
        aria-label="Previous story"
        className={cn(zone, "left-0 w-[32%]")}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onPointerCancel={onUp}
        onClick={onTap(-1)}
      />
      <button
        type="button"
        aria-label="Next story"
        className={cn(zone, "right-0 w-[68%]")}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onPointerCancel={onUp}
        onClick={onTap(1)}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3 md:p-3.5">
        <div aria-hidden="true" className="flex gap-1">
          {stories.map((video, i) => (
            <span key={video.id} className="h-[2.5px] flex-1 overflow-hidden rounded-full bg-white/35">
              <span
                className={cn("block h-full origin-left rounded-full bg-white", i < index ? "scale-x-100" : i > index ? "scale-x-0" : "story-fill")}
                style={i === index ? ({ animationPlayState: running ? "running" : "paused", "--story-s": `${SECONDS}s` } as CSSProperties) : undefined}
                onAnimationEnd={i === index ? () => go(1) : undefined}
              />
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2.5">
          {avatar ? (
            <span className="story-ring shrink-0 rounded-full p-[2px]">
              <img src={avatar} alt="" className="h-8 w-8 rounded-full border-2 border-ink object-cover object-top" />
            </span>
          ) : null}
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[13px] font-semibold">{handle.replace(/^@/, "")}</span>
            <span className="block truncate text-[11.5px] text-white/70">{(current.pillar && pillars[current.pillar]) || "Most viewed"}</span>
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.14em]" aria-hidden="true">
            <span className={cn("rec-dot", running && "is-live")} />
            REC 00:0{elapsed}
          </span>
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? "Play the stories" : "Pause the stories"}
            className="pointer-events-auto -mr-1 grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white/15"
          >
            {paused ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4 fill-current" />}
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-5 md:p-6">
        {/* Her covers carry their own titles; this is the quiet "now playing" line under them. */}
        <p key={current.id} className="story-caption text-[14px] font-semibold leading-snug [text-shadow:0_1px_10px_rgb(0_0_0/0.4)]">
          {current.title}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[12px]">
          {current.result && <span className="rounded-full bg-white/15 px-2.5 py-1 font-medium backdrop-blur">▷ {views(current.result)} views</span>}
          {current.brand && <span className="rounded-full border border-white/30 px-2.5 py-1">{current.brand}</span>}
        </div>
        <button
          type="button"
          onClick={(event) => open(current, event.currentTarget)}
          className="pointer-events-auto mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-medium text-ink transition-transform active:scale-[0.97]"
        >
          <Volume2 className="h-4 w-4" />
          Watch with sound
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        {paused ? `Story ${index + 1} of ${stories.length}: ${current.title}` : ""}
      </p>
    </div>
  )
}
