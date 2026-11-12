import type { CSSProperties } from "react"
import { Camera, NotebookPen, PenLine, RotateCcw, Scissors } from "lucide-react"
import SampleTag from "@/components/sample-tag"
import { site } from "@/content/site"
import { moment } from "@/lib/day"

const ICONS = [NotebookPen, PenLine, Camera, Scissors, RotateCcw]
// A box drawn by hand: corners that don't quite meet, sides that bow.
const ROUGH = "M3.5 4.2 C 30 2.6, 68 4.4, 97.2 2.9 C 98.4 24, 96.9 50, 97.9 72.3 C 70 73.6, 31 71.9, 2.4 73.1 C 1.6 50, 3.1 26, 2.2 2.6"

/**
 * 16:45. How a shoot runs, as her shot list: a page torn from a ruled
 * notebook, taped down, each step a sketched frame with a pencil note under
 * it. The boxes tick themselves off in order as the page comes into view.
 */
export default function Storyboard() {
  if (site.process.length === 0) return null
  return (
    <section id="process" {...moment("16:45", "How we'll work", "afternoon")} aria-labelledby="process-title" className="relative overflow-x-clip py-16 md:py-24">
      <div className="shell">
        <div className="reveal notebook relative mx-auto max-w-[70rem]">
          <span aria-hidden="true" className="tape -left-4 -top-3 h-7 w-28 -rotate-[24deg]" />
          <span aria-hidden="true" className="tape -right-5 -top-2 h-7 w-28 rotate-[18deg]" />
          <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <h2 id="process-title" className="font-hand text-[clamp(2.3rem,4.4vw,3.5rem)] leading-[0.95]">
              shot list: how we&apos;ll work
            </h2>
            <div className="flex items-center gap-4">
              <p aria-hidden="true" className="hidden font-hand text-[1.3rem] text-fg/60 sm:block">
                brand: <span className="inline-block w-28 border-b border-fg/40" />
              </p>
              <SampleTag slots={["process"]} />
            </div>
          </header>

          <ol className="observe board mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-7 sm:gap-y-10 lg:mt-11 lg:grid-cols-5">
            {site.process.map((step, i) => {
              const Icon = ICONS[i % ICONS.length]
              return (
                <li key={step.title} className="board-step relative" style={{ "--i": i } as CSSProperties}>
                  <div className="board-frame relative aspect-[4/3]">
                    <svg aria-hidden="true" viewBox="0 0 100 75" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
                      <path d={ROUGH} vectorEffect="non-scaling-stroke" />
                    </svg>
                    <Icon aria-hidden="true" className="board-icon absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 sm:h-10 sm:w-10" strokeWidth={1.2} />
                    <span aria-hidden="true" className="absolute left-2.5 top-1.5 font-hand text-[1.15rem] text-fg/55">
                      #{i + 1}
                    </span>
                    {step.duration && <span className="absolute bottom-1.5 right-2.5 font-hand text-[1.1rem] text-berry">{step.duration}</span>}
                    {i < site.process.length - 1 && (
                      <svg aria-hidden="true" viewBox="0 0 40 20" className="board-arrow hidden lg:block">
                        <path d="M2 12 C 12 4, 24 4, 36 10" pathLength={1} />
                        <path d="M29 4 L 37 10.5 L 28 14" pathLength={1} />
                      </svg>
                    )}
                  </div>
                  <div className="mt-3.5 flex items-start gap-2.5">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="board-check mt-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6">
                      <path d="M4 5.5 C 9 4.4, 15 5.2, 20 4.6 C 19.6 10, 20.4 15, 19.7 20 C 14 20.6, 9 19.7, 4.2 20.3 C 3.6 15, 4.5 10, 4 5.5" className="board-box" />
                      <path d="M6.5 12.5 L 10.5 16.5 L 21 3" pathLength={1} className="board-tick" />
                    </svg>
                    <div>
                      <h3 className="font-hand text-[1.45rem] leading-none sm:text-[1.75rem]">{step.title}</h3>
                      <p className="mt-1.5 font-hand text-[1.08rem] leading-[1.12] text-fg/70 sm:text-[1.22rem]">{step.description}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>

          {site.turnaround && (
            <p className="mt-11 flex flex-wrap items-center gap-3 font-hand text-[1.45rem] leading-tight">
              <span className="circled">turnaround: {site.turnaround}</span>
              <SampleTag slots={["turnaround"]} />
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
