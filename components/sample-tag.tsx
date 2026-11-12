import type { Content } from "@/content/profile"
import { isSampled } from "@/content/site"
import { cn } from "@/lib/site"

/** A small tag on any section still showing SAMPLE stand-ins. Renders nothing otherwise. */
export default function SampleTag({ slots, className }: { slots: (keyof Content)[]; className?: string }) {
  if (!slots.some(isSampled)) return null
  return (
    <span
      title="Placeholder until her material is in"
      className={cn("no-print inline-flex items-center gap-1.5 rounded-full border border-dashed border-rose/70 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-rose", className)}
    >
      Sample
    </span>
  )
}
