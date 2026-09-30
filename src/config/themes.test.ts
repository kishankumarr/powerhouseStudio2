import { describe, expect, it } from 'vitest'
import { buildPrefsBootScript } from '@/lib/prefs-boot-script'
import {
  DEFAULT_PRESET,
  LAYOUT_IDS,
  PRESET_IDS,
  PRESETS,
  STYLE_IDS,
  THEME_COLOR,
  THEME_IDS,
  matchPreset,
} from './themes'

describe('theme registry', () => {
  it('offers exactly two colour directions', () => {
    expect([...THEME_IDS]).toEqual(['noir', 'daylight'])
    expect([...PRESET_IDS]).toEqual(['noir', 'daylight'])
  })

  it('has presets that reference existing axis ids', () => {
    for (const id of PRESET_IDS) {
      const p = PRESETS[id]
      expect(THEME_IDS).toContain(p.theme)
      expect(LAYOUT_IDS).toContain(p.layout)
      expect(STYLE_IDS).toContain(p.style)
    }
    expect(PRESET_IDS).toContain(DEFAULT_PRESET)
  })

  it('has a browser chrome colour for every theme', () => {
    for (const t of THEME_IDS) expect(THEME_COLOR[t]).toMatch(/^#[0-9A-F]{6}$/i)
  })

  it('matches presets exactly and reports anything else as custom', () => {
    expect(matchPreset(PRESETS.noir)).toBe('noir')
    expect(matchPreset({ theme: 'noir', layout: 'blocks', style: 'sharp' })).toBe('custom')
  })

  it('builds the pre-paint script from the same registry (allow-lists cannot drift)', () => {
    const script = buildPrefsBootScript()
    const cfg = JSON.parse(script.slice(script.lastIndexOf('})(') + 3, -2)) as {
      ids: Record<string, string[]>
      def: string
    }
    expect(cfg.ids.theme).toEqual([...THEME_IDS])
    expect(cfg.ids.layout).toEqual([...LAYOUT_IDS])
    expect(cfg.ids.style).toEqual([...STYLE_IDS])
    expect(cfg.ids.preset).toEqual([...PRESET_IDS])
    expect(cfg.def).toBe(DEFAULT_PRESET)
  })
})
