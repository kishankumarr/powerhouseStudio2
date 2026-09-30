import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import { PREFS_STORAGE_KEY, PREFS_VERSION, PRESET_QUERY_PARAM, THEME_COLOR } from '@/config/themes'
import { preferencesSlice, type PreferencesState } from './slices/preferences-slice'

export const listenerMiddleware = createListenerMiddleware()

const { applyPreset, setTheme, setLayout, setStyle, resetPreferences } = preferencesSlice.actions

/** Writes preferences to <html> data-* attributes and localStorage. Redux is the only writer after boot. */
export function persistPreferences(prefs: PreferencesState) {
  const root = document.documentElement
  root.dataset.theme = prefs.theme
  root.dataset.layout = prefs.layout
  root.dataset.style = prefs.style
  root.dataset.preset = prefs.preset
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLOR[prefs.theme])
  try {
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify({ ...prefs, v: PREFS_VERSION }))
  } catch {
    // Storage can throw in private mode; the choice still applies for this page view.
  }
  // A shared ?preset= link has done its job once the visitor picks their own look;
  // drop it so a reload keeps their choice.
  const url = new URL(window.location.href)
  if (url.searchParams.has(PRESET_QUERY_PARAM)) {
    url.searchParams.delete(PRESET_QUERY_PARAM)
    window.history.replaceState(window.history.state, '', url)
  }
}

listenerMiddleware.startListening({
  matcher: isAnyOf(applyPreset, setTheme, setLayout, setStyle, resetPreferences),
  effect: (_action, api) => {
    const { preferences } = api.getState() as { preferences: PreferencesState }
    persistPreferences(preferences)
  },
})
