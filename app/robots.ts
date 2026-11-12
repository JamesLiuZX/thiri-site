import type { MetadataRoute } from "next"
import { launch } from "@/content/profile"
import { siteUrl } from "@/lib/site"

export const dynamic = "force-static"

// Closed to crawlers until she approves the site (launch.indexable in content/profile.ts).
export default function robots(): MetadataRoute.Robots {
  if (!launch.indexable) return { rules: { userAgent: "*", disallow: "/" } }
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteUrl}/sitemap.xml` }
}
