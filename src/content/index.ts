import { content as en } from './en'
import type { Content, ServiceSlug } from './types'

export const locales = ['en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

const dictionaries = { en } satisfies Record<Locale, Content>

/** Server-side access to copy. Client components receive only the slices they need, as props. */
export function getContent(locale: Locale = defaultLocale): Content {
  return dictionaries[locale]
}

export function getService(slug: string, locale: Locale = defaultLocale) {
  return getContent(locale).services.items.find((s) => s.slug === slug)
}

export const serviceSlugs = (): ServiceSlug[] => getContent().services.items.map((s) => s.slug)

export type { Content, ServiceSlug } from './types'
