import type { Content } from '../types'

export const contact = {
  hero: {
    eyebrow: 'Contact',
    title: "Have a project in mind? Let's talk.",
    lead: "Whether you need social media management, video production, editing, photography, event management, event coverage, studio facilities or a complete creative solution, we'd love to understand what you're building.",
  },
  details: {
    title: 'Powerhouse Studios',
    locationLabel: 'Location',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    instagramLabel: 'Instagram',
    websiteLabel: 'Website',
  },
  form: {
    title: 'Start a conversation',
    intro:
      'Whether you already have a detailed brief or only have an idea, tell us a little about it.',
    name: 'Your name',
    email: 'Email',
    phone: 'Phone',
    company: 'Brand or company',
    services: 'What do you need?',
    engagement: 'How would you like to work with us?',
    engagementPlaceholder: 'Choose one',
    engagementOptions: [
      'A single project',
      'Ongoing content',
      'A campaign',
      'An event',
      'A complete creative partner',
      'Not sure yet',
    ],
    message: 'Tell us about the project',
    messagePlaceholder: 'The brand, the audience, what you want to communicate, and any dates…',
    optional: '(optional)',
    required: '(required)',
    submit: 'Compose email',
    submitNote:
      'This opens your email app with your message ready to send to team.powerhousestudios@gmail.com.',
    success: 'Your email app should now be open with the message ready. Just press send.',
    errors: {
      name: 'Please tell us your name.',
      email: 'Please enter a valid email address.',
      message: 'Please add a few words about the project.',
      summary: 'Please check the highlighted fields.',
    },
    mail: {
      subject: 'Project enquiry from {name}',
      greeting: 'Hello Powerhouse Studios,',
      nameLine: 'Name: {value}',
      emailLine: 'Email: {value}',
      phoneLine: 'Phone: {value}',
      companyLine: 'Brand / company: {value}',
      servicesLine: 'Interested in: {value}',
      engagementLine: 'Engagement: {value}',
      messageLine: 'About the project:',
      none: 'Not specified',
    },
  },
  signoff: "Let's create something powerful.",
} satisfies Content['contact']
