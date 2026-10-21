# Glowence — Luxury Salon & Spa (Astro + Tailwind + GSAP)

A production-ready, single-page clone of the Glowence salon landing page.

## Stack
- **Astro 4** (`output: 'hybrid'`, page prerendered) + **@astrojs/cloudflare**
- **Tailwind CSS 3** with custom tokens (`tailwind.config.mjs`)
- **GSAP 3 + ScrollTrigger** and **Lenis** smooth scroll (`src/scripts/site.ts`)
- Cormorant Garamond (display) + Plus Jakarta Sans (UI), inline Lucide-style SVG icons

## Run
```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # -> dist/
npm run preview    # Cloudflare Pages runtime via wrangler
npm run deploy     # build + wrangler pages deploy
```
On the Cloudflare Pages dashboard: build command `npm run build`, output directory `dist`.

## Structure
```
src/
  layouts/Layout.astro        SEO/meta, fonts, motion pre-hide + failsafe, boots site.ts
  pages/index.astro           section order
  data/content.ts             ALL copy + image URLs (edit here)
  scripts/site.ts             Lenis, GSAP timelines, carousel, tabs, menu
  styles/global.css           Tailwind layers, button/tag/card primitives, orbit + gauge CSS
  components/
    ui/Button.astro  ui/SectionTag.astro  ui/Icon.astro
    Navbar  Hero (+ value strip)  About  Features  Reels  Services  Process
    Pricing  SkinAnalysis  Academy  Team  Testimonials  Journal  OrbitCTA  Footer
```

## Motion map
| Section | Effect |
|---|---|
| Hero | Centre-out card reveal on an arch, word-mask headline, per-card scroll parallax by depth, pointer drift (fine pointers only) |
| About | Clip-path image reveals, scroll-scrubbed word highlight on the mission statement |
| Features | 31-tick radial gauge fills to 87%, counters tick up |
| Services | Sticky stacked cards; earlier cards scale back as the next arrives (≥1024px) |
| Process | Section pins and the five steps rise into a staircase (≥1024px × ≥700px tall) |
| Orbit CTA | Two counter-rotating rings, avatars stay upright; pauses on hover |
| Everything else | `data-reveal` batch fade-ups, `data-split` word-mask headings |

`prefers-reduced-motion` disables Lenis and all GSAP work and shows final states. If JS fails, a 4s failsafe in `<head>` un-hides content.

## Reels video
Each reel accepts a `video` URL in `content.ts` (muted, looped, `playsinline`). With no URL, Play toggles a slow Ken Burns zoom on the poster so the control still responds.

## Images
Unsplash CDN URLs are centralised in `content.ts`. If any photo ID is ever removed upstream, the `<img>` falls back to a warm gradient block; swap in your own photography for production.
