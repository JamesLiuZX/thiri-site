import type { CSSProperties } from "react"
import Link from "next/link"
import { ArrowDown } from "lucide-react"
import HeroCluster from "@/components/hero-cluster"
import Wordmark from "@/components/wordmark"
import { site } from "@/content/site"

const at = (seconds: number) => ({ "--delay": `${seconds}s` }) as CSSProperties

/**
 * 07:30, the start of her day: the wordmark, very large and light; James's
 * value proposition as the headline; the reach, as her profiles show it;
 * and "Work with me" first. Three of her prints, just set down.
 */
export default function Hero() {
  const lead = site.videos.filter((video) => video.featured).slice(0, 3)
  const first = site.name.split(" ")[0]
  const tiktok = site.socials.find((social) => social.platform === "tiktok")
  const instagram = site.socials.find((social) => social.platform === "instagram")

  return (
    <section id="top" data-time="07:30" data-moment="Good morning" data-light="morning" className="light-morning relative overflow-hidden">
      <div className="shell grid items-center gap-16 pb-20 pt-8 md:pb-28 md:pt-12 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7">
          <p className="enter flex items-baseline gap-3 text-muted" style={at(0.05)}>
            <span className="font-hand text-[1.7rem] leading-none text-rose">07:30</span>
            <span className="label">Good morning{site.location ? `, ${site.location}` : ""}</span>
          </p>

          <p aria-hidden="true" className="mt-3 font-display text-[clamp(5.5rem,27vw,13rem)] font-light italic leading-[0.82] tracking-[-0.035em]">
            <Wordmark text={site.wordmark} />
          </p>

          <h1 className="enter mt-7 max-w-xl font-display text-[clamp(1.75rem,3vw,2.6rem)] font-normal leading-[1.12] tracking-[-0.01em]" style={at(0.7)}>
            {site.tagline}.
          </h1>
          <p className="enter mt-4 max-w-xl text-[15px] leading-relaxed text-muted" style={at(0.78)}>
            {first && <>By {site.name}. </>}
            {tiktok && <>{tiktok.handle} on TikTok</>}
            {tiktok && instagram && ", "}
            {instagram && <>{instagram.handle} on Instagram</>}.
          </p>

          <div className="enter mt-9 flex flex-wrap items-center gap-3" style={at(0.86)}>
            <a href="#book" className="btn px-8 py-4 text-[15px]">
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

          {site.stats.length > 0 && (
            <div className="enter mt-12 border-t border-fg/10 pt-6" style={at(0.95)}>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
                {site.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <dt className="label order-2 mt-2 leading-snug text-muted">{stat.label}</dt>
                    <dd className="order-1 font-display text-[clamp(2.3rem,3.6vw,3.1rem)] font-light italic leading-none">{stat.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[12px] text-muted">
                As shown on her {Array.from(new Set(site.stats.map((stat) => stat.source).filter(Boolean))).join(" and ")} profiles
                {site.stats[0]?.asOf && `, ${site.stats[0].asOf}`}.
              </p>
            </div>
          )}
        </div>

        {lead.length > 0 && (
          <div className="relative lg:col-span-5">
            <HeroCluster videos={lead} />
            <p className="absolute -bottom-2 right-2 rotate-[-4deg] font-hand text-[1.5rem] text-rose lg:right-8">tap one ↑</p>
          </div>
        )}
      </div>
    </section>
  )
}
