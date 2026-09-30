import type { Page } from '@playwright/test'
import { ROUTES, servicePath } from '../src/config/routes'
import { PRESET_IDS } from '../src/config/themes'
import { getContent, serviceSlugs } from '../src/content'

export const content = getContent()
export const presets = PRESET_IDS

/** Every indexable page: the route registry plus the eight service pages. */
export const indexablePaths = [
  ...ROUTES.filter((r) => r.sitemap).map((r) => r.path),
  ...serviceSlugs().map((s) => servicePath(s)),
]
export const allPaths = [...indexablePaths, '/config']

/** Scroll the whole page so in-view reveals and lazy images settle. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8)
    // 'instant' overrides the site's smooth scrolling, which would otherwise be
    // interrupted by the next step and leave parts of the page never in view.
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 150))
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  })
  // Wait for every reveal, and any other finite animation or transition, to finish
  // instead of guessing a delay (CI machines are slower).
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll<HTMLElement>('[data-reveal]')].every(
        (el) => Number(getComputedStyle(el).opacity) >= 0.99,
      ) &&
      document
        .getAnimations()
        .every((a) => a.playState !== 'running' || a.effect?.getTiming().iterations === Infinity),
    undefined,
    { timeout: 10_000 },
  )
}

/** Marks the look picker's first-visit hint as seen, so it can't fade in mid-scan. */
export async function skipDockHint(page: Page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('ph-dock-seen', '1')
    } catch {}
  })
}

/** Collects console errors and uncaught exceptions for a page. */
export function collectErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`)
  })
  return errors
}
