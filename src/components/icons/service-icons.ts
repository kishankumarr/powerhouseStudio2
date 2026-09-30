import type { ServiceSlug } from '@/content/types'
import { IconCampaign } from './icon-campaign'
import { IconEdit } from './icon-edit'
import { IconLive } from './icon-live'
import { IconPhoto } from './icon-photo'
import { IconSocial } from './icon-social'
import { IconStage } from './icon-stage'
import { IconStudio } from './icon-studio'
import { IconVideo } from './icon-video'

export const SERVICE_ICONS = {
  'social-media-management': IconSocial,
  'video-production': IconVideo,
  'video-editing': IconEdit,
  photography: IconPhoto,
  'event-management': IconStage,
  'event-coverage': IconLive,
  'studio-rentals': IconStudio,
  'brand-campaigns': IconCampaign,
} as const satisfies Record<ServiceSlug, unknown>
