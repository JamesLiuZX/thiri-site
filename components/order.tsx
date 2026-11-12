"use client"

import type { CSSProperties } from "react"
import { ArrowRight, Camera, Check, Plus, X } from "lucide-react"
import type { Package, Service, UsageTier, Video } from "@/content/profile"
import { useOrder } from "@/components/providers"
import { cn } from "@/lib/site"

const SLOTS = [
  { left: "12%", tilt: -12, lift: "6%" },
  { left: "56%", tilt: 10, lift: "2%" },
  { left: "34%", tilt: -3, lift: "-4%" },
  { left: "70%", tilt: 15, lift: "10%" },
  { left: "4%", tilt: -16, lift: "12%" },
  { left: "45%", tilt: 6, lift: "8%" },
  { left: "22%", tilt: 9, lift: "0%" },
]

/**
 * 15:30. Her services as an order you build, the way her audience shops the
 * mega-sales: add what you need to the bag, pick a size, add extras. The bag
 * fills as you go (each item drops in), its swing tag says the price is on
 * request, and checkout writes the brief in the booking line below.
 */
export default function Order({
  services,
  packages,
  usage,
  videos,
  wordmark,
  sampleUsage,
}: {
  services: Service[]
  packages: Package[]
  usage: UsageTier[]
  videos: Video[]
  wordmark: string
  sampleUsage?: boolean
}) {
  const { order, toggle, choose, clear, count } = useOrder()
  const sets = packages.filter((item) => !item.addOn)
  const extras = packages.filter((item) => item.addOn)
  const set = sets.find((item) => item.name === order.set)
  const poster = (id?: string) => videos.find((video) => video.id === id)?.poster

  const bagged = [
    ...order.services.map((name) => ({ key: `s-${name}`, name, src: poster(services.find((item) => item.name === name)?.videoId), extra: false })),
    ...order.extras.map((name) => ({ key: `e-${name}`, name, src: undefined, extra: true })),
  ]

  const checkout = () => window.dispatchEvent(new Event("order:checkout"))

  return (
    <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-12">
      {/* The bag. */}
      <div className="lg:sticky lg:top-24 lg:col-span-5">
        <div className="bag-scene relative mx-auto aspect-[5/6] w-full max-w-[22rem]">
          <svg aria-hidden="true" viewBox="0 0 320 384" className="absolute inset-0 h-full w-full">
            <path d="M58 132 L262 132 L276 352 L44 352 Z" fill="rgb(214 140 168)" />
          </svg>
          <ul aria-hidden="true" className="absolute inset-x-[16%] top-[21%] h-[30%]">
            {bagged.slice(0, SLOTS.length).map((item, index) => {
              const slot = SLOTS[index]
              return (
                <li
                  key={item.key}
                  className="bag-item absolute top-0 w-[30%]"
                  style={{ left: slot.left, "--r": `${slot.tilt}deg`, "--lift": slot.lift } as CSSProperties}
                >
                  {item.src ? (
                    <span className="block bg-white p-[6%] pb-[16%] shadow-print">
                      <img src={item.src} alt="" className="aspect-[3/4] w-full object-cover" />
                    </span>
                  ) : (
                    <span className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-1 bg-white p-2 text-center shadow-print">
                      {item.extra ? <Camera className="h-5 w-5 text-berry" strokeWidth={1.5} /> : null}
                      <span className="font-hand text-[1rem] leading-none">{item.name}</span>
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
          <svg aria-hidden="true" viewBox="0 0 320 384" className="absolute inset-0 h-full w-full">
            {/* Handles, behind the front. */}
            <path d="M104 140 C 104 40, 150 30, 160 30 C 170 30, 216 40, 216 140" fill="none" stroke="rgb(var(--fg))" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
            <path d="M104 140 C 104 40, 150 30, 160 30 C 170 30, 216 40, 216 140" fill="none" stroke="rgb(var(--surface))" strokeWidth="1.2" strokeDasharray="3 5" opacity="0.6" />
            {/* The front of the bag. */}
            <path d="M40 150 L280 150 L300 372 L20 372 Z" fill="rgb(245 190 208)" />
            <path d="M40 150 L280 150 L283 176 L37 176 Z" fill="rgb(232 166 190)" />
            <path d="M20 372 L300 372 L298 380 L22 380 Z" fill="rgb(205 132 160)" />
            <circle cx="104" cy="163" r="4.5" fill="rgb(160 80 112)" />
            <circle cx="216" cy="163" r="4.5" fill="rgb(160 80 112)" />
            <text x="160" y="272" textAnchor="middle" className="fill-fg font-display" style={{ fontSize: 52, fontStyle: "italic", fontWeight: 300, letterSpacing: "-0.03em" }}>
              {wordmark}
            </text>
            <text x="160" y="300" textAnchor="middle" className="fill-fg/60 font-sans" style={{ fontSize: 10, letterSpacing: "0.32em" }}>
              SINGAPORE
            </text>
          </svg>

          {/* The swing tag. */}
          <div className="bag-tag absolute right-[2%] top-[34%] w-[34%] origin-top" aria-live="polite">
            <span className="block h-7 w-px translate-x-6 bg-fg/50" aria-hidden="true" />
            <span className="block rounded-[10px] bg-surface px-3 pb-3 pt-4 shadow-print [clip-path:polygon(18%_0,82%_0,100%_14%,100%_100%,0_100%,0_14%)]">
              <span aria-hidden="true" className="mx-auto mb-2 block h-2 w-2 rounded-full bg-fg/25" />
              <span className="block font-hand text-[1.15rem] leading-none">{set ? set.name : "pick a size"}</span>
              <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">{set?.price ? `Price: ${set.price.toLowerCase()}` : "Price on request"}</span>
            </span>
          </div>

          <p className="absolute -bottom-2 left-1/2 w-max -translate-x-1/2 font-hand text-[1.35rem] text-berry">
            {count === 0 ? "your bag is empty, for now" : `${count} in the bag`}
          </p>
        </div>
      </div>

      {/* The shop. */}
      <div className="lg:col-span-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">Order · {wordmark}</p>
            <h2 id="services-title" className="mt-2 font-sans text-[clamp(1.9rem,3vw,2.6rem)] font-light leading-[1.02] tracking-[-0.03em]">
              Build your order. <span className="font-display italic">It writes the brief.</span>
            </h2>
          </div>
          <p className="sale-tag" aria-hidden="true">
            around the big sales
          </p>
        </div>

        <fieldset className="mt-10">
          <legend className="shop-step">
            <span>1</span> What you need
          </legend>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {services.map((service) => {
              const on = order.services.includes(service.name)
              const src = poster(service.videoId)
              return (
                <li key={service.name}>
                  <button type="button" aria-pressed={on} onClick={() => toggle("services", service.name)} className={cn("product group", on && "is-on")}>
                    <span aria-hidden="true" className="product-thumb">
                      {src ? <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14.5px] font-semibold leading-snug">{service.name}</span>
                      <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{service.description}</span>
                    </span>
                    <span aria-hidden="true" className="product-add">
                      {on ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </fieldset>

        {sets.length > 0 && (
          <fieldset className="mt-9">
            <legend className="shop-step">
              <span>2</span> How many
            </legend>
            <div role="radiogroup" aria-label="How many" className="mt-4 flex flex-wrap gap-2">
              {sets.map((item) => {
                const on = order.set === item.name
                return (
                  <button key={item.name} type="button" role="radio" aria-checked={on} onClick={() => choose("set", item.name)} className={cn("size-pill", on && "is-on")}>
                    {item.name}
                    {item.highlight && <span className="ml-1.5 font-hand text-[1.05rem] text-berry">♡</span>}
                  </button>
                )
              })}
            </div>
            <p className="mt-3 min-h-[1.5rem] text-[14px] text-muted">{set ? set.description : "Pick one, or leave it to the brief."}</p>
          </fieldset>
        )}

        {(extras.length > 0 || usage.length > 0) && (
          <fieldset className="mt-9">
            <legend className="shop-step">
              <span>3</span> Extras
            </legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {extras.map((item) => {
                const on = order.extras.includes(item.name)
                return (
                  <button key={item.name} type="button" aria-pressed={on} onClick={() => toggle("extras", item.name)} className={cn("size-pill", on && "is-on")}>
                    {on ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    {item.name}
                  </button>
                )
              })}
            </div>
            {usage.length > 0 && (
              <div className="mt-5">
                <p className="flex items-center gap-2 text-[13px] font-medium">
                  Where it runs
                  {sampleUsage && <span className="rounded-full border border-dashed border-rose/70 px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.16em] text-rose">Sample</span>}
                </p>
                <div role="radiogroup" aria-label="Where it runs" className="mt-2.5 flex flex-wrap gap-2">
                  {usage.map((tier) => {
                    const on = order.usage === tier.name
                    return (
                      <button key={tier.name} type="button" role="radio" aria-checked={on} title={tier.description} onClick={() => choose("usage", tier.name)} className={cn("size-pill", on && "is-on")}>
                        {tier.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </fieldset>
        )}

        <div className="checkout mt-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Total</p>
            <p className="font-display text-[1.7rem] italic leading-none">on request</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {count > 0 && (
              <button type="button" onClick={clear} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] text-muted transition-colors hover:text-fg">
                <X className="h-3.5 w-3.5" />
                Empty the bag
              </button>
            )}
            <a href="#book" onClick={checkout} className="btn">
              Write the brief
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
