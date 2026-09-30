import type { Metadata } from 'next'
import { getContent } from '@/content'
import type { SeoEntry } from '@/content/types'

type PageSeo = SeoEntry & {
  path: `/${string}`
  noindex?: boolean
  /** Use the title as-is instead of the "%s | Powerhouse Studios" template. */
  absoluteTitle?: boolean
}

/** The only way pages build metadata. OG images come from per-route opengraph-image files. */
export function buildMetadata(page: PageSeo): Metadata {
  const { site, locale } = getContent()
  const title = page.absoluteTitle ? { absolute: page.title } : page.title
  const ogTitle = page.absoluteTitle ? page.title : `${page.title} | ${site.name}`
  return {
    title,
    description: page.description,
    keywords: page.keywords.length ? page.keywords : undefined,
    alternates: { canonical: page.path },
    openGraph: {
      type: 'website',
      url: page.path,
      siteName: site.name,
      locale: locale.ogLocale,
      title: ogTitle,
      description: page.description,
    },
    twitter: { card: 'summary_large_image', title: ogTitle, description: page.description },
    robots: page.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large' },
  }
}
