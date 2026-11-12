import { Play } from "lucide-react"
import type { Video } from "@/content/profile"
import { parseEmbed } from "@/lib/embeds"
import { cn } from "@/lib/site"

/**
 * The face of a post that has no cover yet: its title, written like her
 * covers, on a wash of her colours, and where it plays.
 */
export default function EmbedFace({ video, className }: { video: Video; className?: string }) {
  const embed = parseEmbed(video.embed)
  const instagram = embed?.platform === "instagram"
  return (
    <span
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden p-5 text-center text-white",
        instagram ? "bg-[linear-gradient(150deg,rgb(var(--honey)),rgb(var(--berry))_70%)]" : "bg-[linear-gradient(160deg,rgb(var(--bubble)),rgb(var(--berry))_75%)]",
        className,
      )}
    >
      <span aria-hidden="true" className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/15 blur-xl" />
      <span className="font-script text-[clamp(1.4rem,2.4vw,2rem)] leading-tight [text-shadow:0_2px_12px_rgb(0_0_0/0.18)]">{video.title}</span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.16em] backdrop-blur">
        <Play className="h-3 w-3 fill-current" />
        {embed ? `Plays on ${embed.label}` : "Video"}
      </span>
    </span>
  )
}
