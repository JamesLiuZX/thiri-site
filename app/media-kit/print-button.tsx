"use client"

import { Printer } from "lucide-react"

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full bg-[#141416] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
    >
      <Printer className="h-4 w-4" />
      Print or save as PDF
    </button>
  )
}
