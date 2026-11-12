"use client"

import { useRef, type CSSProperties } from "react"
import Print from "@/components/print"
import PlayerDialog, { type PlayerHandle } from "@/components/work/player-dialog"
import type { Video } from "@/content/profile"

/** Three prints, just set down: the front one plays muted, a tap plays it with sound. */
const LAYOUT = [
  { left: "4%", top: "14%", width: "50%", rotate: -7, tape: undefined, delay: 0.55, drift: 0 },
  { left: "44%", top: "0%", width: "50%", rotate: 5, tape: "right" as const, delay: 0.7, drift: 1.2 },
  { left: "22%", top: "30%", width: "54%", rotate: -1.5, tape: "center" as const, delay: 0.4, drift: 2.4 },
]

export default function HeroCluster({ videos }: { videos: Video[] }) {
  const player = useRef<PlayerHandle>(null)
  // Front print last, so it lies on top.
  const prints = [videos[1], videos[2], videos[0]].filter(Boolean) as Video[]
  return (
    <div className="relative mx-auto aspect-[0.92] w-full max-w-[30rem]">
      {prints.map((video, index) => {
        const spot = LAYOUT[index]
        return (
          <div key={video.id} className="absolute" style={{ left: spot.left, top: spot.top, width: spot.width, zIndex: index + 1 }}>
            <div className="settle" style={{ "--delay": `${spot.delay}s` } as CSSProperties}>
              <div className="drift" style={{ "--delay": `${2 + spot.drift}s`, "--dur": `${7 + index}s` } as CSSProperties}>
                <Print video={video} onOpen={(item, from) => player.current?.open(item, from)} rotate={spot.rotate} tape={spot.tape} eager className="w-full" />
              </div>
            </div>
          </div>
        )
      })}
      <PlayerDialog ref={player} />
    </div>
  )
}
