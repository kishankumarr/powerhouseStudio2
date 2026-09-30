import { Stagger, StaggerItem } from '@/components/motion/stagger'
import { SectionHeader } from '@/components/patterns/section-header'
import { Section } from '@/components/ui/section'
import { getContent } from '@/content'

/**
 * Founders with typographic monograms: no photos were supplied, and stock faces
 * must never stand in for real people.
 */
export function Founders() {
  const { team, founders } = getContent().about
  return (
    <Section id="founders" labelledBy="founders-title">
      <div className="container-ph grid gap-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader id="team-title" eyebrow={team.eyebrow} title={team.title} />
          </div>
          <div className="grid content-end gap-5 lg:col-span-6 lg:col-start-7">
            {team.paragraphs.map((p) => (
              <p key={p} className="text-lead text-fg-muted">
                {p}
              </p>
            ))}
          </div>
        </div>

        <SectionHeader id="founders-title" eyebrow={founders.eyebrow} title={founders.title} />

        <Stagger className="grid gap-6 lg:grid-cols-2">
          {founders.people.map((p) => (
            <StaggerItem
              as="article"
              key={p.name}
              className="group/f grid overflow-hidden rounded-lg border-ph border-border bg-surface sm:grid-cols-[minmax(0,15rem)_1fr]"
            >
              <div
                data-tone="accent"
                className="relative grid min-h-60 place-items-center overflow-hidden sm:min-h-full"
              >
                <span
                  aria-hidden="true"
                  className="ph-viewfinder [--vf-c:var(--ph-fg)] [--vf-inset:1rem]"
                />
                <span
                  aria-hidden="true"
                  className="display-type text-[7.5rem] leading-none text-fg transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/f:scale-110"
                >
                  {p.initials}
                </span>
                <span className="absolute inset-x-6 bottom-7 text-center label-type text-fg-muted">
                  {founders.photoNote}
                </span>
              </div>
              <div className="grid content-start gap-4 p-7 sm:p-9">
                <p className="label-type text-fg-muted">{p.role}</p>
                <h3 className="display-type text-display-md text-fg">{p.name}</h3>
                {p.alias && (
                  <p className="w-fit bg-accent px-2 py-0.5 font-semibold text-accent-fg">
                    {p.alias}
                  </p>
                )}
                <div className="grid gap-3 text-fg-muted">
                  {p.bio.map((b) => (
                    <p key={b}>{b}</p>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}
