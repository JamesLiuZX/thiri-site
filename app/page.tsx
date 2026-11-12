import Link from "next/link"
import { ArrowUpRight, FileText } from "lucide-react"
import Booking from "@/components/booking"
import DayClock from "@/components/day-clock"
import Footer from "@/components/footer"
import Heading from "@/components/heading"
import Hero from "@/components/hero"
import Nav from "@/components/nav"
import PreviewBadge from "@/components/preview-badge"
import { About, Angles, BrandStrip, Faq, FilmStrip, Menu, Notes, Results, hour } from "@/components/sections"
import Portfolio from "@/components/work/portfolio"
import { site } from "@/content/site"

/*
 * A day in her life. Her signature format is the day-in-the-life vlog, so
 * the site keeps time: the cover at 07:30, the work filed by hour (08:00
 * Beauty & Hair, 12:30 F&B, 17:30 Fashion, the weekend's travel), the menu
 * in the afternoon, the About at golden hour, booking after dark. Each
 * section is lit for its hour, and a vlog timestamp in the corner follows.
 *
 * Inside the day, the order is a brand's: value proposition, reach, "Work
 * with me", who trusts her, the work by pillar, why it works, what to book,
 * who she is, and how to reach her.
 */

const has = <T,>(list: T[] | undefined): list is T[] => Array.isArray(list) && list.length > 0
const platform = { instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube" } as const

export default function Home() {
  const links = [
    has(site.videos) && { id: "work", name: "Work" },
    (has(site.services) || has(site.packages)) && { id: "services", name: "Services" },
    site.bio && { id: "about", name: "About" },
  ].filter(Boolean) as { id: string; name: string }[]

  return (
    <>
      <Nav links={links} />
      <main>
        <Hero />
        <BrandStrip />

        {has(site.videos) && (
          <section id="work" {...hour(site.pillars[0]?.time ?? "08:00", site.pillars[0]?.tab ?? "The work", "noon")} className="light-noon py-24 md:py-36">
            <div className="shell">
              <Heading kicker="The work" title={["A day of", { text: "content.", className: "italic" }]} intro="Filed by the hour I'd film it. Tap any print to watch." slots={["videos"]} />
              <div className="mt-12 md:mt-16">
                <Portfolio pillars={site.pillars} videos={site.videos} sectionId="work" />
              </div>
            </div>
          </section>
        )}

        <Angles />
        <Results />
        <Menu />
        <FilmStrip />
        <About />
        <Notes />
        <Faq />

        <section id="book" {...hour("22:30", "Booking", "night")} className="light-night py-24 md:py-36">
          <div className="shell">
            <Heading
              kicker="Booking"
              tone="paper"
              title={["Let's make", { text: "something.", className: "italic" }]}
              intro={site.booking.responseTime ? `Send a brief and I'll reply ${site.booking.responseTime}.` : "Send a brief: the brand, the product, what you need and when."}
            />
            <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12">
              <div className="text-fg lg:col-span-7">
                {site.booking.email ? <Booking booking={site.booking} services={site.services} usage={site.usage} /> : <p className="text-accent-fg/70">Message me on any of the platforms here.</p>}
              </div>
              <aside className="space-y-8 lg:col-span-4 lg:col-start-9">
                {site.booking.email && (
                  <div>
                    <p className="label text-accent-fg/55">Or write to me</p>
                    <a href={`mailto:${site.booking.email}`} className="link mt-2 inline-block break-all font-display text-[1.6rem] italic leading-tight">
                      {site.booking.email}
                    </a>
                  </div>
                )}
                <div>
                  <p className="label text-accent-fg/55">Find me</p>
                  <ul className="mt-3 space-y-2">
                    {site.socials.map((social) => (
                      <li key={social.url}>
                        <a href={social.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-[16px]">
                          <span className="link">
                            {platform[social.platform]} {social.handle}
                          </span>
                          {social.followers && <span className="text-accent-fg/55">· {social.followers}</span>}
                          <ArrowUpRight className="h-3.5 w-3.5 text-accent-fg/55 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/media-kit" className="inline-flex items-center justify-center gap-2 rounded-full border border-accent-fg/25 px-6 py-3.5 text-[14px] transition-colors hover:border-accent-fg/60">
                  <FileText className="h-4 w-4" />
                  The media kit
                </Link>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <DayClock />
      <PreviewBadge />
    </>
  )
}
