# UGC creator portfolio

A portfolio for a UGC creator (Instagram [@thiriiii_](https://www.instagram.com/thiriiii_/), TikTok [@thiriiiii](https://www.tiktok.com/@thiriiiii)), built for the people who hire her: brands and agencies. A static Next.js 15 site (App Router, `output: "export"`), Tailwind 3, pnpm, Node 22, with a printable media kit at `/media-kit`.

**Status: phase 1.** The structure, the content model and the engineering are done, and the styling is deliberately neutral. The design system comes from her own content (see [docs/directions.md](docs/directions.md)). Until her material is in, empty slots show labelled SAMPLE stand-ins and a "Preview" badge.

## Run it

```bash
pnpm install
pnpm dev             # http://localhost:3000
pnpm build           # static export into out/ (type-checks too)
pnpm check:content   # what is filled, what is still SAMPLE or empty
```

## Edit it

All content is in [`content/profile.ts`](content/profile.ts):

- `content` holds her real material. Only facts she has supplied go here.
- `SAMPLE` holds stand-ins for design and review. Nothing in it describes her.

`content/site.ts` merges the two (a real value always wins). Sections with nothing to show disappear.

Rules: never invent a number, brand, testimonial or caption. Stats come from her analytics, with their source and the month they were read. Results come from the brand's numbers or hers.

### Her videos

Put files in `public/work/` and list them in `content.videos`:

```ts
{ id: "serum", title: "Morning skincare", format: "testimonial", brand: "Brand", src: "/work/serum.mp4", poster: "/work/serum.jpg", duration: "0:28" }
```

- **Files:** H.264 MP4, 9:16 (720×1280 is plenty), with `+faststart`. A WebM next to it (`srcWebm`) is optional.

  ```bash
  ffmpeg -i in.mov -vf scale=720:-2 -c:v libx264 -crf 23 -preset slow -movflags +faststart -an work/serum.mp4
  ```

  Drop `-an` if the video needs its sound.

- **Poster:** the frame that sells the video.

  ```bash
  ffmpeg -ss 1 -i work/serum.mp4 -frames:v 1 -q:v 3 work/serum.jpg
  ```

- **No file?** Use `embed: "<TikTok or Instagram post URL>"` instead of `src`. The tile shows the poster and loads the official embed only when tapped.
- **Behaviour:** tiles preview muted only while on screen (never for reduced motion or data saver), and a tap opens the player with sound.

## Before launch

- [ ] Her real material in every required slot: name, tagline, bio, portrait, videos, booking (`pnpm check:content`).
- [ ] She approves the copy and every figure.
- [ ] Delete `public/samples/`, set `launch.useSamples = false`, and run `pnpm check:launch`.
- [ ] Set `launch.indexable = true`. The build refuses this while any SAMPLE is still in use.

## Deploy

On Vercel, import the repository at vercel.com/new. Next.js is detected and no settings are needed. Canonical and Open Graph URLs follow the production domain; set `NEXT_PUBLIC_SITE_URL` once a custom domain is live. Any static host works too: deploy the `out/` folder.

## Structure

| Where | What |
| --- | --- |
| `app/page.tsx` | The page, in the order a brand evaluates a creator: hook, brands, videos by format, pillars, results, services / usage / packages, process, testimonials, about, FAQ, booking |
| `app/media-kit/` | The printable media kit, built from the same content |
| `components/work/` | The 9:16 gallery, tiles and the shared player dialog |
| `components/booking.tsx` | "Build your brief": composes an email, or posts to `booking.formEndpoint` |
| `lib/embeds.ts` | TikTok and Instagram post URLs to official embed URLs |
| `scripts/check-content.mjs` | The content report and launch check |
| `lib/reveal-script.ts`, `components/rise.tsx` | Motion primitives (CSS-first, reduced-motion safe) |
