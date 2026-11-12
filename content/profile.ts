/**
 * Everything the site says lives in this file, in two objects:
 *
 *   `content`  Her real material. Only facts she (or James, on her behalf)
 *              has supplied go here. Empty slots stay empty.
 *   `SAMPLE`   Clearly fake stand-ins, used only while `launch.useSamples`
 *              is on, so the layout can be designed and reviewed before her
 *              material arrives. Nothing in SAMPLE describes her.
 *
 * `content/site.ts` merges the two (a real value always wins) and refuses to
 * build an indexable site while any SAMPLE slot is still in use.
 * `pnpm check:content` lists what is still empty or sampled.
 *
 * Rules: never invent a number, brand, testimonial or caption. Stats come
 * from her own analytics, with the date they were read. Results come from
 * the brand's numbers or hers, never estimated.
 *
 * Kept free of imports so `scripts/check-content.mjs` can load it directly.
 */

export type Platform = "instagram" | "tiktok" | "youtube"

/** Formats brands browse by. */
export type Format = "testimonial" | "unboxing" | "grwm" | "tutorial" | "voiceover" | "hooks" | "review" | "lifestyle"

export const FORMAT_LABELS: Record<Format, string> = {
  testimonial: "Testimonial",
  unboxing: "Unboxing",
  grwm: "GRWM",
  tutorial: "Tutorial",
  voiceover: "Voiceover",
  hooks: "Hook variations",
  review: "Review",
  lifestyle: "Lifestyle",
}

export type Social = { platform: Platform; handle: string; url: string; followers?: string }

/** A figure from her own analytics, with where and when it was read. */
export type Stat = { value: string; label: string; source?: string; asOf?: string }

export type Video = {
  id: string
  title: string
  format: Format
  brand?: string
  /** A local file in public/, e.g. "/work/serum.mp4". Preferred. */
  src?: string
  srcWebm?: string
  /** First frame or cover, e.g. "/work/serum.jpg". */
  poster?: string
  /** Fallback when there is no file: the TikTok or Instagram post URL. */
  embed?: string
  duration?: string
  /** Only from the brand's or her own numbers. */
  result?: string
  featured?: boolean
}

export type Pillar = { name: string; description: string; videoIds?: string[] }
export type Brand = { name: string; logo?: string; url?: string }
export type CaseStudy = { brand: string; brief: string; delivered: string; result?: string; videoId?: string }
export type Service = { name: string; description: string; includes?: string[] }
export type Package = { name: string; description: string; includes: string[]; price?: string; highlight?: boolean }
export type UsageTier = { name: string; description: string; term?: string; price?: string }
export type Step = { title: string; description: string; duration?: string }
export type Testimonial = { quote: string; name: string; role?: string; brand?: string }
export type Faq = { q: string; a: string }
export type Booking = { email: string; formEndpoint?: string; calendar?: string; responseTime?: string }

export type Content = {
  name: string
  handle: string
  tagline: string
  bio: string
  location: string
  languages: string[]
  portrait: string
  socials: Social[]
  pillars: Pillar[]
  stats: Stat[]
  audience: Stat[]
  videos: Video[]
  brands: Brand[]
  caseStudies: CaseStudy[]
  services: Service[]
  packages: Package[]
  usage: UsageTier[]
  process: Step[]
  turnaround: string
  testimonials: Testimonial[]
  faq: Faq[]
  booking: Booking
}

/** Slots the site cannot launch without. */
export const REQUIRED: (keyof Content)[] = ["name", "tagline", "bio", "portrait", "videos", "booking"]

/**
 * Launch switches.
 * - `useSamples`: show SAMPLE stand-ins in empty slots (design and review only).
 * - `indexable`: let search engines in. Only once she has approved the site;
 *   the build refuses it while any SAMPLE slot is in use.
 */
export const launch = {
  useSamples: true,
  indexable: false,
}

/* -------------------------------------------------------------------------- */
/* Her real material                                                          */
/* -------------------------------------------------------------------------- */

export const content: Content = {
  // Display name and preferred spelling: to confirm with her.
  name: "",
  // Instagram is the handle James listed first. Confirm which one leads.
  handle: "@thiriiii_",
  tagline: "",
  bio: "",
  location: "",
  languages: [],
  portrait: "",
  socials: [
    { platform: "instagram", handle: "@thiriiii_", url: "https://www.instagram.com/thiriiii_/" },
    { platform: "tiktok", handle: "@thiriiiii", url: "https://www.tiktok.com/@thiriiiii" },
  ],
  pillars: [],
  stats: [],
  audience: [],
  videos: [],
  brands: [],
  caseStudies: [],
  services: [],
  packages: [],
  usage: [],
  process: [],
  turnaround: "",
  testimonials: [],
  faq: [],
  booking: { email: "" },
}

/* -------------------------------------------------------------------------- */
/* SAMPLE stand-ins: fake by design, never shipped                            */
/* -------------------------------------------------------------------------- */

