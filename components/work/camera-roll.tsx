"use client"

import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react"
import { ArrowUpRight, Play } from "lucide-react"
import type { Pillar, Social, Video } from "@/content/profile"
import EmbedFace from "@/components/work/embed-face"
import { usePlayer } from "@/components/providers"
import { useSeen } from "@/components/work/use-preview"
import { views } from "@/lib/day"
import { cn } from "@/lib/site"

type Album = { id: string; name: string; videos: Video[] }

/** "1.5M views on TikTok" -> 1500000, for ordering by views. */
const count = (result?: string) => {
  const match = result?.match(/([\d.,]+)\s*([KM]?)/i)
  if (!match) return 0
  const n = parseFloat(match[1].replace(/,/g, ""))
  return n * (match[2].toUpperCase() === "M" ? 1e6 : match[2].toUpperCase() === "K" ? 1e3 : 1)
}
const PLATFORM = { instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube" } as const

/**
 * Noon. Her work as her camera roll: edge to edge, tight as a phone's grid,
 * with albums for each pillar. Covers develop in a wave as the roll comes
 * into view (and again when the album changes); the featured ones take a
 * double square. Tap any of them to watch it with sound.
 */
export default function CameraRoll({ videos, pillars, socials }: { videos: Video[]; pillars: Pillar[]; socials: Social[] }) {
  const open = usePlayer()
  const albums = useMemo<Album[]>(
    () => [
      { id: "all", name: "Everything", videos },
      ...pillars.map((pillar) => ({ id: pillar.id, name: pillar.tab, videos: videos.filter((video) => video.pillar === pillar.id) })).filter((album) => album.videos.length > 0),
    ],
    [videos, pillars],
  )
  const [albumId, setAlbumId] = useState("all")
  const album = albums.find((item) => item.id === albumId) ?? albums[0]
  // Everything leads with her most-viewed video, so the roll's double squares sit mid-grid.
  const shown = useMemo(() => {
    if (album.id !== "all") return album.videos
    const lead = [...album.videos].sort((a, b) => count(b.result) - count(a.result))[0]
    return lead ? [lead, ...album.videos.filter((video) => video !== lead)] : album.videos
  }, [album])
  const grid = useRef<HTMLUListElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const seen = useSeen(grid, "0px 0px -12% 0px")
  const all = album.id === "all"

  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next = (index + step + albums.length) % albums.length
    setAlbumId(albums[next].id)
    tabs.current[next]?.focus()
  }

  return (
    <div>
      <div className="shell flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="work-title" className="font-sans text-[clamp(2rem,3.4vw,2.9rem)] font-semibold leading-none tracking-[-0.035em]">
            Camera roll
          </h2>
          <p className="mt-3 text-[14.5px] text-muted">
            {videos.length} videos, {albums.length - 1} albums. Tap one to watch it with sound.
          </p>
        </div>
        <div role="tablist" aria-label="Albums" className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:gap-5 md:px-0 md:pb-0">
          {albums.map((item, index) => {
            const covers = item.videos.filter((video) => video.poster).slice(0, 3)
            const selected = item.id === album.id
            return (
              <button
                key={item.id}
                ref={(el) => {
                  tabs.current[index] = el
                }}
                type="button"
                role="tab"
                id={`album-${item.id}`}
                aria-selected={selected}
                aria-controls="roll-grid"
                tabIndex={selected ? 0 : -1}
                onClick={() => setAlbumId(item.id)}
                onKeyDown={(event) => onKey(event, index)}
                className={cn("album group shrink-0 text-left", selected && "is-selected")}
              >
                <span aria-hidden="true" className="album-stack">
                  {covers.map((video, k) => (
                    <img key={video.id} src={video.poster} alt="" loading="lazy" style={{ "--k": k } as CSSProperties} />
                  ))}
                </span>
                <span className="mt-2.5 block text-[13px] font-semibold leading-tight">{item.name}</span>
                <span className="block text-[12px] text-muted">{item.videos.length}</span>
              </button>
            )
          })}
        </div>
      </div>

      <ul
        ref={grid}
        id="roll-grid"
        role="tabpanel"
        aria-labelledby={`album-${album.id}`}
        className={cn("roll mt-9 grid grid-flow-dense grid-cols-3 gap-[3px] sm:grid-cols-4 md:mt-12 lg:grid-cols-6", seen && "is-in")}
      >
        {shown.map((video, i) => {
          const big = all && video.featured
          return (
            <li key={`${album.id}-${video.id}`} className={cn("roll-tile", big && "col-span-2 row-span-2")} style={{ "--i": i } as CSSProperties}>
              <button
                type="button"
                onClick={(event) => open(video, event.currentTarget)}
                aria-label={`Play: ${video.title}${video.result ? `, ${video.result}` : ""}`}
                className="group relative block aspect-[3/4] h-full w-full overflow-hidden bg-oat"
              >
                {video.poster ? (
                  <img
                    src={video.poster}
                    alt=""
                    loading="lazy"
                    className="develop h-full w-full object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.05]"
                    style={{ "--develop-delay": `${(i % 14) * 60}ms` } as CSSProperties}
                  />
                ) : (
                  <EmbedFace video={video} />
                )}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 text-left text-white transition-opacity duration-500",
                    big ? "h-1/2" : "h-2/3",
                    "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                  )}
                >
                  <span className={cn("leading-tight", big ? "font-script text-[clamp(1.6rem,2.6vw,2.4rem)]" : "text-[13px] font-medium")}>{video.title}</span>
                  {video.brand && <span className="mt-1 text-[11.5px] text-white/75">{video.brand}</span>}
                </span>
                {video.result && (
                  <span aria-hidden="true" className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/25 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                    <Play className="h-2.5 w-2.5 fill-current" />
                    {views(video.result)}
                  </span>
                )}
              </button>
            </li>
          )
        })}
        {socials
          .filter((social) => social.platform !== "youtube")
          .map((social) => (
            <li key={social.url} className="roll-tile">
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex aspect-[3/4] h-full w-full flex-col items-center justify-center gap-1 bg-surface/80 text-center transition-colors hover:bg-surface"
              >
                <span className="font-hand text-[1.25rem] leading-none text-berry">more on</span>
                <span className="font-display text-[clamp(1.5rem,2.2vw,2rem)] italic leading-tight">{PLATFORM[social.platform]}</span>
                <span className="mt-1 inline-flex items-center gap-1 text-[12px] text-muted">
                  {social.handle}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </a>
            </li>
          ))}
      </ul>
    </div>
  )
}
