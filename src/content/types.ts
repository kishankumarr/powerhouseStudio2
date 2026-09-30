/**
 * The shape every locale dictionary must satisfy. Add a key here first; a missing
 * key in any locale then becomes a compile error.
 */
import type { LayoutId, PresetId, StyleId, ThemeId } from '@/config/themes'
import type { ImageKey } from '@/constants/images'

export type ServiceSlug =
  | 'social-media-management'
  | 'video-production'
  | 'video-editing'
  | 'photography'
  | 'event-management'
  | 'event-coverage'
  | 'studio-rentals'
  | 'brand-campaigns'

export type FaqId =
  'what' | 'size' | 'entire' | 'social' | 'events' | 'footage' | 'studio' | 'outside'

export type RouteKey =
  'home' | 'about' | 'services' | 'work' | 'approach' | 'faq' | 'contact' | 'config'

export type SeoEntry = {
  title: string
  description: string
  keywords: string[]
  ogAlt: string
}

export type Link = { label: string; href: string }
export type Titled = { title: string; body: string }
export type SectionIntro = { eyebrow: string; title: string; lead?: string }
export type Faq = { id: FaqId; question: string; answer: string }

export type Service = {
  slug: ServiceSlug
  name: string
  shortName: string
  summary: string
  intro: string[]
  capabilitiesIntro: string
  capabilities: string[]
  body: string[]
  outcome: string
  related: ServiceSlug[]
  faqIds: FaqId[]
  image: ImageKey
  seo: SeoEntry
}

export type PortfolioSlot = { placeholder: true; note: string }

