import type { CSSProperties } from "react"
import { Play } from "lucide-react"
import PlayButton from "@/components/play-button"
import { site } from "@/content/site"
import { moment, views } from "@/lib/day"

const BANDS = ["sea", "honey", "bubble", "sage", "peach", "blush"]
const TILT = [-4, 3, -2, 5, -5, 2]

/**
 * 18:00, golden hour. Her trips around the region as ticket stubs dropped
 * on a sunlit table: the place, the video, its views, and a stub to tear
 * off and watch. Places come only from her own covers and captions; trips
 * without one are named by the video.
 */
export default function Tickets() {
  const travel = site.pillars.find((pillar) => pillar.id === "travel")
  const trips = site.videos.filter((video) => video.place || (travel && video.pillar === travel.id))
  if (trips.length === 0) return null
  const backdrop = trips.find((video) => video.id === "clifftop")?.poster ?? trips.find((video) => video.poster)?.poster

  return (
    <section
      id="weekends"
      {...moment("18:00", "Weekends", "golden")}
      aria-labelledby="weekends-title"
      className="tickets-scene relative overflow-hidden py-20 md:py-28"
      style={backdrop ? ({ "--backdrop": `url(${backdrop})` } as CSSProperties) : undefined}
    >
      <div className="shell relative">
        <div className="relative z-10 max-w-xl">
          <h2 id="weekends-title" className="reveal font-script text-[clamp(4.4rem,13vw,11rem)] leading-[0.8] text-white [text-shadow:0_6px_40px_rgb(120_60_20/0.35)]">
            weekends
          </h2>
          {travel?.description && <p className="reveal mt-4 max-w-sm text-[16px] leading-relaxed text-white/90 [text-shadow:0_1px_12px_rgb(90_40_10/0.4)]">{travel.description}</p>}
        </div>

        <ul className="observe tickets relative z-10 mt-12 grid gap-y-6 md:mt-16 md:grid-cols-2 md:gap-x-6 md:gap-y-2 lg:grid-cols-3">
          {trips.map((video, i) => (
            <li
              key={video.id}
              className="ticket-drop"
              style={{ "--i": i, "--r": `${TILT[i % TILT.length]}deg`, "--band": `var(--${BANDS[i % BANDS.length]})` } as CSSProperties}
            >
              <PlayButton video={video} label={`Play: ${video.title}${video.result ? `, ${video.result}` : ""}`} className="ticket group">
                <span className="ticket-main">
                  {video.poster && <img src={video.poster} alt="" loading="lazy" className="ticket-photo" />}
                  <span className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-fg/55">Admit one · weekend</span>
                    <span className="mt-1.5 block font-display text-[clamp(1.55rem,2.2vw,1.95rem)] italic leading-[1.02]">{video.place ?? video.title}</span>
                    {video.place && <span className="mt-1.5 line-clamp-2 block text-[12.5px] leading-snug text-fg/70">{video.title}</span>}
                    {video.result && <span className="mt-2 block text-[11.5px] font-semibold text-fg/60">▷ {views(video.result)} views</span>}
                  </span>
                </span>
                <span className="ticket-stub" aria-hidden="true">
                  <Play className="h-4 w-4 fill-current" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Watch</span>
                  <span className="ticket-no">No. {String(i + 1).padStart(2, "0")}</span>
                </span>
              </PlayButton>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
