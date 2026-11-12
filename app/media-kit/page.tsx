import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import PrintButton from "@/app/media-kit/print-button"
import PreviewBadge from "@/components/preview-badge"
import { FORMAT_LABELS } from "@/content/profile"
import { site } from "@/content/site"

export const metadata: Metadata = {
  title: "Media kit",
  description: `${site.name || site.handle}: media kit.`,
}

const has = <T,>(list: T[] | undefined): list is T[] => Array.isArray(list) && list.length > 0

/**
 * The media kit brands ask for, printable to A4 from the browser and built
 * from the same content as the site. Sections without content drop out.
 */
export default function MediaKit() {
  return (
    <div className="min-h-screen bg-[#f3f2ef] py-10 text-[#141416] print:bg-white print:py-0">
      <div className="no-print mx-auto mb-6 flex max-w-[210mm] items-center justify-between px-5">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#55555b] hover:text-[#141416]">
          <ArrowLeft className="h-4 w-4" />
          Back to the site
        </Link>
        <PrintButton />
      </div>

      <main className="mx-auto max-w-[210mm] bg-white px-[14mm] py-[13mm] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.3)] print:max-w-none print:p-0 print:shadow-none">
        <header className="flex items-start justify-between gap-6 border-b-2 border-[#141416] pb-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#55555b]">Media kit</p>
            <h1 className="mt-1 text-[30px] font-semibold leading-none tracking-tight">{site.name || site.handle}</h1>
            {site.tagline && <p className="mt-2 max-w-md text-[13px] text-[#33333a]">{site.tagline}</p>}
          </div>
          <div className="text-right text-[12px] leading-relaxed text-[#33333a]">
            {site.socials.map((social) => (
              <p key={social.url}>
                {social.platform === "tiktok" ? "TikTok" : social.platform === "instagram" ? "Instagram" : "YouTube"} {social.handle}
              </p>
            ))}
            {site.booking.email && <p>{site.booking.email}</p>}
            {site.location && <p>{site.location}</p>}
          </div>
        </header>

        {(has(site.stats) || has(site.audience)) && (
          <Block title="At a glance">
            <dl className="grid grid-cols-3 gap-4">
              {[...site.stats, ...site.audience].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-[#e4e3df] p-3">
                  <dd className="text-[20px] font-semibold">{stat.value}</dd>
                  <dt className="text-[11.5px] text-[#55555b]">{stat.label}</dt>
                  {(stat.source || stat.asOf) && <dd className="mt-0.5 text-[10px] text-[#8a8a90]">{[stat.source, stat.asOf].filter(Boolean).join(", ")}</dd>}
                </div>
              ))}
            </dl>
          </Block>
        )}

        {site.bio && (
          <Block title="About">
            <p className="text-[13px] leading-[1.6]">{site.bio}</p>
            {has(site.languages) && <p className="mt-2 text-[12px] text-[#55555b]">Films in {site.languages.join(", ")}.</p>}
          </Block>
        )}

        {has(site.pillars) && (
          <Block title="Content pillars">
            <ul className="grid grid-cols-3 gap-4 text-[12.5px]">
              {site.pillars.map((pillar) => (
                <li key={pillar.name}>
                  <p className="font-semibold">{pillar.name}</p>
                  <p className="text-[#33333a]">{pillar.description}</p>
                </li>
              ))}
            </ul>
          </Block>
        )}

        {has(site.services) && (
          <Block title="Services">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[12.5px]">
              {site.services.map((service) => (
                <li key={service.name}>
                  <span className="font-semibold">{service.name}</span> <span className="text-[#33333a]">{service.description}</span>
                </li>
              ))}
            </ul>
          </Block>
        )}

        {(has(site.packages) || has(site.usage)) && (
          <Block title="Packages and usage">
            <div className="grid grid-cols-2 gap-6 text-[12.5px]">
              {has(site.packages) && (
                <ul className="space-y-2">
                  {site.packages.map((pack) => (
                    <li key={pack.name}>
                      <span className="font-semibold">{pack.name}</span>
                      {pack.price && <span className="text-[#55555b]"> · {pack.price}</span>}
                      <span className="block text-[#33333a]">{pack.includes.join(" · ")}</span>
                    </li>
                  ))}
                </ul>
              )}
              {has(site.usage) && (
                <ul className="space-y-2">
                  {site.usage.map((tier) => (
                    <li key={tier.name}>
                      <span className="font-semibold">{tier.name}</span>
                      {tier.term && <span className="text-[#55555b]"> · {tier.term}</span>}
                      <span className="block text-[#33333a]">{tier.description}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {site.turnaround && <p className="mt-3 text-[12px] text-[#55555b]">Turnaround: {site.turnaround}.</p>}
          </Block>
        )}

        {has(site.brands) && (
          <Block title="Brands">
            <p className="text-[13px]">{site.brands.map((brand) => brand.name).join(" · ")}</p>
          </Block>
        )}

        {has(site.videos) && (
          <Block title="Selected work">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12.5px]">
              {site.videos.map((video) => (
                <li key={video.id}>
                  <span className="font-semibold">{video.brand ?? video.title}</span>
                  <span className="text-[#55555b]"> · {FORMAT_LABELS[video.format]}</span>
                  {video.result && <span className="text-[#33333a]"> · {video.result}</span>}
                </li>
              ))}
            </ul>
          </Block>
        )}

        {has(site.testimonials) && (
          <Block title="Kind words">
            {site.testimonials.map((item) => (
              <p key={item.quote} className="text-[12.5px] italic">
                “{item.quote}” <span className="not-italic text-[#55555b]">{[item.name, item.brand].filter(Boolean).join(", ")}</span>
              </p>
            ))}
          </Block>
        )}
      </main>
      <PreviewBadge />
    </div>
  )
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 break-inside-avoid-page">
      <h2 className="mb-2.5 border-b border-[#e4e3df] pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55555b]">{title}</h2>
      {children}
    </section>
  )
}
