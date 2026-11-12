import { cn } from "@/lib/site"

/**
 * A small fish in one line, from the 🐟 in her display name. Its tail wags
 * and its body bobs; flip it with `facing="left"`.
 */
export default function Fish({ className, facing = "right" }: { className?: string; facing?: "left" | "right" }) {
  return (
    <svg viewBox="0 0 48 28" aria-hidden="true" className={cn("overflow-visible", facing === "left" && "-scale-x-100", className)}>
      <g className="fish-swim" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <path className="fish-tail" d="M12 14 L2 6 Q5 14 2 22 Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M12 14 C17 4 33 3 44 13 C46 14.5 46 13.5 44 15 C33 25 17 24 12 14 Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M24 9 Q27 14 24 19" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <circle cx="37.5" cy="12" r="1.5" fill="currentColor" />
      </g>
    </svg>
  )
}
