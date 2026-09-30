'use client'

import { useSyncExternalStore } from 'react'

function read(): number {
  const v = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--ph-motion-scale'),
  )
  return Number.isFinite(v) ? v : 1
}

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-style'] })
  return () => mo.disconnect()
}

/** The style axis' motion multiplier (0 = static). Re-reads when the style changes. */
export function useMotionScale(): number {
  return useSyncExternalStore(subscribe, read, () => 1)
}
