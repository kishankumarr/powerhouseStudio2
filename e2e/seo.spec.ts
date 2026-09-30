import { expect, test } from '@playwright/test'
import { content, indexablePaths } from './helpers'

const titles = new Map<string, string>()

for (const path of indexablePaths) {
  test(`${path} has complete, unique metadata`, async ({ page, request }) => {
    await page.goto(path)
    const title = await page.title()
    expect(title.length).toBeLessThanOrEqual(60)
    for (const [other, t] of titles) expect(t, `duplicate of ${other}`).not.toBe(title)
    titles.set(path, title)

    const desc = await page.locator('meta[name="description"]').getAttribute('content')
    expect(desc?.length ?? 0).toBeGreaterThanOrEqual(140)
    expect(desc?.length ?? 0).toBeLessThanOrEqual(160)

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toBe(path === '/' ? content.site.url : `${content.site.url}${path}`)

    for (const p of ['og:title', 'og:description', 'og:image', 'og:url']) {
      await expect(page.locator(`meta[property="${p}"]`).first()).toHaveAttribute('content', /.+/)
    }
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    )
    await expect(page.locator('h1')).toHaveCount(1)

    // The OG image is generated at build time: fetch it from this server.
    const og = await page.locator('meta[property="og:image"]').first().getAttribute('content')
    const ogUrl = new URL(og ?? '')
    const img = await request.get(`${ogUrl.pathname}${ogUrl.search}`)
    expect(img.status()).toBe(200)
    expect(img.headers()['content-type']).toContain('image/png')

    // Every JSON-LD block parses and has a @type.
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
    expect(blocks.length).toBeGreaterThan(0)
    for (const b of blocks) expect(JSON.parse(b)['@type']).toBeTruthy()
  })
}

test('FAQ page carries FAQPage JSON-LD matching the visible questions', async ({ page }) => {
  await page.goto('/faq')
  const blocks = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(
    (b) => JSON.parse(b) as { '@type': string; mainEntity?: { name: string }[] },
  )
  const faq = blocks.find((b) => b['@type'] === 'FAQPage')
  expect(faq?.mainEntity?.map((q) => q.name)).toEqual(content.faq.items.map((f) => f.question))
  for (const f of content.faq.items) await expect(page.getByText(f.answer)).toBeAttached()
})

test('/config is noindex and absent from the sitemap; robots points at the sitemap', async ({
  page,
  request,
}) => {
  await page.goto('/config')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap).not.toContain('/config')
  expect(sitemap).toContain('/services/event-coverage')
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain(`${content.site.url}/sitemap.xml`)
  expect(robots).toMatch(/Disallow: \/config/)
})
