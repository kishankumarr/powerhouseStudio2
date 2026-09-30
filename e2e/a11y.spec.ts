import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { allPaths, presets, scrollThrough } from './helpers'

for (const preset of presets) {
  for (const path of allPaths) {
    test(`${path} [${preset}] has no serious or critical axe violations`, async ({ page }) => {
      await page.goto(`${path}?preset=${preset}`, { waitUntil: 'networkidle' })
      await scrollThrough(page)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
      const serious = results.violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => ({ id: v.id, nodes: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) }))
      expect(serious).toEqual([])
    })
  }
}

test('the skip link is the first tab stop and moves focus to main', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main$/)
})

test('the look picker opens, is keyboard operable and closes on Escape', async ({ page }) => {
  await page.goto('/')
  const toggle = page.getByRole('button', { name: 'Change the look' })
  await toggle.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Choose a look' })
  await expect(dialog).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(toggle).toBeFocused()
})
