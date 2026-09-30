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
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(900)
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