export type Content = {
  locale: { lang: string; ogLocale: string }
  site: {
    name: string
    shortName: string
    legalName: string
    url: string
    tagline: string
    description: string
    chain: string[]
    mission: string
    locality: string
    region: string
    countryCode: string
    areaServed: string[]
    languages: string[]
    phone: { display: string; e164: string; href: string }
    email: { display: string; href: string }
    instagram: { handle: string; url: string }
    website: { display: string; url: string }
    lastModified: string
  }
  common: {
    skipLink: string
    nav: Link[]
    navLabel: string
    footerNavLabel: string
    homeLabel: string
    logoLabel: string
    primaryCta: Link
    secondaryCta: Link
    menuOpen: string
    menuClose: string
    menuTitle: string
    external: string
    backToTop: string
    readMore: string
    viewService: string
    allServices: string
    breadcrumbLabel: string
    breadcrumbHome: string
    footer: {
      blurb: string
      exploreTitle: string
      servicesTitle: string
      contactTitle: string
      rights: string
      creditsTitle: string
      creditsNote: string
      creditLine: string
      location: string
      phoneLabel: string
      emailLabel: string
      instagramLabel: string
      signoff: string
    }
    hud: { rec: string; scene: string; take: string; location: string; live: string }
  }
  images: Record<ImageKey, string>
  seo: Record<RouteKey, SeoEntry>
  home: {
    hero: {
      kicker: string
      lines: string[]
      lead: string
      primary: Link
      secondary: Link
      scroll: string
      tapes: string[]
      stageLabel: string
    }
    reasons: { label: string; items: string[] }
    intro: { eyebrow: string; statement: string; body: string; link: Link }
    belief: SectionIntro & {
      items: { word: string; title: string; body: string }[]
      closing: string
    }
    services: SectionIntro & { link: Link }
    audiences: SectionIntro & {
      items: {
        id: 'brands' | 'creators' | 'events'
        name: string
        headline: string
        body: string
        link: Link
        image: ImageKey
      }[]
    }
    process: SectionIntro & {
      steps: Titled[]
      link: Link
      trackVideo: string
      trackAudio: string
      playhead: string
    }
    why: SectionIntro & { items: Titled[] }
    industries: SectionIntro & { link: Link }
    cta: {
      eyebrow: string
      title: string
      body: string
      primary: Link
      callLabel: string
      emailLabel: string
      instagramLabel: string
    }
  }
  about: {
    hero: { eyebrow: string; title: string; lead: string }
    story: { eyebrow: string; paragraphs: string[]; promiseLine: string }
    who: SectionIntro & {
      paragraphs: string[]
      disciplinesIntro: string
      disciplines: string[]
      closing: string[]
    }
    beliefs: SectionIntro & { items: Titled[]; chain: string; closing: string }
    philosophy: SectionIntro & {
      lines: string[]
      listIntro: string
      reasons: string[]
      closing: string
    }
    team: SectionIntro & { paragraphs: string[] }
    founders: SectionIntro & {
      people: { name: string; initials: string; role: string; alias?: string; bio: string[] }[]
      photoNote: string
    }
    vision: SectionIntro & { paragraphs: string[] }
    mission: SectionIntro & {
      statement: string
      formulaIntro: string
      formula: string[]
      closing: string
    }
    promise: SectionIntro & { lines: Titled[] }
    note: SectionIntro & { lines: string[]; closing: string[] }
  }
  services: {
    index: {
      hero: { eyebrow: string; title: string; lead: string }
      listTitle: string
      closing: string
    }
    detail: {
      capabilitiesTitle: string
      relatedTitle: string
      faqTitle: string
      ctaTitle: string
      ctaBody: string
      backToServices: string
      serviceLabel: string
    }
    items: Service[]
  }
  work: {
    hero: { eyebrow: string; title: string; lead: string }
    industries: SectionIntro & { items: string[] }
    portfolio: SectionIntro & { slots: PortfolioSlot[]; slotLabel: string; comingSoon: string }
    closing: string
  }
  approach: {
    hero: { eyebrow: string; title: string; lead: string }
    discovery: SectionIntro & { questions: string[]; closing: string }
    stages: SectionIntro & { items: Titled[] }
    difference: SectionIntro & { opening: string[]; sometimes: string[]; closing: string[] }
    engage: SectionIntro & { items: Titled[]; closing: string }
    audiences: {
      brands: { id: 'brands'; title: string; paragraphs: string[] }
      creators: {
        id: 'creators'
        title: string
        paragraphs: string[]
        listIntro: string
        list: string[]
        closing: string
      }
      events: { id: 'events'; title: string; paragraphs: string[] }
    }
  }
  faq: {
    hero: { eyebrow: string; title: string; lead: string }
    items: Faq[]
    ctaTitle: string
    ctaBody: string
  }
  contact: {
    hero: { eyebrow: string; title: string; lead: string }
    details: {
      title: string
      locationLabel: string
      phoneLabel: string
      emailLabel: string
      instagramLabel: string
      websiteLabel: string
    }
    form: {
      title: string
      intro: string
      name: string
      email: string
      phone: string
      company: string
      services: string
      engagement: string
      engagementPlaceholder: string
      engagementOptions: string[]
      message: string
      messagePlaceholder: string
      optional: string
      required: string
      submit: string
      submitNote: string
      success: string
      errors: { name: string; email: string; message: string; summary: string }
      mail: {
        subject: string
        greeting: string
        nameLine: string
        emailLine: string
        phoneLine: string
        companyLine: string
        servicesLine: string
        engagementLine: string
        messageLine: string
        none: string
      }
    }
    signoff: string
  }
  config: {
    presets: Record<PresetId, { name: string; tagline: string; description: string }>
    axes: {
      theme: { label: string; options: Record<ThemeId, { name: string; description: string }> }
      layout: { label: string; options: Record<LayoutId, { name: string; description: string }> }
      style: { label: string; options: Record<StyleId, { name: string; description: string }> }
    }
    dock: {
      open: string
      close: string
      title: string
      subtitle: string
      fineTune: string
      reset: string
      openConfig: string
      custom: string
      current: string
    }
    page: {
      eyebrow: string
      title: string
      lead: string
      presetsTitle: string
      fineTuneTitle: string
      fineTuneLead: string
      apply: string
      applied: string
      viewSite: string
      reset: string
      shareTitle: string
      shareLead: string
      copy: string
      copied: string
      previewHeadline: string
      previewBody: string
      previewButton: string
      previewCard: string
    }
  }
  notFound: { code: string; title: string; body: string; home: Link; services: Link }
}
