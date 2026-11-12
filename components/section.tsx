import type { ReactNode } from "react"
import { cn } from "@/lib/site"

/**
 * Phase 1 scaffolding: one neutral wrapper so the structure can be reviewed.
 * Phase 2 gives each section its own presentation; keep the ids, they are
 * the nav anchors.
 */
export default function Section({
  id,
  kicker,
  title,
  intro,
  children,
  className,
}: {
  id: string
  kicker: string
  title: ReactNode
  intro?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn("border-t border-line py-20 md:py-28", className)}>
      <div className="shell">
        <header className="reveal max-w-2xl">
          <p className="label text-muted">{kicker}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-5xl">{title}</h2>
          {intro && <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>}
        </header>
        <div className="mt-10 md:mt-14">{children}</div>
      </div>
    </section>
  )
}
