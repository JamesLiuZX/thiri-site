/** The light a section is set in; components/day.tsx blends between them. */
export type Light = "dawn" | "morning" | "noon" | "afternoon" | "golden" | "dusk" | "evening" | "night"

/**
 * Puts a section in the day: the hour it belongs to (the page's light and
 * the sun in the corner follow it) and its name in the running order.
 */
export const moment = (time: string, label: string, light: Light) => ({ "data-time": time, "data-moment": label, "data-light": light })

/** The first figure of a result, e.g. "40.5K" from "40.5K views on TikTok". */
export const views = (result?: string) => result?.trim().split(/\s+/)[0]
