import { Reveal } from '@/components/motion/reveal'
import { SectionHeader } from '@/components/patterns/section-header'
import { Section } from '@/components/ui/section'
import { getContent } from '@/content'
import { pad2 } from '@/lib/utils'

export function WhoWeAre() {
  const { who } = getContent().about
  return (
    <Section id="who" labelledBy="who-title" tone="contrast">
      <div className="container-ph grid gap-14">
        <SectionHeader
          id="who-title"
          eyebrow={who.eyebrow}
          title={who.title}
          lead={who.paragraphs[0]}
          align="split"
        />
        <div className="grid gap-6">
          <p className="label-type text-fg-muted">{who.disciplinesIntro}</p>
          <Reveal>
            <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border-ph border-border bg-border sm:grid-cols-3 lg:grid-cols-4">
              {who.disciplines.map((d, i) => (
                <li
                  key={d}
                  className="group/disc flex min-h-28 flex-col justify-between gap-6 bg-bg p-5 transition-colors duration-300 hover:bg-accent sm:min-h-32 sm:p-6"
                >
                  <span
                    aria-hidden="true"
                    className="label-type text-fg-muted tabular group-hover/disc:text-accent-fg"
                  >
                    {pad2(i + 1)}
                  </span>
                  <span className="text-lg font-semibold text-fg group-hover/disc:text-accent-fg sm:text-xl">
                    {d}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {who.closing.map((p, i) => (
            <p
              key={p}
              className={
                i === who.closing.length - 1
                  ? 'text-lead font-semibold text-fg'
                  : 'text-lead text-fg-muted'
              }
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </Section>
  )
}
