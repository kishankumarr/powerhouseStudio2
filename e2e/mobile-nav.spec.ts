import { expect, test } from '@playwright/test'

test('the mobile menu opens, traps focus, closes on Escape and returns focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const toggle = page.getByRole('button', { name: 'Open menu' })
  await toggle.click()
  const menu = page.getByRole('dialog', { name: 'Menu' })
  await expect(menu).toBeVisible()
  await expect(menu.getByRole('link', { name: 'About' })).toBeFocused()

  // Tabbing never leaves the menu (toggle + panel links).
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab')
    const inside = await page.evaluate(() => {
      const a = document.activeElement
      return !!a && (!!a.closest('#mobile-nav') || a.getAttribute('aria-controls') === 'mobile-nav')
    })
    expect(inside).toBe(true)
  }

  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused()
})

test('choosing a menu link navigates and closes the menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.getByRole('dialog', { name: 'Menu' }).getByRole('link', { name: 'Services' }).click()
  await expect(page).toHaveURL(/\/services$/)
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden()
})
