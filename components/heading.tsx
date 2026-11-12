import type { ReactNode } from "react"
import Rise from "@/components/rise"
import SampleTag from "@/components/sample-tag"
import type { Content } from "@/content/profile"
import { cn } from "@/lib/site"

type Piece = string | { text: string; className?: string }

/**
 * Section openings: a small label in the margin, a large light headline
 * whose words rise into place, and a sample tag while the section is still
 * placeholder. The body of each section has its own presentation.
 */
export default function Heading({
  kicker,
  title,
  intro,
  slots = [],
  align = "split",
  tone = "ink",
  className,
}: {
  kicker: string
  title: Piece[]
  intro?: ReactNode
  slots?: (keyof Content)[]
  align?: "split" | "center"
  tone?: "ink" | "paper"
  className?: string
}) {
  const centered = align === "center"
  return (
    <header className={cn(centered ? "flex flex-col items-center text-center" : "grid gap-5 md:grid-cols-12 md:gap-10", className)}>
      <div className={cn("flex items-center gap-3", !centered && "md:col-span-3 md:flex-col md:items-start md:pt-4")}>
        <p className={cn("label", tone === "ink" ? "text-muted" : "text-accent-fg/60")}>{kicker}</p>
        <SampleTag slots={slots} />
      </div>
      <div className={cn(!centered && "md:col-span-9")}>
        <Rise
          pieces={title}
          className={cn(
            "font-display text-[clamp(2.7rem,6.6vw,5.8rem)] font-light leading-[0.94] tracking-[-0.01em]",
            centered && "mt-5",
          )}
        />
        {intro && <p className={cn("reveal mt-6 max-w-xl text-[17px] leading-relaxed", tone === "ink" ? "text-muted" : "text-accent-fg/70", centered && "mx-auto")}>{intro}</p>}
      </div>
    </header>
  )
}
