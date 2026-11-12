"use client"

import { useMemo, useRef, useState } from "react"
import PlayerDialog, { type PlayerHandle } from "@/components/work/player-dialog"
import VideoTile from "@/components/work/video-tile"
import { FORMAT_LABELS, type Format, type Video } from "@/content/profile"
import { cn } from "@/lib/site"

/** Her samples, filterable by format, with one shared player. */
export default function VideoGallery({ videos }: { videos: Video[] }) {
  const player = useRef<PlayerHandle>(null)
  const [filter, setFilter] = useState<Format | "all">("all")
  const formats = useMemo(() => Array.from(new Set(videos.map((video) => video.format))), [videos])
  const shown = filter === "all" ? videos : videos.filter((video) => video.format === filter)

  return (
    <div>
      {formats.length > 1 && (
        <div role="group" aria-label="Filter by format" className="flex flex-wrap gap-2">
          {(["all", ...formats] as const).map((format) => (
            <button
              key={format}
              type="button"
              aria-pressed={filter === format}
              onClick={() => setFilter(format)}
              className={cn("chip", filter === format ? "border-fg bg-fg text-bg" : "hover:border-fg/40")}
            >
              {format === "all" ? "All" : FORMAT_LABELS[format]}
            </button>
          ))}
        </div>
      )}

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
        {shown.map((video) => (
          <li key={video.id}>
            <VideoTile video={video} onOpen={(item, from) => player.current?.open(item, from)} />
          </li>
        ))}
      </ul>

      <PlayerDialog ref={player} />
    </div>
  )
}
