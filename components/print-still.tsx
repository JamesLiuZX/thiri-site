import type { CSSProperties } from "react"
import { cn } from "@/lib/site"

/**
 * A still print for server-rendered sections: the same paper frame and
 * developing picture as the interactive prints, without the player. It
 * develops when the inline observer marks it `.is-in`.
 */
export default function PrintStill({
  src,
  caption,
  note,
  rotate = 0,
  tape,
  ratio = "aspect-[9/16]",
  className,
  delay = 0,
}: {
  src?: string
  caption?: string
  note?: string
  rotate?: number
  tape?: "left" | "right" | "center"
  ratio?: string
  className?: string
  delay?: number
}) {
  return (
    <figure
      className={cn("observe print rotate-0", className)}
      style={{ "--tw-rotate": `${rotate}deg`, "--develop-delay": `${delay}s` } as CSSProperties}
    >
      <span className={cn("relative block overflow-hidden bg-oat", ratio)}>
        {src && <img src={src} alt="" loading="lazy" decoding="async" className="develop absolute inset-0 h-full w-full object-cover" />}
      </span>
      {(caption || note) && (
        <figcaption className="absolute inset-x-[7%] bottom-[4.5%] flex items-baseline justify-between gap-2">
          {caption && <span className="truncate font-display text-[clamp(0.95rem,1.2vw,1.2rem)] italic leading-none">{caption}</span>}
          {note && <span className="label shrink-0 text-[9px] text-muted">{note}</span>}
        </figcaption>
      )}
      {tape && (
        <span
          aria-hidden="true"
          className={cn(
            "tape -top-[4.5%]",
            tape === "left" && "-left-[6%] -rotate-[28deg]",
            tape === "right" && "-right-[6%] rotate-[28deg]",
            tape === "center" && "left-[29%] -rotate-[3deg]",
          )}
        />
      )}
    </figure>
  )
}
