import { content, launch, SAMPLE, type Content } from "@/content/profile"

/** True for empty strings, empty arrays, and objects whose every field is empty. */
export function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === "string") return value.trim() === ""
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === "object") return Object.values(value as Record<string, unknown>).every(isEmpty)
  return false
}

type Key = keyof Content

/**
 * The content the site renders: her real material, with SAMPLE stand-ins in
 * the empty slots while `launch.useSamples` is on.
 */
function resolve() {
  const merged = {} as Record<Key, unknown>
  const sampled: Key[] = []
  for (const key of Object.keys(content) as Key[]) {
    const real = content[key]
    if (launch.useSamples && isEmpty(real) && !isEmpty(SAMPLE[key])) {
      merged[key] = SAMPLE[key]
      sampled.push(key)
    } else {
      merged[key] = real
    }
  }
  if (launch.indexable && sampled.length > 0) {
    throw new Error(
      `Launch blocked: these slots still show SAMPLE content: ${sampled.join(", ")}. ` +
        "Fill them in content/profile.ts or turn launch.useSamples off.",
    )
  }
  return { data: merged as Content, sampled }
}

const resolved = resolve()

export const site = resolved.data
/** Slots currently showing SAMPLE stand-ins (shown in the preview badge). */
export const sampledSlots = resolved.sampled
