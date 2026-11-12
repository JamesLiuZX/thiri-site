"use client"

import { useEffect, type ReactNode } from "react"

/**
 * Momentum scrolling on desktop. Skipped (and never downloaded) on touch
 * devices and for visitors who prefer reduced motion; anchor links then fall
 * back to the stylesheet's native smooth scrolling.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (window.matchMedia("(pointer: coarse)").matches) return

    let frame = 0
    let cleanup: (() => void) | null = null
    let cancelled = false

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return
      const lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })

      const raf = (time: number) => {
        lenis.raf(time)
        frame = requestAnimationFrame(raf)
      }
      frame = requestAnimationFrame(raf)

      // In-page anchors go through Lenis so the jump is eased, not instant.
      const onClick = (event: MouseEvent) => {
        const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href*="#"]')
        if (!anchor) return
        const url = new URL(anchor.href, window.location.href)
        if (url.pathname !== window.location.pathname || !url.hash) return
        const target = document.querySelector(url.hash)
        if (!target) return
        event.preventDefault()
        // Land the section just under the sticky header.
        const bar = document.querySelector<HTMLElement>("body > header, header")?.offsetHeight ?? 64
        lenis.scrollTo(target as HTMLElement, { offset: url.hash === "#top" ? 0 : -bar })
        window.history.pushState(null, "", url.hash)
      }
      document.addEventListener("click", onClick)

      cleanup = () => {
        document.removeEventListener("click", onClick)
        cancelAnimationFrame(frame)
        lenis.destroy()
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return <>{children}</>
}
