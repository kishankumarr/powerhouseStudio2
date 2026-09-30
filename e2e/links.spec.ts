import { expect, test } from '@playwright/test'
import { allPaths, content } from './helpers'

test('every internal link resolves, and contact links use canonical values', async ({
  page,
  request,
}) => {
  const internal = new Set<string>()
  const external = new Set<string>()
  for (const path of allPaths) {
    await page.goto(path)
    const hrefs = await page
      .locator('a[href]')
      .evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute('href') ?? ''))
    for (const h of hrefs) {
      if (h.startsWith('/')) internal.add(h.split('#')[0]!.split('?')[0] || '/')
      else if (/^(tel|mailto|https?):/.test(h)) external.add(h)
    }
  }
  for (const href of internal) {
    const res = await request.get(href)
    expect(res.status(), href).toBe(200)
  }
  const tel = [...external].filter((h) => h.startsWith('tel:'))
  const mail = [...external].filter((h) => h.startsWith('mailto:'))
  const insta = [...external].filter((h) => h.includes('instagram.com'))
  expect(new Set(tel)).toEqual(new Set([content.site.phone.href]))
  expect(new Set(mail)).toEqual(new Set([content.site.email.href]))
  expect(new Set(insta)).toEqual(new Set([content.site.instagram.url]))
})
