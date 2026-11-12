import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import Fish from "@/components/fish"
import { site } from "@/content/site"

const platform = { instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube" } as const

export default function Footer() {
  return (
    <footer id="goodnight" data-time="00:00" data-moment="Goodnight" data-light="night" className="relative overflow-hidden bg-[#242221] text-accent-fg">
      <div className="shell pb-10 pt-20 md:pt-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-display text-[2.6rem] font-light italic leading-none">{site.wordmark || site.handle}</p>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-accent-fg/65">
              {site.tagline}. Open to brand work: send a brief and I&apos;ll come back to you.
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="label text-accent-fg/45">Find me</p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {site.socials.map((social) => (
                <li key={social.url}>
                  <a href={social.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-accent-fg/80 transition-colors hover:text-accent-fg">
                    {platform[social.platform]} {social.handle}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <p className="label text-accent-fg/45">For brands</p>
            <ul className="mt-4 space-y-2.5 text-[15px] text-accent-fg/80">
              {site.booking.email && (
                <li>
                  <a href={`mailto:${site.booking.email}`} className="link">
                    {site.booking.email}
                  </a>
                </li>
              )}
              <li>
                <Link href="/media-kit" className="link">
                  Media kit
                </Link>
              </li>
              <li>
                <a href="#book" className="link">
                  Book a shoot
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-accent-fg/10 pt-6 text-[13px] text-accent-fg/45">
          <p>
            © {new Date().getFullYear()} {site.wordmark || site.handle}
          </p>
          <a href="#top" className="transition-colors hover:text-accent-fg">
            Back to the top ↑
          </a>
        </div>
      </div>

      {/* Her wordmark, too big for the page, with a fish crossing it. */}
      <div aria-hidden="true" className="relative">
        <p className="pointer-events-none -mb-[0.18em] select-none whitespace-nowrap text-center font-display text-[30vw] font-light italic leading-[0.8] tracking-[-0.04em] text-accent-fg/[0.06]">
          {site.wordmark || site.handle}
        </p>
        <div className="fish-companion absolute left-0 top-[38%] w-full">
          <div className="w-max [animation:footer-swim_22s_linear_infinite]">
            <Fish className="h-7 w-12 text-fish" />
          </div>
        </div>
      </div>
    </footer>
  )
}
