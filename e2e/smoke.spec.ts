import { expect, test } from '@playwright/test'
import { allPaths, collectErrors } from './helpers'

for (const path of allPaths) {
  test(`${path} renders with one h1 and no errors`, async ({ page }) => {
    const errors = collectErrors(page)
    const res = await page.goto(path, { waitUntil: 'networkidle' })
    expect(res?.status()).toBe(200)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('main#main')).toBeVisible()
    expect(errors).toEqual([])
  })
}

test('unknown URLs get the on-brand 404 with a 404 status', async ({ page }) => {
  const res = await page.goto('/this-page-does-not-exist')
  expect(res?.status()).toBe(404)
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.getByRole('link', { name: /back to home/i })).toBeVisible()
})
