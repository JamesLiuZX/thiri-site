import type { CSSProperties, ReactNode } from "react"
import Heading from "@/components/heading"
import PrintStill from "@/components/print-still"
import { isSampled, site } from "@/content/site"
import { moment } from "@/lib/day"

/*
 * Sections that stay hidden until her real material is in: case studies
 * (brand results) and kind words (testimonials). Neither ever shows SAMPLE
 * content. Give each its own presentation when it is filled.
 */

const has = <T,>(list: T[] | undefined): list is T[] => Array.isArray(list) && list.length > 0
const at = (seconds: number) => ({ "--delay": `${seconds}s` }) as CSSProperties
const poster = (id?: string) => site.videos.find((video) => video.id === id)?.poster

export function Results() {
  if (!has(site.caseStudies) || isSampled("caseStudies")) return null
  return (
    <section id="results" {...moment("15:00", "Results", "afternoon")} className="py-20 md:py-28">
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

export function Notes() {
  if (!has(site.testimonials) || isSampled("testimonials")) return null
  return (
    <section id="words" {...moment("19:00", "Kind words", "dusk")} className="py-20 md:py-28">
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
