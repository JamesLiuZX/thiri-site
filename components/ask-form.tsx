"use client"

import { useState, type FormEvent } from "react"
import { ArrowUp } from "lucide-react"

/** "Add a question…": the visitor's question, sent to her as an email. */
export default function AskForm({ email }: { email: string }) {
  const [question, setQuestion] = useState("")
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = question.trim()
    if (!text) return
    window.location.href = `mailto:${email}?subject=${encodeURIComponent("A question from your site")}&body=${encodeURIComponent(text)}`
  }
  return (
    <form onSubmit={onSubmit} className="mt-7 flex items-center gap-2 border-t border-fg/10 pt-5">
      <label className="min-w-0 flex-1">
        <span className="sr-only">Your question</span>
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Add a question…"
          className="w-full rounded-full bg-oat px-4 py-3 text-[14.5px] outline-none ring-berry/40 transition-shadow placeholder:text-muted focus:ring-2"
        />
      </label>
      <button
        type="submit"
        aria-label="Send the question by email"
        disabled={!question.trim()}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-berry text-white transition-opacity disabled:opacity-35"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </form>
  )
}
