import Link from "next/link"
import { ArrowUpRight, FileText } from "lucide-react"
import About from "@/components/about"
import Anatomy from "@/components/anatomy"
import Booking from "@/components/booking"
import Comments from "@/components/comments"
import Day from "@/components/day"
import { Notes, Results } from "@/components/extras"
import Footer from "@/components/footer"
import Hero from "@/components/hero"
import Nav from "@/components/nav"
import Order from "@/components/order"
import PreviewBadge from "@/components/preview-badge"
import Providers from "@/components/providers"
import Stickers from "@/components/stickers"
import Storyboard from "@/components/storyboard"
import Tickets from "@/components/tickets"
import CameraRoll from "@/components/work/camera-roll"
import { isSampled, site } from "@/content/site"
import { moment } from "@/lib/day"

/*
 * One day of hers, from first light to goodnight, and the page's light
 * follows it (components/day.tsx). No two sections share a layout:
 *
 *   07:30  stories over her masthead, stats as story stickers
 *   09:00  the brands that trust her, as die-cut stickers
 *   12:00  her camera roll, edge to edge, with albums
 *   14:00  three covers marked up: hook, product, call to action
 *   15:30  the services as an order you build in a shopping bag
 *   16:45  how a shoot runs, as a notebook shot list
 *   18:00  weekends away, as ticket stubs at golden hour
 *   18:45  who she is: a photo-booth strip, a letter, a card
 *   20:30  questions answered in the comments
 *   22:30  booking as one sentence to fill in, under the moon
 */

const has = <T,>(list: T[] | undefined): list is T[] => Array.isArray(list) && list.length > 0
const platform = { instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube" } as const

export default function Home() {
  const first = site.name.split(" ")[0] || site.wordmark
  const links = [
    has(site.videos) && { id: "work", name: "Work" },
    (has(site.services) || has(site.packages)) && { id: "order", name: "Services" },
    site.bio && { id: "about", name: "About" },
  ].filter(Boolean) as { id: string; name: string }[]

  return (
    <Providers>
      <Day />
      <Nav links={links} />
      <main>
        <Hero />
        <Stickers />

        {has(site.videos) && (
          <section id="work" {...moment("12:00", "The work", "noon")} aria-labelledby="work-title" className="relative py-16 md:py-24">
            <CameraRoll videos={site.videos} pillars={site.pillars} socials={site.socials} />
          </section>
        )}

        <Anatomy />
        <Results />

        {(has(site.services) || has(site.packages)) && (
          <section id="order" {...moment("15:30", "Services", "afternoon")} aria-labelledby="services-title" className="relative py-20 md:py-28">
            <div className="shell">
              <Order
                services={site.services}
                packages={site.packages}
                usage={site.usage}
                videos={site.videos}
                wordmark={site.wordmark || site.handle}
                sampleUsage={isSampled("usage")}
              />
            </div>
          </section>
        )}

        <Storyboard />
        <Tickets />
        <About />
        <Notes />
        <Comments />

        <section id="book" {...moment("22:30", "Booking", "night")} aria-labelledby="book-title" className="night-scene relative overflow-hidden pb-24 pt-28 text-accent-fg md:pb-32 md:pt-40">
          <div aria-hidden="true" className="moon" />
          <div className="shell relative">
            <h2 id="book-title" className="reveal font-hand text-[clamp(1.6rem,2.4vw,2rem)] text-lamp">
              after dark, the inbox is open
            </h2>
            <div className="mt-6 max-w-[62rem]">
              {site.booking.email ? <Booking booking={site.booking} to={first} /> : <p className="text-accent-fg/70">Message me on any of the platforms below.</p>}
            </div>

            <div className="mt-20 grid gap-10 border-t border-accent-fg/10 pt-10 md:grid-cols-3">
              {site.booking.email && (
                <div>
                  <p className="label text-accent-fg/50">Or write to me</p>
                  <a href={`mailto:${site.booking.email}`} className="link mt-3 inline-block break-all font-display text-[1.5rem] italic leading-tight">
                    {site.booking.email}
                  </a>
                </div>
              )}
              <div>
                <p className="label text-accent-fg/50">Find me</p>
                <ul className="mt-3 space-y-2">
                  {site.socials.map((social) => (
                    <li key={social.url}>
                      <a href={social.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-[15.5px]">
                        <span className="link">
                          {platform[social.platform]} {social.handle}
                        </span>
                        {social.followers && <span className="text-accent-fg/50">· {social.followers}</span>}
                        <ArrowUpRight className="h-3.5 w-3.5 text-accent-fg/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="label text-accent-fg/50">For your team</p>
                <Link href="/media-kit" className="mt-3 inline-flex items-center gap-2 rounded-full border border-accent-fg/25 px-5 py-3 text-[14px] transition-colors hover:border-accent-fg/60">
                  <FileText className="h-4 w-4" />
                  The media kit
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <PreviewBadge />
    </Providers>
  )
}
