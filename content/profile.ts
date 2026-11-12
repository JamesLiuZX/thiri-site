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
export type Format =
  | "testimonial"
  | "unboxing"
  | "grwm"
  | "tutorial"
  | "voiceover"
  | "hooks"
  | "review"
  | "lifestyle"
  | "haul"
  | "vlog"
  | "transformation"
  | "walkthrough"

export const FORMAT_LABELS: Record<Format, string> = {
  testimonial: "Testimonial",
  unboxing: "Unboxing",
  grwm: "GRWM",
  tutorial: "Tutorial",
  voiceover: "Voiceover",
  hooks: "Hook variations",
  review: "Review",
  lifestyle: "Lifestyle",
  haul: "Haul",
  vlog: "Vlog",
  transformation: "Transformation",
  walkthrough: "Walkthrough",
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
  /** The pillar (portfolio tab) it belongs to. */
  pillar?: string
  /** Poster shape: "3/4" for covers cropped from her profile grid; files are 9:16. */
  ratio?: "9/16" | "3/4"
  /** Where to watch it while there is no file or embed. */
  href?: string
  /** Where it was filmed, as her cover or caption says it (travel tickets). */
  place?: string
}

/** A content pillar; on the site, one portfolio tab, filed under a time of day. */
export type Pillar = { id: string; time: string; tab: string; name: string; description: string; videoIds?: string[] }

/** A reason brands book her. */
export type Angle = { title: string; body: string }
export type Brand = { name: string; logo?: string; url?: string }
export type CaseStudy = { brand: string; brief: string; delivered: string; result?: string; videoId?: string }
/** `videoId`: a video of hers that shows what the service looks like. */
export type Service = { name: string; description: string; includes?: string[]; videoId?: string }
/** `addOn`: an extra that goes with any package rather than a size of order. */
export type Package = { name: string; description: string; includes: string[]; price?: string; highlight?: boolean; addOn?: boolean }
export type UsageTier = { name: string; description: string; term?: string; price?: string }
export type Step = { title: string; description: string; duration?: string }
export type Testimonial = { quote: string; name: string; role?: string; brand?: string }
export type Faq = { q: string; a: string }
export type Booking = { email: string; formEndpoint?: string; calendar?: string; responseTime?: string }
/**
 * One frame of a video of hers, marked up: the stage it plays, why it sells,
 * and where on the cover to look (`mark`, in percent of the cover).
 */
export type Frame = { videoId: string; stage: string; title: string; body: string; note: string; mark: { x: number; y: number; w: number; h: number } }

