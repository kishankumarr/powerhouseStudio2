---
name: redux-state
description: Client-state architecture for the Powerhouse Next.js 16 App Router site using Redux Toolkit 2 and React-Redux 9. Covers the per-request store factory, StoreProvider, typed hooks, slice conventions, the listener middleware that persists theme, layout and style preferences, and what must NOT go into Redux. Use when adding global client state, touching the store, preferences or UI slices, or wiring a component to Redux.
---

# Redux State (RTK 2 + App Router)

## Scope: Redux holds _client UI state only_

| Belongs in Redux                                                                | Does NOT belong in Redux                                                |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `preferences`: preset, theme, layout, style (persisted)                         | Site content and copy (static imports from `src/content`)               |
| `ui`: mobile nav open, active modal, cursor/spotlight mode, "intro played" flag | Image lists and constants                                               |
| `enquiry`: contact-form draft and wizard step (optional; persisted draft)       | Anything a Server Component needs. **RSCs must never import the store** |
|                                                                                 | Scroll position or animation values (use Motion values / refs)          |

## Files

```
src/store/
  store.ts              makeStore(), types
  hooks.ts              typed hooks
  store-provider.tsx    'use client' provider (per-request store)
  listeners.ts          listener middleware (persistence, side-effects)
  slices/
    preferences-slice.ts
    ui-slice.ts
```

## Store factory (never a module-level singleton)

A module-level store would be shared across requests on the server. Always create it per request with `makeStore`.

```ts
// src/store/store.ts
import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { preferencesSlice } from './slices/preferences-slice'
import { uiSlice } from './slices/ui-slice'
import { listenerMiddleware } from './listeners'

const rootReducer = combineSlices(preferencesSlice, uiSlice)
export type RootState = ReturnType<typeof rootReducer>

export const makeStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (gDM) => gDM().prepend(listenerMiddleware.middleware),
  })

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']
```

```ts
// src/store/hooks.ts
import { useDispatch, useSelector, useStore } from 'react-redux'
import type { AppDispatch, AppStore, RootState } from './store'
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()
```

```tsx
// src/store/store-provider.tsx
'use client'
import { useState } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from './store'
import { readBootPreferences } from './slices/preferences-slice'

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // lazy init runs once per mount; reads the data-* attributes the pre-paint script already set
  const [store] = useState(() => makeStore({ preferences: readBootPreferences() }))
  return <Provider store={store}>{children}</Provider>
}
```

`readBootPreferences()` returns the default preset on the server (`typeof document === 'undefined'`). On the client it reads `document.documentElement.dataset`, which the pre-paint script set (see `theme-system`). Server HTML and the first client render therefore agree on the _default_. Components that display the current choice (for example, the selected radio on `/config`) must render it **after mount**, using a `useHydrated()` guard, to avoid hydration mismatches.

## Slice conventions

- Use `createSlice` with a typed `initialState`, and keep reducers small and pure. Use Immer mutation syntax.
- Validate external input at the boundary. `setTheme(id)` ignores ids that are not in the registry from `src/config/themes.ts`, which is the single source of valid ids shared with the pre-paint script and `/config`.
- Expose **selectors** from the slice (`selectors: { selectTheme: s => s.theme }`, in RTK 2 slice `selectors`). Components never reach into state shape directly.
- Use `applyPreset(presetId)` to set all three axes at once. Setting any single axis marks `preset: 'custom'`.

## Persistence via listener middleware (no redux-persist)

```ts
// src/store/listeners.ts
import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import { preferencesSlice } from './slices/preferences-slice'
export const listenerMiddleware = createListenerMiddleware()

const { applyPreset, setTheme, setLayout, setStyle, resetPreferences } = preferencesSlice.actions
listenerMiddleware.startListening({
  matcher: isAnyOf(applyPreset, setTheme, setLayout, setStyle, resetPreferences),
  effect: (_action, api) => {
    const prefs = (api.getState() as { preferences: PreferencesState }).preferences
    const root = document.documentElement
    root.dataset.theme = prefs.theme
    root.dataset.layout = prefs.layout
    root.dataset.style = prefs.style
    try {
      localStorage.setItem('ph-prefs', JSON.stringify({ ...prefs, v: 1 }))
    } catch {
      /* private mode */
    }
  },
})
```

The theme cross-fade (View Transition) is triggered in the _component_ that dispatches, wrapping the dispatch. The listener stays a pure side-effect writer.

## Testing

- Reducers and selectors are tested with Vitest as pure functions: `reducer(state, action)`.
- Listener persistence runs in Vitest with `jsdom`. Dispatch, then assert `localStorage` and `document.documentElement.dataset`.
- Provide a `renderWithStore(ui, { preloadedState })` helper for component tests, built on `makeStore`.

## Anti-patterns

- `'use client'` on a layout or page just to read the store. Push the island down instead.
- Putting derived data in state. Derive it with selectors (use `createSelector` only for expensive or derived-array cases).
- `useSelector(state => state)` or returning new objects from selectors, which re-render on every dispatch.
- Reading `localStorage` in a reducer or during render. It belongs in the boot read and the listener only.
