import { Clapperboard, Layers, MapPin, Shuffle, Target, Users } from 'lucide-react'
import { SectionHeader } from '@/components/patterns/section-header'
import { Stagger, StaggerItem } from '@/components/motion/stagger'
import { Section } from '@/components/ui/section'
import { getContent } from '@/content'
import { cn, pad2 } from '@/lib/utils'

const ICONS = [Users, Clapperboard, Target, Shuffle, Layers, MapPin] as const

/** Six reasons as a bento grid; the first and last cards are the wide "hero" tiles. */
export function Why() {
  const { why } = getContent().home
  return (
    <Section id="why" labelledBy="why-title">
      <div className="container-ph grid gap-14">
        <SectionHeader id="why-title" eyebrow={why.eyebrow} title={why.title} />
        <Stagger
          as="ul"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 layout-blocks:gap-(--ph-border-width)"
        >
          {why.items.map((item, i) => {
            const Icon = ICONS[i] ?? Users
            // 2-1 / 1-2 / 2-1 zigzag on three columns
            const wide = i === 0 || i === 3 || i === 4
            return (
              <StaggerItem
                as="li"
                key={item.title}
                className={cn(
                  'group/why relative grid content-between gap-10 overflow-hidden rounded-lg border-ph border-border bg-surface p-7 transition-colors duration-500 hover:border-border-strong sm:p-9',
                  'layout-blocks:rounded-none layout-blocks:border-border-strong',
                  wide && 'lg:col-span-2',
                )}
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="grid size-14 place-items-center rounded-md bg-accent text-accent-fg transition-transform duration-500 group-hover/why:-rotate-6">
                    <Icon aria-hidden="true" className="size-6" strokeWidth={2} />
                  </span>
                  <span aria-hidden="true" className="label-type text-fg-muted tabular">
                    {pad2(i + 1)}
                  </span>
                </div>
                <div className="grid gap-3">
                  <h3
                    className={cn(
                      'display-type text-fg',
                      wide ? 'text-display-md' : 'text-display-sm',
                    )}
                  >
                    {item.title}
                  </h3>
                  <p className="max-w-lg text-fg-muted">{item.body}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="absolute -right-6 -bottom-6 size-28 rounded-full bg-accent opacity-0 blur-2xl transition-opacity duration-700 group-hover/why:opacity-25"
                />
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </Section>
  )
}
