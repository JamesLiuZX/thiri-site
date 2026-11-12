"use client"

import { useEffect, useState, type ReactNode } from "react"
import { cn } from "@/lib/site"

/** Below md, where the floating UI would sit on the hero's numbers. */
export const PHONE_QUERY = "(max-width: 767.98px)"

/**
 * True once the hero's stats ([data-hero-stats]) have scrolled above the
 * viewport; false while they are on screen or still below it. Always true
 * when the page has no stats.
 */
export function usePastHero() {
  const [past, setPast] = useState(false)
  useEffect(() => {
    const mark = document.querySelector("[data-hero-stats]")
    if (!mark || typeof IntersectionObserver === "undefined") {
      setPast(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => setPast(!entry.isIntersecting && entry.boundingClientRect.top < 0))
    observer.observe(mark)
    return () => observer.disconnect()
  }, [])
  return past
}

/**
 * Floating UI that, on phones, fades in only once the hero's stats have
 * scrolled past, so the first screen's numbers are never covered. Desktop
 * shows it throughout. The hiding itself is CSS (.after-hero, globals.css).
 */
export default function AfterHero({ className, children }: { className?: string; children: ReactNode }) {
  const past = usePastHero()
  return <div className={cn("after-hero", past && "is-past", className)}>{children}</div>
}
