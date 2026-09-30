---
name: content-i18n
description: Content architecture for the Powerhouse site. No hard-coded user-visible text; everything (copy, labels, aria-labels, alt text, SEO strings) lives in typed, locale-keyed content files so languages such as Kannada can be added later. Also covers the central image constants registry (Unsplash, licence-safe, credited) and the rules for adding or swapping images. Use when writing any JSX that shows text, adding a page or section, adding or replacing an image, or preparing for multi-language support.
---

# Content & i18n Readiness

## Rule zero: no string literals in JSX

All human-readable text comes from content: headings, paragraphs, button labels, nav, footer, form labels, placeholders, validation messages, `aria-label`, `alt`, `title`, SEO titles and descriptions, OG alt, JSON-LD text, toast messages and 404 copy.

Allowed literals: CSS classes, `data-*` values, ids and keys, URLs, and brand constants that never translate (the phone number digits).

Enforce it with ESLint `react/jsx-no-literals` (`{ noStrings: true, ignoreProps: false, allowedStrings: ['·', '→', '+', '/', '|'] }`) on `src/app/**` and `src/components/**`, with content files excluded.

## Structure

```
src/content/
  index.ts                  getContent(locale) + Locale type + defaultLocale
  en/
    site.ts                 brand name, contact, social, taglines (from powerhouse-brand)
    common.ts               nav, footer, buttons, a11y strings (skip link, menu open/close)
    seo.ts                  per-route { title, description, keywords, ogAlt }
    home.ts  about.ts  services.ts  work.ts  studio.ts  contact.ts  faq.ts  config.ts  not-found.ts
  types.ts                  the Content type every locale must satisfy
```

- **Typed dictionaries, not JSON**: each locale exports `const content = { … } satisfies Content`. A missing key in a future `kn/` locale is a compile error. The files hold plain data only, with no JSX and no functions except simple ICU-like formatters in `common.ts`.
- Use rich text sparingly. Where a sentence needs emphasis, store segments as `[{ text }, { text, strong: true }]` and render them with a `<RichText>` component. Never store HTML strings.
- **Services** are an array keyed by the slugs in `powerhouse-brand`, and each has `{ slug, name, summary, intro, capabilities[], outcome, faq[], seo, imageKeys[] }`. Pages and `generateStaticParams` iterate the array, so adding a service means adding data, not code.
- Copy source: `powerhouse-brand/references/brand-source.md`. Keep British/Indian spelling. Follow the content integrity rules there (no invented stats, clients or testimonials; placeholders are typed `{ placeholder: true }`).

## Access pattern

```ts
// src/content/index.ts
import { content as en } from './en'
export const locales = ['en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
const dictionaries = { en } satisfies Record<Locale, Content>
export function getContent(locale: Locale = defaultLocale) {
  return dictionaries[locale]
}
```

- Server Components call `getContent()` and pass only the slice a client island needs as props. Don't import all content into client bundles.
- **Future i18n path** (documented, not built yet): move routes under `app/[lang]/`, add `generateStaticParams` over `locales`, add `proxy.ts` (Next 16's rename of middleware) for `Accept-Language` redirect, and add `alternates.languages` in `buildMetadata`. Alternatively, adopt `next-intl` 4.x, whose `getTranslations` maps 1:1 onto this dictionary shape. Keep every string keyed now so this later step is mechanical.
- Numbers, dates and phone numbers are formatted with `Intl.*` using the locale. Nothing is concatenated into sentences, and content holds whole sentences with placeholders (`'{count} services'`).

## Images: one registry, licence-safe

All images are referenced through `src/constants/images.ts`. Components never contain an image URL.

```ts
// src/constants/images.ts
export type ImageAsset = {
  src: string              // full https URL (Unsplash CDN) or /public path
  width: number; height: number
  altKey: string           // key into content (alt text is translatable content, not stored here)
  credit?: { name: string; profileUrl: string; photoUrl: string; source: 'Unsplash' | 'Pexels' }
  focal?: `${number}% ${number}%`   // object-position for art direction
  placeholder?: 'blur'     // with blurDataURL generated at build (plaiceholder / sharp)
}
export const IMAGES = {
  heroStudio: { src: 'https://images.unsplash.com/photo-<id>?…', width: 2400, height: 1600, altKey: 'images.heroStudio', credit: {…} },
  // grouped by section: hero*, service.<slug>.*, industries.*, studio.*, events.*
} as const satisfies Record<string, ImageAsset>
```

**Sourcing rules**

- Use **Unsplash** (`images.unsplash.com`) or **Pexels** (`images.pexels.com`). Both licences allow free commercial use without permission. Do **not** use `plus.unsplash.com`; Unsplash+ images need a paid licence. Do not use Google Images, Pinterest or brand sites.
- Verify every URL returns 200 and matches its description **before** committing. Open it and look. Store the photographer credit even when not legally required, and render credits on an `/credits` section or in the footer disclosure.
- Choose images that fit Coastal Karnataka and India where possible (Indian events, crews, studios and creators). Avoid generic Western office stock. Never use images that depict identifiable people as Powerhouse staff, founders or clients (see `powerhouse-brand`).
- Apply theme treatment in CSS (duotone via `mix-blend-mode` or a `filter` overlay token), not by editing files, so one image serves three themes.
- `next.config.ts` → `images.remotePatterns` for `images.unsplash.com` and `images.pexels.com` only, `formats: ['image/avif', 'image/webp']`, and a tuned `deviceSizes`.
- Swapping in the client's real photos later means replacing the `src` and `credit` in one file. Keep keys semantic (`service.eventCoverage.primary`), not descriptive of the current photo.

## Checks

- A Vitest test walks every locale dictionary and asserts that no value is empty, every `altKey` in `IMAGES` resolves to a string, and every service slug has SEO strings.
- A script (`scripts/check-images.mjs`) HEAD-requests every remote image in `IMAGES` and fails on a non-200 response or a disallowed host.
