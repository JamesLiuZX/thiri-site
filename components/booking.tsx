"use client"

import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type InputHTMLAttributes } from "react"
import { Check, Copy, Send, X } from "lucide-react"
import type { Booking as BookingInfo } from "@/content/profile"
import { useOrder } from "@/components/providers"
import { cn } from "@/lib/site"

type Key = "name" | "brand" | "what" | "product" | "date" | "email"
type Fields = Record<Key, string>

const EMPTY: Fields = { name: "", brand: "", what: "", product: "", date: "", email: "" }
const HINT: Fields = { name: "your name", brand: "your brand", what: "3 videos", product: "the product", date: "a date", email: "your email" }
const LABEL: Fields = { name: "Your name", brand: "Your brand", what: "What you'd like", product: "The product or campaign", date: "When it goes live", email: "Your email" }
const REQUIRED: Key[] = ["name", "brand", "email"]

/** "3-video bundle" -> "a 3-video bundle". */
const sizePhrase = (name: string) => `a ${name.charAt(0).toLowerCase()}${name.slice(1)}`

/**
 * 22:30. Booking as one sentence to fill in: "Hi Kate, I'm __ from __.
 * We'd love __ for __, live by __. Reach me at __." The size from the
 * order fills itself in, and the bag comes along. Sending it opens the
 * visitor's mail app with the brief written (or posts it, with
 * `booking.formEndpoint`).
 */
export default function Booking({ booking, to }: { booking: BookingInfo; to: string }) {
  const { order, toggle, choose } = useOrder()
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [ownWhat, setOwnWhat] = useState(false)
  const [missing, setMissing] = useState<Key[]>([])
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [copied, setCopied] = useState(false)
  const refs = useRef<Partial<Record<Key, HTMLInputElement | null>>>({})

  // The order's size fills "what", unless they've written their own.
  useEffect(() => {
    if (!ownWhat) setFields((value) => ({ ...value, what: order.set ? sizePhrase(order.set) : "" }))
  }, [order.set, ownWhat])

  // Checking out of the order lands on the first blank.
  useEffect(() => {
    const onCheckout = () => window.setTimeout(() => refs.current.name?.focus({ preventScroll: true }), 1100)
    window.addEventListener("order:checkout", onCheckout)
    return () => window.removeEventListener("order:checkout", onCheckout)
  }, [])

  const bag = [
    ...order.services.map((name) => ({ key: `s-${name}`, text: name, remove: () => toggle("services", name) })),
    ...(order.set ? [{ key: "set", text: order.set, remove: () => choose("set", order.set) }] : []),
    ...order.extras.map((name) => ({ key: `e-${name}`, text: name, remove: () => toggle("extras", name) })),
    ...(order.usage ? [{ key: "usage", text: `Usage: ${order.usage}`, remove: () => choose("usage", order.usage) }] : []),
  ]

  const compose = () => {
    const f = fields
    const lines = [
      `Hi ${to},`,
      "",
      `I'm ${f.name} from ${f.brand}. We'd love ${f.what || "some videos"} for ${f.product || "our product"}${f.date ? `, live by ${f.date}` : ""}.`,
    ]
    if (bag.length > 0) lines.push("", "From the order on your site:", ...bag.map((item) => `- ${item.text}`))
    lines.push("", `You can reach me at ${f.email}.`)
    return { subject: `UGC inquiry: ${f.brand || "a new brand"}`, body: lines.join("\n"), reply: f.email }
  }

  const check = () => {
    const gaps = REQUIRED.filter((key) => !fields[key].trim() || (key === "email" && !/^\S+@\S+\.\S+$/.test(fields[key].trim())))
    setMissing(gaps)
    if (gaps.length > 0) refs.current[gaps[0]]?.focus()
    return gaps.length === 0
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!check()) return
    const { subject, body, reply } = compose()
    if (!booking.formEndpoint) {
      window.location.href = `mailto:${booking.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      return
    }
    setStatus("sending")
    try {
      const response = await fetch(booking.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ subject, message: body, email: reply }),
      })
      setStatus(response.ok ? "sent" : "error")
    } catch {
      setStatus("error")
    }
  }

  const onCopy = async () => {
    const { subject, body } = compose()
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // No clipboard: the email route still works.
    }
  }

  const blank = (key: Key, attrs: InputHTMLAttributes<HTMLInputElement> = {}) => {
    const value = fields[key]
    const wrong = missing.includes(key)
    return (
      <label className={cn("blank", wrong && "is-missing")}>
        <span className="sr-only">
          {LABEL[key]}
          {REQUIRED.includes(key) ? " (required)" : ""}
        </span>
        <input
          ref={(el) => {
            refs.current[key] = el
          }}
          name={key}
          value={value}
          placeholder={HINT[key]}
          aria-invalid={wrong || undefined}
          size={Math.max(value.length, HINT[key].length) + 1}
          style={{ fieldSizing: "content" } as CSSProperties}
          onChange={(event) => {
            const next = event.target.value
            if (key === "what") setOwnWhat(next.trim() !== "")
            setFields((current) => ({ ...current, [key]: next }))
            if (wrong && next.trim()) setMissing((list) => list.filter((item) => item !== key))
          }}
          {...attrs}
        />
      </label>
    )
  }

  if (status === "sent") {
    return (
      <div role="status" className="py-10">
        <p className="font-display text-[clamp(2.2rem,4vw,3.4rem)] font-light italic">Sent. Talk soon.</p>
        <p className="mt-3 text-accent-fg/70">{booking.responseTime ? `Expect a reply ${booking.responseTime}.` : "I'll write back as soon as I can."}</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="booking-line">
      <p className="font-display text-[clamp(1.75rem,3.7vw,3.3rem)] font-light leading-[1.55] tracking-[-0.005em]">
        Hi {to}, I&apos;m {blank("name", { autoComplete: "name", required: true })} from {blank("brand", { autoComplete: "organization", required: true })}. We&apos;d love{" "}
        {blank("what")} for {blank("product")}, live by {blank("date")}. Reach me at{" "}
        {blank("email", { type: "email", inputMode: "email", autoComplete: "email", required: true })}.
      </p>

      {bag.length > 0 && (
        <div className="mt-8">
          <p className="font-hand text-[1.4rem] text-lamp">+ the order in your bag</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {bag.map((item) => (
              <li key={item.key} className="inline-flex items-center gap-1.5 rounded-full border border-accent-fg/20 bg-accent-fg/5 py-1.5 pl-3.5 pr-1.5 text-[13.5px]">
                {item.text}
                <button type="button" onClick={item.remove} aria-label={`Remove ${item.text}`} className="grid h-6 w-6 place-items-center rounded-full text-accent-fg/60 transition-colors hover:bg-accent-fg/10 hover:text-accent-fg">
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={status === "sending"} className="btn-lamp">
          {status === "sending" ? "Sending…" : "Send it"}
          <Send className="h-4 w-4" />
        </button>
        <button type="button" onClick={onCopy} className="inline-flex items-center gap-2 rounded-full border border-accent-fg/25 px-5 py-3.5 text-[14px] transition-colors hover:border-accent-fg/60">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy the brief"}
        </button>
      </div>
      <p aria-live="polite" className="mt-4 min-h-[1.25rem] text-[14px] text-lamp">
        {missing.length > 0 && `Fill in ${missing.map((key) => LABEL[key].toLowerCase()).join(", ")} and it's ready.`}
        {status === "error" && `That didn't send. Try again, or email ${booking.email}.`}
      </p>
    </form>
  )
}
