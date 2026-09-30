import type { RouteKey } from '@/content/types'

type RouteDef = {
  key: RouteKey
  path: `/${string}`
  sitemap: boolean
  priority: number
  changeFrequency: 'weekly' | 'monthly' | 'yearly'
}

/** Single source for routes: nav, sitemap, robots and tests read this. */
export const ROUTES = [
  { key: 'home', path: '/', sitemap: true, priority: 1, changeFrequency: 'monthly' },
  { key: 'about', path: '/about', sitemap: true, priority: 0.8, changeFrequency: 'monthly' },
  { key: 'services', path: '/services', sitemap: true, priority: 0.9, changeFrequency: 'monthly' },
  { key: 'work', path: '/work', sitemap: true, priority: 0.7, changeFrequency: 'monthly' },
  { key: 'approach', path: '/approach', sitemap: true, priority: 0.7, changeFrequency: 'yearly' },
  { key: 'faq', path: '/faq', sitemap: true, priority: 0.6, changeFrequency: 'yearly' },
  { key: 'contact', path: '/contact', sitemap: true, priority: 0.8, changeFrequency: 'yearly' },
  { key: 'config', path: '/config', sitemap: false, priority: 0, changeFrequency: 'yearly' },
] as const satisfies readonly RouteDef[]

export const servicePath = (slug: string) => `/services/${slug}` as const

export const routePath = (key: RouteKey) => ROUTES.find((r) => r.key === key)?.path ?? '/'
