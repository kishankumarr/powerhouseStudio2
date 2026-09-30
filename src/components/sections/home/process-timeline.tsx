'use client'

import { useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import { useRef, useState } from 'react'
import { Eyebrow } from '@/components/ui/eyebrow'
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe'
import { cn, pad2 } from '@/lib/utils'

type Step = { title: string; body: string }

type ProcessTimelineProps = {
  eyebrow: string
  title: string
  lead?: string
  steps: Step[]
  labels: { video: string; audio: string }
  footer?: React.ReactNode
}

// Deterministic "waveform" (no Math.random during render → no hydration mismatch).
const WAVE = Array.from({ length: 96 }, (_, i) => {
  const v = Math.abs(
    Math.sin(i * 0.55) * 0.6 + Math.sin(i * 1.7 + 1) * 0.3 + Math.sin(i * 0.13) * 0.25,
  )
  return Math.round(18 + v * 70)
})
const FPS = 25
const TOTAL_SECONDS = 60
const tc = (p: number) => {
  const frames = Math.round(p * TOTAL_SECONDS * FPS)
  const s = Math.floor(frames / FPS)
  return `00:${pad2(Math.floor(s / 60))}:${pad2(s % 60)}:${pad2(frames % FPS)}`
}

/**
 * Understand → Create → Produce → Deliver as an edit timeline. Scrolling scrubs the
 * playhead across four clips; the clip under the playhead lights up with its step.
 */
export function ProcessTimeline({
  eyebrow,
  title,
  lead,
  steps,
  labels,
  footer,
}: ProcessTimelineProps) {
  const ref = useRef<HTMLDivElement>(null)
  const timecodeRef = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotionSafe()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.55', 'end end'] })
  const head = useTransform(scrollYProgress, [0.05, 0.95], [0, 1], { clamp: true })
  const left = useTransform(head, (v) => `${v * 100}%`)
  const [active, setActive] = useState(0)

  useMotionValueEvent(head, 'change', (v) => {
    const idx = Math.min(steps.length - 1, Math.floor(v * steps.length))
    if (idx !== active) setActive(idx)
    if (timecodeRef.current) timecodeRef.current.textContent = tc(v)
  })

  const isLit = (i: number) => reduce || i <= active

  return (
    <div ref={ref} className="relative lg:h-[220vh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:min-h-dvh lg:items-center">
        <div className="container-ph grid gap-12 py-4">
          <header className="grid gap-5 lg:grid-cols-12 lg:items-end">
            <div className="grid gap-5 lg:col-span-7">
              <Eyebrow>{eyebrow}</Eyebrow>
              <h2 id="process-title" className="display-type text-display-lg text-fg">
                {title}
              </h2>
            </div>
            {lead && (
              <p className="text-lead text-fg-muted lg:col-span-5 lg:justify-self-end">{lead}</p>
            )}
          </header>

          {/* The timeline (decorative; the steps below carry the content) */}
          <div
            aria-hidden="true"
            className="relative overflow-hidden rounded-md border-ph border-border bg-surface p-3 sm:p-4"
          >
            <div className="mb-3 flex items-center justify-between label-type text-fg-muted">
              <span className="flex items-center gap-2">
                <span className="ph-rec-dot inline-block size-2 rounded-full bg-accent-ink" />
                <span ref={timecodeRef} className="text-fg tabular">
                  {tc(0)}
                </span>
              </span>
              <span className="tabular">{tc(1)}</span>
            </div>
            {/* Ruler */}
            <div className="ml-10 flex h-3 items-end justify-between border-b border-border">
              {Array.from({ length: 41 }, (_, i) => (
                <span
                  key={i}
                  className={cn('w-px bg-border-strong', i % 5 === 0 ? 'h-3' : 'h-1.5')}
                />
              ))}
            </div>
            <div className="relative mt-2 grid gap-2">
              {/* V1: the four clips */}
              <div className="flex items-stretch gap-2">
                <span className="grid w-8 shrink-0 place-items-center label-type text-fg-muted">
                  {labels.video}
                </span>
                <div className="grid flex-1 grid-cols-4 gap-1.5">
                  {steps.map((s, i) => (
                    <div
                      key={s.title}
                      className={cn(
                        'relative h-14 overflow-hidden rounded-sm border-ph px-2 py-1.5 transition-colors duration-500 sm:h-16 sm:px-3',
                        isLit(i)
                          ? 'border-accent bg-accent text-accent-fg'
                          : 'border-border bg-surface-2 text-fg-muted',
                      )}
                    >
                      <span className="block label-type tabular">{pad2(i + 1)}</span>
                      <span className="block truncate display-type text-sm sm:text-lg">
                        {s.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* A1: waveform */}
              <div className="flex items-stretch gap-2">
                <span className="grid w-8 shrink-0 place-items-center label-type text-fg-muted">
                  {labels.audio}
                </span>
                <div className="flex h-10 flex-1 items-center gap-[2px] overflow-hidden rounded-sm bg-surface-2 px-1">
                  {WAVE.map((h, i) => (
                    <span
                      key={i}
                      className="w-full min-w-px flex-1 bg-fg-muted/60"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              {/* Playhead */}
              <div className="pointer-events-none absolute inset-y-0 right-0 left-10">
                <m.div
                  className="absolute inset-y-[-0.75rem] w-0.5 -translate-x-1/2 bg-fg"
                  style={{ left }}
                >
                  <span className="absolute -top-1 left-1/2 size-3 -translate-x-1/2 rotate-45 bg-fg" />
                </m.div>
              </div>
            </div>
          </div>

          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className={cn(
                  'grid content-start gap-3 border-t-2 pt-5 transition-colors duration-500',
                  isLit(i) ? 'border-accent-ink' : 'border-border',
                )}
              >
                <p className="label-type text-fg-muted tabular">{pad2(i + 1)}</p>
                <h3 className="display-type text-display-sm text-fg">{s.title}</h3>
                <p className="text-fg-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          {footer}
        </div>
      </div>
    </div>
  )
}
