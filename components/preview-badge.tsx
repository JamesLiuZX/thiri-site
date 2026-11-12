import { sampledSlots } from "@/content/site"

/**
 * Tells whoever is reviewing that some of what they see is SAMPLE content.
 * Renders nothing once every slot holds her real material.
 */
export default function PreviewBadge() {
  if (sampledSlots.length === 0) return null
  return (
    <div className="no-print fixed bottom-4 left-4 z-[80] max-w-[18rem] rounded-2xl bg-fg/90 px-4 py-3 text-xs leading-relaxed text-bg shadow-lg backdrop-blur">
      <p className="font-medium">Preview: sample content</p>
      <p className="mt-0.5 opacity-75">
        {sampledSlots.length} slots are SAMPLE stand-ins until her material is in. Run <code>pnpm check:content</code>.
      </p>
    </div>
  )
}
