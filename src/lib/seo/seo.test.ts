import { describe, expect, it } from 'vitest'
import { getContent } from '@/content'
import { buildMetadata } from './build-metadata'
import {
  breadcrumbSchema,
  faqSchema,
  localBusinessSchema,
  organizationSchema,
  serviceSchema,
} from './schema'

describe('buildMetadata', () => {
  const c = getContent()

  it('sets canonical, Open Graph, Twitter and robots from content', () => {
    const m = buildMetadata({ ...c.seo.about, path: '/about' })
    expect(m.alternates?.canonical).toBe('/about')
    expect(m.title).toBe(c.seo.about.title)
    expect(m.openGraph).toMatchObject({ url: '/about', locale: 'en_IN', siteName: c.site.name })
    expect(m.twitter).toMatchObject({ card: 'summary_large_image' })
    expect(m.robots).toMatchObject({ index: true, follow: true })
  })

  it('supports absolute titles and noindex', () => {
    const m = buildMetadata({
      ...c.seo.config,
      path: '/config',
      noindex: true,
      absoluteTitle: true,
    })
    expect(m.title).toEqual({ absolute: c.seo.config.title })
    expect(m.robots).toEqual({ index: false, follow: false })
  })
})

describe('JSON-LD builders', () => {
  const c = getContent()
  const org = `${c.site.url}/#organization`

  it('links the organisation by @id and never invents an address or ratings', () => {
    const o = organizationSchema() as unknown as { '@id': string }
    expect(o['@id']).toBe(org)
    const lb = JSON.stringify(localBusinessSchema())
    expect(lb).not.toMatch(/streetAddress|geo|openingHours|aggregateRating|review/)
    expect(lb).toContain('"addressLocality":"Mangaluru"')
  })

  it('builds Service with provider and the visible capabilities', () => {
    const s = c.services.items[0]!
    const schema = serviceSchema(s) as unknown as {
      provider: { '@id': string }
      hasOfferCatalog: { itemListElement: unknown[] }
    }
    expect(schema.provider['@id']).toBe(org)
    expect(schema.hasOfferCatalog.itemListElement).toHaveLength(s.capabilities.length)
  })

  it('mirrors the visible FAQ text exactly', () => {
    const f = faqSchema(c.faq.items) as unknown as {
      mainEntity: { name: string; acceptedAnswer: { text: string } }[]
    }
    expect(f.mainEntity.map((q) => q.name)).toEqual(c.faq.items.map((q) => q.question))
    expect(f.mainEntity[0]?.acceptedAnswer.text).toBe(c.faq.items[0]?.answer)
  })

  it('builds absolute breadcrumb URLs', () => {
    const b = breadcrumbSchema([{ name: 'Home', path: '/' }]) as unknown as {
      itemListElement: { item: string }[]
    }
    expect(b.itemListElement[0]?.item).toBe(`${c.site.url}/`)
  })

  it('escapes "<" when serialised for a script tag', () => {
    const json = JSON.stringify({ x: '</script><script>' }).replace(/</g, '\\u003c')
    expect(json).not.toContain('<')
  })
})
