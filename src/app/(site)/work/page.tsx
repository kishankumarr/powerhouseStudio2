import { Stagger, StaggerItem } from '@/components/motion/stagger'
import { CtaBand } from '@/components/patterns/cta-band'
import { PageHero } from '@/components/patterns/page-hero'
import { SectionHeader } from '@/components/patterns/section-header'
import { Section } from '@/components/ui/section'
import { getContent } from '@/content'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { fill, pad2 } from '@/lib/utils'

export const metadata = buildMetadata({ ...getContent().seo.work, path: '/work' })

export default function WorkPage() {
  const { work, common } = getContent()
  return (
    <>
      <PageHero
        eyebrow={work.hero.eyebrow}
        title={work.hero.title}
        lead={work.hero.lead}
        scene="16"
      />

      <Section id="industries" labelledBy="industries-title" tone="contrast">
        <div className="container-ph grid gap-12">
          <SectionHeader
            id="industries-title"
            eyebrow={work.industries.eyebrow}
            title={work.industries.title}
          />
          <Stagger
            as="ul"
            className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border-ph border-border bg-border sm:grid-cols-3 lg:grid-cols-4"
          >
            {work.industries.items.map((it, i) => (
              <StaggerItem
                as="li"
                key={it}
                className="group/ind relative flex min-h-36 flex-col justify-between gap-6 overflow-hidden bg-bg p-5 sm:min-h-44 sm:p-7"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/ind:scale-y-100"
                />
                <span
                  aria-hidden="true"
                  className="relative label-type text-fg-muted tabular group-hover/ind:text-accent-fg"
                >
                  {pad2(i + 1)}
                </span>
                <span className="relative display-type text-display-sm text-fg group-hover/ind:text-accent-fg">
                  {it}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      <Section id="portfolio" labelledBy="portfolio-title">
        <div className="container-ph grid gap-12">
          <SectionHeader
            id="portfolio-title"
            eyebrow={work.portfolio.eyebrow}
            title={work.portfolio.title}
            lead={work.portfolio.lead}
            align="split"
          />
          {/* Typed placeholders until the client supplies projects: never fake-real work. */}
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {work.portfolio.slots.map((slot, i) => (
              <li
                key={`slot-${i}`}
                data-placeholder={slot.placeholder}
                className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-lg border-ph border-dashed border-border-strong bg-surface"
              >
                <span
                  aria-hidden="true"
                  className="ph-viewfinder [--vf-c:var(--ph-border-strong)]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(to_right,var(--ph-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--ph-border)_1px,transparent_1px)] bg-[size:33.33%_33.33%] opacity-60"
                />
                <span className="relative grid justify-items-center gap-3 text-center">
                  <span className="flex items-center gap-2 label-type text-fg-muted">
                    <span
                      aria-hidden="true"
                      className="inline-block size-2 rounded-full border border-fg-muted"
                    />
                    {fill(work.portfolio.slotLabel, { number: pad2(i + 1) })}
                  </span>
                  <span className="display-type text-display-sm text-fg">
                    {work.portfolio.comingSoon}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="absolute right-5 bottom-4 label-type text-fg-muted tabular"
                >
                  {common.hud.take}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand />
    </>
  )
}
