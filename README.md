# UGC creator portfolio

A portfolio for a UGC creator (Instagram [@thiriiii_](https://www.instagram.com/thiriiii_/), TikTok [@thiriiiii](https://www.tiktok.com/@thiriiiii)), built for the people who hire her: brands and agencies. A static Next.js 15 site (App Router, `output: "export"`), Tailwind 3, pnpm, Node 22, with a printable media kit at `/media-kit`.

**Status: built, awaiting her approval.** The site is told as *a day in her life*: her signature format is the day-in-the-life vlog, so the page keeps time. The cover sits at 07:30, the work is filed by hour (08:00 Beauty & Hair, 12:30 F&B & Lifestyle, 17:30 Fashion & E-commerce, the weekend's Travel), the menu is in the afternoon, the About at golden hour, and booking after dark. Each section is lit for its hour, and a vlog timestamp in the corner follows the reader. See [docs/directions.md](docs/directions.md).

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

Then:

- [ ] Fill the slots above, set `launch.useSamples = false`, and run `pnpm check:launch`.
- [ ] Set `launch.indexable = true`. The build refuses this while any SAMPLE is still in use.

## Deploy

On Vercel, import the repository at vercel.com/new. Next.js is detected and no settings are needed. Canonical and Open Graph URLs follow the production domain; set `NEXT_PUBLIC_SITE_URL` once a custom domain is live. Any static host works too: deploy the `out/` folder.

## Structure

| Where | What |
| --- | --- |
| `app/page.tsx` | The day: cover (07:30), Trusted by, the work by hour, why brands book her, the menu, process, About (golden hour), FAQ, booking (22:30). Case studies and testimonials appear once they are real |
| `components/day-clock.tsx` | The vlog timestamp that keeps the page's time, and opens the day's running order |
| `components/work/portfolio.tsx` | The portfolio tabs (one per pillar, by hour) and their reels; "Everything" is the moodboard |
| `app/media-kit/` | The printable media kit, built from the same content |
| `components/work/` | The 9:16 gallery, tiles and the shared player dialog |
| `components/booking.tsx` | "Build your brief": composes an email, or posts to `booking.formEndpoint` |
| `lib/embeds.ts` | TikTok and Instagram post URLs to official embed URLs |
| `scripts/check-content.mjs` | The content report and launch check |
| `lib/reveal-script.ts`, `components/rise.tsx` | Motion primitives (CSS-first, reduced-motion safe) |
