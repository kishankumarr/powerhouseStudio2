import type { MetadataRoute } from 'next'
import { routePath } from '@/config/routes'
import { getContent } from '@/content'

export default function robots(): MetadataRoute.Robots {
  const { site } = getContent()
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: [routePath('config')] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
