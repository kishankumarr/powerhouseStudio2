---
name: e2e-testing
description: Testing strategy for the Powerhouse site. Covers Playwright 1.6x end-to-end suites across desktop and mobile browsers, accessibility scans with axe, SEO and meta assertions per route, theme and preset matrix tests, responsive and overflow checks, reduced-motion checks, visual regression, Vitest unit tests for content, slices and helpers, and exploratory verification with the Playwright MCP plugin. Use when writing or running tests, before declaring any feature done, or when verifying responsiveness, themes or SEO.
---

# Testing (E2E + Unit)

"Done" means: the build passes, the unit and E2E suites are green, there are zero serious or critical axe violations, and you have **looked** at the page at mobile and desktop widths in all three themes. Use the Playwright MCP plugin for screenshots while building, and the committed test suite for regressions.

## Stack

| Layer             | Tool                                        | Location              |
| ----------------- | ------------------------------------------- | --------------------- |
| Unit / component  | Vitest 5 + `@testing-library/react` + jsdom | `src/**/*.test.ts(x)` |
| E2E / integration | `@playwright/test` 1.6x                     | `e2e/**/*.spec.ts`    |
| Accessibility     | `@axe-core/playwright` 4.x                  | inside E2E specs      |
| Performance       | Lighthouse CI (see `web-performance`)       | `lighthouserc.json`   |

Before writing a Vitest 5 config, check its current config API with Context7 (`/vitest-dev/vitest`), since Vitest 5 is newer than most examples online. Async Server Components can't be unit-rendered by Vitest, so cover them with E2E.

## Playwright config essentials

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry', screenshot: 'only-on-failure' },
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
  projects: [
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 15'] } },
    {
      name: 'reduced-motion',
      use: { ...devices['Desktop Chrome'], contextOptions: { reducedMotion: 'reduce' } },
    },
  ],
})
```

Test against the **production build**. The dev server's overlays, Strict Mode double effects and unminified bundles give misleading results.

## Data-driven from the route registry

Specs iterate `src/config/routes.ts` (the same registry the sitemap and nav use) and `PRESETS` from `src/config/themes.ts`. New pages are then covered automatically. Theme variants are loaded with `?preset=<id>` (see `theme-system`).

## Required specs

1. **`smoke.spec.ts`**: every route returns 200, renders its `<h1>`, and has no console errors or `pageerror` (collect them with `page.on('console')` and `page.on('pageerror')`). The 404 page renders for an unknown URL with a 404 status.
2. **`seo.spec.ts`**: per route: `<title>` is unique across routes and ≤ 60 chars; meta description is 140–160 chars; canonical is absolute and self-referencing; `og:title`, `og:description`, `og:image` and `twitter:card` are present; fetching `og:image` returns 200 `image/png`; there is exactly one `h1`; each `application/ld+json` block parses and has the expected `@type`; `/config` has `noindex` and is absent from `/sitemap.xml`; `/robots.txt` references the sitemap.
3. **`a11y.spec.ts`**: for every route × every preset, run `new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze()` and expect zero violations with impact `serious` or `critical`. Also check keyboard behaviour: the skip link is the first tab stop and moves focus to `main`; the mobile menu opens with Enter, traps focus, closes on Escape and returns focus to the toggle; `/config` radio groups work with arrow keys.
4. **`responsive.spec.ts`**: at widths 320, 360, 390, 768, 1024, 1440 and 1920, `document.documentElement.scrollWidth <= innerWidth` (no horizontal scroll); tap targets are ≥ 24×24 CSS px (WCAG 2.5.8); nav switches to the mobile menu below the breakpoint; images are not upscaled beyond their intrinsic size.
5. **`themes.spec.ts`**:
   - Selecting each preset on `/config` updates `html[data-theme|data-layout|data-style]`, and the choice survives a reload and navigation.
   - **No flash:** seed `localStorage` with `page.addInitScript`, navigate, and at `waitUntil: 'commit'` or `domcontentloaded` assert `data-theme` already equals the stored value before hydration.
   - `?preset=signal` on any route applies and persists the preset. Invalid values fall back to the default.
   - Contrast guard: computed `color` vs `background-color` on body text, muted text and buttons is ≥ 4.5 in each theme (complements `scripts/check-contrast.mjs`).
6. **`motion.spec.ts`** (reduced-motion project): all content is visible (`opacity` 1) without scrolling triggers, no element has an infinite running animation (`document.getAnimations().filter(a => a.effect?.getTiming().iterations === Infinity && a.playState === 'running')` is empty), and the logo renders in its final static state.
7. **`links.spec.ts`**: crawl every internal `<a href>` from every route and assert each target is 200. `tel:`, `mailto:` and the Instagram URL match the canonical values in `powerhouse-brand`.
8. **`visual.spec.ts`**: `toHaveScreenshot()` for the home hero and one service page per preset at 390 and 1440 widths, with `animations: 'disabled'` and reduced motion. Snapshots are OS-specific, so generate and compare them on one platform (CI Linux container). Locally, run with `--update-snapshots` only intentionally.

## Unit tests (Vitest)

- Content integrity: every locale satisfies `Content`, there are no empty strings, every `IMAGES[*].altKey` resolves, and every service slug has SEO strings with length limits (see `content-i18n`).
- `buildMetadata()` output shape, title and description limits, canonical paths.
- Preferences slice reducers, selectors and listener persistence (see `redux-state`).
- Theme registry: every preset references existing theme, layout and style ids, and the pre-paint script allow-list matches the registry. Import the same constant and don't duplicate it.
- JSON-LD builders: required fields, `@id` links, and `<` escaping.

## Scripts (package.json)

```
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:a11y": "playwright test e2e/a11y.spec.ts",
"test:all": "npm run lint && npm run typecheck && npm run test && npm run test:e2e"
```

## Exploratory verification (while building)

Use the **Playwright MCP** tools (from the `playwright` plugin) to open the running app, resize to 390 and 1440, switch presets via `?preset=`, and take screenshots to critique the design. The `frontend-design` skill expects visual self-review. Use the **Chrome DevTools MCP** for performance traces and console or network inspection. Report findings with evidence (a screenshot or trace excerpt), not assumptions.
