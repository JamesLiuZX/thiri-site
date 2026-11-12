import type { CSSProperties, ReactNode } from "react"
import Link from "next/link"
import { ArrowDown } from "lucide-react"
import Stories from "@/components/hero/stories"
import Wordmark from "@/components/wordmark"
import type { Stat, Video } from "@/content/profile"
import { site } from "@/content/site"
import { moment } from "@/lib/day"

const at = (seconds: number) => ({ "--delay": `${seconds}s` }) as CSSProperties

/** A small heart for the slider sticker (an emoji would depend on the reader's fonts). */
const Heart = () => (
  <svg viewBox="0 0 24 22" aria-hidden="true" className="h-5 w-5">
    <path d="M12 21s-8.5-5.2-10.4-10.6C.4 6.8 2.7 2.5 6.8 2.1c2.3-.2 4 .9 5.2 2.6 1.2-1.7 2.9-2.8 5.2-2.6 4.1.4 6.4 4.7 5.2 8.3C20.5 15.8 12 21 12 21Z" fill="rgb(var(--berry))" />
    <path d="M6.4 5.6c-1.3.4-2 1.6-2 2.8" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

/**
 * Her stats as story stickers, each in a different sticker's shape: a
 * question box, an emoji slider, a mention and a views pill.
 */
function Sticker({ stat, index }: { stat: Stat; index: number }) {
  const kind = index % 4
  let body: ReactNode
  if (kind === 0) {
    body = (
      <span className="hs-question">
        <span className="hs-question-head">{stat.source ?? "Stat"}</span>
        <span className="flex flex-col items-center px-5 pb-3.5 pt-2.5">
          <span className="font-display text-[2.5rem] font-medium italic leading-none">{stat.value}</span>
          <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{stat.label}</span>
        </span>
      </span>
    )
  } else if (kind === 1) {
    body = (
      <span className="hs-slider">
        <span className="flex items-baseline justify-between gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{stat.label}</span>
          <span className="font-display text-[1.9rem] font-medium italic leading-none">{stat.value}</span>
        </span>
        <span className="hs-track">
          <span className="hs-fill" />
          <span className="hs-knob">
            <Heart />
          </span>
        </span>
      </span>
    )
  } else if (kind === 2) {
    body = (
      <span className="hs-mention">
        <span className="hs-gradient font-display text-[2.1rem] font-semibold italic leading-none">{stat.value}</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.12em]">{stat.label}</span>
      </span>
    )
  } else {
    body = (
      <span className="hs-views">
        <span aria-hidden="true">▷</span>
        <span className="font-display text-[1.7rem] italic leading-none">{stat.value}</span>
        <span className="max-w-[9rem] text-[11px] leading-tight text-white/75">{stat.label}</span>
      </span>
    )
  }
  return (
    <li className={`hero-sticker hero-sticker-${index}`} style={{ ...at(1.25 + index * 0.16), "--r": `${[-6, 4, -3, 5][kind]}deg` } as CSSProperties}>
      {body}
    </li>
  )
}

/**
 * 07:30. The cover of the day: her wordmark set like a masthead, her
 * stories playing over it, and her numbers stuck on as story stickers.
 * The sun comes up behind them.
 */
export default function Hero() {
  const stories = site.stories.map((id) => site.videos.find((video) => video.id === id)).filter((video): video is Video => Boolean(video))
  const pillars = Object.fromEntries(site.pillars.map((pillar) => [pillar.id, pillar.tab]))
  const tiktok = site.socials.find((social) => social.platform === "tiktok")
  const instagram = site.socials.find((social) => social.platform === "instagram")
  const sources = Array.from(new Set(site.stats.map((stat) => stat.source).filter(Boolean)))

  return (
    <section id="top" {...moment("07:30", "Good morning", "dawn")} className="relative overflow-hidden">
      <div aria-hidden="true" className="hero-sun" />
      <div className="shell relative grid pb-16 pt-6 md:pb-20 lg:grid-cols-12 lg:gap-x-10 lg:pb-24 lg:pt-12">
        <div aria-hidden="true" className="relative lg:col-span-12 lg:col-start-1 lg:row-start-1">
          <p className="enter-fade absolute left-1 top-1 z-10 -rotate-[4deg] font-hand text-[1.45rem] leading-none text-berry md:left-2 md:top-2 md:text-[1.8rem]" style={at(1.1)}>
            good morning ✿
          </p>
          <p className="masthead select-none whitespace-nowrap pt-9 font-display font-light italic leading-[0.82] tracking-[-0.045em] md:pt-12">
            <Wordmark text={site.wordmark || site.handle} delay={0.15} />
          </p>
        </div>

        <div className="relative z-10 mt-5 lg:col-span-6 lg:col-start-1 lg:row-start-2 lg:mt-2 lg:self-start">
          <h1 className="enter max-w-[34rem] font-display text-[clamp(2.05rem,3.4vw,3.25rem)] font-light leading-[1.04] tracking-[-0.01em]" style={at(0.55)}>
            {site.tagline}.
          </h1>
          <p className="enter mt-4 max-w-md text-[15.5px] leading-relaxed text-muted" style={at(0.7)}>
            By {site.name}.{" "}
            {tiktok && (
              <>
                <a href={tiktok.url} target="_blank" rel="noopener noreferrer" className="link text-fg">
                  {tiktok.handle}
                </a>{" "}
                on TikTok
              </>
            )}
            {tiktok && instagram && ", "}
            {instagram && (
              <>
                <a href={instagram.url} target="_blank" rel="noopener noreferrer" className="link text-fg">
                  {instagram.handle}
                </a>{" "}
                on Instagram
              </>
            )}
            .
          </p>
          <div className="enter mt-8 flex flex-wrap items-center gap-3" style={at(0.85)}>
            <a href="#book" className="btn">
              Work with me
            </a>
            <a href="#work" className="btn-ghost">
              See the work
              <ArrowDown className="h-4 w-4" />
            </a>
            <Link href="/media-kit" className="link ml-2 text-[14px] text-muted hover:text-fg">
              Media kit
            </Link>
          </div>
        </div>

        <div className="relative z-20 mx-auto mt-12 w-full max-w-[24rem] lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:mt-16 lg:max-w-[26rem]">
          <div className="enter" style={{ ...at(0.3), "--enter-y": "36px", "--dur": "1.3s" } as CSSProperties}>
            <Stories stories={stories} avatar={site.portrait || undefined} handle={site.handle} pillars={pillars} />
          </div>
          {site.stats.length > 0 && (
            <ul data-hero-stats className="hero-stickers">
              {site.stats.slice(0, 4).map((stat, index) => (
                <Sticker key={stat.label} stat={stat} index={index} />
              ))}
            </ul>
          )}
          {site.stats.length > 0 && (
            <p className="enter-fade relative z-10 mt-6 text-center text-[12px] text-muted lg:mt-5" style={at(1.9)}>
              As shown on her {sources.join(" and ")} profiles{site.stats[0]?.asOf && `, ${site.stats[0].asOf}`}.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
