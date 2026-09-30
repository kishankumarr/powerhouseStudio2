'use client'

import { useState } from 'react'
import { Provider } from 'react-redux'
import { readBootPreferences } from './slices/preferences-slice'
import { makeStore } from './store'

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Lazy init runs once per mount and reads what the pre-paint script applied.
  const [store] = useState(() => makeStore({ preferences: readBootPreferences() }))
  return <Provider store={store}>{children}</Provider>
}
