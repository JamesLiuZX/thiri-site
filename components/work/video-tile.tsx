"use client"

import { useEffect, useRef, useState } from "react"
import { Play } from "lucide-react"
import { FORMAT_LABELS, type Video } from "@/content/profile"
import { parseEmbed } from "@/lib/embeds"
import { cn } from "@/lib/site"

/**
 * A 9:16 tile. With a local file it previews muted, but only while at least
 * 60% of it is on screen, never for reduced motion or data saver, and never
 * while the player is open. Posters show until then; post URLs show their
 * poster (or a plain card) and only load the platform embed when opened.
 */
export default function VideoTile({
  video,
  onOpen,
  className,
}: {
  video: Video
  onOpen: (video: Video, from: HTMLElement | null) => void
  className?: string
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    if (!video.src) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    setPreview(!reduce && !saveData)
  }, [video.src])

  useEffect(() => {
    const el = videoRef.current
    if (!el || !preview) return
    let visible = false
    let playerOpen = false
    const sync = () => {
      if (visible && !playerOpen) void el.play().catch(() => {})
      else el.pause()
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.6
        sync()
      },
      { threshold: [0, 0.6] },
    )
    const onOpenPlayer = () => {
      playerOpen = true
      sync()
    }
    const onClosePlayer = () => {
      playerOpen = false
      sync()
    }
    observer.observe(el)
    window.addEventListener("player:open", onOpenPlayer)
    window.addEventListener("player:close", onClosePlayer)
    return () => {
      observer.disconnect()
      window.removeEventListener("player:open", onOpenPlayer)
      window.removeEventListener("player:close", onClosePlayer)
    }
  }, [preview])

  const embed = !video.src ? parseEmbed(video.embed) : null
  const label = `Play ${video.title}${video.brand ? `, for ${video.brand}` : ""}, ${FORMAT_LABELS[video.format]}`

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={() => onOpen(video, buttonRef.current)}
      aria-label={label}
      className={cn("group relative block aspect-[9/16] w-full overflow-hidden rounded-2xl bg-line text-left", className)}
    >
      {video.poster && <img src={video.poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />}
      {video.src && preview && (
        <video ref={videoRef} muted playsInline loop preload="none" poster={video.poster} aria-hidden="true" className="absolute inset-0 h-full w-full object-cover">
          {video.srcWebm && <source src={video.srcWebm} type="video/webm" />}
          <source src={video.src} type="video/mp4" />
        </video>
      )}
      {!video.poster && !video.src && (
        <span className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-muted">
          {embed ? `Plays on ${embed.label}` : "No preview"}
        </span>
      )}

      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
      <span aria-hidden="true" className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
        {FORMAT_LABELS[video.format]}
      </span>
      <span aria-hidden="true" className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 text-white">
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{video.brand ?? video.title}</span>
          {video.duration && <span className="text-xs text-white/70">{video.duration}</span>}
        </span>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/90 text-black transition-transform duration-300 group-hover:scale-110">
          <Play className="h-4 w-4 translate-x-px fill-current" />
        </span>
      </span>
    </button>
  )
}
