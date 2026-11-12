"use client"

import { useEffect, useState, type RefObject } from "react"

/** Muted previews are allowed: a file exists, no reduced motion, no data saver. */
export function useCanPreview(hasSource: boolean) {
  const [allowed, setAllowed] = useState(false)
  useEffect(() => {
    if (!hasSource) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    setAllowed(!reduce && !saveData)
  }, [hasSource])
  return allowed
}

/**
 * Plays a muted preview only while enough of it is on screen, and never
 * while the player is open.
 */
export function usePreviewPlayback(ref: RefObject<HTMLVideoElement | null>, enabled: boolean, threshold = 0.6) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    let visible = false
    let playerOpen = false
    const sync = () => {
      if (visible && !playerOpen) void el.play().catch(() => {})
      else el.pause()
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= threshold
        sync()
      },
      { threshold: [0, threshold] },
    )
    const onOpen = () => {
      playerOpen = true
      sync()
    }
    const onClose = () => {
      playerOpen = false
      sync()
    }
    observer.observe(el)
    window.addEventListener("player:open", onOpen)
    window.addEventListener("player:close", onClose)
    return () => {
      observer.disconnect()
      window.removeEventListener("player:open", onOpen)
      window.removeEventListener("player:close", onClose)
    }
  }, [ref, enabled, threshold])
}

/** True once the element has been on screen (for one-off entrances). */
export function useSeen<T extends Element>(ref: RefObject<T | null>, rootMargin = "0px 0px -10% 0px") {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, rootMargin, seen])
  return seen
}
