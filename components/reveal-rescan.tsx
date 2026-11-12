"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/** Picks up `.reveal` elements rendered by a client-side navigation. */
export default function RevealRescan() {
  const pathname = usePathname()

  useEffect(() => {
    ;(window as { __revealScan?: () => void }).__revealScan?.()
  }, [pathname])

  return null
}
