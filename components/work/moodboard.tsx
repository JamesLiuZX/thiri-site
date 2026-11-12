"use client"

import { useRef, useState, type CSSProperties, type PointerEvent } from "react"
import { LayoutGrid, Shuffle, Sparkles } from "lucide-react"
import Fish from "@/components/fish"
import Print from "@/components/print"
import PlayerDialog, { type PlayerHandle } from "@/components/work/player-dialog"
import VideoGallery from "@/components/work/video-gallery"
import type { Video } from "@/content/profile"
import { cn } from "@/lib/site"

/** Where prints lie on the board: left and top as % of the board, width as % of its width, tilt. */
const SLOTS = [
  { x: 1.5, y: 9, w: 15.5, r: -6 },
  { x: 18.5, y: 0, w: 17, r: 3 },
  { x: 38, y: 8, w: 15.5, r: -2.5 },
  { x: 56, y: 0.5, w: 16, r: 5 },
  { x: 75.5, y: 10, w: 15.5, r: -4 },
  { x: 8, y: 50, w: 14.5, r: 4.5 },
  { x: 62, y: 51, w: 15, r: -3 },
  { x: 25.5, y: 55, w: 14, r: -5 },
  { x: 81, y: 54, w: 13.5, r: 6 },
]

const TAPES: ("left" | "right" | "center" | undefined)[] = ["center", undefined, "right", "center", "left", "center", undefined, "right", "left"]

function shuffled(length: number) {
  const order = Array.from({ length }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

/**
 * The work, as her moodboard: prints scattered on the table. Drag them
 * anywhere; "Shuffle" lays them out again with a little spring; tap a print
 * to play it with sound. On phones the board becomes a strip to swipe, and
 * "Grid" shows every video in a plain list, filterable by format.
 */
export default function Moodboard({ videos }: { videos: Video[] }) {
  const player = useRef<PlayerHandle>(null)
  const drag = useRef<{ id: string; x: number; y: number; from: { dx: number; dy: number }; moved: boolean } | null>(null)
  const onBoard = videos.slice(0, SLOTS.length)

  const [view, setView] = useState<"board" | "grid">("board")
  const [slots, setSlots] = useState(() => onBoard.map((_, i) => i))
  const [tilt, setTilt] = useState(() => onBoard.map(() => 0))
  const [offsets, setOffsets] = useState<Record<string, { dx: number; dy: number }>>({})
  const [stack, setStack] = useState(() => onBoard.map((video) => video.id))
  const [dragging, setDragging] = useState<string | null>(null)
  const [springy, setSpringy] = useState(false)

  const lift = (id: string) => setStack((current) => [...current.filter((item) => item !== id), id])

  const handlers = (video: Video) => ({
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) return
      event.currentTarget.setPointerCapture(event.pointerId)
      drag.current = { id: video.id, x: event.clientX, y: event.clientY, from: offsets[video.id] ?? { dx: 0, dy: 0 }, moved: false }
      setSpringy(false)
      lift(video.id)
    },
    onPointerMove: (event: PointerEvent<HTMLButtonElement>) => {
      const state = drag.current
      if (!state || state.id !== video.id) return
      const dx = event.clientX - state.x
      const dy = event.clientY - state.y
      if (!state.moved && Math.hypot(dx, dy) > 5) {
        state.moved = true
        setDragging(video.id)
      }
      if (state.moved) setOffsets((current) => ({ ...current, [video.id]: { dx: state.from.dx + dx, dy: state.from.dy + dy } }))
    },
    onPointerUp: (event: PointerEvent<HTMLButtonElement>) => {
      const state = drag.current
      drag.current = null
      setDragging(null)
      if (state && !state.moved) player.current?.open(video, event.currentTarget)
    },
  })

  const shuffle = () => {
    setSpringy(true)
    setOffsets({})
    setSlots(shuffled(onBoard.length))
    setTilt(onBoard.map(() => Math.round((Math.random() * 4 - 2) * 10) / 10))
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="View" className="inline-flex rounded-full border border-fg/15 bg-surface/70 p-1">
          {(["board", "grid"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={view === option}
              onClick={() => setView(option)}
              className={cn("inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] transition-colors", view === option ? "bg-accent text-accent-fg" : "text-muted hover:text-fg")}
            >
              {option === "board" ? <Sparkles className="h-3.5 w-3.5" /> : <LayoutGrid className="h-3.5 w-3.5" />}
              {option === "board" ? "Moodboard" : "Grid"}
            </button>
          ))}
        </div>
        {view === "board" && (
          <button type="button" onClick={shuffle} className="chip hidden hover:border-fg/40 lg:inline-flex">
            <Shuffle className="h-3.5 w-3.5" />
            Shuffle
          </button>
        )}
      </div>

      {view === "board" ? (
        <>
          {/* The board (wide screens) */}
          <div className="relative mt-10 hidden aspect-[1.42] lg:block">
            {onBoard.map((video, index) => {
              const slot = SLOTS[slots[index]]
              const offset = offsets[video.id] ?? { dx: 0, dy: 0 }
              const isDragging = dragging === video.id
              return (
                <div
                  key={video.id}
                  className={cn("absolute", springy && "transition-[left,top,transform] duration-700 ease-spring")}
                  style={{
                    left: `${slot.x}%`,
                    top: `${slot.y}%`,
                    width: `${slot.w}%`,
                    zIndex: 10 + stack.indexOf(video.id),
                    transform: `translate(${offset.dx}px, ${offset.dy}px)`,
                  }}
                >
                  <div className="settle" style={{ "--delay": `${0.1 + index * 0.09}s` } as CSSProperties}>
                    <Print
                      video={video}
                      onOpen={(item, from) => player.current?.open(item, from)}
                      rotate={slot.r + tilt[index] + (isDragging ? 2 : 0)}
                      tape={TAPES[slots[index]]}
                      handlers={handlers(video)}
                      className={cn("w-full touch-none cursor-grab active:cursor-grabbing", isDragging && "scale-[1.04] shadow-lift")}
                    />
                  </div>
                </div>
              )
            })}

            {/* A note left on the board */}
            <div className="pointer-events-none absolute left-[45%] top-[64%] z-[5] w-[14%] -rotate-2 bg-surface px-5 pb-5 pt-6 shadow-print">
              <span aria-hidden="true" className="tape -top-[10%] left-[30%] h-4 w-[40%] -rotate-3" />
              <p className="font-display text-[1.15rem] italic leading-snug">Drag the prints around. Tap one to play it, with sound.</p>
              <Fish className="mt-3 h-4 w-8 text-fish" />
            </div>
          </div>

          {/* The strip (phones and tablets) */}
          <div className="-mx-5 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-10 pt-4 md:-mx-10 md:px-10 lg:hidden">
            {videos.map((video, index) => (
              <div key={video.id} className="w-[64vw] max-w-[17rem] shrink-0 snap-center">
                <Print video={video} onOpen={(item, from) => player.current?.open(item, from)} rotate={index % 2 === 0 ? -2 : 2} tape={index % 3 === 0 ? "center" : undefined} className="w-full" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-10">
          <VideoGallery videos={videos} />
        </div>
      )}

      <PlayerDialog ref={player} />
    </div>
  )
}
