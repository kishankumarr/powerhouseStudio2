import { getContent, serviceSlugs } from '@/content'
import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from '@/lib/og/render-og'
import { fill, pad2 } from '@/lib/utils'

// One static alt: generateImageMetadata can't pass [slug] through a static export.
export const alt = getContent().seo.services.ogAlt
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const dynamic = 'force-static'

export function generateStaticParams() {
  return serviceSlugs().map((slug) => ({ slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { services } = getContent()
  const index = services.items.findIndex((s) => s.slug === slug)
  const service = services.items[index]
  return renderOg({
    eyebrow: fill(services.detail.serviceLabel, { number: pad2(index + 1) }),
    title: service?.name ?? services.index.hero.title,
  })
}
