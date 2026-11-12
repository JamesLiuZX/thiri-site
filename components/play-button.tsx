"use client"

import type { CSSProperties, ReactNode } from "react"
import type { Video } from "@/content/profile"
import { usePlayer } from "@/components/providers"

/**
 * Wraps any server-rendered markup (a print, a ticket, a frame) in a button
 * that opens the page's player on this video, with sound.
 */
export default function PlayButton({
  video,
  label,
  className,
  style,
  children,
}: {
  video: Video
  label?: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const open = usePlayer()
  return (
    <button type="button" aria-label={label ?? `Play: ${video.title}`} className={className} style={style} onClick={(event) => open(video, event.currentTarget)}>
      {children}
    </button>
  )
}
