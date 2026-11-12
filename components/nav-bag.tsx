"use client"

import { ShoppingBag } from "lucide-react"
import { useOrder } from "@/components/providers"

/** The bag from the order, in the bar: it appears with the first item and pops on each one. */
export default function NavBag() {
  const { count } = useOrder()
  if (count === 0) return null
  return (
    <a href="#order" aria-label={`Your order: ${count} ${count === 1 ? "item" : "items"}`} className="relative grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-fg/5">
      <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
      <span key={count} className="bag-pop absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-berry px-1 text-[10.5px] font-semibold text-white">
        {count}
      </span>
    </a>
  )
}
