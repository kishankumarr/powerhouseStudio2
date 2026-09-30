'use client'

import { useEffect } from 'react'

/**
 * Moves the key-light glow with the pointer by writing CSS variables. It never
 * re-renders React, only runs on fine pointers and stays still under reduced motion.
 */
export function SpotlightTracker() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduce.matches) return
    const root = document.documentElement
    let frame = 0
    let x = 0
    let y = 0
    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        root.style.setProperty('--spot-x', `${x}px`)
        root.style.setProperty('--spot-y', `${y}px`)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])
  return null
}
