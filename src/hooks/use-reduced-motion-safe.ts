'use client'

import { useReducedMotion } from 'motion/react'
import { useHydrated } from './use-hydrated'

/**
 * Reduced-motion preference that is `false` during SSR and hydration, so markup
 * that depends on it never mismatches the server render.
 */
export function useReducedMotionSafe(): boolean {
  const reduce = useReducedMotion()
  const hydrated = useHydrated()
  return hydrated && !!reduce
}
