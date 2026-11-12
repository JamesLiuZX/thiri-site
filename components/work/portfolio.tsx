"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Print from "@/components/print"
import Moodboard from "@/components/work/moodboard"
import PlayerDialog, { type PlayerHandle } from "@/components/work/player-dialog"
import type { Pillar, Video } from "@/content/profile"
import { cn } from "@/lib/site"

type Tab = Pick<Pillar, "id" | "time" | "tab" | "name" | "description">

/**
 * The portfolio as her day: one tab per pillar, each filed under its hour
 * (08:00 Beauty & Hair, 12:30 F&B, 17:30 Fashion, the weekend's travel),
 * plus "Everything", the moodboard. Each tab is a reel of prints to swipe
 * or step through; the page clock follows the tab you are on.
 */
export default function Portfolio({ pillars, videos, sectionId }: { pillars: Pillar[]; videos: Video[]; sectionId: string }) {
  const player = useRef<PlayerHandle>(null)
  const reel = useRef<HTMLUListElement>(null)
  const tabs: Tab[] = [
    ...pillars.filter((pillar) => videos.some((video) => video.pillar === pillar.id)),
    { id: "all", time: "All day", tab: "Everything", name: "Everything, on one board", description: "Every video on the table. Drag them around, or switch to the grid." },
  ]
  const [active, setActive] = useState(tabs[0]?.id ?? "all")
  const tab = tabs.find((item) => item.id === active) ?? tabs[0]
  const list = active === "all" ? videos : videos.filter((video) => video.pillar === active)

  // The page clock reads the section's time: keep it on the open tab.
  const tabTime = tab?.time
  const tabName = tab?.tab
  useEffect(() => {
    const section = document.getElementById(sectionId)
    if (!section || !tabTime || !tabName) return
    section.dataset.time = tabTime
    section.dataset.moment = tabName
    window.dispatchEvent(new Event("daytime:update"))
  }, [sectionId, tabTime, tabName])

  const step = (direction: 1 | -1) => {
    const el = reel.current
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" })
  }

  if (!tab) return null

  return (
    <div>
      <div role="tablist" aria-label="Portfolio" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:-mx-0 md:flex-wrap md:px-0">
        {tabs.map((item) => {
          const selected = item.id === active
          const count = item.id === "all" ? videos.length : videos.filter((video) => video.pillar === item.id).length
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={selected}
              aria-controls="portfolio-panel"
              onClick={() => setActive(item.id)}
              className={cn(
                "group flex shrink-0 items-baseline gap-3 rounded-full border px-5 py-3 text-left transition-colors duration-300",
                selected ? "border-accent bg-accent text-accent-fg" : "border-fg/15 bg-surface/70 hover:border-fg/35",
              )}
            >
              <span className={cn("font-hand text-[1.4rem] leading-none", selected ? "text-blush" : "text-rose")}>{item.time}</span>
              <span className="text-[14px] font-medium">{item.tab}</span>
              <span className={cn("text-[12px]", selected ? "text-accent-fg/60" : "text-muted")}>{count}</span>
            </button>
          )
        })}
      </div>

      <div id="portfolio-panel" role="tabpanel" aria-labelledby={`tab-${tab.id}`} className="mt-10">
        <div key={tab.id} className="enter flex flex-wrap items-end justify-between gap-6" style={{ "--dur": "0.6s" } as CSSProperties}>
          <div className="max-w-xl">
            <p className="font-display text-[clamp(1.8rem,3.2vw,2.6rem)] font-light italic leading-tight">{tab.name}</p>
            <p className="mt-2 text-[16px] leading-relaxed text-muted">{tab.description}</p>
          </div>
          {active !== "all" && (
            <div className="hidden gap-2 md:flex">
              <button type="button" onClick={() => step(-1)} aria-label="Previous videos" className="grid h-11 w-11 place-items-center rounded-full border border-fg/20 transition-colors hover:border-fg/50">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="More videos" className="grid h-11 w-11 place-items-center rounded-full border border-fg/20 transition-colors hover:border-fg/50">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {active === "all" ? (
          <div className="mt-8">
            <Moodboard videos={videos} />
          </div>
        ) : (
          <ul
            key={`reel-${tab.id}`}
            ref={reel}
            className="-mx-5 mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-10 pt-4 [scrollbar-width:none] md:-mx-10 md:px-10 [&::-webkit-scrollbar]:hidden"
          >
            {list.map((video, index) => (
              <li key={video.id} className="w-[64vw] max-w-[16.5rem] shrink-0 snap-start md:w-[15.5rem]">
                <div className="settle" style={{ "--delay": `${index * 0.07}s` } as CSSProperties}>
                  <Print video={video} onOpen={(item, from) => player.current?.open(item, from)} rotate={index % 2 === 0 ? -1.6 : 1.4} tape={index % 3 === 0 ? "center" : undefined} caption={video.brand ?? undefined} className="w-full" />
                </div>
                <p className="mt-5 text-[14.5px] font-medium leading-snug">{video.title}</p>
                {video.result && <p className="mt-1 text-[12.5px] text-muted">{video.result}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <PlayerDialog ref={player} />
    </div>
  )
}
