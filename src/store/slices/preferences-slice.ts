import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  DEFAULT_PRESET,
  isLayoutId,
  isPresetId,
  isStyleId,
  isThemeId,
  matchPreset,
  PRESETS,
  type LayoutId,
  type PresetId,
  type StyleId,
  type ThemeId,
} from '@/config/themes'

export type PreferencesState = {
  preset: PresetId | 'custom'
  theme: ThemeId
  layout: LayoutId
  style: StyleId
}

export const defaultPreferences: PreferencesState = {
  preset: DEFAULT_PRESET,
  ...PRESETS[DEFAULT_PRESET],
}

/**
 * Initial state for the store. On the server this is the default preset; in the
 * browser it reads the data-* attributes the pre-paint script already applied.
 */
export function readBootPreferences(): PreferencesState {
  if (typeof document === 'undefined') return defaultPreferences
  const d = document.documentElement.dataset
  const theme = isThemeId(d.theme) ? d.theme : defaultPreferences.theme
  const layout = isLayoutId(d.layout) ? d.layout : defaultPreferences.layout
  const style = isStyleId(d.style) ? d.style : defaultPreferences.style
  return { preset: matchPreset({ theme, layout, style }), theme, layout, style }
}

const syncPreset = (s: PreferencesState) => {
  s.preset = matchPreset(s)
}

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: defaultPreferences,
  reducers: {
    applyPreset(state, action: PayloadAction<string>) {
      if (!isPresetId(action.payload)) return
      Object.assign(state, PRESETS[action.payload], { preset: action.payload })
    },
    setTheme(state, action: PayloadAction<string>) {
      if (!isThemeId(action.payload)) return
      state.theme = action.payload
      syncPreset(state)
    },
    setLayout(state, action: PayloadAction<string>) {
      if (!isLayoutId(action.payload)) return
      state.layout = action.payload
      syncPreset(state)
    },
    setStyle(state, action: PayloadAction<string>) {
      if (!isStyleId(action.payload)) return
      state.style = action.payload
      syncPreset(state)
    },
    resetPreferences: () => defaultPreferences,
  },
  selectors: {
    selectPreset: (s) => s.preset,
    selectTheme: (s) => s.theme,
    selectLayout: (s) => s.layout,
    selectStyle: (s) => s.style,
  },
})

export const { applyPreset, setTheme, setLayout, setStyle, resetPreferences } =
  preferencesSlice.actions
export const { selectPreset, selectTheme, selectLayout, selectStyle } = preferencesSlice.selectors
