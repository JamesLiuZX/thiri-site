import { clsx, type ClassValue } from "clsx"

/**
 * The site's public origin, for canonical, Open Graph and sitemap URLs. On
 * Vercel it comes from the project's production domain automatically; set
 * NEXT_PUBLIC_SITE_URL to override it once a custom domain is live.
 */
const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? (vercelDomain ? `https://${vercelDomain}` : "http://localhost:3000")

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
