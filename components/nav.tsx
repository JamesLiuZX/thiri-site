import Link from "next/link"
import { site } from "@/content/site"

/** Phase 1: a plain sticky bar listing only the sections that exist. */
export default function Nav({ links }: { links: { id: string; name: string }[] }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between gap-6">
        <a href="#top" className="truncate text-[15px] font-semibold tracking-tight">
          {site.name || site.handle}
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-6 text-sm text-muted md:flex">
          {links.map((link) => (
            <a key={link.id} href={`#${link.id}`} className="transition-colors hover:text-fg">
              {link.name}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/media-kit" className="hidden text-muted transition-colors hover:text-fg sm:inline">
            Media kit
          </Link>
          <a href="#book" className="rounded-full bg-accent px-4 py-2 font-medium text-accent-fg transition-opacity hover:opacity-90">
            Work with me
          </a>
        </div>
      </div>
    </header>
  )
}
