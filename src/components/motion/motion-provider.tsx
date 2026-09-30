'use client'

import { LazyMotion, MotionConfig } from 'motion/react'

const loadFeatures = () => import('./features').then((r) => r.default)

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
