'use client'

import { useScroll, useTransform, type MotionValue } from 'motion/react'
import * as m from 'motion/react-m'
import { useRef } from 'react'
import { Eyebrow } from '@/components/ui/eyebrow'
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe'
import { cn } from '@/lib/utils'

type Item = { word: string; title: string; body: string }

type BeliefSequenceProps = {
  eyebrow: string
  title: string
  items: Item[]
  closing: string
}

/**
 * Visibility → Trust → Growth, scrubbed by scroll. On large screens the stage pins
 * while each word is "lit" in turn with the theme's accent fill, and the arrows between
 * them draw. All text is always in the DOM and legible (muted ink passes AA).
 */
export function BeliefSequence({ eyebrow, title, items, closing }: BeliefSequenceProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotionSafe()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.6', 'end end'] })
  const n = items.length

  return (
    <div ref={ref} className="relative lg:h-[230vh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:min-h-dvh lg:items-center">
        <div className="container-ph grid gap-14 py-4 lg:gap-20">
          <header className="grid gap-5">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id="belief-title" className="max-w-3xl display-type text-display-md text-fg">
              {title}
            </h2>
          </header>

          <ol className="grid gap-14 lg:grid-cols-3 lg:gap-0">
            {items.map((item, i) => (
              <Step
                key={item.word}
                item={item}
                index={i}
                last={i === n - 1}
                progress={scrollYProgress}
                range={[i / n, i / n + 0.55 / n]}
                reduce={reduce}
              />
            ))}
          </ol>

          <p className="label-type text-fg-muted">{closing}</p>
        </div>
      </div>
    </div>
  )
}

function Step({
  item,
  index,
  last,
  progress,
  range,
  reduce,
}: {
  item: Item
  index: number
  last: boolean
  progress: MotionValue<number>
  range: [number, number]
  reduce: boolean
}) {
  const fill = useTransform(progress, range, [0, 1], { clamp: true })
  const arrow = useTransform(progress, [range[1], range[1] + 0.12], [0, 1], { clamp: true })
  const lit = reduce ? 1 : fill
  const drawn = reduce ? 1 : arrow

  return (
    <li className={cn('relative grid content-start gap-6 lg:pr-12', index > 0 && 'lg:pl-12')}>
      <p aria-hidden="true" className="label-type text-fg-muted tabular">
        {String(index + 1).padStart(2, '0')}
      </p>
      <p className="relative w-fit">
        <span className="block display-type text-[calc(clamp(3.2rem,7vw,7.5rem)*var(--ph-display-scale))] leading-[0.9] text-fg-muted">
          {item.word}
        </span>
        {/* Lit state: accent fill wipes in behind, word switches to accent ink-on-fill */}
        <m.span
          aria-hidden="true"
          className="absolute -inset-x-[0.08em] inset-y-0 origin-left bg-accent"
          style={{ scaleX: lit }}
        />
        <m.span
          aria-hidden="true"
          className="absolute inset-0 block display-type text-[calc(clamp(3.2rem,7vw,7.5rem)*var(--ph-display-scale))] leading-[0.9] text-accent-fg"
          style={{ opacity: lit }}
        >
          {item.word}
        </m.span>
      </p>
      <h3 className="text-xl font-semibold text-fg">{item.title}</h3>
      <p className="max-w-sm text-fg-muted">{item.body}</p>

      {!last && (
        <m.span
          aria-hidden="true"
          className="absolute top-[4.6rem] right-0 hidden h-0.5 w-10 origin-left bg-fg lg:block"
          style={{ scaleX: drawn }}
        >
          <span className="absolute -top-[5px] -right-0.5 size-3 rotate-45 border-t-2 border-r-2 border-fg" />
        </m.span>
      )}
    </li>
  )
}
