import type { CSSProperties } from "react"
import SampleTag from "@/components/sample-tag"
import { isSampled, site } from "@/content/site"
import { moment } from "@/lib/day"

const PLATFORM = { instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube" } as const

/**
 * 18:45. Who she is, at golden hour: a photo-booth strip of her own solo
 * frames (it slides out of the slot, each frame flashing then developing),
 * a letter in her words, and a card with the facts a brand needs.
 */
export default function About() {
  if (!site.bio) return null
  const frames = site.booth.slice(0, 4)
  const local = site.angles[1]
  const audience = site.audience.filter((stat) => stat.value)

  return (
    <section id="about" {...moment("18:45", "About me", "golden")} aria-labelledby="about-title" className="relative overflow-x-clip py-20 md:py-28">
      <div className="shell grid items-start gap-14 md:grid-cols-12 md:gap-8 lg:gap-12">
        {frames.length > 0 && (
          <div className="observe booth relative mx-auto w-[50%] max-w-[14rem] md:col-span-4 md:w-full md:max-w-[16.5rem] lg:col-span-3">
            <span aria-hidden="true" className="booth-slot" />
            <div className="booth-strip">
              {frames.map((src, i) => (
                <span key={src} className="booth-frame" style={{ "--i": i } as CSSProperties}>
                  <img src={src} alt="" loading="lazy" className="develop h-full w-full object-cover object-[center_28%]" style={{ "--develop-delay": `${0.9 + i * 0.45}s` } as CSSProperties} />
                  <span aria-hidden="true" className="booth-flash" />
                </span>
              ))}
              <span className="block pt-3 text-center font-hand text-[1.35rem] leading-none text-fg/75">{site.displayName}</span>
            </div>
          </div>
        )}

        <article className="reveal letter relative md:col-span-8 lg:col-span-5">
          <span aria-hidden="true" className="tape -top-3 left-[38%] h-6 w-[26%] rotate-2" />
          <h2 id="about-title" className="font-hand text-[clamp(2.6rem,4.6vw,3.6rem)] leading-none text-berry">
            hi, I&apos;m {site.name.split(" ")[0] || site.wordmark}
          </h2>
          <p className="mt-5 font-display text-[clamp(1.3rem,1.8vw,1.55rem)] font-light leading-[1.42]">{site.bio}</p>
          {local && (
            <p className="mt-6 font-hand text-[1.4rem] leading-[1.15] text-fg/80">
              p.s. {local.title.replace(/\.$/, "").toLowerCase()}: {local.body}
            </p>
          )}
          <p aria-hidden="true" className="mt-6 text-right font-script text-[2.1rem] leading-none text-fg/80">
            {site.name.split(" ")[0] || site.displayName}
          </p>
        </article>

        <aside aria-label="At a glance" className="reveal relative md:col-span-8 md:col-start-5 lg:col-span-4 lg:col-start-auto lg:mt-16" style={{ "--delay": "0.15s" } as CSSProperties}>
          <div className="name-card">
            <p className="font-display text-[1.9rem] font-light italic leading-none">{site.name}</p>
            <p className="mt-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">
              UGC creator{site.location && ` · ${site.location}`}
            </p>
            <dl className="mt-5 space-y-3 text-[14px]">
              {site.socials.map((social) => (
                <div key={social.url} className="flex items-baseline justify-between gap-3 border-b border-dashed border-fg/15 pb-2.5">
                  <dt className="text-muted">{PLATFORM[social.platform]}</dt>
                  <dd className="text-right">
                    <a href={social.url} target="_blank" rel="noopener noreferrer" className="link">
                      {social.handle}
                    </a>
                    {social.followers && <span className="text-muted"> · {social.followers}</span>}
                  </dd>
                </div>
              ))}
              {site.market && (
                <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-fg/15 pb-2.5">
                  <dt className="text-muted">Market</dt>
                  <dd className="text-right">{site.market}</dd>
                </div>
              )}
              {site.languages.length > 0 && (
                <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-fg/15 pb-2.5">
                  <dt className="flex items-center gap-2 text-muted">
                    Films in <SampleTag slots={["languages"]} />
                  </dt>
                  <dd className="text-right">{site.languages.join(", ")}</dd>
                </div>
              )}
              {audience.length > 0 && (
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="flex items-center gap-2 text-muted">
                    Viewers <SampleTag slots={["audience"]} />
                  </dt>
                  <dd className="text-right">{audience.map((stat) => `${stat.value} ${stat.label.toLowerCase()}`).join(" · ")}</dd>
                </div>
              )}
            </dl>
          </div>

          {site.featured.length > 0 && !isSampled("featured") && (
            <div className="mt-8">
              <p className="font-hand text-[1.35rem] leading-none text-fg/75">seen on my covers</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {site.featured.map((brand, i) => (
                  <li key={brand} className="cover-tag" style={{ "--r": `${[-3, 2, -1, 3, -2, 1, -3, 2][i % 8]}deg` } as CSSProperties}>
                    {brand}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
