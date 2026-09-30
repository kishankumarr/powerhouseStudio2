import type { Content } from '../types'

const slot = { placeholder: true, note: 'Awaiting client input' } as const

export const work = {
  hero: {
    eyebrow: 'Our work',
    title: 'Different brands. Different stories. One Powerhouse approach.',
    lead: 'At Powerhouse, every project is an opportunity to create something meaningful. Our portfolio reflects different industries, different audiences and different creative challenges.',
  },
  industries: {
    eyebrow: 'Industries',
    title: 'We work across',
    items: [
      'Retail',
      'Restaurants',
      'Hospitality',
      'Healthcare',
      'Education',
      'Real estate',
      'Fitness',
      'Lifestyle',
      'Fashion',
      'Automotive',
      'Corporate brands',
      'Events',
      'Personal brands',
      'Creators',
      'Startups',
      'Local businesses',
    ],
  },
  portfolio: {
    eyebrow: 'Selected projects',
    title: 'Case studies in the edit',
    lead: 'We are preparing selected projects to share here. In the meantime, ask us about work relevant to your industry.',
    slots: [slot, slot, slot, slot, slot, slot],
    slotLabel: 'Project {number}',
    comingSoon: 'Coming soon',
  },
  closing: 'Different brands. Different stories. One Powerhouse approach.',
} satisfies Content['work']
