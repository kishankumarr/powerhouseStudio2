---
name: theme-system
description: Colour, theme and design-token architecture for the Powerhouse site. Covers the three switchable brand themes, the layout and style axes, the /config route where the client picks a combination, Tailwind v4 token mapping, no-flash persistence and contrast validation. Use when defining colours, tokens, typography scales, radii or backgrounds, adding or editing a theme, building /config, or styling any component that must look right in all three themes.
---

# Theme System

The site ships **two complete design directions** (the client asked to drop the yellow-dominant third one) that can be compared live at `/config` and from the floating look picker in the bottom-right corner. Every component must render correctly in both, so styling always goes through **semantic tokens**. Never use raw hex values or theme-specific classes inside components.

## Three independent axes, two presets

| Axis                            | Attribute on `<html>` | What it controls                                                                                                   |
| ------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Theme** (colour and texture)  | `data-theme`          | Surface, ink and accent tokens, background treatment (grain, grid, spotlight), image treatment (duotone, contrast) |
| **Layout** (composition)        | `data-layout`         | Section grid templates, hero composition, nav style, card arrangement, density                                     |
| **Style** (shape, type, motion) | `data-style`          | Display font choice and tracking, radius scale, border weight, motion intensity multiplier                         |

A **preset** is a named, curated combination of the three axes. These are the design directions offered to the client. The `blocks` layout and `condensed` style remain available as fine-tune options. `/config` shows the presets first, then lets the user fine-tune each axis independently.

### Current roster (starting proposal; refine during design and keep this table updated)

The rationale: each preset leads with one of the logo's surfaces (the black pill or the white inset), with yellow as the accent in both. The yellow-dominant `signal` direction was removed at the client's request.

| Preset id  | Name          | Theme                                                                             | Layout                                                         | Style     | Personality                         |
| ---------- | ------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------- | ----------------------------------- |
| `noir`     | Studio Noir   | black stage, yellow as the _light source_ (spotlight glow, key light), film grain | `cinematic`: full-bleed, big type, horizontal reels            | `sharp`   | Night shoot, premium, cinematic     |
| `daylight` | Daylight Edit | white or paper surfaces, black ink, yellow as _highlighter_ and tape fills        | `editorial`: asymmetric grid, generous whitespace, pull-quotes | `rounded` | Clean, credible, corporate-friendly |

The default preset (first visit) is `noir` unless the client decides otherwise.

## Token contract

Components may only use these semantic tokens, through the Tailwind utilities generated from them.

```
--ph-bg            page background
--ph-surface       raised panels / cards
--ph-surface-2     secondary surface (inputs, chips)
--ph-fg            primary text
--ph-fg-muted      secondary text (≥ 4.5:1 on bg AND surface)
--ph-accent        brand yellow usage for this theme (usually #FEED01)
--ph-accent-fg     text/icon colour placed ON accent (black)
--ph-accent-ink    accent used AS text/line on bg — only defined where contrast allows (dark themes); on light themes it falls back to --ph-fg
--ph-border        hairlines / dividers
--ph-ring          focus ring (must be ≥ 3:1 against bg)
--ph-overlay       scrim over images for text legibility
--ph-grain-opacity background texture strength (0 disables)
--ph-font-display / --ph-font-body
--ph-tracking-display, --ph-leading-display
--ph-radius-sm / md / lg / pill
--ph-border-width
--ph-motion-scale  multiplier applied to durations/distances (0 = static)
```

Brand constants such as `--ph-yellow: #FEED01` and `--ph-black: #000` live in `:root` and are referenced by the themes. They are never used directly by components.

## Tailwind v4 wiring (CSS-first; no `tailwind.config.js`)

```css
/* src/styles/theme.css */
@import 'tailwindcss';

/* Variants so components can adapt structure per axis when CSS vars aren't enough */
@custom-variant theme-noir     (&:where([data-theme="noir"], [data-theme="noir"] *));
@custom-variant theme-daylight (&:where([data-theme="daylight"], [data-theme="daylight"] *));
@custom-variant layout-cinematic (&:where([data-layout="cinematic"], [data-layout="cinematic"] *));
@custom-variant layout-editorial (&:where([data-layout="editorial"], [data-layout="editorial"] *));
@custom-variant layout-blocks    (&:where([data-layout="blocks"], [data-layout="blocks"] *));

@theme inline {
  --color-bg: var(--ph-bg);
  --color-surface: var(--ph-surface);
  --color-surface-2: var(--ph-surface-2);
  --color-fg: var(--ph-fg);
  --color-fg-muted: var(--ph-fg-muted);
  --color-accent: var(--ph-accent);
  --color-accent-fg: var(--ph-accent-fg);
  --color-accent-ink: var(--ph-accent-ink);
  --color-border: var(--ph-border);
  --color-ring: var(--ph-ring);
  --font-display: var(--ph-font-display);
  --font-body: var(--ph-font-body);
  --radius-sm: var(--ph-radius-sm);
  --radius-md: var(--ph-radius-md);
  --radius-lg: var(--ph-radius-lg);
}

:root {
  --ph-yellow: #feed01;
  --ph-black: #000000;
  --ph-white: #ffffff;
}
[data-theme='noir'] {
  --ph-bg: var(--ph-black); /* …full set… */
}
[data-theme='daylight'] {
  --ph-bg: var(--ph-white); /* … */
}
```

