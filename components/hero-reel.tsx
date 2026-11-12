"use client"

import { useRef } from "react"
import PlayerDialog, { type PlayerHandle } from "@/components/work/player-dialog"
import VideoTile from "@/components/work/video-tile"
import type { Video } from "@/content/profile"

/** The featured video in the hero: a tile with its own player. */
export default function HeroReel({ video }: { video: Video }) {
  const player = useRef<PlayerHandle>(null)
  return (
    <>
      <VideoTile video={video} onOpen={(item, from) => player.current?.open(item, from)} className="rounded-[1.75rem] shadow-xl" />
      <PlayerDialog ref={player} />
    </>
  )
}
