import type { MetadataRoute } from 'next'
import { DEFAULT_PRESET, PRESETS, THEME_COLOR } from '@/config/themes'
import { getContent } from '@/content'

export default function manifest(): MetadataRoute.Manifest {
  const { site } = getContent()
  const color = THEME_COLOR[PRESETS[DEFAULT_PRESET].theme]
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: color,
    theme_color: color,
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/brand/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