Keep one file per theme (`src/styles/themes/noir.css` etc.) that defines the _entire_ token set. A missing token must be a visible bug, not a silent inheritance. Set `color-scheme: dark|light` per theme so form controls and scrollbars match.

## Layout variation must stay in CSS

Pages are statically rendered, and the user's preference is only known in the browser. So:

- **Do not** branch JSX on the layout preference (`prefs.layout === 'editorial' ? <A/> : <B/>`). It causes a flash of the wrong layout and hydration mismatches.
- **Do** express layout differences with `data-layout` selectors or `layout-*:` variants: `grid-template-areas`, `order`, column spans, `display`, aspect ratios and sizes. One DOM, three compositions.
- If a variant truly needs different markup (rare), render the variants inside a single client island that mounts after hydration, and give it a skeleton of fixed dimensions (CLS = 0).

## No-flash persistence

1. **Storage key:** `ph-prefs` in `localStorage`, holding `{ preset, theme, layout, style, v: 1 }`. Bump `v` on breaking changes and discard older values.
2. **Before paint:** the root layout renders a tiny inline `<script>` in `<head>`. It reads `ph-prefs`, validates each value against an allow-list and sets `document.documentElement.dataset.theme/layout/style`, falling back to the default preset. Wrap it in `try/catch`, because storage can throw in private mode. Put `suppressHydrationWarning` on `<html>`.
   - If the URL has `?preset=<id>` on **any** route, the script validates it, applies it and persists it. The agency can then share `https://…/?preset=daylight` directly, and Lighthouse and Playwright can test each theme without clicking through `/config`. Canonical tags keep these URLs from being indexed as duplicates.
3. The server-rendered `<html>` carries the **default preset's** attributes, so no-JS users and crawlers get a complete design.
4. **Redux** (`preferences` slice; see the `redux-state` skill) initialises from `document.documentElement.dataset` on mount. A listener middleware writes changes back to both `dataset` and `localStorage`. Redux is the only writer after boot.
5. Theme changes animate with a short cross-fade using a View Transition when supported (`document.startViewTransition`), and change instantly under `prefers-reduced-motion`.

Do not read preferences from cookies in Server Components. `await cookies()` makes every route dynamic and loses static generation.

## `/config` route

- `app/config/page.tsx` is a server component shell with `robots: { index: false, follow: false }`. It is excluded from `sitemap.ts` and not linked in the main nav. It is a client-facing demo tool.
- It shows **3 preset cards**, each with a live miniature preview. The preview is a scaled `<div data-theme data-layout data-style>` island rendering real components, not screenshots, so it never drifts from the site.
- Below the presets are **fine-tune controls** for Theme × Layout × Style (radio groups, fully keyboard operable), plus "Reset to default" and "View site", which navigates to `/` with the choice applied.
- A shareable link (`/config?preset=daylight`) applies a preset when opened. This lets the agency send each option to the client directly. Read it with `useSearchParams` inside a `<Suspense>` boundary.
- All labels and descriptions come from content files (see the `content-i18n` skill).

## Background treatments (per theme, CSS-first)

Use CSS or inline-SVG layers behind content, `aria-hidden`, `pointer-events: none` and `position: fixed|absolute`:

- Grain: SVG `feTurbulence` as a data-URI background, with opacity from `--ph-grain-opacity`.
- Spotlight: `radial-gradient` in `color-mix(in oklab, var(--ph-accent) 18%, transparent)` that follows the pointer only on fine pointers, updated through a CSS variable and never re-rendering React.
- Grid, film strip, waveform and timecode motifs: see the `svg-vector-animation` skill.

Textures must never reduce text contrast below AA. Test text over the busiest part.

## Contrast is a build-time check

Every theme must pass these pairs (WCAG 2.2): `fg/bg` ≥ 7, `fg-muted/bg` ≥ 4.5, `fg-muted/surface` ≥ 4.5, `accent-fg/accent` ≥ 4.5, `ring/bg` ≥ 3, and `accent-ink/bg` ≥ 4.5 where defined. Keep a `scripts/check-contrast.mjs` that parses the theme files and fails CI on regressions. Brand fact: yellow on white is 1.2:1, so on light themes yellow is **only** a fill.

## Fonts per style (no layout shift)

The style axis changes Saira's width (sharp 75%, rounded 100%, condensed 56%). Each style's `--ph-font-display` stack is `var(--font-saira)` followed by that style's own width-matched fallback faces (`PH Fallback <Style>` for Arial on desktop and iOS, and `… Android` for Roboto). These are defined at the top of `styles/styles.css`. When adding a style or changing a width, recompute `size-adjust` and the ascent/descent overrides from the font metrics; the method is described in the web-performance skill.

## Guardrails

- `#FEED01` and black are present and recognisable in all three themes. Variety comes from proportion, texture, type and layout, not from swapping in unrelated brand colours.
- Each theme is a _choice_, not a recolour. It should read as a different creative direction at a glance, while the logo, content and IA stay the same.
- Honour `prefers-reduced-motion` and `prefers-contrast: more` in every theme. `forced-colors: active` must keep focus rings and borders visible.
