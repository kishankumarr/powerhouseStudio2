'use client'

import { useEffect, useRef } from 'react'
import { INTRO_STORAGE_KEY } from '@/constants/storage-keys'
const INTRO_MS = 2200

/**
 * Marks the logo intro as played (once per session) and pauses the idle loop when
 * the logo is off-screen. The animation itself is CSS; this only flips attributes.
 */
export function IntroFlag({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.documentElement
    if (root.dataset.intro !== 'done') {
      const t = window.setTimeout(() => {
        root.dataset.intro = 'done'
        try {
          sessionStorage.setItem(INTRO_STORAGE_KEY, '1')
        } catch {}
      }, INTRO_MS)
      return () => window.clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      el.dataset.offscreen = e?.isIntersecting ? 'false' : 'true'
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
