import { Reveal } from '@/components/motion/reveal'
import { SectionHeader } from '@/components/patterns/section-header'
import { Section } from '@/components/ui/section'
import { getContent } from '@/content'
import { pad2 } from '@/lib/utils'

export function Philosophy() {
  const { philosophy } = getContent().about
  return (
    <Section id="philosophy" labelledBy="philosophy-title" tone="accent">
      <div className="container-ph grid gap-14">
        <SectionHeader
          id="philosophy-title"
          eyebrow={philosophy.eyebrow}
          title={philosophy.title}
          lead={philosophy.lines[0]}
          align="split"
          size="xl"
        />
        <div className="grid gap-6">
          <p className="label-type text-fg">{philosophy.listIntro}</p>
          <Reveal>
            <ol className="grid border-t-2 border-fg sm:grid-cols-2 lg:grid-cols-3">
              {philosophy.reasons.map((r, i) => (
                <li
                  key={r}
                  className="flex items-baseline gap-4 border-b border-fg/25 py-4 sm:pr-6"
                >
                  <span
                    aria-hidden="true"
                    className="w-7 shrink-0 label-type text-fg-muted tabular"
                  >
                    {pad2(i + 1)}
                  </span>
                  <span className="display-type text-2xl leading-tight text-fg">{r}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
        <p className="max-w-3xl text-lead font-semibold text-fg">{philosophy.closing}</p>
      </div>
    </Section>
  )
}
