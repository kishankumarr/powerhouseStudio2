import { expect, test } from '@playwright/test'
import { scrollThrough } from './helpers'

// Runs in the `reduced-motion` project (prefers-reduced-motion: reduce).
// Scrolling the longest pages can exceed the default budget on a busy runner.
test.describe.configure({ timeout: 120_000 })

for (const path of ['/', '/about', '/services/photography', '/approach']) {
  test(`${path}: nothing loops and all content ends up visible`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' })
    await scrollThrough(page)
    const running = await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((a) => a.effect?.getTiming().iterations === Infinity && a.playState === 'running')
          .length,
    )
    expect(running).toBe(0)
    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll<HTMLElement>('[data-reveal]')].filter(
          (el) => Number(getComputedStyle(el).opacity) < 0.99,
        ).length,
    )
    expect(hidden).toBe(0)
  })
}

test('the hero logo renders in its final frame', async ({ page }) => {
  await page.goto('/')
  const word = page.locator('.ph-logo-word')
  await expect(word).toBeVisible()
  const clip = await word.evaluate((el) => getComputedStyle(el).clipPath)
  expect(clip).toMatch(/inset\(0(px)?( 0(px)?)*|none/)
})
