# Working in this repo

A UGC creator's portfolio. `README.md` covers how it runs, where her videos go and what is left before launch; read it first.

- **The gate**: `pnpm install --frozen-lockfile && pnpm build` (type-checked) and `pnpm exec tsc --noEmit` at zero errors.
- **Content** lives only in `content/profile.ts`: `content` is her real material, `SAMPLE` is labelled stand-ins for design and review. Never invent her name, bio, brands, numbers, rates, testimonials or captions; a fact she has not supplied stays empty. Stats carry their source and date.
- **Privacy**: she is a private individual. Do not put her name or handles into searches or other external requests, and keep the site noindex (`launch.indexable = false`) until she approves it.
- **Launch**: `pnpm check:launch` must pass before `launch.indexable` turns on; the build refuses an indexable site that still shows SAMPLE content.
- `main` is the only long-lived branch.
