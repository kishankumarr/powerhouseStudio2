import type { Content } from '../types'

export const home = {
  hero: {
    kicker: 'Creative & production studio · Mangaluru, Karnataka',
    lines: ['We create.', 'We connect.', 'We build brands.'],
    lead: 'From an idea on paper to the final piece of content, from a social media campaign to a large-scale event, Powerhouse brings together creative thinking, production expertise and execution under one roof.',
    primary: { label: 'Start a project', href: '/contact' },
    secondary: { label: 'Explore services', href: '/services' },
    scroll: 'Scroll',
    tapes: ['Brand films', 'Events', 'Podcasts'],
    stageLabel: 'Powerhouse Studios logo: a microphone and a video camera joined by one ribbon',
  },
  reasons: {
    label: 'Every piece of communication should have a reason',
    items: [
      'Introduce a brand',
      'Explain a product',
      'Educate an audience',
      'Build credibility',
      'Create awareness',
      'Generate conversations',
      'Showcase an experience',
      "Strengthen a brand's identity",
      'Document an important moment',
      'Entertain an audience',
      'Support a campaign',
      'Create long-term brand value',
    ],
  },
  intro: {
    eyebrow: 'About Powerhouse',
    statement:
      'Powerhouse Studios is a creative and production company built to help brands become more visible, more memorable and more impactful.',
    body: 'We work with businesses, brands, creators and organisations to develop content, manage digital presence, produce videos, execute events and create experiences that connect with people.',
    link: { label: 'Who we are', href: '/about' },
  },
  belief: {
    eyebrow: 'What we believe',
    title: 'The thinking behind Powerhouse',
    items: [
      {
        word: 'Visibility',
        title: 'Visibility creates opportunity.',
        body: "A good business can exist without being visible, but it becomes much harder to grow when people don't know it exists.",
      },
      {
        word: 'Trust',
        title: 'Visibility builds trust.',
        body: 'When people repeatedly see a brand, understand what it stands for and experience its communication consistently, familiarity begins to develop.',
      },
      {
        word: 'Growth',
        title: 'Trust supports business growth.',
        body: 'Our work is designed to help brands communicate better, stay relevant and build stronger relationships with their audience.',
      },
    ],
    closing: 'That is the thinking behind Powerhouse.',
  },
  services: {
    eyebrow: 'What we do',
    title: 'Eight services. One creative partner.',
    lead: 'Instead of treating these as completely separate services, we bring them together to create a more connected brand experience.',
    link: { label: 'All services', href: '/services' },
  },
  audiences: {
    eyebrow: 'Who we work with',
    title: 'For brands, creators and events',
    items: [
      {
        id: 'brands',
        name: 'Businesses & Brands',
        headline: 'Your business already has a story.',
        body: 'Our job is to help you tell it better.',
        link: { label: 'For businesses & brands', href: '/approach#brands' },
        image: 'audienceBrands',
      },
      {
        id: 'creators',
        name: 'Creators',
        headline: 'Creators need more than a camera.',
        body: 'We provide the production support so creators can focus on creating.',
        link: { label: 'For creators', href: '/approach#creators' },
        image: 'audienceCreators',
      },
      {
        id: 'events',
        name: 'Events',
        headline: 'An event should be experienced, not just organised.',
        body: 'From the first planning conversation to the final highlight video, our team can be involved throughout the journey.',
        link: { label: 'For events', href: '/approach#events' },
        image: 'audienceEvents',
      },
    ],
  },
  process: {
    eyebrow: 'Our approach',
    title: 'Every project begins with understanding.',
    lead: 'From there, our process generally moves through four stages.',
    steps: [
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
    link: { label: 'How we work', href: '/approach' },
    trackVideo: 'V1',
    trackAudio: 'A1',
    playhead: 'Playhead',
  },
  why: {
    eyebrow: 'Why Powerhouse Studios',
    title: 'One team across content, production and events.',
    items: [
      {
        title: 'One Creative Partner',
        body: 'Instead of managing multiple vendors for different requirements, brands can work with one team across content, production and events.',
      },
      {
        title: 'Creative + Execution',
        body: "We don't stop at ideas. We take ideas into production and deliver the final output.",
      },
      {
        title: 'Content That Has Purpose',
        body: 'We focus on why the content is being created, not just how it looks.',
      },
      {
        title: 'Flexible Production',
        body: 'Every brand has different requirements. We build our approach around the project instead of forcing every client into the same production model.',
      },
      {
        title: 'End-to-End Capability',
        body: 'From strategy and concepts to production, editing and final delivery, we can manage the complete creative process.',
      },
      {
        title: 'Local Understanding, Professional Production',
        body: 'Based in Mangaluru, we understand the local market while bringing a professional production mindset to every project.',
      },
    ],
  },
  industries: {
    eyebrow: 'Industries we work across',
    title: 'Different brands. Different stories. One Powerhouse approach.',
    lead: 'At Powerhouse, every project is an opportunity to create something meaningful.',
    link: { label: 'Our work', href: '/work' },
  },
  cta: {
    eyebrow: 'Have a project in mind?',
    title: "Let's create something powerful.",
    body: 'Whether you already have a detailed brief or only have an idea, you can start a conversation with us.',
    primary: { label: "Let's talk", href: '/contact' },
    callLabel: 'Call',
    emailLabel: 'Email',
    instagramLabel: 'Instagram',
  },
} satisfies Content['home']
