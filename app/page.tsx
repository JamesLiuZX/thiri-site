import Link from "next/link"
import { ArrowUpRight, FileText } from "lucide-react"
import Booking from "@/components/booking"
import HeroReel from "@/components/hero-reel"
import Nav from "@/components/nav"
import PreviewBadge from "@/components/preview-badge"
import Section from "@/components/section"
import VideoGallery from "@/components/work/video-gallery"
import { FORMAT_LABELS } from "@/content/profile"
import { site } from "@/content/site"

/*
 * Information architecture, in the order a brand evaluates a UGC creator:
 *   hook (who, what, one reel, the numbers) → proof (brands) → the work, by
 *   format → what she makes (pillars) → results → services, usage, packages →
 *   process and turnaround → what brands say → about → FAQ → booking.
 * Every section renders only when its slot has content.
 */

const has = <T,>(list: T[] | undefined): list is T[] => Array.isArray(list) && list.length > 0

export default function Home() {
  const featured = site.videos.find((video) => video.featured) ?? site.videos[0]
  const byId = new Map(site.videos.map((video) => [video.id, video]))

  const links = [
    has(site.videos) && { id: "work", name: "Work" },
    (has(site.services) || has(site.packages)) && { id: "services", name: "Services" },
    has(site.process) && { id: "process", name: "Process" },
    site.bio && { id: "about", name: "About" },
    has(site.faq) && { id: "faq", name: "FAQ" },
  ].filter(Boolean) as { id: string; name: string }[]

  return (
    <>
      <Nav links={links} />
      <main id="top">
        {/* Hook */}
        <section className="shell grid items-center gap-12 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-7">
            <p className="enter label text-muted">{site.handle}</p>
            <h1 className="enter mt-4 font-display text-5xl font-semibold tracking-tight md:text-7xl" style={{ ["--delay" as string]: "0.08s" }}>
              {site.name}
            </h1>
            {site.tagline && (
              <p className="enter mt-6 max-w-xl text-xl leading-relaxed text-muted" style={{ ["--delay" as string]: "0.16s" }}>
                {site.tagline}
              </p>
            )}
            <div className="enter mt-8 flex flex-wrap gap-3" style={{ ["--delay" as string]: "0.24s" }}>
              <a href="#book" className="rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-fg">
                Work with me
              </a>
              <Link href="/media-kit" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm">
                <FileText className="h-4 w-4" />
                Media kit
              </Link>
            </div>
            {has(site.stats) && (
              <dl className="enter mt-12 grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-3" style={{ ["--delay" as string]: "0.32s" }}>
                {site.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="label order-2 text-muted">{stat.label}</dt>
                    <dd className="text-3xl font-semibold tracking-tight">{stat.value}</dd>
                    {(stat.source || stat.asOf) && <dd className="mt-1 text-xs text-muted">{[stat.source, stat.asOf].filter(Boolean).join(", ")}</dd>}
                  </div>
                ))}
              </dl>
            )}
          </div>
          {featured && (
            <div className="enter mx-auto w-full max-w-[20rem] md:col-span-4 md:col-start-9" style={{ ["--delay" as string]: "0.2s" }}>
              <HeroReel video={featured} />
            </div>
          )}
        </section>

        {/* Proof */}
        {has(site.brands) && (
          <section aria-label="Brands" className="border-t border-line py-10">
            <div className="shell flex flex-wrap items-center gap-x-10 gap-y-4">
              <p className="label text-muted">Made content for</p>
              {site.brands.map((brand) =>
                brand.logo ? (
                  <img key={brand.name} src={brand.logo} alt={brand.name} className="h-6 w-auto opacity-70" />
                ) : (
                  <span key={brand.name} className="text-lg font-semibold tracking-tight text-fg/70">
                    {brand.name}
                  </span>
                ),
              )}
            </div>
          </section>
        )}

        {/* The work */}
        {has(site.videos) && (
          <Section id="work" kicker="Work" title="The videos" intro="Filter by format. Tap any video to play it with sound.">
            <VideoGallery videos={site.videos} />
          </Section>
        )}

        {/* What she makes */}
        {has(site.pillars) && (
          <Section id="pillars" kicker="Content pillars" title="What I make">
            <ul className="grid gap-6 md:grid-cols-3">
              {site.pillars.map((pillar) => (
                <li key={pillar.name} className="reveal rounded-3xl border border-line bg-surface p-6">
                  <h3 className="text-xl font-semibold">{pillar.name}</h3>
                  <p className="mt-2 text-muted">{pillar.description}</p>
                  {has(pillar.videoIds) && (
                    <div className="mt-5 flex gap-2">
                      {pillar.videoIds.map((id) => byId.get(id)?.poster).filter(Boolean).map((poster) => (
                        <img key={poster} src={poster} alt="" className="aspect-[9/16] w-16 rounded-lg object-cover" />
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Results */}
        {has(site.caseStudies) && (
          <Section id="results" kicker="Results" title="What it did for brands">
            <ul className="grid gap-6 md:grid-cols-2">
              {site.caseStudies.map((study) => (
                <li key={study.brand + study.brief} className="reveal rounded-3xl border border-line bg-surface p-6">
                  <p className="label text-muted">{study.brand}</p>
                  <dl className="mt-4 grid gap-3">
                    <div>
                      <dt className="text-sm text-muted">The brief</dt>
                      <dd>{study.brief}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted">What I made</dt>
                      <dd>{study.delivered}</dd>
                    </div>
                    {study.result && (
                      <div>
                        <dt className="text-sm text-muted">The result</dt>
                        <dd className="font-semibold">{study.result}</dd>
                      </div>
                    )}
                  </dl>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Services, usage, packages */}
        {(has(site.services) || has(site.packages) || has(site.usage)) && (
          <Section id="services" kicker="Services" title="What you can book">
            {has(site.services) && (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {site.services.map((service) => (
                  <li key={service.name} className="reveal rounded-3xl border border-line bg-surface p-6">
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="mt-2 text-sm text-muted">{service.description}</p>
                    {has(service.includes) && (
                      <ul className="mt-3 space-y-1 text-sm">
                        {service.includes.map((item) => (
                          <li key={item}>· {item}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {has(site.usage) && (
              <div className="mt-12">
                <h3 className="label text-muted">Usage rights</h3>
                <ul className="mt-4 grid gap-4 sm:grid-cols-3">
                  {site.usage.map((tier) => (
                    <li key={tier.name} className="rounded-2xl border border-line p-5">
                      <p className="font-semibold">{tier.name}</p>
                      <p className="mt-1 text-sm text-muted">{tier.description}</p>
                      {tier.term && <p className="mt-2 text-sm">{tier.term}</p>}
                      {tier.price && <p className="mt-1 text-sm font-medium">{tier.price}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {has(site.packages) && (
              <div className="mt-12">
                <h3 className="label text-muted">Packages</h3>
                <ul className="mt-4 grid gap-4 md:grid-cols-3">
                  {site.packages.map((pack) => (
                    <li key={pack.name} className={`rounded-3xl border p-6 ${pack.highlight ? "border-fg" : "border-line"}`}>
                      <p className="text-lg font-semibold">{pack.name}</p>
                      {pack.price && <p className="mt-1 text-sm">{pack.price}</p>}
                      <p className="mt-3 text-sm text-muted">{pack.description}</p>
                      <ul className="mt-3 space-y-1 text-sm">
                        {pack.includes.map((item) => (
                          <li key={item}>· {item}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        )}

        {/* Process */}
        {has(site.process) && (
          <Section id="process" kicker="Process" title="How it works" intro={site.turnaround ? `Turnaround: ${site.turnaround}.` : undefined}>
            <ol className="grid gap-4 md:grid-cols-5">
              {site.process.map((step, index) => (
                <li key={step.title} className="reveal rounded-2xl border border-line p-5">
                  <p className="label text-muted">{String(index + 1).padStart(2, "0")}</p>
                  <p className="mt-2 font-semibold">{step.title}</p>
                  <p className="mt-1 text-sm text-muted">{step.description}</p>
                  {step.duration && <p className="mt-2 text-xs">{step.duration}</p>}
                </li>
              ))}
            </ol>
          </Section>
        )}

        {/* What brands say */}
        {has(site.testimonials) && (
          <Section id="words" kicker="Kind words" title="From brands">
            <ul className="grid gap-6 md:grid-cols-2">
              {site.testimonials.map((item) => (
                <li key={item.quote} className="reveal rounded-3xl border border-line bg-surface p-6">
                  <blockquote className="text-lg">“{item.quote}”</blockquote>
                  <p className="mt-4 text-sm text-muted">{[item.name, item.role, item.brand].filter(Boolean).join(", ")}</p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* About */}
        {site.bio && (
          <Section id="about" kicker="About" title={`Hi, I'm ${site.name}`}>
            <div className="grid gap-10 md:grid-cols-12">
              {site.portrait && <img src={site.portrait} alt={site.name} className="reveal aspect-[4/5] w-full max-w-sm rounded-3xl object-cover md:col-span-4" />}
              <div className="md:col-span-7 md:col-start-6">
                <p className="reveal text-xl leading-relaxed">{site.bio}</p>
                <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
                  {site.location && (
                    <div>
                      <dt className="label text-muted">Based in</dt>
                      <dd className="mt-1">{site.location}</dd>
                    </div>
                  )}
                  {has(site.languages) && (
                    <div>
                      <dt className="label text-muted">Films in</dt>
                      <dd className="mt-1">{site.languages.join(", ")}</dd>
                    </div>
                  )}
                  {site.audience.map((stat) => (
                    <div key={stat.label}>
                      <dt className="label text-muted">{stat.label}</dt>
                      <dd className="mt-1">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Section>
        )}

        {/* FAQ */}
        {has(site.faq) && (
          <Section id="faq" kicker="FAQ" title="Good to know">
            <div className="max-w-3xl divide-y divide-line border-y border-line">
              {site.faq.map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium">
                    {item.q}
                    <span aria-hidden="true" className="text-muted transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </Section>
        )}

        {/* Booking */}
        <Section
          id="book"
          kicker="Booking"
          title="Work with me"
          intro={site.booking.responseTime ? `Send a brief and I'll reply ${site.booking.responseTime}.` : "Send a brief, or reach me on socials."}
        >
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {site.booking.email ? (
                <Booking booking={site.booking} services={site.services} usage={site.usage} />
              ) : (
                <p className="text-muted">Message me on any of the platforms here.</p>
              )}
            </div>
            <aside className="space-y-6 lg:col-span-4 lg:col-start-9">
              {site.booking.email && (
                <div>
                  <p className="label text-muted">Email</p>
                  <a href={`mailto:${site.booking.email}`} className="mt-1 block text-lg underline-offset-4 hover:underline">
                    {site.booking.email}
                  </a>
                </div>
              )}
              <div>
                <p className="label text-muted">Socials</p>
                <ul className="mt-2 space-y-1.5">
                  {site.socials.map((social) => (
                    <li key={social.url}>
                      <a href={social.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
                        {social.platform === "tiktok" ? "TikTok" : social.platform === "instagram" ? "Instagram" : "YouTube"} {social.handle}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/media-kit" className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm">
                <FileText className="h-4 w-4" />
                Media kit (printable)
              </Link>
              {has(site.videos) && (
                <p className="text-sm text-muted">Formats: {Array.from(new Set(site.videos.map((video) => FORMAT_LABELS[video.format]))).join(", ")}.</p>
              )}
            </aside>
          </div>
        </Section>
      </main>

      <footer className="border-t border-line py-10">
        <div className="shell flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
          <p>
            © {new Date().getFullYear()} {site.name || site.handle}
          </p>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
      <PreviewBadge />
    </>
  )
}
