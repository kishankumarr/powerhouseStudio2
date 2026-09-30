import { getContent } from '@/content'
import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from '@/lib/og/render-og'

export const alt = getContent().seo.work.ogAlt
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  const c = getContent()
  return renderOg({ eyebrow: c.work.hero.eyebrow, title: c.work.hero.title })
}
