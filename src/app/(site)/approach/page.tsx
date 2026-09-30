import { Check } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { Stagger, StaggerItem } from '@/components/motion/stagger'
import { CtaBand } from '@/components/patterns/cta-band'
import { PageHero } from '@/components/patterns/page-hero'
import { SectionHeader } from '@/components/patterns/section-header'
import { ProcessTimeline } from '@/components/sections/home/process-timeline'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Media } from '@/components/ui/media'
import { Section } from '@/components/ui/section'
import { getContent } from '@/content'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { cn, pad2 } from '@/lib/utils'

export const metadata = buildMetadata({ ...getContent().seo.approach, path: '/approach' })

export default function ApproachPage() {
  const { approach, home } = getContent()
  const { discovery, stages, difference, engage, audiences } = approach
  return (
    <>
      <PageHero
        eyebrow={approach.hero.eyebrow}
        title={approach.hero.title}
        lead={approach.hero.lead}
        scene="04"
      />

      {/* Discovery questions */}
      <Section id="discovery" labelledBy="discovery-title" tone="contrast">
        <div className="container-ph grid gap-12 lg:grid-cols-12">
          <div className="grid content-start gap-6 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <Eyebrow>{discovery.eyebrow}</Eyebrow>
            <h2 id="discovery-title" className="display-type text-display-md text-fg">
              {discovery.title}
            </h2>
          </div>
          <div className="grid gap-8 lg:col-span-7">
            <Stagger as="ol" className="grid">
              {discovery.questions.map((q, i) => (
                <StaggerItem
                  as="li"
                  key={q}
                  className="flex items-baseline gap-5 border-b border-border py-5 first:border-t"
                >
                  <span
                    aria-hidden="true"
                    className="w-8 shrink-0 label-type text-fg-muted tabular"
                  >
                    {pad2(i + 1)}
                  </span>
                  <span className="display-type text-display-sm text-fg">{q}</span>
                </StaggerItem>
              ))}
            </Stagger>
            <p className="text-lead text-fg-muted">{discovery.closing}</p>
          </div>
        </div>
      </Section>

      {/* Four stages as a timeline */}
      <Section id="stages" labelledBy="process-title" className="lg:py-0!">
        <ProcessTimeline
          eyebrow={stages.eyebrow}
          title={stages.title}
          steps={stages.items}
          labels={{ video: home.process.trackVideo, audio: home.process.trackAudio }}
        />
      </Section>

      {/* The Powerhouse difference */}
      <Section id="difference" labelledBy="difference-title" tone="accent">
        <div className="container-ph grid gap-14">
          <div className="grid gap-6">
            <Eyebrow className="text-fg">{difference.eyebrow}</Eyebrow>
            <h2 id="difference-title" className="max-w-5xl display-type text-display-xl text-fg">
              {difference.title}
            </h2>
            {difference.opening.map((p) => (
              <p key={p} className="max-w-2xl text-lead text-fg-muted">
                {p}
              </p>
            ))}
          </div>
          <Stagger as="ul" className="grid border-t-2 border-fg">
            {difference.sometimes.map((line) => (
              <StaggerItem as="li" key={line} className="border-b border-fg/25 py-4">
                <p className="display-type text-display-sm text-fg">{line}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal>
            <p className="grid gap-1 display-type text-display-md text-fg">
              {difference.closing.map((l, i) => (
                <span key={l} className={cn(i === difference.closing.length - 1 && 'hl w-fit')}>
                  {l}
                </span>
              ))}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Ways to engage */}
      <Section id="engage" labelledBy="engage-title">
        <div className="container-ph grid gap-12">
          <SectionHeader
            id="engage-title"
            eyebrow={engage.eyebrow}
            title={engage.title}
            lead={engage.closing}
            align="split"
          />
          <Stagger as="ol" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {engage.items.map((it, i) => (
              <StaggerItem
                as="li"
                key={it.title}
                className="group/eng grid content-between gap-10 rounded-lg border-ph border-border bg-surface p-6 transition-colors duration-500 hover:border-fg"
              >
                <span
                  aria-hidden="true"
                  className="grid size-10 place-items-center rounded-pill bg-accent text-sm font-bold text-accent-fg"
                >
                  {pad2(i + 1)}
                </span>
                <span className="grid gap-2">
                  <h3 className="display-type text-2xl text-fg">{it.title}</h3>
                  <p className="text-fg-muted">{it.body}</p>
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* For brands / creators / events */}
      <Section id="audiences" tone="contrast">
        <div className="container-ph grid gap-20">
          <article
            id={audiences.brands.id}
            aria-labelledby={`${audiences.brands.id}-title`}
            className="grid scroll-mt-28 gap-8 lg:grid-cols-12 lg:items-center"
          >
            <div className="grid gap-5 lg:col-span-6">
              <h2
                id={`${audiences.brands.id}-title`}
                className="display-type text-display-lg text-fg"
              >
                {audiences.brands.title}
              </h2>
              <p className="display-type text-display-sm text-accent-ink">
                {audiences.brands.paragraphs[0]}
              </p>
              {audiences.brands.paragraphs.slice(1).map((p) => (
                <p key={p} className="text-lead text-fg-muted">
                  {p}
                </p>
              ))}
            </div>
            <Media
              image="audienceBrands"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[4/3] rounded-lg lg:col-span-5 lg:col-start-8"
            />
          </article>

          <article
            id={audiences.creators.id}
            aria-labelledby={`${audiences.creators.id}-title`}
            className="grid scroll-mt-28 gap-8 lg:grid-cols-12 lg:items-center"
          >
            <Media
              image="studioPodcast"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[4/3] rounded-lg lg:col-span-5"
            />
            <div className="grid gap-5 lg:col-span-6 lg:col-start-7">
              <h2
                id={`${audiences.creators.id}-title`}
                className="display-type text-display-lg text-fg"
              >
                {audiences.creators.title}
              </h2>
              <p className="display-type text-display-sm text-accent-ink">
                {audiences.creators.paragraphs[0]}
              </p>
              {audiences.creators.paragraphs.slice(1).map((p) => (
                <p key={p} className="text-lead text-fg-muted">
                  {p}
                </p>
              ))}
              <p className="label-type text-fg-muted">{audiences.creators.listIntro}</p>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                {audiences.creators.list.map((l) => (
                  <li key={l} className="flex items-center gap-2 text-fg">
                    <Check
                      aria-hidden="true"
                      className="size-4 shrink-0 text-accent-ink"
                      strokeWidth={3}
                    />
                    {l}
                  </li>
                ))}
              </ul>
              <p className="font-semibold text-fg">{audiences.creators.closing}</p>
            </div>
          </article>

          <article
            id={audiences.events.id}
            aria-labelledby={`${audiences.events.id}-title`}
            className="grid scroll-mt-28 gap-8 lg:grid-cols-12 lg:items-center"
          >
            <div className="grid gap-5 lg:col-span-6">
              <h2
                id={`${audiences.events.id}-title`}
                className="display-type text-display-lg text-fg"
              >
                {audiences.events.title}
              </h2>
              <p className="display-type text-display-sm text-accent-ink">
                {audiences.events.paragraphs[0]}
              </p>
              {audiences.events.paragraphs.slice(1).map((p) => (
                <p key={p} className="text-lead text-fg-muted">
                  {p}
                </p>
              ))}
            </div>
            <Media
              image="audienceEvents"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[4/3] rounded-lg lg:col-span-5 lg:col-start-8"
            />
          </article>
        </div>
      </Section>

      <CtaBand />
    </>
  )
}
