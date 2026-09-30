'use client'

import { useScroll, useTransform, type MotionValue } from 'motion/react'
import * as m from 'motion/react-m'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

type ScrollFillTextProps = {
  text: string
  className?: string
  as?: 'p' | 'h2'
}

/**
 * Statement text whose words fill from muted to full ink as it scrolls through
 * the viewport. The muted base colour already passes AA, so text is always legible;
 * only the overlay's opacity animates.
 */
export function ScrollFillText({ text, className, as = 'p' }: ScrollFillTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  const Tag = as
  return (
    <Tag ref={ref} className={cn('flex flex-wrap', className)}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          word={word}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        />
      ))}
    </Tag>
  )
}

function Word({
  word,
  progress,
  range,
}: {
  word: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className="relative mr-[0.25em] text-fg-muted">
      {word}
      <m.span aria-hidden="true" className="absolute inset-0 text-fg" style={{ opacity }}>
        {word}
      </m.span>
    </span>
  )
}
