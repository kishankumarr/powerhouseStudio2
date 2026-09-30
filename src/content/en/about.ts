import type { Content } from '../types'

export const about = {
  hero: {
    eyebrow: 'About Powerhouse',
    title: 'A creative and production studio from Mangaluru',
    lead: 'Powerhouse Studios is a creative and production company built to help brands become more visible, more memorable and more impactful.',
  },
  story: {
    eyebrow: 'About Powerhouse Studios',
    paragraphs: [
      'We work with businesses, brands, creators and organisations to develop content, manage digital presence, produce videos, execute events and create experiences that connect with people.',
      'From an idea on paper to the final piece of content, from a social media campaign to a large-scale event, Powerhouse brings together creative thinking, production expertise and execution under one roof.',
      'We believe that great content is not just about looking good. It should have a purpose. It should communicate something clearly, create attention, build trust and ultimately help a brand grow.',
      'Whether it is a brand film, a social media reel, a product shoot, an event, a campaign or a complete digital presence, we focus on creating work that represents the brand and speaks to its audience.',
    ],
    promiseLine: 'Our approach is simple: we create. We connect. We build brands.',
  },
  who: {
    eyebrow: 'Who we are',
    title: 'A growing creative studio in Mangaluru, Karnataka',
    paragraphs: [
      'Powerhouse Studios is a growing creative studio based in Mangaluru, Karnataka, working with brands and businesses across different industries.',
    ],
    disciplinesIntro: 'We bring together people from different creative disciplines including:',
    disciplines: [
      'Creative strategy',
      'Content creation',
      'Social media',
      'Video production',
      'Video editing',
      'Photography',
      'Event management',
      'Event production',
      'Event coverage',
      'Studio production',
      'Digital campaigns',
      'Brand communication',
    ],
    closing: [
      'Instead of treating these as completely separate services, we bring them together to create a more connected brand experience.',
      'A client may come to us looking for social media management and eventually need a campaign, video production, event coverage or a complete content strategy.',
      'Our role is to understand the bigger picture and build the right creative solution around it.',
    ],
  },
  beliefs: {
    eyebrow: 'What we believe',
    title: 'Visibility creates opportunity.',
    items: [
      {
        title: 'Visibility creates opportunity.',
        body: "A good business can exist without being visible, but it becomes much harder to grow when people don't know it exists. We believe that consistent and meaningful communication helps brands become visible.",
      },
      {
        title: 'Visibility builds trust.',
        body: 'When people repeatedly see a brand, understand what it stands for and experience its communication consistently, familiarity begins to develop.',
      },
      {
        title: 'Trust supports business growth.',
        body: 'Our work is designed to help brands communicate better, stay relevant and build stronger relationships with their audience.',
      },
    ],
    chain: 'Visibility → Trust → Growth',
    closing: 'That is the thinking behind Powerhouse.',
  },
  philosophy: {
    eyebrow: 'Our philosophy',
    title: 'Every piece of communication should have a reason.',
    lines: ["We don't believe in creating content just for the sake of creating content."],
    listIntro: 'It could be to:',
    reasons: [
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
    closing: 'We combine creativity with purpose to make content that works for the brand.',
  },
  team: {
    eyebrow: 'Our team',
    title: 'We believe in collaboration.',
    paragraphs: [
      'Powerhouse is built around a team of creative thinkers, producers, editors, strategists and execution specialists.',
      'Our team combines different skills because modern brand building requires more than one discipline.',
      'A strong idea can come from anywhere, and the best work happens when creative, production and strategy work together.',
    ],
  },
  founders: {
    eyebrow: 'Our founders',
    title: 'Built by creators who understand audiences',
    people: [
      {
        name: 'Sharan Chilimbi',
        initials: 'SC',
        role: 'Co-Founder | Creative & Content',
        bio: [
          'Sharan is a Tulu creator, influencer, host, actor, dancer and YouTuber known for building strong connections with audiences through entertainment and digital content.',
          'His experience as a creator and performer brings a strong understanding of audience behaviour, storytelling and content creation to Powerhouse Studios.',
          'Through his creative work and entrepreneurial journey, Sharan focuses on developing content that feels authentic, engaging and culturally relevant.',
        ],
      },
      {
        name: 'Shravan Rajani',
        initials: 'SR',
        role: 'Co-Founder | Digital & Creative Strategy',
        alias: 'Known as Shravan Bro',
        bio: [
          'Shravan brings together digital thinking, creative strategy and entrepreneurial experience.',
          'Known as Shravan Bro, he is a fitness creator and entrepreneur with an understanding of digital audiences, personal branding and content-led growth.',
          'At Powerhouse, he focuses on strategy, digital direction and building creative solutions that connect business objectives with audience communication.',
        ],
      },
    ],
    photoNote: 'Founder portraits coming soon',
  },
  vision: {
    eyebrow: 'Our vision',
    title: 'From Mangaluru, for audiences beyond the region',
    paragraphs: [
      'To build Powerhouse Studios into a leading creative and production company from Mangaluru, creating work that reaches audiences beyond the region.',
      'We want to build a creative ecosystem where brands, businesses, creators and communities can come together to create meaningful work.',
    ],
  },
  mission: {
    eyebrow: 'Our mission',
    title: 'Helping brands communicate better',
    statement: 'To help brands communicate better through creativity, content and experiences.',
    formulaIntro: 'We aim to combine:',
    formula: ['Strategy', 'Creativity', 'Production', 'Execution'],
    closing: 'to create work that helps businesses become more visible, build trust and grow.',
  },
  promise: {
    eyebrow: 'Our brand promise',
    title: 'We create. We connect. We build brands.',
    lines: [
      { title: 'We create.', body: 'We create content that captures attention.' },
      { title: 'We connect.', body: 'We connect brands with people.' },
      { title: 'We build brands.', body: 'We build communication that creates long-term value.' },
    ],
  },
  note: {
    eyebrow: 'A note from Powerhouse',
    title: 'Every brand has something worth saying.',
    lines: [
      'Sometimes it is a story.',
      'Sometimes it is a product.',
      'Sometimes it is a person.',
      'Sometimes it is an experience.',
    ],
    closing: [
      'Our job is to find that story, shape it and bring it to life.',
      'We believe good creative work should not simply fill a feed or produce a moment of attention. It should help people understand a brand, remember it and connect with it.',
      "That's what Powerhouse is built to do.",
    ],
  },
} satisfies Content['about']
