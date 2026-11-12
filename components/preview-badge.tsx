import { sampledSlots } from "@/content/site"

/**
 * Tells whoever is reviewing that some of what they see is still SAMPLE
 * content (hover for which). Renders nothing once every slot is real.
 */
export default function PreviewBadge() {
  if (sampledSlots.length === 0) return null
  return (
    <p
      title={`SAMPLE stand-ins: ${sampledSlots.join(", ")}. Run pnpm check:content.`}
      className="no-print fixed bottom-4 right-4 z-[80] rounded-full border border-dashed border-rose bg-surface/90 px-3.5 py-2 text-[11px] font-medium text-rose shadow-print backdrop-blur md:bottom-6 md:right-6"
    >
      Preview · {sampledSlots.length} sample slots
    </p>
  )
}
