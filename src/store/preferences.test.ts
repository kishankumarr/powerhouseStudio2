// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { PREFS_STORAGE_KEY, PRESETS } from '@/config/themes'
import {
  applyPreset,
  defaultPreferences,
  preferencesSlice,
  readBootPreferences,
  resetPreferences,
  selectPreset,
  selectTheme,
  setLayout,
  setTheme,
} from './slices/preferences-slice'
import { makeStore } from './store'

const reducer = preferencesSlice.reducer

describe('preferences slice', () => {
  it('applies a preset to all three axes', () => {
    const s = reducer(defaultPreferences, applyPreset('daylight'))
    expect(s).toEqual({ preset: 'daylight', ...PRESETS.daylight })
  })

  it('ignores ids that are not in the registry', () => {
    expect(reducer(defaultPreferences, applyPreset('signal'))).toEqual(defaultPreferences)
    expect(reducer(defaultPreferences, setTheme('purple'))).toEqual(defaultPreferences)
  })

  it('marks a single-axis change as custom, and back to a preset when it matches', () => {
    const custom = reducer(defaultPreferences, setLayout('blocks'))
    expect(custom.preset).toBe('custom')
    expect(reducer(custom, setLayout(PRESETS.noir.layout)).preset).toBe('noir')
  })

  it('resets to the default preset', () => {
    const s = reducer(reducer(defaultPreferences, applyPreset('daylight')), resetPreferences())
    expect(s).toEqual(defaultPreferences)
  })
})

describe('persistence', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
    window.history.replaceState(null, '', '/?preset=noir')
  })

  it('writes <html> attributes and localStorage, and drops a used ?preset= param', () => {
    const store = makeStore()
    store.dispatch(applyPreset('daylight'))
    const root = document.documentElement
    expect(root.dataset.theme).toBe('daylight')
    expect(root.dataset.layout).toBe('editorial')
    expect(root.dataset.style).toBe('rounded')
    expect(JSON.parse(localStorage.getItem(PREFS_STORAGE_KEY) ?? '{}')).toMatchObject({
      preset: 'daylight',
      theme: 'daylight',
      v: 1,
    })
    expect(window.location.search).toBe('')
    expect(selectPreset(store.getState())).toBe('daylight')
    expect(selectTheme(store.getState())).toBe('daylight')
  })

  it('boots from the attributes the pre-paint script applied', () => {
    const root = document.documentElement
    root.dataset.theme = 'daylight'
    root.dataset.layout = 'blocks'
    root.dataset.style = 'sharp'
    expect(readBootPreferences()).toEqual({
      preset: 'custom',
      theme: 'daylight',
      layout: 'blocks',
      style: 'sharp',
    })
    root.dataset.theme = 'signal'
    expect(readBootPreferences().theme).toBe(defaultPreferences.theme)
  })
})
