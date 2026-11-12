import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/site"

type Piece = string | { text: string; className?: string }

/**
 * A headline whose words climb out of their own masks when it scrolls into
 * view. Pieces can carry a class (an italic word, say). Screen readers get the
 * plain sentence.
 */
export default function Rise({
  as: Tag = "h2",
  pieces,
  className,
  delay = 0,
  children,
}: {
  as?: "h1" | "h2" | "h3" | "p"
  pieces: Piece[]
  className?: string
  delay?: number
  children?: ReactNode
}) {
  const words: { text: string; className?: string }[] = []
  for (const piece of pieces) {
    const text = typeof piece === "string" ? piece : piece.text
    const pieceClass = typeof piece === "string" ? undefined : piece.className
    for (const word of text.split(/\s+/).filter(Boolean)) words.push({ text: word, className: pieceClass })
  }
  const label = words.map((word) => word.text).join(" ")

  return (
    <Tag className={cn("rise", className)} style={{ "--delay": `${delay}s` } as CSSProperties}>
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={index}>
            <span className="w">
              <span className={word.className} style={{ "--i": index } as CSSProperties}>
                {word.text}
              </span>
            </span>{" "}
          </span>
        ))}
      </span>
      {children}
    </Tag>
  )
}
