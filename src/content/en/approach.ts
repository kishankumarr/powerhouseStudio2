import type { Content } from '../types'

export const approach = {
  hero: {
    eyebrow: 'Our approach',
    title: 'How we work: understand, create, produce, deliver',
    lead: 'Every project begins with understanding. Whether you already have a detailed brief or only have an idea, you can start a conversation with us.',
  },
  discovery: {
    eyebrow: 'Before anything else',
    title: 'Before creating anything, we want to understand:',
    questions: [
      'What is the brand?',
      'Who is the audience?',
      'What does the brand want to communicate?',
      'What is the objective?',
      'Where will the content be used?',
      'What does success look like for the project?',
    ],
    closing: 'From there, our process generally moves through four stages.',
  },
  stages: {
    eyebrow: 'The process',
    title: 'Four stages, one team',
    items: [
      {
        title: 'Understand',
        body: 'We understand the brand, requirement, audience and objective.',
      },
      {
        title: 'Create',
        body: 'We develop ideas, concepts, scripts, visuals and creative directions.',
      },
      {
        title: 'Produce',
        body: 'We bring the idea to life through production, shoots, events and content creation.',
      },
      {
        title: 'Deliver',
        body: 'We edit, refine and prepare the final content for the required platforms and purposes.',
      },
    ],
  },
  difference: {
    eyebrow: 'The Powerhouse difference',
    title: 'We are not here to simply produce another reel.',
    opening: [
      'We are here to understand what the brand needs and build the right creative solution around it.',
    ],
    sometimes: [
      'Sometimes that means one video.',
      'Sometimes it means an entire campaign.',
      "Sometimes it means managing a brand's social media every month.",
      'Sometimes it means producing an event from the ground up.',
      'And sometimes it means simply helping a business figure out what it should communicate next.',
    ],
    closing: [
      'The requirement may change.',
      'The approach remains the same — understand, create, execute and build.',
    ],
  },
  engage: {
    eyebrow: 'Working with Powerhouse',
    title: 'You may approach us for:',
    items: [
      {
        title: 'A single project',
        body: 'A video, shoot, event, campaign or editing requirement.',
      },
      {
        title: 'Ongoing content',
        body: 'Regular social media and content production for your brand.',
      },
      {
        title: 'A campaign',
        body: 'A complete creative campaign requiring multiple formats and deliverables.',
      },
      { title: 'An event', body: 'Planning, production, management and coverage.' },
      {
        title: 'A complete creative partner',
        body: 'A long-term relationship covering multiple creative and production requirements.',
      },
    ],
    closing: 'We adapt our involvement according to what your brand needs.',
  },
  audiences: {
    brands: {
      id: 'brands',
      title: 'For Businesses & Brands',
      paragraphs: [
        'Your business already has a story.',
        'Our job is to help you tell it better.',
        'Whether you are launching a new brand, expanding an existing business, introducing a product, running a campaign or simply looking to improve your digital presence, Powerhouse can help you build the content and communication around it.',
      ],
    },
    creators: {
      id: 'creators',
      title: 'For Creators',
      paragraphs: [
        'Creators need more than a camera.',
        'They need a creative environment, production support and content that keeps up with their ideas.',
      ],
      listIntro: 'Powerhouse can support creators with:',
      list: [
        'Studio access',
        'Video production',
        'Podcast production',
        'Video editing',
        'Reels',
        'YouTube content',
        'Photography',
        'Creative assistance',
        'Content production',
      ],
      closing: 'We provide the production support so creators can focus on creating.',
    },
    events: {
      id: 'events',
      title: 'For Events',
      paragraphs: [
        'An event should be experienced, not just organised.',
        'Powerhouse brings together event management, production, creative execution and event coverage to create experiences that people remember.',
        'From the first planning conversation to the final highlight video, our team can be involved throughout the journey.',
      ],
    },
  },
} satisfies Content['approach']
