import { expect, test } from '@playwright/test'
import { presets } from './helpers'

const WIDTHS = [320, 360, 390, 768, 1024, 1440, 1920]
const PATHS = [
  '/',
  '/about',
  '/services',
  '/services/video-production',
  '/approach',
  '/contact',
  '/config',
]

for (const path of PATHS) {
  for (const preset of presets) {
    test(`${path} [${preset}] never scrolls sideways`, async ({ page }) => {
      await page.goto(`${path}?preset=${preset}`, { waitUntil: 'networkidle' })
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 })
        await page.waitForTimeout(150)
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        )
        expect(overflow, `at ${width}px`).toBeLessThanOrEqual(0)
      }
    })
  }
}

test('navigation switches to the menu button below the large breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.getByRole('navigation', { name: 'Main' }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden()
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
})

test('the footer wordmark shows every letter at every width', async ({ page }) => {
  await page.goto('/')
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 })
    await page.waitForTimeout(150)
    const fits = await page.evaluate(() => {
      const p = document.querySelector<HTMLElement>('footer p[data-word]')!
      const drawn = getComputedStyle(p, '::after').content.replace(/"/g, '')
      return drawn === p.dataset.word && p.scrollWidth <= p.clientWidth + 1
    })
    expect(fits, `at ${width}px`).toBe(true)
  }
})

test('tap targets in the header are at least 24×24', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  for (const el of await page.locator('header a, header button').all()) {
    if (!(await el.isVisible())) continue
    const box = await el.boundingBox()
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(24)
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(24)
  }
})
