---
name: web-performance
description: Performance budgets and optimisation rules for the Powerhouse Next.js 16 site. Covers Core Web Vitals targets, image, font and video loading, JS bundle budgets, server-first rendering, animation cost, bundle analysis and Lighthouse CI. Use when adding images, video, fonts, third-party scripts or heavy client components, before any release, or when a page feels slow or Lighthouse drops.
---

# Web Performance

Companion skills: Vercel `react-best-practices` (React and Next rules), Chrome DevTools `debug-optimize-lcp` (trace-driven LCP debugging) and Google `modern-web-guidance` (platform APIs). This skill holds the **project budgets** and **Next 16 specifics**.

## Budgets (fail the release if exceeded)

Measured on a production build (`next build && next start`), Lighthouse mobile preset (Moto G Power, slow 4G):

| Metric                                                                                  | Budget                                                                                                                                                  |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LCP                                                                                     | ≤ 2.0 s (field target ≤ 2.5 s at p75)                                                                                                                   |
| INP                                                                                     | ≤ 200 ms (TBT ≤ 150 ms in lab)                                                                                                                          |
| CLS                                                                                     | ≤ 0.05                                                                                                                                                  |
| Lighthouse Performance / Accessibility / Best Practices / SEO                           | ≥ 90 / 100 / 100 / 100 on **every** route, in **all three themes**                                                                                      |
| First-load JS per route (gzip, modern browsers; the `noModule` polyfill chunk excluded) | ≤ 200 KB home, ≤ 185 KB other routes. The Next 16 + React 19 framework baseline alone is ~130 KB, so app code must stay ≤ 60 KB. Current: 191 / ~175 KB |
| Hero image                                                                              | ≤ 180 KB AVIF at 1080 px wide                                                                                                                           |
| Web fonts                                                                               | ≤ 2 families, ≤ 80 KB total. Current: self-hosted subsets built by `scripts/subset_fonts.py` (Saira 47 KB + Instrument Sans 29 KB)                      |

## Rendering

- **Server Components by default.** Client islands only for interactivity, animation, the store and `/config`. Every `'use client'` file should be a leaf or near-leaf.
- All marketing routes are **statically prerendered**. No `cookies()` or `headers()` in pages or layouts (see `theme-system` for no-flash theming without cookies). Service pages use `generateStaticParams`.
- `dynamic(() => import(...))` for below-the-fold heavy islands (logo timeline if large, `/config` previews, marquee galleries). Use `ssr: false` only when the island truly cannot render on the server, and always with a fixed-size fallback.
- `React.lazy` or `dynamic` must not wrap the LCP element.

## Project decisions already in place (keep them)

- **Images render as plain server `<img>` via `getImageProps`** (`components/ui/media.tsx`). The result has a responsive CDN srcset, zero client JS and zero hydration. Do not reintroduce `<Image>` in server components; ~40 images on the home page would each hydrate a client component.
- **LCP images** use `<Media preload>`, which adds a `react-dom` `preload()` hint plus eager loading and high fetch priority. For layout-dependent heroes (the editorial collage), `hero.tsx` injects the preload only when that layout is active.
- **No font-swap CLS:** Saira has per-style, width-matched fallback faces (`styles/styles.css`, computed from real metrics) because one generic fallback cannot match three widths (56/75/100%). Body text uses `display: 'optional'`. If a style's width changes, recompute the `size-adjust` values.
- **Motion features load lazily** (`LazyMotion features={() => import('./features')}`), so the animation engine is not on the critical path.
- **Client components never import `@/content`**: that would ship every page's copy. Error boundaries use `content/boundary.ts`.
- Use `clsx` only (tailwind-merge was removed; class conflicts are not a pattern here).
- Measure Lighthouse with `--throttling-method=devtools` as well as the default. On localhost, the simulated LCP charges hydration to text LCP, because JS runs before the first paint. Treat observed FCP/LCP and applied-throttling runs as the truth.

## Images (`next/image`, Next 16)

- **`priority` is deprecated in Next 16. Use `preload`** on the single LCP image per page (usually the hero). No other image gets it.
- Always pass `sizes` for responsive or `fill` images (for example `sizes="(min-width: 1024px) 50vw, 100vw"`). A missing `sizes` downloads the largest variant.
- `placeholder="blur"` with a build-time `blurDataURL` for large photos. Explicit `width`/`height` or `fill` inside an aspect-ratio box gives CLS = 0.
- `quality` 70–75 for photos, and only values listed in `images.qualities` in `next.config.ts`.
- Decorative backgrounds use CSS or SVG (see `svg-vector-animation`), not raster.

## Video

- No autoplaying hero video on mobile data by default. Use a poster image (the LCP candidate) plus a video that loads on interaction or when idle on desktop fine-pointer, `muted playsInline loop preload="none"`. Skip it under `prefers-reduced-motion` and `Save-Data`.
- Embeds (YouTube or Instagram) use a facade: a static thumbnail and play button that swaps in the iframe on click. Never load embed iframes on page load.

## Fonts

- `next/font/google` (or `next/font/local`) with `display: 'swap'` and `variable` CSS vars wired into theme tokens. Only the weights actually used, or a variable font.
- Fonts for the "Style" axis that are not the default are still declared through `next/font` so they are self-hosted, with `preload: false` so they don't compete with the default font.
- OG image fonts are separate `.ttf` files read at build time and are not shipped to the browser.

## JavaScript hygiene

- Motion via `LazyMotion` + `m` + `domAnimation` (see `motion-animation`). `domMax` only in islands that need layout or drag.
- Import icons individually (`lucide-react` per-icon imports are tree-shaken, never `import * as`).
- No analytics or pixels unless the client asks. If added, use `next/script` `strategy="lazyOnload"` or `@next/third-parties`.
- Avoid large utility libraries (lodash, moment). Use platform APIs (`Intl`, `structuredClone`, `Array` methods).
- Enable `reactCompiler: true` (React Compiler) if the build is green with it. It removes most manual `useMemo` and `useCallback`.

## CSS

- Tailwind v4 generates only used utilities. Avoid giant `@apply` blocks.
- Apply `content-visibility: auto` with `contain-intrinsic-size` to long below-the-fold sections (industries grid, FAQ, footer).
- Animate only compositor-friendly properties (`transform`, `opacity`, `filter` on small elements, `clip-path`).

## Measuring (always measure, never guess)

1. `npx next experimental-analyze` (Next 16 bundle analyser) and check first-load JS per route against the budget.
2. Lighthouse CI (`@lhci/cli` 0.15): `lighthouserc.json` asserts the budgets above for every route in the route registry. Run it per theme by auditing `<route>?preset=<id>`. The pre-paint script applies the preset on any route (see `theme-system`).
3. For regressions, record a Chrome DevTools performance trace with the `chrome-devtools-mcp` plugin. Inspect LCP sub-parts (TTFB, resource load delay, resource load time, render delay), long tasks and layout shifts.
4. Check responsiveness on a real mid-range Android over throttled 4G before handover.
