import { Stagger, StaggerItem } from '@/components/motion/stagger'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { getContent } from '@/content'

/** Vision, mission (with its four-part formula) and the brand promise. */
export function VisionMission() {
  const { vision, mission, promise } = getContent().about
  return (
    <Section id="vision" labelledBy="vision-title" tone="contrast">
      <div className="container-ph grid gap-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="grid content-start gap-6 lg:col-span-5">
            <Eyebrow>{vision.eyebrow}</Eyebrow>
            <h2 id="vision-title" className="display-type text-display-lg text-fg">
              {vision.title}
            </h2>
          </div>
          <div className="grid content-end gap-5 lg:col-span-6 lg:col-start-7">
            {vision.paragraphs.map((p, i) => (
              <p
                key={p}
                className={i === 0 ? 'text-lead font-semibold text-fg' : 'text-lead text-fg-muted'}
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="grid gap-10">
          <div className="grid gap-6">
            <Eyebrow>{mission.eyebrow}</Eyebrow>
            <h2 className="max-w-4xl display-type text-display-md text-fg">{mission.statement}</h2>
          </div>
          <p className="label-type text-fg-muted">{mission.formulaIntro}</p>
          <Stagger as="ol" className="flex flex-wrap items-center gap-3">
            {mission.formula.map((part, i) => (
              <StaggerItem as="li" key={part} className="flex items-center gap-3">
                <span className="rounded-pill border-ph border-fg px-6 py-3 display-type text-display-sm text-fg transition-colors hover:bg-accent hover:text-accent-fg sm:px-8">
                  {part}
                </span>
                {i < mission.formula.length - 1 && (
                  <span aria-hidden="true" className="display-type text-display-sm text-accent-ink">
                    {'+'}
                  </span>
                )}
              </StaggerItem>
            ))}
          </Stagger>
          <p className="max-w-2xl text-lead text-fg-muted">{mission.closing}</p>
        </div>

        <div className="grid gap-10">
          <Eyebrow>{promise.eyebrow}</Eyebrow>
          <ol className="grid gap-px overflow-hidden rounded-lg bg-border md:grid-cols-3">
            {promise.lines.map((l) => (
              <li key={l.title} className="grid content-between gap-10 bg-bg p-7 sm:p-9">
                <h3 className="display-type text-display-md text-accent-ink">{l.title}</h3>
                <p className="text-lead text-fg">{l.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}
