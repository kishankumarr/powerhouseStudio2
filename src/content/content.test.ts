import { describe, expect, it } from 'vitest'
import { ROUTES } from '@/config/routes'
import { IMAGES } from '@/constants/images'
import { getContent, locales } from '@/content'

const TITLE_SUFFIX = ' | Powerhouse Studios'

/** Every string leaf in a nested object, with its path. */
function strings(value: unknown, path = ''): [string, string][] {
  if (typeof value === 'string') return [[path, value]]
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`))
  if (value && typeof value === 'object')
    return Object.entries(value).flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k))
  return []
}

describe.each(locales)('content (%s)', (locale) => {
  const c = getContent(locale)

  it('has no empty strings', () => {
    const empty = strings(c).filter(([, v]) => v.trim() === '')
    expect(empty).toEqual([])
  })

  it('resolves alt text for every image in the registry', () => {
    for (const [key, asset] of Object.entries(IMAGES)) {
      expect(asset.altKey).toBe(`images.${key}`)
      expect(c.images[key as keyof typeof c.images]).toBeTruthy()
    }
  })

  it('keeps page titles ≤ 60 chars and descriptions 140–160 chars', () => {
    const entries = [
      ...Object.entries(c.seo).map(([k, v]) => [k, v] as const),
      ...c.services.items.map((s) => [s.slug, s.seo] as const),
    ]
    for (const [key, seo] of entries) {
      const full = key === 'home' ? seo.title : `${seo.title}${TITLE_SUFFIX}`
      expect(full.length, `${key} title`).toBeLessThanOrEqual(60)
      expect(seo.description.length, `${key} description`).toBeGreaterThanOrEqual(140)
      expect(seo.description.length, `${key} description`).toBeLessThanOrEqual(160)
    }
  })

  it('has SEO copy for every route in the registry', () => {
    for (const r of ROUTES) expect(c.seo[r.key]).toBeDefined()
  })

  it('links services only to services and FAQs that exist', () => {
    const slugs = new Set(c.services.items.map((s) => s.slug))
    const faqIds = new Set(c.faq.items.map((f) => f.id))
    expect(slugs.size).toBe(8)
    for (const s of c.services.items) {
      for (const r of s.related) expect(slugs.has(r), `${s.slug} → ${r}`).toBe(true)
      for (const f of s.faqIds) expect(faqIds.has(f), `${s.slug} → faq ${f}`).toBe(true)
      expect(s.capabilities.length).toBeGreaterThan(0)
    }
  })

  it('keeps portfolio slots as typed placeholders (no invented work)', () => {
    expect(c.work.portfolio.slots.every((s) => s.placeholder === true)).toBe(true)
  })

  it('uses the canonical contact details from the brand profile', () => {
    expect(c.site.phone.href).toBe('tel:+918050461707')
    expect(c.site.email.href).toBe('mailto:team.powerhousestudios@gmail.com')
    expect(c.site.instagram.url).toBe('https://www.instagram.com/powerhousestudios.in/')
    expect(c.site.url).toBe('https://powerhousestudios.in')
  })
})
