/**
 * Theme registry: the single source of valid ids for the design axes.
 * Two colour directions (noir, daylight); layout and style keep three options each.
 * Shared by the pre-paint boot script, the preferences slice, the theme dock,
 * /config and the tests. Labels live in content (content.config).
 */

export const THEME_IDS = ['noir', 'daylight'] as const
export const LAYOUT_IDS = ['cinematic', 'editorial', 'blocks'] as const
export const STYLE_IDS = ['sharp', 'rounded', 'condensed'] as const
export const PRESET_IDS = ['noir', 'daylight'] as const

export type ThemeId = (typeof THEME_IDS)[number]
export type LayoutId = (typeof LAYOUT_IDS)[number]
export type StyleId = (typeof STYLE_IDS)[number]
export type PresetId = (typeof PRESET_IDS)[number]

export type Axes = { theme: ThemeId; layout: LayoutId; style: StyleId }

export const PRESETS = {
  noir: { theme: 'noir', layout: 'cinematic', style: 'sharp' },
  daylight: { theme: 'daylight', layout: 'editorial', style: 'rounded' },
} as const satisfies Record<PresetId, Axes>

export const DEFAULT_PRESET: PresetId = 'noir'

/** Swatches used by the theme dock and /config preset cards (bg, ink, accent). */
export const PRESET_SWATCHES = {
  noir: ['#000000', '#F5F4EE', '#FEED01'],
  daylight: ['#FAFAF7', '#0A0A0A', '#FEED01'],
} as const satisfies Record<PresetId, readonly [string, string, string]>

/** Browser chrome colour per theme (meta theme-color). */
export const THEME_COLOR = {
  noir: '#000000',
  daylight: '#FAFAF7',
} as const satisfies Record<ThemeId, string>

export const PREFS_STORAGE_KEY = 'ph-prefs'
export const PREFS_VERSION = 1
export const PRESET_QUERY_PARAM = 'preset'

export const isThemeId = (v: unknown): v is ThemeId =>
  typeof v === 'string' && (THEME_IDS as readonly string[]).includes(v)
export const isLayoutId = (v: unknown): v is LayoutId =>
  typeof v === 'string' && (LAYOUT_IDS as readonly string[]).includes(v)
export const isStyleId = (v: unknown): v is StyleId =>
  typeof v === 'string' && (STYLE_IDS as readonly string[]).includes(v)
export const isPresetId = (v: unknown): v is PresetId =>
  typeof v === 'string' && (PRESET_IDS as readonly string[]).includes(v)

/** The preset whose axes exactly match, or 'custom'. */
export function matchPreset(axes: Axes): PresetId | 'custom' {
  for (const id of PRESET_IDS) {
    const p = PRESETS[id]
    if (p.theme === axes.theme && p.layout === axes.layout && p.style === axes.style) return id
  }
  return 'custom'
}
