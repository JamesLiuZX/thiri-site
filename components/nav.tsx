import Link from "next/link"
import NavBag from "@/components/nav-bag"
import { site } from "@/content/site"

/** A quiet bar that takes on the hour (light by day, ink at night), with the bag once it has something in it. */
export default function Nav({ links }: { links: { id: string; name: string }[] }) {
  return (
    <header className="site-nav sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-700">
      <div className="shell flex h-16 items-center justify-between gap-6">
        <a href="#top" className="font-display text-[1.7rem] font-light italic leading-none tracking-[-0.01em]">
          {site.wordmark || site.handle}
        </a>
        <nav aria-label="Sections" className="nav-links hidden items-center gap-7 text-[13.5px] md:flex">
          {links.map((link) => (
            <a key={link.id} href={`#${link.id}`} className="transition-opacity hover:opacity-100">
              {link.name}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-[13.5px] sm:gap-4">
          <Link href="/media-kit" className="nav-links hidden transition-opacity hover:opacity-100 sm:inline">
            Media kit
          </Link>
          <NavBag />
          <a href="#book" className="nav-book rounded-full px-4 py-2 font-medium transition-opacity hover:opacity-90">
            Book
          </a>
        </div>
      </div>
    </header>
  )
}
