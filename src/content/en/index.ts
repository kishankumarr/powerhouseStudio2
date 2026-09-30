import type { Content } from '../types'
import { about } from './about'
import { approach } from './approach'
import { common } from './common'
import { config } from './config'
import { contact } from './contact'
import { faq } from './faq'
import { home } from './home'
import { images } from './images'
import { notFound } from './not-found'
import { seo } from './seo'
import { services } from './services'
import { site } from './site'
import { work } from './work'

export const content = {
  locale: { lang: 'en-IN', ogLocale: 'en_IN' },
  site,
  common,
  images,
  seo,
  home,
  about,
  services,
  work,
  approach,
  faq,
  contact,
  config,
  notFound,
} satisfies Content
