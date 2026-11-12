"use client"

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react"
import PlayerDialog, { type PlayerHandle } from "@/components/work/player-dialog"
import type { Video } from "@/content/profile"

/* -------------------------------------------------------------------------- */
/* One player for the whole page                                              */
/* -------------------------------------------------------------------------- */

type Open = (video: Video, from?: HTMLElement | null) => void
const PlayerContext = createContext<Open>(() => {})

/** Opens the page's one video player (with sound, inside the click: iOS-safe). */
export const usePlayer = () => useContext(PlayerContext)

/* -------------------------------------------------------------------------- */
/* The order a brand builds (services), read by the bag and the booking line  */
/* -------------------------------------------------------------------------- */

export type Order = { services: string[]; set: string | null; extras: string[]; usage: string | null }
type OrderApi = {
  order: Order
  toggle: (list: "services" | "extras", name: string) => void
  choose: (field: "set" | "usage", name: string | null) => void
  clear: () => void
  /** Items in the bag: services and extras. */
  count: number
}

const EMPTY: Order = { services: [], set: null, extras: [], usage: null }
const OrderContext = createContext<OrderApi>({ order: EMPTY, toggle: () => {}, choose: () => {}, clear: () => {}, count: 0 })
export const useOrder = () => useContext(OrderContext)

export default function Providers({ children }: { children: ReactNode }) {
  const player = useRef<PlayerHandle>(null)
  const open = useCallback<Open>((video, from) => player.current?.open(video, from), [])

  const [order, setOrder] = useState<Order>(EMPTY)
  const api = useMemo<OrderApi>(
    () => ({
      order,
      toggle: (list, name) =>
        setOrder((value) => ({ ...value, [list]: value[list].includes(name) ? value[list].filter((item) => item !== name) : [...value[list], name] })),
      choose: (field, name) => setOrder((value) => ({ ...value, [field]: value[field] === name ? null : name })),
      clear: () => setOrder(EMPTY),
      count: order.services.length + order.extras.length,
    }),
    [order],
  )

  return (
    <PlayerContext.Provider value={open}>
      <OrderContext.Provider value={api}>
        {children}
        <PlayerDialog ref={player} />
      </OrderContext.Provider>
    </PlayerContext.Provider>
  )
}
