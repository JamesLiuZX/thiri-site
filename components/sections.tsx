import type { CSSProperties, ReactNode } from "react"
import Fish from "@/components/fish"
import Heading from "@/components/heading"
import PrintStill from "@/components/print-still"
import Rise from "@/components/rise"
import SampleTag from "@/components/sample-tag"
import { FORMAT_LABELS } from "@/content/profile"
import { isSampled, site } from "@/content/site"
import { cn } from "@/lib/site"

const has = <T,>(list: T[] | undefined): list is T[] => Array.isArray(list) && list.length > 0
const at = (seconds: number) => ({ "--delay": `${seconds}s` }) as CSSProperties
const poster = (id?: string) => site.videos.find((video) => video.id === id)?.poster

/** The hour a section is lit for, read by the page clock. */
export const hour = (time: string, moment: string, light: string) => ({ "data-time": time, "data-moment": moment, "data-light": light })

/* -------------------------------------------------------------------------- */
/* Trusted by: her brands, set as type in the site's own italic               */
/* -------------------------------------------------------------------------- */

export function BrandStrip() {
  if (!has(site.brands)) return null
  const names = [...site.brands, ...site.brands]
  return (
    <section aria-label="Trusted by" className="border-y border-fg/10 bg-bg py-7">
      <div className="shell flex items-center gap-6">
        <p className="label shrink-0 text-muted">Trusted by</p>
        <SampleTag slots={["brands"]} className="shrink-0" />
        <div className="marquee-wrap mask-fade-x relative flex-1 overflow-hidden">
          <ul className="marquee flex w-max items-center gap-12 whitespace-nowrap" style={{ "--dur": "46s" } as CSSProperties}>
            {names.map((brand, index) => (
              <li key={`${brand.name}-${index}`} aria-hidden={index >= site.brands.length} className="flex items-center gap-12">
                <span className="font-display text-[1.85rem] font-light italic text-fg/80">{brand.name}</span>
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-rose" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Why brands book her: three hooks, each opening on its first second         */
/* -------------------------------------------------------------------------- */

export function Angles() {
  if (!has(site.angles)) return null
  return (
    <section id="why" {...hour("14:00", "Why brands book me", "noon")} className="light-noon py-24 md:py-36">
      <div className="shell">
        <Heading kicker="Why brands book me" title={["Made to stop", { text: "the scroll.", className: "italic" }]} slots={["angles"]} />
        <ol className="mt-16 grid gap-px overflow-hidden rounded-[28px] bg-fg/10 md:mt-20 md:grid-cols-3">
          {site.angles.map((angle, index) => (
            <li key={angle.title} className="reveal flex flex-col bg-surface p-8 md:p-10" style={at(index * 0.08)}>
              <p className="flex items-center justify-between">
                <span className="font-hand text-[1.6rem] leading-none text-rose">0:0{index + 1}</span>
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-sage" />
              </p>
              <h3 className="mt-10 font-display text-[clamp(1.9rem,2.6vw,2.4rem)] font-light italic leading-[1.05]">{angle.title}</h3>
              <p className="mt-4 text-[16px] leading-relaxed text-muted">{angle.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Results: case notes, shown only once there are real ones                   */
/* -------------------------------------------------------------------------- */

export function Results() {
  if (!has(site.caseStudies) || isSampled("caseStudies")) return null
  return (
    <section id="results" {...hour("15:00", "Results", "afternoon")} className="light-afternoon py-24 md:py-36">
      <div className="shell">
        <Heading kicker="Results" title={["Case", { text: "notes.", className: "italic" }]} />
        <ul className="mt-16 grid gap-8 md:mt-20 lg:grid-cols-2">
          {site.caseStudies.map((study, index) => (
            <li key={study.brand + index} className="reveal grid grid-cols-[7.5rem_minmax(0,1fr)] gap-6 rounded-[28px] border border-fg/10 bg-surface/60 p-6 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-8 md:p-8" style={at(index * 0.08)}>
              <PrintStill src={poster(study.videoId)} rotate={index % 2 === 0 ? -3 : 3} className="w-full" />
              <div>
                <p className="font-display text-[2rem] font-light italic leading-none">{study.brand}</p>
                <dl className="mt-6 space-y-4 text-[15px] leading-relaxed">
                  <Row term="The brief">{study.brief}</Row>
                  <Row term="What I made">{study.delivered}</Row>
                  {study.result && <Row term="What it did">{study.result}</Row>}
                </dl>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Row({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-t border-fg/10 pt-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4">
      <dt className="font-display text-[1.1rem] italic text-muted">{term}</dt>
      <dd className="text-fg/85">{children}</dd>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* The menu: deliverables, sets and usage, on a printed card                  */
/* -------------------------------------------------------------------------- */

export function Menu() {
  if (!has(site.services) && !has(site.packages) && !has(site.usage)) return null
  const priced = [...site.packages, ...site.usage].some((item) => item.price && !/request|included/i.test(item.price))
  return (
    <section id="services" {...hour("15:30", "The menu", "afternoon")} className="light-afternoon py-24 md:py-36">
      <div className="shell">
        <Heading align="center" kicker="Services" title={["The", { text: "menu.", className: "italic" }]} intro={priced ? "Everything is made to order." : "Everything is made to order. Rates on request."} />
        <div className="reveal relative mx-auto mt-16 max-w-3xl bg-surface p-3 shadow-print md:mt-20">
          <div className="border border-fg/15 px-6 py-12 outline outline-1 outline-offset-[6px] outline-fg/10 md:px-16 md:py-16">
            {has(site.services) && (
              <MenuCourse title="What I make" sampled={isSampled("services")}>
                {site.services.map((service) => (
                  <MenuItem key={service.name} name={service.name} description={service.description} extras={service.includes} />
                ))}
              </MenuCourse>
            )}
            {has(site.packages) && (
              <MenuCourse title="Sets" sampled={isSampled("packages")}>
                {site.packages.map((pack) => (
                  <MenuItem key={pack.name} name={pack.name} price={pack.price ?? "On request"} description={pack.description} highlight={pack.highlight} />
                ))}
              </MenuCourse>
            )}
            {has(site.usage) && (
              <MenuCourse title="Usage rights" sampled={isSampled("usage")}>
                {site.usage.map((tier) => (
                  <MenuItem key={tier.name} name={tier.name} price={tier.price ?? "On request"} description={[tier.description, tier.term].filter(Boolean).join(" · ")} />
                ))}
              </MenuCourse>
            )}
            {site.turnaround && (
              <p className="mt-12 flex items-center justify-center gap-3 text-center font-display text-[1.2rem] italic text-muted">
                Turnaround: {site.turnaround}.
                <SampleTag slots={["turnaround"]} />
              </p>
            )}
            <Fish className="mx-auto mt-8 h-5 w-10 text-fish" />
          </div>
        </div>
      </div>
    </section>
  )
}

function MenuCourse({ title, sampled, children }: { title: string; sampled?: boolean; children: ReactNode }) {
  return (
    <div className="mt-12 first:mt-0">
      <p className="flex items-center justify-center gap-4 text-center font-display text-[1.7rem] italic">
        <span aria-hidden="true" className="h-px w-10 bg-fg/20" />
        {title}
        <span aria-hidden="true" className="h-px w-10 bg-fg/20" />
      </p>
      {sampled && (
        <p className="mt-3 flex justify-center">
          <span className="no-print inline-flex rounded-full border border-dashed border-rose/70 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-rose">Sample</span>
        </p>
      )}
      <ul className="mt-7 space-y-6">{children}</ul>
    </div>
  )
}

function MenuItem({ name, price, description, extras, highlight }: { name: string; price?: string; description?: string; extras?: string[]; highlight?: boolean }) {
  return (
    <li>
      <p className="flex items-baseline text-[17px]">
        <span className="font-medium">
          {name}
          {highlight && <span className="ml-2 align-middle font-hand text-[1.25rem] text-rose">most booked?</span>}
        </span>
        {price && (
          <>
            <span aria-hidden="true" className="leader" />
            <span className="font-display text-[1.15rem] italic">{price}</span>
          </>
        )}
      </p>
      {description && <p className="mt-1 text-[14.5px] text-muted">{description}</p>}
      {has(extras) && <p className="label mt-2 text-[9.5px] text-muted/80">{extras.join(" · ")}</p>}
    </li>
  )
}

/* -------------------------------------------------------------------------- */
/* Process: a strip of film, one frame per step                               */
/* -------------------------------------------------------------------------- */

export function FilmStrip() {
  if (!has(site.process)) return null
  return (
    <section id="process" {...hour("16:45", "From brief to final cut", "afternoon")} className="bg-oat py-24 md:py-36">
      <div className="shell">
        <Heading kicker="Process" title={["From brief", { text: "to final cut.", className: "italic" }]} slots={["process"]} />
      </div>
      <div className="reveal mt-16 overflow-x-auto md:mt-20">
        <div className="mx-auto w-max min-w-full bg-accent px-5 md:px-10">
          <div aria-hidden="true" className="sprockets h-[14px] w-full" />
          <ol className="mx-auto flex max-w-[1160px] gap-3 py-4">
            {site.process.map((step, index) => (
              <li key={step.title} className="flex w-[15.5rem] shrink-0 flex-col rounded-[6px] bg-[#3a3634] p-6 text-accent-fg md:w-auto md:flex-1">
                <p className="label text-accent-fg/45">
                  <span aria-hidden="true">▸ </span>
                  {String(index + 1).padStart(2, "0")}A
                </p>
                <p className="mt-8 font-display text-[1.75rem] font-light italic leading-tight">{step.title}</p>
                <p className="mt-3 text-[14.5px] leading-relaxed text-accent-fg/70">{step.description}</p>
                {step.duration && <p className="label mt-auto pt-6 text-accent-fg/45">{step.duration}</p>}
              </li>
            ))}
          </ol>
          <div aria-hidden="true" className="sprockets h-[14px] w-full" />
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Kind words: shown only once brands have said them                          */
/* -------------------------------------------------------------------------- */

export function Notes() {
  if (!has(site.testimonials) || isSampled("testimonials")) return null
  return (
    <section id="words" {...hour("19:00", "Kind words", "dusk")} className="light-dusk py-24 md:py-36">
      <div className="shell">
        <Heading kicker="Kind words" title={["From the", { text: "brands.", className: "italic" }]} />
        <ul className="mt-16 grid gap-10 md:mt-20 md:grid-cols-2 lg:gap-16">
          {site.testimonials.map((item, index) => (
            // The reveal sits on the item and the tilt on the note: an animation's
            // final transform would otherwise replace the tilt.
            <li key={item.quote} className="reveal" style={at(index * 0.1)}>
              <div className="relative rotate-0 bg-surface px-8 pb-8 pt-12 shadow-print md:px-10" style={{ "--tw-rotate": `${index % 2 === 0 ? -1.5 : 1.2}deg` } as CSSProperties}>
                <span aria-hidden="true" className="tape -top-3 left-[34%] h-6 w-[32%] -rotate-2" />
                <blockquote className="font-display text-[1.75rem] font-light italic leading-snug">“{item.quote}”</blockquote>
                <p className="label mt-6 text-muted">{[item.name, item.role, item.brand].filter(Boolean).join(" · ")}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* About: golden hour, her portrait, and the track record                     */
/* -------------------------------------------------------------------------- */

export function About() {
  if (!site.bio) return null
  const first = site.name.split(" ")[0]
  const tiktok = site.socials.find((social) => social.platform === "tiktok")
  const instagram = site.socials.find((social) => social.platform === "instagram")
  const likes = site.stats.find((stat) => /likes/i.test(stat.label))
  const facts = [
    site.location && { term: "Based in", value: site.location },
    site.market && { term: "Audience", value: site.market },
    tiktok?.followers && { term: "On TikTok", value: `${tiktok.followers} followers${likes ? ` · ${likes.value} likes` : ""}` },
    instagram?.followers && { term: "On Instagram", value: `${instagram.followers} followers` },
    has(site.languages) && !isSampled("languages") && { term: "Films in", value: site.languages.join(", ") },
  ].filter(Boolean) as { term: string; value: string }[]

  return (
    <section id="about" {...hour("18:30", "Golden hour", "golden")} className="light-golden py-24 md:py-36">
      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="mx-auto w-full max-w-[22rem] lg:col-span-5 lg:mx-0">
          <PrintStill src={site.portrait} rotate={-3} tape="center" ratio="aspect-[4/5]" caption={first || site.wordmark} note={site.displayName} className="w-full" />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="flex items-baseline gap-3">
            <span className="font-hand text-[1.7rem] leading-none text-rose">18:30</span>
            <span className="label text-muted">About</span>
          </p>
          <Rise pieces={first ? ["Hi, I'm", { text: `${first}.`, className: "italic" }] : ["A little", { text: "hello.", className: "italic" }]} className="mt-5 font-display text-[clamp(2.7rem,6.6vw,5.8rem)] font-light leading-[0.94]" />
          <p className="reveal mt-8 font-display text-[clamp(1.35rem,2vw,1.7rem)] leading-[1.45]">{site.bio}</p>
          {facts.length > 0 && (
            <dl className="reveal mt-10 grid gap-x-8 gap-y-5 border-t border-fg/15 pt-6 sm:grid-cols-2">
              {facts.map((fact) => (
                <div key={fact.term}>
                  <dt className="label text-muted">{fact.term}</dt>
                  <dd className="mt-1.5 font-display text-[1.35rem] italic leading-snug">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {has(site.featured) && (
            <p className="reveal mt-8 text-[14.5px] leading-relaxed text-muted">
              <span className="label mr-2 text-muted">Featured in my videos</span>
              {site.featured.join(" · ")}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* FAQ, at dusk                                                               */
/* -------------------------------------------------------------------------- */

export function Faq() {
  if (!has(site.faq)) return null
  return (
    <section id="faq" {...hour("19:45", "Good to know", "dusk")} className="light-dusk py-24 md:py-36">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <p className="label text-muted">FAQ</p>
            <SampleTag slots={["faq"]} />
          </div>
          <Rise pieces={["Good to", { text: "know.", className: "italic" }]} className="mt-5 font-display text-[clamp(2.7rem,6vw,5rem)] font-light leading-[0.94]" />
        </div>
        <div className="divide-y divide-fg/15 border-y border-fg/15 lg:col-span-7 lg:col-start-6">
          {site.faq.map((item) => (
            <details key={item.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-[1.55rem] leading-snug [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden="true" className="relative h-4 w-4 shrink-0">
                  <span className="absolute left-0 top-1/2 h-px w-4 bg-fg" />
                  <span className="absolute left-1/2 top-0 h-4 w-px bg-fg transition-transform duration-300 group-open:rotate-90 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export const formatList = () => Array.from(new Set(site.videos.map((video) => FORMAT_LABELS[video.format])))
