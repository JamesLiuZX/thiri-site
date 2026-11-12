import type { CSSProperties } from "react"
import Fish from "@/components/fish"
import SampleTag from "@/components/sample-tag"
import { site } from "@/content/site"
import { moment } from "@/lib/day"

// Seven die-cut sticker styles, each setting the name in the site's own type.
const STYLES = ["s-serif", "s-caps", "s-script", "s-star", "s-oval", "s-ticket", "s-pen"]
const TILT = [-5, 4, -2, 6, -4, 3, -6, 2, 5, -3, 4, -5]
const LIFT = [6, -8, 4, -4, 10, -10, 2, 8, -6, 4, -2, 6]

/**
 * 09:00. Who trusts her, as a sheet of die-cut stickers slapped down one
 * by one: brand names set in the site's own type (never their logos), each
 * sticker in its own shape. Her signature fish signs the sheet.
 */
export default function Stickers() {
  if (site.brands.length === 0) return null
  return (
    <section id="brands" {...moment("09:00", "Trusted by", "morning")} aria-labelledby="brands-title" className="relative overflow-x-clip py-12 md:py-20">
      <h2 id="brands-title" className="sr-only">
        Trusted by
      </h2>
      <ul className="observe stickers shell flex flex-wrap items-center justify-center gap-x-3 gap-y-5 md:gap-x-5 md:gap-y-7">
        <li className="sticker s-label" style={{ "--r": "-7deg", "--y": "0px", "--i": 0 } as CSSProperties}>
          Trusted by
        </li>
        {site.brands.map((brand, index) => (
          <li
            key={brand.name}
            className={`sticker ${STYLES[index % STYLES.length]}`}
            style={{ "--r": `${TILT[index % TILT.length]}deg`, "--y": `${LIFT[index % LIFT.length]}px`, "--i": index + 1 } as CSSProperties}
          >
            {STYLES[index % STYLES.length] === "s-star" && <span aria-hidden="true">✦ </span>}
            {brand.name}
          </li>
        ))}
        <li aria-hidden="true" className="sticker s-fish" style={{ "--r": "8deg", "--y": "-4px", "--i": site.brands.length + 1 } as CSSProperties}>
          <Fish className="h-5 w-9 text-fish" />
          <span>{site.displayName}</span>
        </li>
      </ul>
      <div className="mt-6 flex justify-center">
        <SampleTag slots={["brands"]} />
      </div>
    </section>
  )
}
