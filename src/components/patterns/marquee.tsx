'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type MarqueeProps = {
  children: React.ReactNode
  /** Seconds for one full loop at motion scale 1. */
  duration?: number
  reverse?: boolean
  className?: string
  trackClassName?: string
}

/**
 * CSS-driven marquee: the content is rendered twice (the copy is aria-hidden) and
 * translated -50%. Pauses on hover/focus, when off-screen, and stops entirely under
 * reduced motion (see globals.css).
 */
export function Marquee({
  children,
  duration = 40,
  reverse = false,
  className,
  trackClassName,
}: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? true), {
      rootMargin: '100px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-paused={!inView || undefined}
      className={cn('ph-marquee overflow-hidden', className)}
      style={{ ['--marquee-duration' as string]: `${duration}s` }}
    >
      <div
        className={cn('ph-marquee-track', trackClassName)}
        data-direction={reverse ? 'reverse' : undefined}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
