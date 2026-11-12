# UGC creator portfolio

A portfolio for a UGC creator (Instagram [@thiriiii_](https://www.instagram.com/thiriiii_/), TikTok [@thiriiiii](https://www.tiktok.com/@thiriiiii)), built for the people who hire her: brands and agencies. A static Next.js 15 site (App Router, `output: "export"`), Tailwind 3, pnpm, Node 22, with a printable media kit at `/media-kit`.

**Status: v3 built, awaiting her approval.** The page is one day of hers, from first light to goodnight, and the light moves with the scroll: the sky turns from dawn blush to sea-glass noon, golden hour and night ink, the sun's glow crosses the page, window-light shadows lean across it, and a small sun (then moon) travels an arc in the corner. The colours come from her own covers. No two sections share a layout:

- **07:30:** her stories playing over her masthead, with her stats as story stickers.
- **09:00:** "Trusted by" as a sheet of die-cut stickers.
- **12:00:** her camera roll, edge to edge, with albums.
- **14:00:** three of her covers marked up in pen: the hook, the product, the call to action.
- **15:30:** the services as an order you build in a shopping bag, which writes the brief.
- **16:45:** the process as a notebook shot list.
- **18:00:** weekends away as ticket stubs at golden hour.
- **18:45:** a photo-booth strip, a letter and a card.
- **20:30:** the FAQ answered in the comments.
- **22:30:** booking as one sentence to fill in, under the moon.

See [docs/directions.md](docs/directions.md). The version before v3 is kept for comparison on the branch `archive/2026-11-12-day-clock`.

Content comes from two sources, and every fact is for Kate to confirm before launch:

- her TikTok and Instagram profiles, captured by James on 2026-11-12 (counts, covers, views, the brands named on her covers)
- James's creator brief (her name, pillars, brand partners, deliverables, packages, selling angles)

Where they differ, the captures win. The site stays noindex until she approves it, and the slots nobody has supplied yet (usage rights, process, turnaround, FAQ, languages, audience) still show labelled SAMPLE stand-ins and a "Preview" pill.

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

For now, every video is a cover cropped from her TikTok grid (a provisional poster, for her approval) that opens on TikTok, plus three real posts that play in the official TikTok or Instagram embed. When her original files arrive, add `src` (and a 9:16 `poster`, then drop `ratio: "3/4"`) to each entry, and they play on the site.

To add one, put the files in `public/work/` and list them in `content.videos`:

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

Questions for Kate:

- [ ] Her name on the site ("Kate Zheng"), and how brands should address her.
- [ ] Publishing her email on the site (it is already in both bios).
- [ ] The "Trusted by" list. None of James's brands carries a paid-partnership label in the captures; Aestura is named on a cover. Separately, her covers name Glow Recipe, OLENS, Medicube, SHEIN (with a discount code), Soundpeats, Montigo and Taobao. Which of these were brand work?
- [ ] The 1.5M-view TikTok. The brief says her Juno Hair transformation passed 1.5M views; the cover in the capture doesn't show which video it is.
- [ ] "Bilingual": which languages does she film in?
- [ ] Naming her university, and whether couple content belongs on the site (both are off by default).
- [ ] Usage rights, process and turnaround, FAQ answers, audience figures, and rates (or "on request").
- [ ] The posters and portrait cropped from her profile, the cover titles, and the site copy.
- [ ] Her SHEIN code. The marked-up call-to-action frame shows the cover with "<88KATE> for 15% off" on it, with TikTok's view counter painted out. Is it still fine to show?
- [ ] The marked-up frames' notes and headings, the solo frames in the photo-booth strip, and which covers play as stories.

Then:

- [ ] Fill the slots above, set `launch.useSamples = false`, and run `pnpm check:launch`.
- [ ] Set `launch.indexable = true`. The build refuses this while any SAMPLE is still in use.

## Deploy

On Vercel, import the repository at vercel.com/new. Next.js is detected and no settings are needed. Canonical and Open Graph URLs follow the production domain; set `NEXT_PUBLIC_SITE_URL` once a custom domain is live. Any static host works too: deploy the `out/` folder.

## Structure

| Where | What |
| --- | --- |
| `app/page.tsx` | The day, in order. Case studies and testimonials (`components/extras.tsx`) appear once they are real |
| `components/day.tsx` | The day's light: sky, glows, window light, stars, and the sun-to-moon arc with the running order |
| `components/hero.tsx`, `components/hero/stories.tsx` | The masthead, her covers as stories, the stats as story stickers |
| `components/stickers.tsx` | Trusted by, as die-cut stickers in the site's type |
| `components/work/camera-roll.tsx` | The camera roll and its albums; `player-dialog.tsx` is the one player for the page |
| `components/anatomy.tsx` | The marked-up covers (`content.anatomy`) |
| `components/order.tsx` | The order and the bag; `components/providers.tsx` shares it with the booking sentence and the bar |
| `components/storyboard.tsx`, `tickets.tsx`, `about.tsx`, `comments.tsx` | Shot list, weekends, the booth and letter, the FAQ thread |
| `components/booking.tsx` | The sentence to fill in: composes an email, or posts to `booking.formEndpoint` |
| `app/media-kit/` | The printable media kit, built from the same content |
| `lib/embeds.ts` | TikTok and Instagram post URLs to official embed URLs |
| `scripts/check-content.mjs` | The content report and launch check |
| `lib/reveal-script.ts`, `components/rise.tsx` | Motion primitives (CSS-first, reduced-motion safe) |
