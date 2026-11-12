import { existsSync } from "node:fs"
import { join } from "node:path"
import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import { Caveat, Cormorant, Hanken_Grotesk, Parisienne } from "next/font/google"
import "./globals.css"
import SmoothScroll from "@/components/smooth-scroll"
import RevealRescan from "@/components/reveal-rescan"
import { launch } from "@/content/profile"
import { site } from "@/content/site"
import { REVEAL_BOOTSTRAP } from "@/lib/reveal-script"
import { siteUrl } from "@/lib/site"

// Cormorant for display: light, high-contrast, with flowing italics.
// Hanken Grotesk for text: warm, clean, quiet.
const display = Cormorant({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-display", display: "swap" })
const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" })
// A pen hand for notes and annotations, the way her covers write by hand.
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand", display: "swap" })
// A flowing script for cover-style titles ("Café hopping", "grwm in phuket").
const script = Parisienne({ subsets: ["latin"], weight: "400", variable: "--font-script", display: "swap" })

const title = `${site.wordmark || site.handle}, UGC creator${site.location ? ` in ${site.location}` : ""}`
const description = site.tagline || "UGC creator portfolio."
// The social card is optional until the design direction renders one.
const ogImage = existsSync(join(process.cwd(), "public", "og.png"))
  ? [{ url: "/og.png", width: 1200, height: 630, alt: title }]
  : undefined

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s, ${site.wordmark || site.handle}` },
  description,
  openGraph: { type: "profile", url: "/", siteName: site.wordmark || site.handle, title, description, images: ogImage },
  twitter: { card: ogImage ? "summary_large_image" : "summary", title, description, images: ogImage?.map((image) => image.url) },
  // Closed to search engines until she approves the site (content/profile.ts).
  robots: launch.indexable ? { index: true, follow: true } : { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: "#fdf4ec",
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="no-js">
      <head>
        <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOTSTRAP }} />
      </head>
      <body className={`${sans.variable} ${display.variable} ${hand.variable} ${script.variable} font-sans`}>
        <SmoothScroll>{children}</SmoothScroll>
        <RevealRescan />
      </body>
    </html>
  )
}
