import { existsSync } from "node:fs"
import { join } from "node:path"
import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import SmoothScroll from "@/components/smooth-scroll"
import RevealRescan from "@/components/reveal-rescan"
import { launch } from "@/content/profile"
import { site } from "@/content/site"
import { REVEAL_BOOTSTRAP } from "@/lib/reveal-script"
import { siteUrl } from "@/lib/site"

// Phase 1 type: neutral. The chosen design direction replaces these, and
// sets --font-display to its own face.
const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" })
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" })

const title = `${site.name || site.handle}, UGC creator`
const description = site.tagline || "UGC creator portfolio."
// The social card is optional until the design direction renders one.
const ogImage = existsSync(join(process.cwd(), "public", "og.png"))
  ? [{ url: "/og.png", width: 1200, height: 630, alt: title }]
  : undefined

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s, ${site.name || site.handle}` },
  description,
  openGraph: { type: "profile", url: "/", siteName: site.name || site.handle, title, description, images: ogImage },
  twitter: { card: ogImage ? "summary_large_image" : "summary", title, description, images: ogImage?.map((image) => image.url) },
  // Closed to search engines until she approves the site (content/profile.ts).
  robots: launch.indexable ? { index: true, follow: true } : { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: "#faf9f7",
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="no-js">
      <head>
        <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOTSTRAP }} />
      </head>
      <body className={`${sans.variable} ${mono.variable} font-sans`} style={{ ["--font-display" as string]: "var(--font-sans)" }}>
        <SmoothScroll>{children}</SmoothScroll>
        <RevealRescan />
      </body>
    </html>
  )
}
