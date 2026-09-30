import type { Content } from '../types'

export const faq = {
  hero: {
    eyebrow: 'FAQ',
    title: 'Frequently asked questions',
    lead: 'Straight answers about what Powerhouse Studios does, who we work with and how projects run.',
  },
  items: [
    {
      id: 'what',
      question: 'What does Powerhouse Studios do?',
      answer:
        'Powerhouse Studios is a creative and production company offering social media management, video production, video editing, photography, event management, event production, event coverage, studio rentals and campaign content.',
    },
    {
      id: 'size',
      question: 'Do you work only with large brands?',
      answer:
        'No. We work with businesses of different sizes, including startups, local businesses, established brands, creators and organisations.',
    },
    {
      id: 'entire',
      question: 'Can Powerhouse handle an entire project?',
      answer:
        'Yes. Depending on the requirement, Powerhouse can manage projects from creative planning through production, editing and final delivery.',
    },
    {
      id: 'social',
      question: 'Do you provide social media management?',
      answer:
        'Yes. Our social media services can include strategy, content planning, reels, posters, stories, publishing, community management and performance tracking.',
    },
    {
      id: 'events',
      question: 'Do you provide event management?',
      answer:
        'Yes. We provide end-to-end event management and production solutions, including planning, décor, sound, lighting, entertainment coordination, on-ground execution and event coverage.',
    },
    {
      id: 'footage',
      question: 'Can you edit videos using footage provided by the client?',
      answer:
        'Yes. We can work with client-provided footage for video editing projects, depending on the requirement.',
    },
    {
      id: 'studio',
      question: 'Do you provide studio space?',
      answer:
        'Yes. Powerhouse Studios offers studio facilities for content production, photography, video shoots, interviews, podcasts and creator content.',
    },
    {
      id: 'outside',
      question: 'Do you work outside Mangaluru?',
      answer:
        'Yes. Projects can be undertaken outside Mangaluru depending on the scope, production requirements and location.',
    },
  ],
  ctaTitle: 'Still have a question?',
  ctaBody: "Have a project in mind? Let's talk.",
} satisfies Content['faq']
