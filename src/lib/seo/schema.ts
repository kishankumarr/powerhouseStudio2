import type {
  AboutPage,
  BreadcrumbList,
  FAQPage,
  ItemList,
  Organization,
  ProfessionalService,
  Service,
  WebSite,
  WithContext,
} from 'schema-dts'
import { servicePath } from '@/config/routes'
import { getContent, type Content } from '@/content'
import type { Faq } from '@/content/types'

const c = () => getContent()
const orgId = () => `${c().site.url}/#organization`
const siteId = () => `${c().site.url}/#website`
const abs = (path: string) => new URL(path, c().site.url).toString()

const postalAddress = () => ({
  '@type': 'PostalAddress' as const,
  addressLocality: c().site.locality,
  addressRegion: c().site.region,
  addressCountry: c().site.countryCode,
})

export function organizationSchema(): WithContext<Organization> {
  const { site } = c()
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId(),
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: abs('/brand/icon-512.png'),
    slogan: site.tagline,
    description: site.description,
    email: site.email.display,
    telephone: site.phone.e164,
    address: postalAddress(),
    sameAs: [site.instagram.url],
    founder: c().about.founders.people.map((p) => ({
      '@type': 'Person' as const,
      name: p.name,
      jobTitle: p.role.split('|')[0]?.trim() ?? p.role,
    })),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: site.phone.e164,
      email: site.email.display,
      areaServed: site.areaServed,
      availableLanguage: site.languages,
    },
  }
}

export function websiteSchema(): WithContext<WebSite> {
  const { site, locale } = c()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': siteId(),
    url: site.url,
    name: site.name,
    inLanguage: locale.lang,
    publisher: { '@id': orgId() },
  }
}

export function localBusinessSchema(): WithContext<ProfessionalService> {
  const { site, services } = c()
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${site.url}/#studio`,
    name: site.name,
    url: site.url,
    image: abs('/brand/logo-full-1200.png'),
    logo: abs('/brand/icon-512.png'),
    description: site.description,
    telephone: site.phone.e164,
    email: site.email.display,
    address: postalAddress(),
    areaServed: site.areaServed.map((name) => ({ '@type': 'Place' as const, name })),
    parentOrganization: { '@id': orgId() },
    sameAs: [site.instagram.url],
    knowsAbout: services.items.map((s) => s.name),
  }
}

export function serviceListSchema(): WithContext<ItemList> {
  const { services } = c()
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.items.map((s, i) => ({
      '@type': 'ListItem' as const,
      position: i + 1,
      url: abs(servicePath(s.slug)),
      name: s.name,
    })),
  }
}

export function serviceSchema(service: Content['services']['items'][number]): WithContext<Service> {
  const { site } = c()
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${abs(servicePath(service.slug))}#service`,
    name: service.name,
    serviceType: service.name,
    description: service.seo.description,
    url: abs(servicePath(service.slug)),
    provider: { '@id': orgId() },
    areaServed: site.areaServed.map((name) => ({ '@type': 'Place' as const, name })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: service.name,
      itemListElement: service.capabilities.map((cap) => ({
        '@type': 'Offer' as const,
        itemOffered: { '@type': 'Service' as const, name: cap },
      })),
    },
  }
}

export function breadcrumbSchema(
  items: { name: string; path: string }[],
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem' as const,
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  }
}

export function faqSchema(faqs: Faq[]): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question' as const,
      name: f.question,
      acceptedAnswer: { '@type': 'Answer' as const, text: f.answer },
    })),
  }
}

export function aboutPageSchema(): WithContext<AboutPage> {
  const { site, about } = c()
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: abs('/about'),
    name: about.hero.title,
    about: { '@id': orgId() },
    isPartOf: { '@id': siteId() },
    mainEntity: {
      '@type': 'Organization',
      '@id': orgId(),
      name: site.name,
      founder: about.founders.people.map((p) => ({
        '@type': 'Person' as const,
        name: p.name,
        jobTitle: p.role.replace('|', '·'),
      })),
    },
  }
}
