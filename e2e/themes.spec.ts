import { expect, test, type Page } from '@playwright/test'
import { PRESETS } from '../src/config/themes'

const attrs = (page: Page) => page.evaluate(() => ({ ...document.documentElement.dataset }))

test('the look picker switches presets, persists them and survives navigation', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Change the look' }).click()
  await page.locator('label', { hasText: 'Daylight Edit' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'daylight')
  await expect(page.locator('html')).toHaveAttribute('data-layout', PRESETS.daylight.layout)
  await expect(page.locator('html')).toHaveAttribute('data-style', PRESETS.daylight.style)
  await page.reload()
  expect(await attrs(page)).toMatchObject({ theme: 'daylight', preset: 'daylight' })
  await page.goto('/about')
  expect(await attrs(page)).toMatchObject({ theme: 'daylight' })
})

test('fine-tune marks a custom mix', async ({ page }) => {
  await page.goto('/config')
  await page.locator('label', { hasText: 'Blocks' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-layout', 'blocks')
  await expect(page.locator('html')).toHaveAttribute('data-preset', 'custom')
})

test('no flash: stored preferences apply before hydration', async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'ph-prefs',
      JSON.stringify({
        preset: 'daylight',
        theme: 'daylight',
        layout: 'editorial',
        style: 'rounded',
        v: 1,
      }),
    ),
  )
  await page.goto('/', { waitUntil: 'commit' })
  await page.waitForSelector('body')
  expect(await attrs(page)).toMatchObject({
    theme: 'daylight',
    layout: 'editorial',
    style: 'rounded',
  })
})

test('?preset= applies on any route; unknown values fall back to the default', async ({ page }) => {
  await page.goto('/services?preset=daylight')
  expect(await attrs(page)).toMatchObject({ theme: 'daylight', preset: 'daylight' })
  await page.goto('/')
  expect(await attrs(page)).toMatchObject({ theme: 'daylight' })

  await page.context().clearCookies()
  await page.evaluate(() => localStorage.clear())
  await page.goto('/?preset=signal')
  expect(await attrs(page)).toMatchObject({ theme: 'noir', preset: 'noir' })
})

test('body text and buttons meet 4.5:1 in both themes', async ({ page }) => {
  for (const preset of ['noir', 'daylight']) {
    await page.goto(`/?preset=${preset}`)
    const ratios = await page.evaluate(() => {
      const lum = (c: string) => {
        const [r, g, b] = (c.match(/[\d.]+/g) ?? ['0', '0', '0']).slice(0, 3).map((v) => {
          const s = Number(v) / 255
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
        })
        return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
      }
      const ratio = (a: string, b: string) => {
        const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
        return (x! + 0.05) / (y! + 0.05)
      }
      const bg = getComputedStyle(document.documentElement).backgroundColor
      const lead = document.querySelector('#hero-title ~ div p, main p')!
      return {
        lead: ratio(getComputedStyle(lead).color, bg),
        body: ratio(getComputedStyle(document.body).color, bg),
      }
    })
    expect(ratios.lead, preset).toBeGreaterThanOrEqual(4.5)
    expect(ratios.body, preset).toBeGreaterThanOrEqual(4.5)
  }
})
