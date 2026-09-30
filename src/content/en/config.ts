import type { Content } from '../types'

export const config = {
  presets: {
    noir: {
      name: 'Studio Noir',
      tagline: 'Night shoot. Premium. Cinematic.',
      description:
        'A black stage with yellow as the key light, film grain, full-bleed type and sharp cut corners.',
    },
    daylight: {
      name: 'Daylight Edit',
      tagline: 'Clean. Credible. Corporate-friendly.',
      description:
        'Paper-white surfaces, black ink and yellow used like a highlighter, in an editorial grid.',
    },
  },
  axes: {
    theme: {
      label: 'Colour',
      options: {
        noir: { name: 'Noir', description: 'Black stage, yellow light' },
        daylight: { name: 'Daylight', description: 'Paper white, black ink' },
      },
    },
    layout: {
      label: 'Layout',
      options: {
        cinematic: { name: 'Cinematic', description: 'Full-bleed, big type' },
        editorial: { name: 'Editorial', description: 'Asymmetric grid, whitespace' },
        blocks: { name: 'Blocks', description: 'Stacked bands, bold rules' },
      },
    },
    style: {
      label: 'Style',
      options: {
        sharp: { name: 'Sharp', description: 'Cut corners, uppercase' },
        rounded: { name: 'Rounded', description: 'Soft radius, sentence case' },
        condensed: { name: 'Condensed', description: 'Tall type, heavy rules' },
      },
    },
  },
  dock: {
    open: 'Change the look',
    close: 'Close the look picker',
    title: 'Choose a look',
    subtitle: 'Two directions for Powerhouse. Your choice is remembered on this device.',
    fineTune: 'Fine-tune',
    reset: 'Reset',
    openConfig: 'Open the configurator',
    custom: 'Custom mix',
    current: 'Current',
  },
  page: {
    eyebrow: 'Configurator',
    title: 'Pick the look for Powerhouse',
    lead: 'Two complete design directions built on the same content. Choose a preset, or fine-tune colour, layout and style independently.',
    presetsTitle: 'Presets',
    fineTuneTitle: 'Fine-tune',
    fineTuneLead: 'Mix any colour, layout and style. The whole site updates instantly.',
    apply: 'Apply',
    applied: 'Applied',
    viewSite: 'View the site',
    reset: 'Reset to default',
    shareTitle: 'Share a direction',
    shareLead: 'Send one of these links to open the site in a specific preset.',
    copy: 'Copy link',
    copied: 'Copied',
    previewHeadline: 'We build brands.',
    previewBody: 'Creative thinking, production expertise and execution under one roof.',
    previewButton: 'Start a project',
    previewCard: 'Video Production',
  },
} satisfies Content['config']
