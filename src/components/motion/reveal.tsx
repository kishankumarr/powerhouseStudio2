'use client'

import * as m from 'motion/react-m'
import { useMotionScale } from '@/hooks/use-motion-scale'
import { dur, ease } from '@/lib/motion/tokens'

type RevealProps = {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'li' | 'section' | 'span'
}

/** In-view reveal. Never wrap above-the-fold or LCP content in this. */
export function Reveal({ children, delay = 0, y = 28, className, as = 'div' }: RevealProps) {
  const scale = useMotionScale()
  const Comp = m[as]
  return (
    <Comp
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: y * scale }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: dur.lg * scale, ease: ease.out, delay }}
    >
      {children}
    </Comp>
  )
}
