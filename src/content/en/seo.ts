import type { Content } from '../types'

/** Titles ≤ 60 chars including the " | Powerhouse Studios" template; descriptions 140–160 chars. */
export const seo = {
  home: {
    title: 'Powerhouse Studios — Creative Studio in Mangaluru',
    description:
      'Creative and production studio in Mangaluru, Karnataka: social media, video production, editing, photography, events, studio rental and brand campaigns.',
    keywords: [
      'creative studio Mangaluru',
      'video production Mangaluru',
      'social media management Mangaluru',
      'event management Mangaluru',
      'studio rental Mangaluru',
    ],
    ogAlt: 'Powerhouse Studios: We create. We connect. We build brands.',
  },
  about: {
    title: 'About Us — Creative Studio in Mangaluru',
    description:
      'Meet Powerhouse Studios, a creative and production company from Mangaluru founded by Sharan Chilimbi and Shravan Rajani to help brands grow through content.',
    keywords: ['creative studio Mangaluru', 'Sharan Chilimbi', 'Shravan Rajani', 'Tulu content'],
    ogAlt: 'About Powerhouse Studios, Mangaluru',
  },
  services: {
    title: 'Services — Video, Social Media & Events',
    description:
      'Eight connected services from one Mangaluru studio: social media, video production, editing, photography, events, coverage, studio rental and campaigns.',
    keywords: [
      'video production Mangaluru',
      'social media management',
      'event coverage',
      'brand film',
    ],
    ogAlt: 'Services from Powerhouse Studios',
  },
  work: {
    title: 'Our Work — Industries We Create For',
    description:
      'Powerhouse Studios creates content for retail, restaurants, hospitality, healthcare, education, real estate, fitness, fashion, creators and local businesses.',
    keywords: ['creative agency Mangaluru', 'brand content', 'Dakshina Kannada businesses'],
    ogAlt: 'Different brands. Different stories. One Powerhouse approach.',
  },
  approach: {
    title: 'How We Work — Our Creative Process',
    description:
      'How Powerhouse Studios works: every project begins with understanding, then moves through create, produce and deliver, for brands, creators and events.',
    keywords: ['creative process', 'content strategy Mangaluru', 'event production'],
    ogAlt: 'The Powerhouse approach: Understand, Create, Produce, Deliver',
  },
  faq: {
    title: 'FAQ — Powerhouse Studios, Mangaluru',
    description:
      'Answers about Powerhouse Studios: services, working with small and large brands, full projects, client footage, studio space and projects outside Mangaluru.',
    keywords: ['Powerhouse Studios FAQ', 'studio rental Mangaluru', 'event management Mangaluru'],
    ogAlt: 'Frequently asked questions about Powerhouse Studios',
  },
  contact: {
    title: 'Contact — Start a Project in Mangaluru',
    description:
      "Have a project in mind? Let's talk. Contact Powerhouse Studios in Mangaluru by phone on 80504 61707, by email, or on Instagram at @powerhousestudios.in.",
    keywords: ['contact Powerhouse Studios', 'creative studio Mangaluru', 'video production quote'],
    ogAlt: 'Contact Powerhouse Studios, Mangaluru',
  },
  config: {
    title: 'Configurator',
    description:
      'Preview the three design directions for the Powerhouse Studios website and choose a colour, layout and style combination. This page is not indexed by search.',
    keywords: [],
    ogAlt: 'Powerhouse Studios design configurator',
  },
} satisfies Content['seo']
