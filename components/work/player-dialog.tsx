"use client"

import { forwardRef, useImperativeHandle, useRef, useState, type MouseEvent } from "react"
import { ExternalLink, X } from "lucide-react"
import { FORMAT_LABELS, type Video } from "@/content/profile"
import { parseEmbed } from "@/lib/embeds"

export type PlayerHandle = { open: (video: Video, returnFocus?: HTMLElement | null) => void }

/**
 * One player for the whole gallery, in a native modal <dialog> (focus is
 * trapped, Escape closes, focus returns to the tile).
 *
 * Local files start playing with sound inside the click itself: iOS only
 * allows unmuted playback when play() runs in the user's gesture, so the
 * <video> element is permanent and `open` sets its source and plays it
 * synchronously, before the dialog is shown. Post URLs load the platform's
 * official embed only now, on demand.
 */
const PlayerDialog = forwardRef<PlayerHandle>(function PlayerDialog(_, ref) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const returnTo = useRef<HTMLElement | null>(null)
  const [current, setCurrent] = useState<Video | null>(null)
  const [embedSrc, setEmbedSrc] = useState<string | null>(null)

  useImperativeHandle(ref, () => ({
    open(video, from) {
      const dialog = dialogRef.current
      const player = videoRef.current
      if (!dialog) return
      returnTo.current = from ?? null
      window.dispatchEvent(new Event("player:open"))

      if (video.src && player) {
        const webm = video.srcWebm && player.canPlayType("video/webm") ? video.srcWebm : null
        player.src = webm ?? video.src
        player.poster = video.poster ?? ""
        player.muted = false
        player.currentTime = 0
        void player.play().catch(() => {
          // Blocked: the native controls stay available to start it.
        })
        setEmbedSrc(null)
      } else {
        setEmbedSrc(parseEmbed(video.embed)?.src ?? null)
      }

      setCurrent(video)
      if (!dialog.open) dialog.showModal()
    },
  }))

  const onClose = () => {
    const player = videoRef.current
    if (player) {
      player.pause()
      player.removeAttribute("src")
      player.load()
    }
    setEmbedSrc(null)
    window.dispatchEvent(new Event("player:close"))
    returnTo.current?.focus()
  }

  // A click on the backdrop (the dialog element itself) closes it.
  const onBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) dialogRef.current?.close()
  }

  const embed = current && !current.src ? parseEmbed(current.embed) : null

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={onBackdrop}
      aria-label={current ? current.title : "Video"}
      className="player m-auto max-h-[96svh] max-w-[min(94vw,30rem)] overflow-visible bg-transparent p-0 text-white"
    >
      <div className="relative aspect-[9/16] max-h-[84svh] w-[min(94vw,30rem)] overflow-hidden rounded-3xl bg-black">
        <video ref={videoRef} controls playsInline className={current?.src ? "h-full w-full object-contain" : "hidden"} />
        {embedSrc && (
          <iframe
            src={embedSrc}
            title={current?.title ?? "Video"}
            allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
            allowFullScreen
            className="h-full w-full border-0"
          />
        )}
        {current && !current.src && !embedSrc && (
          <div className="grid h-full place-items-center p-8 text-center text-sm text-white/70">This post can&apos;t be embedded.</div>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-4 px-1">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-medium">{current?.title}</p>
          <p className="mt-0.5 text-sm text-white/60">
            {current && FORMAT_LABELS[current.format]}
            {current?.brand && ` · ${current.brand}`}
            {current?.result && ` · ${current.result}`}
          </p>
          {embed && (
            <a href={embed.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm text-white/70 underline-offset-4 hover:underline">
              Open on {embed.label}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close video"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </dialog>
  )
})

export default PlayerDialog
