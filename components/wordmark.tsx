import type { CSSProperties } from "react"
import { cn } from "@/lib/site"

/** Her wordmark, set large: each letter climbs out of its own mask on arrival. */
export default function Wordmark({ text, className, delay = 0.2 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={cn("inline-block", className)}>
      {Array.from(text).map((letter, index) => (
        <span key={index} className="inline-block overflow-hidden pb-[0.12em] pr-[0.04em] -mb-[0.12em] -mr-[0.04em] align-top">
          <span className="enter-mask inline-block" style={{ "--delay": `${delay + index * 0.045}s` } as CSSProperties}>
            {letter}
          </span>
        </span>
      ))}
    </span>
  )
}
