'use client'

import type { Variants } from 'motion/react'
import * as m from 'motion/react-m'
import { useMotionScale } from '@/hooks/use-motion-scale'
import { dur, ease, stagger } from '@/lib/motion/tokens'

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

type StaggerProps = {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'ul' | 'ol' | 'dl'
  amount?: number
}

/** Parent for sequenced reveals. Keep it to ~8 children; beyond that, reveal as a group. */
export function Stagger({ children, className, as = 'div', amount = 0.2 }: StaggerProps) {
  const scale = useMotionScale()
  const Comp = m[as]
  return (
    <Comp
      data-reveal=""
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger.children * scale,
            delayChildren: stagger.delay * scale,
          },
        },
      }}
    >
      {children}
    </Comp>
  )
}

type StaggerItemProps = {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'li' | 'article'
}

export function StaggerItem({ children, className, as = 'div' }: StaggerItemProps) {
  const scale = useMotionScale()
  const Comp = m[as]
  return (
    <Comp
      data-reveal=""
      className={className}
      variants={item}
      transition={{ duration: dur.lg * scale, ease: ease.out }}
    >
      {children}
    </Comp>
  )
}
