'use client'

import { useSyncExternalStore } from 'react'

const noop = () => () => {}

/** false during SSR and hydration, true afterwards. Guards UI that shows client-only state. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
}
