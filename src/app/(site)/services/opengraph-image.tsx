import { getContent } from '@/content'
import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from '@/lib/og/render-og'

export const alt = getContent().seo.services.ogAlt
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const dynamic = 'force-static'

export default async function Image() {
  const c = getContent()
  return renderOg({ eyebrow: c.services.index.hero.eyebrow, title: c.services.index.hero.title })
}
