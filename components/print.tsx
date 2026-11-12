"use client"

import { useRef, type CSSProperties, type MouseEvent, type PointerEvent } from "react"
import { Play } from "lucide-react"
import { FORMAT_LABELS, type Video } from "@/content/profile"
import { parseEmbed } from "@/lib/embeds"
import { cn } from "@/lib/site"
import { useCanPreview, usePreviewPlayback, useSeen } from "@/components/work/use-preview"

export type PrintHandlers = {
  onPointerDown?: (event: PointerEvent<HTMLButtonElement>) => void
  onPointerMove?: (event: PointerEvent<HTMLButtonElement>) => void
  onPointerUp?: (event: PointerEvent<HTMLButtonElement>) => void
}

/**
 * One of her videos as an instant print: paper border, a deeper foot with a
 * caption, optional washi tape. The picture "develops" the first time it
 * comes into view, previews muted while on screen, and opens the player
 * with sound when tapped.
 *
 * With `handlers` (the moodboard) a press can become a drag: the parent
 * decides on pointer-up whether it was a tap, and keyboard activation still
 * opens the player.
 */
export default function Print({
  video,
  onOpen,
  rotate = 0,
  tape,
  caption,
  handlers,
  className,
  style,
  eager,
}: {
  video: Video
  onOpen: (video: Video, from: HTMLElement | null) => void
  rotate?: number
  tape?: "left" | "right" | "center"
  caption?: string
  handlers?: PrintHandlers
  className?: string
  style?: CSSProperties
  eager?: boolean
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const preview = useCanPreview(Boolean(video.src))
  usePreviewPlayback(videoRef, preview, 0.5)
  const seen = useSeen(buttonRef)
  const embed = !video.src ? parseEmbed(video.embed) : null

  // Mouse and touch taps arrive through the pointer handlers when dragging is
  // on; keyboard activation is a click with no pointer detail.
  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!handlers || event.detail === 0) onOpen(video, buttonRef.current)
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={`Play ${video.title}${video.brand ? `, for ${video.brand}` : ""}, ${FORMAT_LABELS[video.format]}`}
      onClick={onClick}
      {...handlers}
      className={cn("print group rotate-0 text-left transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1.5 hover:shadow-lift", (seen || eager) && "is-in", className)}
      style={{ "--tw-rotate": `${rotate}deg`, ...style } as CSSProperties}
    >
      <span className={cn("relative block overflow-hidden bg-oat", video.ratio === "3/4" ? "aspect-[3/4]" : "aspect-[9/16]")}>
        {video.poster && (
          <img src={video.poster} alt="" loading={eager ? "eager" : "lazy"} decoding="async" draggable={false} className="develop absolute inset-0 h-full w-full select-none object-cover" />
        )}
        {video.src && preview && (
          <video ref={videoRef} muted playsInline loop preload="none" poster={video.poster} aria-hidden="true" className="absolute inset-0 h-full w-full object-cover">
            {video.srcWebm && <source src={video.srcWebm} type="video/webm" />}
            <source src={video.src} type="video/mp4" />
          </video>
        )}
        {!video.poster && !video.src && (
          <span className="absolute inset-0 grid place-items-center bg-oat p-4 text-center">
            <span>
              <span className="block font-display text-[1.35rem] italic leading-tight">{video.title}</span>
              <span className="label mt-3 block text-[9px] text-muted">{embed ? `Plays on ${embed.label}` : "—"}</span>
            </span>
          </span>
        )}
        <span aria-hidden="true" className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-surface/90 text-fg shadow-print">
            <Play className="h-4 w-4 translate-x-px fill-current" />
          </span>
        </span>
      </span>
      <span aria-hidden="true" className="absolute inset-x-[7%] bottom-[4.5%] flex items-baseline justify-between gap-2">
        <span className="truncate font-display text-[clamp(0.95rem,1.15vw,1.2rem)] italic leading-none">{caption ?? video.brand ?? video.title}</span>
        <span className="label shrink-0 text-[9px] text-muted">{FORMAT_LABELS[video.format]}</span>
      </span>
      {tape && (
        <span
          aria-hidden="true"
          className={cn(
            "tape -top-[4.5%]",
            tape === "left" && "-left-[6%] -rotate-[28deg]",
            tape === "right" && "-right-[6%] rotate-[28deg]",
            tape === "center" && "left-[29%] -rotate-[3deg]",
          )}
        />
      )}
    </button>
  )
}
