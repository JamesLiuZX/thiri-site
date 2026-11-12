"use client"

import { useState, type FormEvent } from "react"
import { Check, Copy, Send } from "lucide-react"
import type { Booking as BookingInfo, Service, UsageTier } from "@/content/profile"

/**
 * "Build your brief": the questions she would ask anyway (brand, product,
 * deliverables, usage, timeline, budget), composed into an email. Without a
 * server, submitting opens the visitor's mail app with the brief filled in;
 * set `booking.formEndpoint` (e.g. Formspree) to post it instead.
 */
export default function Booking({ booking, services, usage }: { booking: BookingInfo; services: Service[]; usage: UsageTier[] }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [copied, setCopied] = useState(false)

  const compose = (form: HTMLFormElement) => {
    const data = new FormData(form)
    const get = (key: string) => String(data.get(key) ?? "").trim()
    const deliverables = data.getAll("deliverables").map(String)
    const subject = `UGC inquiry: ${get("brand") || "a new brand"}`
    const body = [
      `Brand: ${get("brand")}`,
      `From: ${get("name")} <${get("email")}>`,
      get("product") && `Product: ${get("product")}`,
      deliverables.length > 0 && `Deliverables: ${deliverables.join(", ")}${get("quantity") ? ` (${get("quantity")})` : ""}`,
      get("usage") && `Usage: ${get("usage")}`,
      get("timeline") && `Timeline: ${get("timeline")}`,
      get("budget") && `Budget: ${get("budget")}`,
      get("notes") && `\n${get("notes")}`,
    ]
      .filter(Boolean)
      .join("\n")
    return { subject, body, reply: get("email") }
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { subject, body, reply } = compose(event.currentTarget)
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

  const onCopy = async (form: HTMLFormElement | null) => {
    if (!form) return
    const { subject, body } = compose(form)
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable: the email route still works.
    }
  }

  const field = "w-full rounded-2xl border border-fg/15 bg-surface/90 px-4 py-3.5 text-[15px] outline-none transition-colors placeholder:text-muted/60 focus:border-fg/45"
  const legend = "label mb-2 block text-muted"

  if (status === "sent") {
    return (
      <div role="status" className="rounded-[32px] bg-surface p-10 shadow-print">
        <p className="font-display text-[2.2rem] font-light italic">Brief sent.</p>
        <p className="mt-2 text-muted">{booking.responseTime ? `Expect a reply ${booking.responseTime}.` : "Expect a reply soon."}</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-[32px] bg-surface p-6 shadow-print md:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <span className={legend}>Brand</span>
          <input name="brand" required autoComplete="organization" className={field} />
        </label>
        <label>
          <span className={legend}>Product link</span>
          <input name="product" type="url" inputMode="url" placeholder="https://" className={field} />
        </label>
        <label>
          <span className={legend}>Your name</span>
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label>
          <span className={legend}>Your email</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
      </div>

      {services.length > 0 && (
        <fieldset>
          <legend className={legend}>What you need</legend>
          <div className="flex flex-wrap gap-2">
            {services.map((service) => (
              <label key={service.name} className="chip cursor-pointer has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-accent-fg">
                <input type="checkbox" name="deliverables" value={service.name} className="sr-only" />
                {service.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="grid gap-5 sm:grid-cols-3">
        <label>
          <span className={legend}>How many</span>
          <input name="quantity" placeholder="e.g. 3 videos" className={field} />
        </label>
        {usage.length > 0 && (
          <label>
            <span className={legend}>Usage</span>
            <select name="usage" className={field} defaultValue="">
              <option value="">Not sure yet</option>
              {usage.map((tier) => (
                <option key={tier.name} value={tier.name}>
                  {tier.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          <span className={legend}>Timeline</span>
          <input name="timeline" placeholder="e.g. live by March" className={field} />
        </label>
      </div>

      <label>
        <span className={legend}>Budget (optional)</span>
        <input name="budget" className={field} />
      </label>
      <label>
        <span className={legend}>Anything else</span>
        <textarea name="notes" rows={4} className={`${field} resize-none`} placeholder="The audience, the must-says, references you love" />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={status === "sending"} className="btn disabled:opacity-60">
          {status === "sending" ? "Sending…" : booking.formEndpoint ? "Send the brief" : "Email the brief"}
          <Send className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={(event) => onCopy(event.currentTarget.form)}
          className="btn-ghost"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy the brief"}
        </button>
        {status === "error" && <p className="text-sm text-red-600">That didn&apos;t send. Try again, or email {booking.email}.</p>}
      </div>
    </form>
  )
}
