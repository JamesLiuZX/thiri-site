import type { CSSProperties } from "react"
import { Heart, Store } from "lucide-react"
import AskForm from "@/components/ask-form"
import PlayButton from "@/components/play-button"
import SampleTag from "@/components/sample-tag"
import { site } from "@/content/site"
import { moment, views } from "@/lib/day"

/**
 * 20:30. The questions brands ask, answered the way she answers her
 * audience: in the comments, under one of her videos playing in the
 * evening light. Anything else goes in the box at the bottom.
 */
export default function Comments() {
  if (site.faq.length === 0) return null
  const video = site.videos.find((item) => item.id === "night-out") ?? site.videos.find((item) => item.poster)
  const handle = site.handle.replace(/^@/, "")

  return (
    <section
      id="faq"
      {...moment("20:30", "Questions", "evening")}
      aria-labelledby="faq-title"
      className="comments-scene relative overflow-hidden py-16 md:py-24"
      style={video?.poster ? ({ "--backdrop": `url(${video.poster})` } as CSSProperties) : undefined}
    >
      <div className="shell relative grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        {video && (
          <div className="reveal relative mx-auto w-[68%] max-w-[21rem] lg:col-span-5 lg:w-full lg:max-w-[23rem]">
            <PlayButton video={video} label={`Play: ${video.title}${video.result ? `, ${video.result}` : ""}`} className="group block w-full text-left">
              <span className="relative block aspect-[3/4] overflow-hidden rounded-[26px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] ring-1 ring-white/10">
                {video.poster && <img src={video.poster} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.03]" />}
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                <span aria-hidden="true" className="absolute left-4 top-4 flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.14em] text-white">
                  <span className="rec-dot is-live" />
                  REC
                </span>
                <span aria-hidden="true" className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="block font-script text-[2rem] leading-none">{video.title}</span>
                  {video.result && <span className="mt-2 block text-[12px] text-white/80">▷ {views(video.result)} views</span>}
                </span>
              </span>
            </PlayButton>
          </div>
        )}

        <div className="lg:col-span-7">
          <div className="comment-sheet reveal" style={{ "--delay": "0.12s" } as CSSProperties}>
            <span aria-hidden="true" className="mx-auto block h-1 w-10 rounded-full bg-fg/15" />
            <header className="mt-4 flex items-center justify-between gap-4">
              <h2 id="faq-title" className="text-[15px] font-semibold">
                Questions brands ask me
              </h2>
              <SampleTag slots={["faq"]} />
            </header>
            <ul className="observe thread mt-5 space-y-6">
              {site.faq.map((item, i) => (
                <li key={item.q} className="comment flex gap-3" style={{ "--i": i } as CSSProperties}>
                  <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sea/40 text-fg/70">
                    <Store className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] text-muted">
                      <span className="font-semibold text-fg/80">a brand</span> asked
                    </p>
                    <p className="mt-0.5 text-[15px] font-medium leading-snug">{item.q}</p>
                    <div className="mt-3 flex gap-2.5">
                      {site.portrait ? (
                        <img src={site.portrait} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover object-top" />
                      ) : (
                        <span aria-hidden="true" className="h-7 w-7 shrink-0 rounded-full bg-blush" />
                      )}
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-[12px]">
                          <span className="font-semibold">{handle}</span>
                          <span className="rounded bg-berry/15 px-1.5 py-px text-[10px] font-semibold text-berry">Creator</span>
                        </p>
                        <p className="mt-0.5 text-[14.5px] leading-relaxed text-fg/85">{item.a}</p>
                      </div>
                    </div>
                  </div>
                  <Heart aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-fg/30" />
                </li>
              ))}
            </ul>
            {site.booking.email && <AskForm email={site.booking.email} />}
          </div>
        </div>
      </div>
    </section>
  )
}
