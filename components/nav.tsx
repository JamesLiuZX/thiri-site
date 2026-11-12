import Link from "next/link"
import { site } from "@/content/site"

/** A quiet bar: her wordmark, the sections that exist, and the way to book. */
export default function Nav({ links }: { links: { id: string; name: string }[] }) {
  return (
    <header className="sticky top-0 z-50 border-b border-fg/[0.07] bg-bg/80 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between gap-6">
        <a href="#top" className="font-display text-[1.7rem] font-light italic leading-none tracking-[-0.01em]">
          {site.wordmark || site.handle}
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-7 text-[13.5px] text-muted md:flex">
          {links.map((link) => (
            <a key={link.id} href={`#${link.id}`} className="transition-colors hover:text-fg">
              {link.name}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-[13.5px]">
          <Link href="/media-kit" className="hidden text-muted transition-colors hover:text-fg sm:inline">
            Media kit
          </Link>
          <a href="#book" className="rounded-full bg-accent px-4 py-2 font-medium text-accent-fg transition-opacity hover:opacity-90">
            Book
          </a>
        </div>
      </div>
    </header>
  )
}
