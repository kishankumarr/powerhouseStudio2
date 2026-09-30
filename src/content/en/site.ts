import type { Content } from '../types'

export const site = {
  name: 'Powerhouse Studios',
  shortName: 'Powerhouse',
  legalName: 'Powerhouse Studios',
  url: 'https://powerhousestudios.in',
  tagline: 'We create. We connect. We build brands.',
  description:
    'Powerhouse Studios is a creative and production company built to help brands become more visible, more memorable and more impactful.',
  chain: ['Visibility', 'Trust', 'Growth'],
  mission: 'Strategy + Creativity + Production + Execution',
  locality: 'Mangaluru',
  region: 'Karnataka',
  countryCode: 'IN',
  areaServed: ['Mangaluru', 'Dakshina Kannada', 'Karnataka', 'India'],
  // Only what the brand profile states; add Kannada/Tulu once the client confirms.
  languages: ['English'],
  phone: { display: '80504 61707', e164: '+91-80504-61707', href: 'tel:+918050461707' },
  email: {
    display: 'team.powerhousestudios@gmail.com',
    href: 'mailto:team.powerhousestudios@gmail.com',
  },
  instagram: {
    handle: '@powerhousestudios.in',
    url: 'https://www.instagram.com/powerhousestudios.in/',
  },
  website: { display: 'powerhousestudios.in', url: 'https://powerhousestudios.in' },
  lastModified: '2026-09-30',
} satisfies Content['site']