export type Content = {
  /** Her name as brands should address her. */
  name: string
  /** The name set large on the site. */
  wordmark: string
  /** The display name on her public profile. */
  displayName: string
  handle: string
  tagline: string
  bio: string
  location: string
  languages: string[]
  portrait: string
  socials: Social[]
  pillars: Pillar[]
  angles: Angle[]
  /** Brands named on her own video covers (not necessarily paid work). */
  featured: string[]
  market: string
  stats: Stat[]
  audience: Stat[]
  videos: Video[]
  /** The hero's stories: video ids, played in order. */
  stories: string[]
  /** How her videos sell, as marked-up frames. */
  anatomy: Frame[]
  /** Solo frames for the About's photo-booth strip: images in public/. */
  booth: string[]
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

// Sources, and every fact here is for Kate to confirm before launch:
//   [capture]  her TikTok or Instagram profile, captured by James on 2026-11-12
//   [James]    James's creator brief (provided by James, confirm with Kate)
//   [site]     copy written for the site from those two, for her approval
// Where the brief and the captures differ, the captures win.
const TIKTOK = "https://www.tiktok.com/@thiriiiii"
const VIEWS = "views on TikTok"

export const content: Content = {
  // [James] Her name. Confirm she wants it on the site.
  name: "Kate Zheng",
  // [capture] Her handle, as the wordmark.
  wordmark: "thiriiii",
  // [capture] Display name on both profiles.
  displayName: "妤🐟",
  handle: "@thiriiiii",
  // [James] His value proposition.
  tagline: "Singapore lifestyle, beauty & F&B UGC creator",
  // [site] From the brief: her student perspective and her SG/SEA audience.
  bio: "I'm Kate, a student in Singapore, and the creator behind @thiriiiii. I film everyday life here the way my audience lives it: getting ready before class, brunch and late-night supper spots, weekend outfits, and trips around the region.",
  // [capture] The 📍🇸🇬 in her TikTok bio.
  location: "Singapore",
  // [James] "Bilingual" is unconfirmed: ask which languages she films in.
  languages: [],
  // [capture] Cropped from a cover in her TikTok grid. Swap for a portrait she chooses.
  portrait: "/work/portrait.jpg",
  socials: [
    // [capture] Counts as displayed, 2026-11-12.
    { platform: "tiktok", handle: "@thiriiiii", url: TIKTOK, followers: "62.3K" },
    { platform: "instagram", handle: "@thiriiii_", url: "https://www.instagram.com/thiriiii_/", followers: "21.7K" },
  ],
  // [James] Pillars and portfolio tabs. [site] The times of day.
  pillars: [
    { id: "beauty", time: "08:00", tab: "Beauty & Hair", name: "Beauty, hair & skincare", description: "GRWMs, hair transformations, sensitive-skin routines and K-beauty demos." },
    { id: "food", time: "12:30", tab: "F&B & Lifestyle", name: "Food, cafés & dining", description: "Aesthetic dining, brunch spots, late-night supper guides and local Singapore finds." },
    { id: "fashion", time: "17:30", tab: "Fashion & E-commerce", name: "Fashion & accessories", description: "Class-to-weekend outfits, footwear and seasonal wear, plus hauls around the big sales." },
    { id: "travel", time: "Weekend", tab: "Travel", name: "Travel & lifestyle", description: "Trips around the region, from Phuket and Phu Quoc to Sapa and Bangkok." },
  ],
  // [James] His three selling angles, [site] in the site's words.
  angles: [
    { title: "Hooks that stop the scroll.", body: "Transformations and transitions for hair, makeup and outfits, built around the first second." },
    { title: "Local, so it converts.", body: "Singapore F&B, salons and retail launches, filmed the way people here actually find them." },
    { title: "Fluent in the mega-sales.", body: "E-commerce and K-beauty campaigns around the big sales: hauls, demos and first looks." },
  ],
  // [capture] Brands named on her own covers and captions. Not proof of paid work.
  featured: ["Glow Recipe", "OLENS", "Aestura", "Medicube", "SHEIN", "Soundpeats", "Montigo", "Taobao"],
  // [James] Primary market.
  market: "Singapore and Southeast Asia",
  // [capture] As displayed, 2026-11-12.
  stats: [
    { value: "62.3K", label: "TikTok followers", source: "TikTok", asOf: "Nov 2026" },
    { value: "594.1K", label: "TikTok likes", source: "TikTok", asOf: "Nov 2026" },
    { value: "21.7K", label: "Instagram followers", source: "Instagram", asOf: "Nov 2026" },
    { value: "1.5M", label: "Views on her top TikTok", source: "TikTok", asOf: "Nov 2026" },
  ],
  audience: [],
  // [capture] Covers cropped from her TikTok grid (provisional posters, for her approval)
  // with the views shown under each. [site] Titles follow the cover text; the few
  // covers without text get a plain description. [James] The three post URLs.
  // Until her files arrive, each plays on TikTok or in the official embed.
  videos: [
    { id: "glow-recipe", pillar: "beauty", title: "GRWM with Glow Recipe", format: "grwm", brand: "Glow Recipe", poster: "/work/glow-recipe.jpg", ratio: "3/4", result: `40.5K ${VIEWS}`, href: TIKTOK, featured: true },
    { id: "olens", pillar: "beauty", title: "OLENS Cherry Moon Brown", format: "review", brand: "OLENS", poster: "/work/olens.jpg", ratio: "3/4", result: `21.8K ${VIEWS}`, href: TIKTOK },
    { id: "korean-makeover", pillar: "beauty", title: "Come with me to get a Korean makeover", format: "transformation", poster: "/work/korean-makeover.jpg", ratio: "3/4", result: `15.3K ${VIEWS}`, href: TIKTOK },
    { id: "skincare", pillar: "beauty", title: "Lazy-girl skincare with Aestura", format: "tutorial", brand: "Aestura", poster: "/work/skincare.jpg", ratio: "3/4", result: `2,647 ${VIEWS}`, href: TIKTOK },
    { id: "phuket-grwm", pillar: "beauty", title: "GRWM in Phuket: pink makeup", format: "grwm", poster: "/work/phuket-grwm.jpg", ratio: "3/4", result: `1,769 ${VIEWS}`, href: TIKTOK, place: "Phuket" },
    { id: "medicube", pillar: "beauty", title: "My Medicube undereye routine", format: "tutorial", brand: "Medicube", poster: "/work/medicube.jpg", ratio: "3/4", result: `802 ${VIEWS}`, href: TIKTOK },

    { id: "campus-diml", pillar: "food", title: "A day in my life on campus", format: "vlog", embed: "https://www.tiktok.com/@thiriiiii/video/7683835885170871573" },
    { id: "cafe-hopping", pillar: "food", title: "Café hopping", format: "vlog", poster: "/work/cafe-hopping.jpg", ratio: "3/4", result: `3,228 ${VIEWS}`, href: TIKTOK, featured: true },
    { id: "korean-bbq", pillar: "food", title: "Korean barbecue", format: "vlog", poster: "/work/hotpot.jpg", ratio: "3/4", result: `18.6K ${VIEWS}`, href: TIKTOK },
    { id: "korean-dinner", pillar: "food", title: "Korean comfort food", format: "vlog", poster: "/work/korean-dinner.jpg", ratio: "3/4", result: `6,317 ${VIEWS}`, href: TIKTOK },
    { id: "korean-restaurant", pillar: "food", title: "A Korean restaurant, walked through", format: "walkthrough", poster: "/work/korean-restaurant.jpg", ratio: "3/4", result: `1,630 ${VIEWS}`, href: TIKTOK },

    { id: "charles-keith", pillar: "fashion", title: "Charles & Keith", format: "lifestyle", brand: "Charles & Keith", embed: "https://www.tiktok.com/@thiriiiii/video/7688571066100321556" },
    // [capture] This cover keeps its bottom edge: her code "<88KATE> for 15% off" is on it
    // (TikTok's view counter, which sat beside it, is painted out).
    { id: "shein-polka", pillar: "fashion", title: "Polka-dot fits with SHEIN", format: "haul", brand: "SHEIN", poster: "/work/shein-polka.jpg", ratio: "3/4", result: `24.9K ${VIEWS}`, href: TIKTOK },
    { id: "soundpeats", pillar: "fashion", title: "OOTD featuring Soundpeats Space", format: "lifestyle", brand: "Soundpeats", poster: "/work/soundpeats.jpg", ratio: "3/4", result: `15.9K ${VIEWS}`, href: TIKTOK },
    { id: "shein-store", pillar: "fashion", title: "At the SHEIN store", format: "walkthrough", brand: "SHEIN", poster: "/work/shein-store.jpg", ratio: "3/4", result: `12.4K ${VIEWS}`, href: TIKTOK },
    { id: "montigo", pillar: "fashion", title: "OOTD ft. Montigo Knight Tumbler", format: "lifestyle", brand: "Montigo", poster: "/work/montigo.jpg", ratio: "3/4", result: `10.3K ${VIEWS}`, href: TIKTOK },
    { id: "k-beauty-sales", pillar: "fashion", title: "K-beauty with Lazada and Gmarket", format: "review", brand: "Lazada · Gmarket", embed: "https://www.instagram.com/p/Dfg51OlCdLC/" },
    { id: "taobao-guide", pillar: "fashion", title: "My ultimate Taobao store guide", format: "review", brand: "Taobao", poster: "/work/taobao-guide.jpg", ratio: "3/4", result: `930 ${VIEWS}`, href: TIKTOK },
    { id: "night-out", pillar: "fashion", title: "A night-out outfit", format: "lifestyle", poster: "/work/red-dress.jpg", ratio: "3/4", result: `817.5K ${VIEWS}`, href: TIKTOK },

    { id: "clifftop", pillar: "travel", title: "Clifftop views", format: "vlog", poster: "/work/clifftop.jpg", ratio: "3/4", result: `53.6K ${VIEWS}`, href: TIKTOK },
    { id: "bangkok", pillar: "travel", title: "When you cannot beat the traffic in Bangkok", format: "vlog", poster: "/work/bangkok.jpg", ratio: "3/4", result: `25.2K ${VIEWS}`, href: TIKTOK, place: "Bangkok" },
    { id: "sapa", pillar: "travel", title: "Ho Chi Minh to Sapa, edited like a horror movie", format: "vlog", poster: "/work/sapa.jpg", ratio: "3/4", result: `11.7K ${VIEWS}`, href: TIKTOK, place: "Ho Chi Minh to Sapa" },
    { id: "island-boat", pillar: "travel", title: "An island boat day", format: "vlog", poster: "/work/phi-phi.jpg", ratio: "3/4", result: `7,529 ${VIEWS}`, href: TIKTOK },
    { id: "phu-quoc", pillar: "travel", title: "A chaotic day in Phu Quoc", format: "vlog", poster: "/work/phu-quoc.jpg", ratio: "3/4", result: `2,244 ${VIEWS}`, href: TIKTOK, place: "Phu Quoc" },

    // [capture] 1.5M views. The brief says her Juno Hair transformation passed 1.5M;
    // nothing on this cover confirms it is that video, so it carries no title claim.
    { id: "top-video", title: "My most-viewed TikTok", format: "lifestyle", poster: "/work/top-video.jpg", ratio: "3/4", result: `1.5M ${VIEWS}`, href: TIKTOK, featured: true },
  ],
  // [site] The hero's stories: one cover per pillar, then her two most-viewed.
  stories: ["glow-recipe", "cafe-hopping", "shein-polka", "clifftop", "night-out", "top-video"],
  // [site] How her videos sell, on three of her real covers. [capture] What each
  // cover shows: the on-screen line, the Aestura tube held to camera, her code.
  // [James] The first and last headings are his angles.
  anatomy: [
    {
      videoId: "bangkok",
      stage: "The hook",
      title: "Hooks that stop the scroll.",
      body: "A line on screen you have to finish, and transformations and transitions for hair, makeup and outfits, built around the first second.",
      note: "a line you have to finish reading",
      mark: { x: 8, y: 75, w: 85, h: 21 },
    },
    {
      videoId: "skincare",
      stage: "The product",
      title: "The product, in my hands.",
      body: "Label to camera, inside the routine itself rather than cut in after it.",
      note: "label to camera",
      mark: { x: 16, y: 59, w: 58, h: 40 },
    },
    {
      videoId: "shein-polka",
      stage: "The call to action",
      title: "Fluent in the mega-sales.",
      body: "E-commerce and K-beauty campaigns around the big sales: hauls, demos and first looks.",
      note: "my code, on screen",
      mark: { x: 52, y: 88, w: 42, h: 12 },
    },
  ],
  // [capture] Solo frames from her own covers for the photo-booth strip, for her approval.
  booth: ["/work/portrait.jpg", "/work/glow-recipe.jpg", "/work/medicube.jpg", "/work/top-video.jpg"],
  // [James] Her brand partners. None shows a paid-partnership label in the
  // captures (only Aestura is named on a cover); confirm each one with Kate.
  brands: [
    { name: "Juno Hair Singapore" },
    { name: "Novela SG" },
    { name: "Sulwhasoo" },
    { name: "Aestura" },
    { name: "Innisfree" },
    { name: "Charles & Keith" },
    { name: "Rockfish Weatherwear" },
    { name: "Lazada Singapore" },
    { name: "Gmarket Global" },
  ],
  caseStudies: [],
  // [James] What she offers.
  services: [
    // [site] Each one's example is a video of hers that shows it.
    { name: "Short-form video", description: "9:16, 15 to 45 seconds, for feeds and ads.", videoId: "glow-recipe" },
    { name: "Day-in-my-life integrations", description: "Your product, woven into a day in my life.", videoId: "cafe-hopping" },
    { name: "Transformation and transition reels", description: "Hair, makeup and outfits, from before to after.", videoId: "korean-makeover" },
    { name: "Voiceover reviews and unboxings", description: "My voice over your product, from first look to verdict.", videoId: "olens" },
    { name: "Venue walkthroughs", description: "F&B, salons and retail pop-ups, the way you'd walk in.", videoId: "korean-restaurant" },
    { name: "Lifestyle and product stills", description: "Photos for your feed, product pages and ads.", videoId: "montigo" },
  ],
  // [James] Rates on request until she sets them.
  packages: [
    { name: "Single video", description: "One 9:16 video.", includes: ["1 video"], price: "On request" },
    { name: "3-video bundle", description: "Three videos, for testing hooks and angles.", includes: ["3 videos"], price: "On request", highlight: true },
    { name: "Monthly retainer", description: "Ongoing content, every month.", includes: ["Videos every month"], price: "On request" },
    { name: "Photography add-on", description: "Lifestyle and product stills, with any package.", includes: ["Stills"], price: "On request", addOn: true },
  ],
  usage: [],
  process: [],
  turnaround: "",
  testimonials: [],
  faq: [],
  // [James] Her booking email; [capture] it is also in both bios. Publishing it on
  // the site is her call before launch.
  booking: { email: "katezheng39@gmail.com" },
}

/* -------------------------------------------------------------------------- */
/* SAMPLE stand-ins: fake by design, never shipped                            */
/* -------------------------------------------------------------------------- */

export const SAMPLE: Content = {
  name: "Creator",
  wordmark: "creator",
  displayName: "Creator",
  handle: "@handle",
  tagline: "One line on what she makes, and for which brands.",
  bio: "A short hello in her own words: what she films, who watches, and why brands come back to her.",
  location: "City",
  languages: ["Language one", "Language two"],
  portrait: "",
  socials: [
    { platform: "instagram", handle: "@handle", url: "https://www.instagram.com/" },
    { platform: "tiktok", handle: "@handle", url: "https://www.tiktok.com/" },
  ],
  pillars: [
    { id: "one", time: "08:00", tab: "Pillar one", name: "Pillar one", description: "The kind of content, and the brands it suits." },
    { id: "two", time: "12:30", tab: "Pillar two", name: "Pillar two", description: "The kind of content, and the brands it suits." },
  ],
  angles: [{ title: "A reason brands book her.", body: "One line on why it works." }],
  featured: [],
  market: "Market",
  stats: [
    { value: "00K", label: "Followers", source: "Her analytics", asOf: "Month 2026" },
    { value: "0.0%", label: "Average engagement", source: "Her analytics", asOf: "Month 2026" },
  ],
  audience: [
    { value: "00%", label: "Audience aged 18–34" },
    { value: "Country", label: "Top country" },
  ],
  videos: [
    { id: "sample-1", title: "Morning routine", format: "testimonial", brand: "Brand One", duration: "0:04", featured: true },
    { id: "sample-2", title: "First look", format: "unboxing", brand: "Brand Two", duration: "0:04" },
    { id: "sample-3", title: "Get ready with me", format: "grwm", brand: "Brand Three", duration: "0:04" },
    { id: "sample-4", title: "How I use it", format: "tutorial", brand: "Brand Four", duration: "0:04" },
    { id: "sample-5", title: "Three openings, one ad", format: "hooks", brand: "Brand Five", duration: "0:04" },
    { id: "sample-6", title: "In her voice", format: "voiceover", brand: "Brand Six", duration: "0:04" },
    { id: "sample-7", title: "An embedded post", format: "lifestyle", embed: "https://www.tiktok.com/@handle/video/0000000000000000000" },
  ],
  stories: ["sample-1", "sample-2", "sample-3"],
  booth: [],
  anatomy: [
    { videoId: "sample-1", stage: "The hook", title: "A reason brands book her.", body: "One line on why this frame works.", note: "what to look at", mark: { x: 10, y: 70, w: 80, h: 20 } },
  ],
  brands: [{ name: "Brand One" }, { name: "Brand Two" }, { name: "Brand Three" }, { name: "Brand Four" }, { name: "Brand Five" }, { name: "Brand Six" }],
  caseStudies: [
    { brand: "Brand One", brief: "What the brand asked for.", delivered: "What she made, in how many versions.", result: "A result, from the brand's own numbers.", videoId: "sample-1" },
    { brand: "Brand Two", brief: "What the brand asked for.", delivered: "What she made, in how many versions.", result: "A result, from the brand's own numbers.", videoId: "sample-2" },
  ],
  services: [
    { name: "UGC video", description: "Scripted, filmed and edited for the brand's feed or ads.", includes: ["Script", "Captions", "One revision"] },
    { name: "Hook variations", description: "New openings for the same video, for ad testing." },
    { name: "Voiceover", description: "Her voice over the brand's own footage." },
    { name: "Photo set", description: "Stills for product pages and ads." },
    { name: "Raw footage", description: "The unedited clips, for the brand's editors." },
  ],
  packages: [
    { name: "One video", description: "A single video and its hook.", includes: ["1 video", "1 hook"], price: "On request" },
    { name: "The bundle", description: "A set for testing.", includes: ["3 videos", "3 hooks"], price: "On request", highlight: true },
    { name: "Monthly", description: "An ongoing retainer.", includes: ["Videos every month"], price: "On request" },
  ],
  usage: [
    { name: "Organic", description: "The brand posts it on its own accounts.", price: "Included" },
    { name: "Paid ads", description: "The brand runs it as an ad.", term: "30, 60 or 90 days", price: "On request" },
    { name: "Whitelisting", description: "Ads run from her handle.", term: "Per month", price: "On request" },
  ],
  process: [
    { title: "Brief", description: "The product, the audience, the must-says.", duration: "Day 1" },
    { title: "Script and hooks", description: "A short script and hook options to approve." },
    { title: "Shoot", description: "Filmed once the product arrives." },
    { title: "Edit and deliver", description: "Captions, clean versions, every format asked for." },
    { title: "Revisions", description: "The rounds included, agreed up front." },
  ],
  turnaround: "a week from the product's arrival, or as agreed",
  testimonials: [
    { quote: "A line from a brand she has worked with goes here.", name: "Name", role: "Role", brand: "Brand One" },
    { quote: "A second line, from another brand.", name: "Name", role: "Role", brand: "Brand Two" },
  ],
  faq: [
    { q: "Do you need the product to film?", a: "Her answer goes here." },
    { q: "Are usage rights included?", a: "Her answer goes here." },
    { q: "How many revisions are included?", a: "Her answer goes here." },
    { q: "Which languages do you film in?", a: "Her answer goes here." },
  ],
  booking: { email: "hello@example.com", responseTime: "within a day" },
}
