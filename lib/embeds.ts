export type Embed = { platform: "tiktok" | "instagram"; src: string; url: string; label: string }

/**
 * Turns a TikTok or Instagram post URL into its official embed player URL.
 * Returns null for anything it does not recognise, so the caller can fall
 * back to a plain link.
 *
 *   https://www.tiktok.com/@user/video/7300000000000000000 -> tiktok.com/embed/v2/<id>
 *   https://www.instagram.com/reel/AbC123/                  -> instagram.com/reel/AbC123/embed/
 */
export function parseEmbed(url: string | undefined): Embed | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, "")
    if (host === "tiktok.com" || host.endsWith(".tiktok.com")) {
      const match = parsed.pathname.match(/\/video\/(\d+)/)
      if (match) return { platform: "tiktok", src: `https://www.tiktok.com/embed/v2/${match[1]}`, url, label: "TikTok" }
    }
    if (host === "instagram.com") {
      const match = parsed.pathname.match(/^\/(p|reel|tv)\/([\w-]+)/)
      if (match) {
        const kind = match[1] === "tv" ? "p" : match[1]
        return { platform: "instagram", src: `https://www.instagram.com/${kind}/${match[2]}/embed/`, url, label: "Instagram" }
      }
    }
  } catch {
    // Not a URL.
  }
  return null
}
