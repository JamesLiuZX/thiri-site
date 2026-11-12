import Link from "next/link"

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="label text-muted">404</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">Nothing here.</h1>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-fg">
          Back to the start
        </Link>
      </div>
    </main>
  )
}
