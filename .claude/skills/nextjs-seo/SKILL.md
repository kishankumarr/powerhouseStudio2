---
name: nextjs-seo
description: SEO system for the Powerhouse Next.js 16 site. Covers per-page title, description, canonical, Open Graph and Twitter tags generated from content files, per-route opengraph-image generation, sitemap, robots, manifest, JSON-LD structured data (Organization, LocalBusiness, Service, FAQPage, BreadcrumbList), semantic HTML and local-SEO for Mangaluru. Use when creating any route, writing metadata, touching layout.tsx or head tags, adding structured data, or auditing search and social previews.
---

# Next.js SEO

This builds on the Vercel `nextjs` skill (see its `references/metadata.md` for Metadata API basics). This skill adds the project's rules. Every indexable page must ship a **unique title, description, canonical URL, OG and Twitter tags, OG image, and relevant JSON-LD**, with all text sourced from content files.

## Single helper, no hand-written metadata objects

```ts
// src/lib/seo/build-metadata.ts
import type { Metadata } from 'next'
import { site } from '@/content/site' // name, url, locale, twitter/instagram handles
export function buildMetadata(page: {
  path: `/${string}`
  title: string // ≤ 60 chars incl. template suffix; primary keyword first
  description: string // 140–160 chars; includes the location where natural
  keywords?: string[]
  noindex?: boolean
  ogImageAlt?: string
}): Metadata {
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: page.path /* , languages: {...} when i18n lands */ },
    openGraph: {
      type: 'website',
      url: page.path,
      siteName: site.name,
      locale: site.ogLocale, // 'en_IN'
      title: page.title,
      description: page.description,
    },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description },
    robots: page.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large' },
  }
}
```

Each `page.tsx` does `export const metadata = buildMetadata(content.seo.<page>)` (or `generateMetadata` for dynamic service pages). The OG **image** is not set here. It comes from the file convention below, so it is automatic and per-route.

Root `app/layout.tsx`:

- `metadataBase: new URL(site.url)` (`https://powerhousestudios.in`). Without it, relative OG and canonical URLs break.
- `title: { default: <home title>, template: '%s | Powerhouse Studios' }`.
- `applicationName`, `authors`, `creator`, `publisher`, `formatDetection: { telephone: true }`, `category: 'business'`.
- `icons` generated from the logo mark (see `svg-vector-animation`). `export const viewport = { themeColor: [...] }` per colour scheme.
- `<html lang={locale}>`. Locale comes from content config, `en-IN` for now.

## Open Graph images: one per route, generated and on-brand

- `app/opengraph-image.tsx` is the default. Add a route-level `opengraph-image.tsx` for each top-level page and for `app/services/[slug]/opengraph-image.tsx`.
- Use `ImageResponse` from `next/og`, 1200×630, Node runtime (not edge). Load the display font `.ttf` via `readFile` and inline the logo SVG as a data URI.
- The composition uses brand black and `#FEED01`, the page title, a one-line tagline and the logo mark. Keep it readable at a thumbnail size of about 300 px wide.
- Export `alt` from content. `twitter-image` falls back to OG automatically.
- `generateStaticParams` on `[slug]` so OG images are prerendered at build time.

## Crawl files

- `app/sitemap.ts` is built from the route registry (`src/config/routes.ts`) plus service slugs. Set `lastModified` from a content constant, not `new Date()`, which would churn every build. **Exclude `/config`** and any noindex page.
- `app/robots.ts` allows all, disallows `/config`, and sets `sitemap: ${site.url}/sitemap.xml`.
- `app/manifest.ts` sets name, short_name, theme and background colours from brand tokens, and icons.

## Structured data (JSON-LD)

Render JSON-LD with a tiny server component and type it with **`schema-dts`**:

```tsx
// src/components/seo/json-ld.tsx
import type { Thing, WithContext } from 'schema-dts'
export function JsonLd<T extends Thing>({ data }: { data: WithContext<T> }) {
  return (
    <script
      type="application/ld+json"
      // Escape '<' so content can never close the script tag (XSS-safe)
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
```

| Where                     | Schema                                                                                                                                                                                                                                                                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Root layout (every page)  | `Organization` + `WebSite`, linked by `@id` (`${url}/#organization`, `${url}/#website`), with `logo`, `sameAs: [instagram]`, `contactPoint` (phone `+91-80504-61707`, email, `areaServed`, `availableLanguage` from content)                                                                                                     |
| Home and contact          | `ProfessionalService` (a `LocalBusiness` subtype) with `address: { addressLocality: 'Mangaluru', addressRegion: 'Karnataka', addressCountry: 'IN' }` and `areaServed` Mangaluru, Dakshina Kannada, Karnataka and India. **No `streetAddress`, `geo` or `openingHours`**, because they were not provided (see `powerhouse-brand`) |
| `/services`               | `ItemList` of `Service` refs                                                                                                                                                                                                                                                                                                     |
| `/services/[slug]`        | `Service` (`serviceType`, `provider` → org `@id`, `areaServed`, `hasOfferCatalog` listing the capability items from content) + `BreadcrumbList`                                                                                                                                                                                  |
| `/faq` or any FAQ section | `FAQPage` built from the same content array that renders the visible FAQ. The markup must match the visible text exactly                                                                                                                                                                                                         |
| `/about`                  | `AboutPage` with `founder` → two `Person` entries (name and jobTitle only)                                                                                                                                                                                                                                                       |

Never mark up anything that is not visible on the page. Never add `aggregateRating` or `review`, since no genuine reviews exist.

## On-page rules (checked by tests)

- Exactly **one `<h1>`** per page with the primary keyword, and a logical heading order with no skipped levels.
- Landmarks: `<header>`, `<nav aria-label>`, `<main id="main">` (skip-link target), `<footer>`.
- Every `next/image` has meaningful `alt` from content, or `alt=""` if decorative.
- Descriptive internal links. No "click here"; the link text names the destination. Each service page links to 2–3 related services and to contact.
- Visible NAP (name, area, phone and email) in the footer on every page, matching JSON-LD exactly.
- Canonical is self-referential with no trailing-slash duplicates (`trailingSlash: false`).
- Content renders in server HTML (RSC). Nothing important is client-only or hidden behind interaction. Accordions keep their answers in the DOM.

## Keyword map (local intent, write naturally)

Primary: _creative studio Mangaluru_, _video production Mangaluru_, _social media management Mangaluru_, _event management Mangaluru_, _photography studio Mangaluru_, _studio rental Mangaluru_, _podcast studio Mangaluru_, _brand film_, _event coverage_. Secondary: Dakshina Kannada, Karnataka, Tulu content. Put the keyword in the title, H1, first paragraph, one H2 and the image alt where natural. Never stuff keywords.

## Validation checklist

- `npm run build` then crawl locally. Playwright asserts per route: title unique and ≤ 60, description 140–160, canonical present, `og:title`, `og:description`, `og:image` (200 status, 1200×630), `twitter:card`, one h1, and JSON-LD parses as valid JSON with the expected `@type`.
- Lighthouse SEO = 100 on every route.
- Validate JSON-LD at validator.schema.org and Google's Rich Results Test before handover. Preview OG cards with a social preview debugger after deploy.