export const SAMPLE: Content = {
  name: "Creator Name",
  handle: "@handle",
  tagline: "SAMPLE: one line on what she makes, and for which brands.",
  bio: "SAMPLE: two or three sentences in her own voice: what she films, who watches, and why brands come back.",
  location: "SAMPLE: City",
  languages: ["SAMPLE: Language one", "SAMPLE: Language two"],
  portrait: "/samples/sample-3.jpg",
  socials: [
    { platform: "instagram", handle: "@handle", url: "https://www.instagram.com/" },
    { platform: "tiktok", handle: "@handle", url: "https://www.tiktok.com/" },
  ],
  pillars: [
    { name: "SAMPLE: Pillar one", description: "SAMPLE: the kind of content, and the brands it suits.", videoIds: ["sample-1"] },
    { name: "SAMPLE: Pillar two", description: "SAMPLE: the kind of content, and the brands it suits.", videoIds: ["sample-2"] },
    { name: "SAMPLE: Pillar three", description: "SAMPLE: the kind of content, and the brands it suits.", videoIds: ["sample-3"] },
  ],
  stats: [
    { value: "00K", label: "SAMPLE: TikTok followers", source: "TikTok analytics", asOf: "Month 2026" },
    { value: "00K", label: "SAMPLE: Instagram followers", source: "Instagram insights", asOf: "Month 2026" },
    { value: "0.0%", label: "SAMPLE: Average engagement", source: "Her analytics", asOf: "Month 2026" },
  ],
  audience: [
    { value: "00%", label: "SAMPLE: Audience aged 18–34" },
    { value: "00%", label: "SAMPLE: Top country" },
  ],
  videos: [
    { id: "sample-1", title: "SAMPLE: Morning routine", format: "testimonial", brand: "Brand One", src: "/samples/sample-1.mp4", poster: "/samples/sample-1.jpg", duration: "0:04", featured: true },
    { id: "sample-2", title: "SAMPLE: First look", format: "unboxing", brand: "Brand Two", src: "/samples/sample-2.mp4", poster: "/samples/sample-2.jpg", duration: "0:04" },
    { id: "sample-3", title: "SAMPLE: Get ready with me", format: "grwm", brand: "Brand Three", src: "/samples/sample-3.mp4", poster: "/samples/sample-3.jpg", duration: "0:04" },
    { id: "sample-4", title: "SAMPLE: How I use it", format: "tutorial", brand: "Brand Four", src: "/samples/sample-4.mp4", poster: "/samples/sample-4.jpg", duration: "0:04" },
    { id: "sample-5", title: "SAMPLE: Embedded post", format: "voiceover", embed: "https://www.tiktok.com/@handle/video/0000000000000000000" },
  ],
  brands: [{ name: "Brand One" }, { name: "Brand Two" }, { name: "Brand Three" }, { name: "Brand Four" }, { name: "Brand Five" }],
  caseStudies: [
    {
      brand: "Brand One",
      brief: "SAMPLE: what the brand asked for.",
      delivered: "SAMPLE: what she made, in how many versions.",
      result: "SAMPLE: a result from the brand's own numbers.",
      videoId: "sample-1",
    },
  ],
  services: [
    { name: "SAMPLE: UGC video", description: "SAMPLE: a scripted, filmed and edited vertical video.", includes: ["SAMPLE: script", "SAMPLE: captions", "SAMPLE: one revision"] },
    { name: "SAMPLE: Hook variations", description: "SAMPLE: extra openings for the same video, for ad testing." },
    { name: "SAMPLE: Voiceover", description: "SAMPLE: her voice over the brand's footage." },
    { name: "SAMPLE: Photo set", description: "SAMPLE: stills for product pages and ads." },
    { name: "SAMPLE: Raw footage", description: "SAMPLE: the unedited clips, for the brand's own editors." },
  ],
  packages: [
    { name: "SAMPLE: One video", description: "SAMPLE: a single video.", includes: ["SAMPLE: 1 video", "SAMPLE: 1 hook"], price: "SAMPLE: On request" },
    { name: "SAMPLE: Bundle", description: "SAMPLE: a set for testing.", includes: ["SAMPLE: 3 videos", "SAMPLE: 3 hooks"], price: "SAMPLE: On request", highlight: true },
    { name: "SAMPLE: Monthly", description: "SAMPLE: an ongoing retainer.", includes: ["SAMPLE: videos a month"], price: "SAMPLE: On request" },
  ],
  usage: [
    { name: "SAMPLE: Organic", description: "SAMPLE: the brand posts it on its own accounts." },
    { name: "SAMPLE: Paid ads", description: "SAMPLE: the brand runs it as an ad.", term: "SAMPLE: 30, 60 or 90 days" },
    { name: "SAMPLE: Whitelisting", description: "SAMPLE: ads run from her handle.", term: "SAMPLE: per month" },
  ],
  process: [
    { title: "SAMPLE: Brief", description: "SAMPLE: the product, the audience, the must-says.", duration: "SAMPLE: day 1" },
    { title: "SAMPLE: Script and hooks", description: "SAMPLE: a short script and hook options to approve." },
    { title: "SAMPLE: Shoot", description: "SAMPLE: filmed once the product arrives." },
    { title: "SAMPLE: Edit and deliver", description: "SAMPLE: captions, music-free versions, the formats asked for." },
    { title: "SAMPLE: Revisions", description: "SAMPLE: how many rounds are included." },
  ],
  turnaround: "SAMPLE: e.g. 5 to 7 working days from product arrival",
  testimonials: [{ quote: "SAMPLE: a line from a brand she has worked with.", name: "Name", role: "Role", brand: "Brand One" }],
  faq: [
    { q: "SAMPLE: Do you need the product to film?", a: "SAMPLE: her answer." },
    { q: "SAMPLE: Are usage rights included?", a: "SAMPLE: her answer." },
    { q: "SAMPLE: How many revisions are included?", a: "SAMPLE: her answer." },
    { q: "SAMPLE: Which languages do you film in?", a: "SAMPLE: her answer." },
  ],
  booking: { email: "hello@example.com", responseTime: "SAMPLE: within a day" },
}
