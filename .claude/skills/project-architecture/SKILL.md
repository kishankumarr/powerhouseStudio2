---
name: project-architecture
description: Folder structure, layering, naming and tooling conventions for the Powerhouse Studios Next.js 16 + React 19 + TypeScript + Tailwind v4 site. Covers the route map, component layers (primitives, patterns, sections, pages), server/client boundaries, config registries, error and loading states, the no-backend contact flow, lint, format, typecheck and commit hygiene. Use when creating files or folders, adding a page, section or component, deciding where code lives, or reviewing structure.
---

# Project Architecture

General React and Next rules come from the Vercel `nextjs` and `react-best-practices` skills. This skill fixes the **project-specific** decisions so every file lands in a predictable place.

## Stack (pin exact versions in package.json; upgrade deliberately)

Next.js 16.x (App Router, Turbopack), React 19.3, TypeScript (strict), Tailwind CSS 4.x, Motion 13.x (`motion`), Redux Toolkit 2.x + React-Redux 9.x, `schema-dts`, `lucide-react`, Vitest 5, Playwright 1.6x, ESLint (flat config, `eslint-config-next`) and Prettier (with `prettier-plugin-tailwindcss`). There are no backend APIs yet.

## Folder structure

```
src/
  app/                         routes only: page/layout/loading/error/not-found/opengraph-image/sitemap/robots/manifest
    (site)/                    route group with the shared marketing chrome (header, footer)
      page.tsx                 /
      about/  services/  services/[slug]/  work/  approach/  faq/  contact/
    config/                    /config (own minimal chrome, noindex)
    layout.tsx                 <html>, fonts, pre-paint script, providers, Organization JSON-LD
    not-found.tsx  global-error.tsx
  components/
    ui/                        primitives: Button, Link, Container, Heading, Text, Badge, Icon, VisuallyHidden, RichText
    patterns/                  composed, reusable: Card variants, Accordion, Marquee, MediaFrame, SectionHeader, CTA band
    sections/                  page sections: home/Hero, home/ServicesGrid, about/Founders … (one folder per page)
    layout/                    SiteHeader, MobileNav, SiteFooter, SkipLink, BackgroundLayers
    brand/                     Logo, AnimatedLogo, logo-paths.ts
    motion/                    MotionProvider, Reveal, Stagger, Parallax, SplitText, ShutterWipe
    seo/                       JsonLd + schema builders
    config/                    PresetCard, AxisPicker, ThemePreview (the /config tool)
    icons/                     custom service icons
  config/                      registries (single sources of truth): routes.ts, themes.ts, nav.ts, site-url.ts
  content/                     typed locale dictionaries (see content-i18n)
  constants/                   images.ts, breakpoints.ts, storage-keys.ts
  lib/                         pure helpers: seo/, motion/tokens.ts, utils (cn), format
  hooks/                       useHydrated, useMotionScale, useMediaQuery
  store/                       Redux (see redux-state)
  styles/                      globals.css, theme.css, themes/*.css, layouts/*.css, styles/*.css
  assets/brand/                generated logo SVGs
e2e/                           Playwright specs (see e2e-testing)
scripts/                       vectorize-logo, check-contrast, check-images
public/                        brand/ (static logos for OG and email), og fonts are NOT here
brand_assets/                  client originals — never modified, never imported directly
```

Path alias: `@/*` → `src/*`. Use no deep relative imports (`../../../`).

## Route map (keep `src/config/routes.ts` in sync; nav, sitemap and tests read it)

| Route              | Purpose                        | Key content                                                                                                                             |
| ------------------ | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                | Home: the pitch in one scroll  | Logo moment, promise, Visibility → Trust → Growth, services overview, who we serve, process, why us, industries ticker, CTA             |
| `/about`           | Who we are                     | About, beliefs, philosophy, team, founders, vision, mission, brand promise, note from Powerhouse                                        |
| `/services`        | Services index                 | 8 services with summaries and links                                                                                                     |
| `/services/[slug]` | 8 static service pages         | Intro, capabilities, related services, FAQ subset, CTA                                                                                  |
| `/work`            | Work and industries            | Industries (16), "Different brands…" line, portfolio slots (typed placeholders until the client supplies work)                          |
| `/approach`        | How we work                    | Discovery questions, Understand → Create → Produce → Deliver, the Powerhouse difference, ways to engage, For Brands / Creators / Events |
| `/faq`             | All FAQs                       | 8 FAQs + FAQPage JSON-LD                                                                                                                |
| `/contact`         | Start a conversation           | Contact details, enquiry form, service interest chips                                                                                   |
| `/config`          | Client theme and layout picker | noindex, not in nav or sitemap                                                                                                          |

## Component rules

- **Layering:** `ui` → `patterns` → `sections` → `app` pages. Lower layers never import higher ones. Sections receive content via props, or read from `getContent()` in server sections, and never define copy.
- **Server by default.** `'use client'` only in leaf islands. Mark client files by folder role or with a `.client.tsx` suffix when a folder mixes both.
- One component per file, with named exports (no default exports except where Next requires them: page, layout, etc.). File names use kebab-case (`service-card.tsx`) and component names use PascalCase.
- Props are typed with `type`, not `interface`, unless a type is extended. There is no `any`, and `unknown` must be narrowed at boundaries.
- Class composition goes through `cn()` (`clsx` + `tailwind-merge`). Variants use a small `variants` map or `cva`. Tokens only; see `theme-system`.
- Accessibility is part of the component contract: semantic element first (`button` vs `a`), visible focus via `--ph-ring`, labelled controls, and `prefers-reduced-motion` respected.

## States and errors

- `app/not-found.tsx` is on-brand (the "lost the shot" ribbon), links home and to services, and uses content text.
- `app/global-error.tsx` and a route-level `error.tsx` for `(site)` show a friendly retry, with no stack traces in production.
- `loading.tsx` is not needed for static pages. Use Suspense skeletons only around genuinely deferred islands.

## Contact without a backend (for now)

- The form validates on the client (native constraints plus a small schema), then **composes a `mailto:`** to `team.powerhousestudios@gmail.com` with a structured subject and body (name, company, services, budget band if the client wants it, message). Next to it sit direct `tel:`, email and Instagram actions.
- Keep the submit logic behind an `EnquiryTransport` interface (`mailto` now). Moving later to a Server Action and an email provider is a one-file change.
- Do not add WhatsApp until the client confirms the number is WhatsApp-enabled.

## Tooling and hygiene

- `tsconfig`: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `verbatimModuleSyntax`.
- Scripts: `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`), `format`, `test`, `test:e2e`, `analyze`.
- ESLint: `eslint-config-next` (core-web-vitals + typescript), `react/jsx-no-literals` for content discipline, `jsx-a11y` recommended, import ordering.
- A pre-commit hook (lint-staged) runs Prettier and ESLint on staged files. Don't bypass hooks.
- Initialise git at scaffold time, on a `main` branch. Commit in small, reviewable steps.
- `README.md` covers how to run, the theme and preset system, how to edit content, how to swap images, and how to add a language.
