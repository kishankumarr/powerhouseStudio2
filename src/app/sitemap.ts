import type { MetadataRoute } from 'next'
import { ROUTES, servicePath } from '@/config/routes'
import { getContent, serviceSlugs } from '@/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const { site } = getContent()
  // A content constant, not new Date(): the sitemap shouldn't churn on every build.
  const lastModified = new Date(site.lastModified)
  const pages = ROUTES.filter((r) => r.sitemap).map((r) => ({
    url: new URL(r.path, site.url).toString(),
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
  const services = serviceSlugs().map((slug) => ({
    url: new URL(servicePath(slug), site.url).toString(),
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  return [...pages, ...services]
}
