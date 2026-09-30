import { getContent, getService, serviceSlugs } from '@/content'
import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from '@/lib/og/render-og'
import { fill, pad2 } from '@/lib/utils'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  return serviceSlugs().map((slug) => ({ slug }))
}

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
  const service = getService(params.slug)
  return [
    {
      id: 'og',
      alt: service?.seo.ogAlt ?? getContent().seo.services.ogAlt,
      size: OG_SIZE,
      contentType: OG_CONTENT_TYPE,
    },
  ]
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
