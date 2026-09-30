import { ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import NextLink from 'next/link'
import { notFound } from 'next/navigation'
import { SERVICE_ICONS } from '@/components/icons/service-icons'
import { Stagger, StaggerItem } from '@/components/motion/stagger'
import { Timecode } from '@/components/motion/timecode'
import { Accordion } from '@/components/patterns/accordion'
import { Breadcrumbs } from '@/components/patterns/breadcrumbs'
import { CtaBand } from '@/components/patterns/cta-band'
import { PageHero } from '@/components/patterns/page-hero'
import { JsonLd } from '@/components/seo/json-ld'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Media } from '@/components/ui/media'
import { Section } from '@/components/ui/section'
import { routePath, servicePath } from '@/config/routes'
import { getContent, getService, serviceSlugs } from '@/content'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { breadcrumbSchema, serviceSchema } from '@/lib/seo/schema'
import { fill, pad2 } from '@/lib/utils'

export const dynamicParams = false

export function generateStaticParams() {
  return serviceSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/services/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}
  return buildMetadata({ ...service.seo, path: servicePath(service.slug) })
}

export default async function ServicePage({ params }: PageProps<'/services/[slug]'>) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const { services, faq, common } = getContent()
  const index = services.items.findIndex((s) => s.slug === service.slug)
  const number = pad2(index + 1)
  const Icon = SERVICE_ICONS[service.slug]
  const related = service.related
    .map((r) => services.items.find((s) => s.slug === r))
    .filter((s) => s !== undefined)
  const faqs = faq.items.filter((f) => service.faqIds.includes(f.id))
  const servicesNav = common.nav.find((n) => n.href === routePath('services'))
  const crumbs = [
    { name: common.breadcrumbHome, path: '/' },
    { name: servicesNav?.label ?? services.index.hero.eyebrow, path: routePath('services') },
    { name: service.name, path: servicePath(service.slug) },
  ]
  const d = services.detail

  return (
    <>
      <PageHero
        eyebrow={fill(d.serviceLabel, { number })}
        title={service.name}
        lead={service.summary}
        scene={number}
        before={<Breadcrumbs items={crumbs} label={common.breadcrumbLabel} />}
      />

      {/* Feature frame */}
      <div className="container-ph">
        <div className="relative overflow-hidden rounded-lg">
          <Media
            image={service.image}
            sizes="(min-width: 1536px) 1472px, 94vw"
            preload
            className="aspect-[16/9] sm:aspect-[21/9]"
          />
          <div
            aria-hidden="true"
            className="ph-viewfinder [--vf-c:var(--ph-white)] [--vf-inset:clamp(0.75rem,2vw,1.5rem)]"
          />
          <div
            aria-hidden="true"
            className="on-media absolute top-[clamp(1.25rem,3vw,2.25rem)] left-[clamp(1.25rem,3vw,2.25rem)] flex items-center gap-3 label-type text-fg"
          >
            <span className="ph-rec-dot inline-block size-2.5 rounded-full bg-brand-yellow" />
            <span>{common.hud.rec}</span>
            <Timecode className="tabular" />
          </div>
          <div
            aria-hidden="true"
            className="absolute right-[clamp(1.25rem,3vw,2.25rem)] bottom-[clamp(1.25rem,3vw,2.25rem)] grid size-14 place-items-center rounded-pill bg-brand-yellow text-brand-black"
          >
            <Icon className="size-7" />
          </div>
        </div>
      </div>

      {/* Intro */}
      <Section id="intro" labelledBy="intro-title">
        <div className="container-ph grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>{service.shortName}</Eyebrow>
          </div>
          <div className="grid gap-6 lg:col-span-8">
            <h2 id="intro-title" className="display-type text-display-md text-fg">
              {service.intro[0]}
            </h2>
            {service.intro.slice(1).map((p) => (
              <p key={p} className="text-lead text-fg-muted">
                {p}
              </p>
            ))}
          </div>
        </div>
      </Section>

      {/* Capabilities */}
      <Section id="capabilities" labelledBy="capabilities-title" tone="contrast">
        <div className="container-ph grid gap-12">
          <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
            <div className="grid gap-5 lg:col-span-7">
              <Eyebrow>{d.capabilitiesTitle}</Eyebrow>
              <h2 id="capabilities-title" className="display-type text-display-lg text-fg">
                {service.capabilitiesIntro}
              </h2>
            </div>
          </div>
          <Stagger
            as="ol"
            className="grid gap-px overflow-hidden rounded-lg border-ph border-border bg-border sm:grid-cols-2 lg:grid-cols-3"
          >
            {service.capabilities.map((c, i) => (
              <StaggerItem
                as="li"
                key={c}
                className="group/cap flex min-h-24 items-center gap-5 bg-bg px-6 py-5 transition-colors duration-300 hover:bg-accent"
              >
                <span
                  aria-hidden="true"
                  className="label-type text-fg-muted tabular group-hover/cap:text-accent-fg"
                >
                  {pad2(i + 1)}
                </span>
                <span className="text-lg font-semibold text-fg group-hover/cap:text-accent-fg">
                  {c}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Outcome */}
      <Section id="outcome" labelledBy="outcome-title">
        <div className="container-ph grid gap-10 lg:grid-cols-12">
          <div className="grid content-start gap-5 text-lead text-fg-muted lg:col-span-4">
            {service.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <blockquote className="border-l-4 border-accent-ink pl-6 lg:col-span-8 lg:pl-10">
            <p id="outcome-title" className="display-type text-display-md text-fg">
              {service.outcome}
            </p>
          </blockquote>
        </div>
      </Section>

      {/* FAQ subset */}
      {faqs.length > 0 && (
        <Section id="questions" labelledBy="questions-title">
          <div className="container-ph grid gap-10 lg:grid-cols-12">
            <div className="grid content-start gap-5 lg:col-span-4">
              <Eyebrow>{d.faqTitle}</Eyebrow>
              <h2 id="questions-title" className="display-type text-display-md text-fg">
                {d.faqTitle}
              </h2>
            </div>
            <Accordion items={faqs} className="lg:col-span-8" />
          </div>
        </Section>
      )}

      {/* Related */}
      <Section id="related" labelledBy="related-title" tone="contrast">
        <div className="container-ph grid gap-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="related-title" className="display-type text-display-md text-fg">
              {d.relatedTitle}
            </h2>
            <NextLink
              href={routePath('services')}
              className="font-semibold text-fg underline decoration-accent-ink decoration-2 underline-offset-8"
            >
              {d.backToServices}
            </NextLink>
          </div>
          <ul className="grid gap-4 md:grid-cols-3">
            {related.map((r) => {
              const RIcon = SERVICE_ICONS[r.slug]
              return (
                <li key={r.slug}>
                  <NextLink
                    href={servicePath(r.slug)}
                    className="group/rel relative flex h-full flex-col justify-between gap-12 overflow-hidden rounded-lg border-ph border-border bg-surface p-7 transition-colors duration-500 hover:border-fg"
                  >
                    <span className="flex items-center justify-between text-fg">
                      <RIcon className="size-8" />
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-6 transition-transform duration-500 group-hover/rel:rotate-45"
                      />
                    </span>
                    <span className="grid gap-2">
                      <span className="display-type text-display-sm text-fg">{r.name}</span>
                      <span className="text-fg-muted">{r.summary}</span>
                    </span>
                  </NextLink>
                </li>
              )
            })}
          </ul>
        </div>
      </Section>

      <CtaBand title={d.ctaTitle} body={d.ctaBody} eyebrow={service.name} />
      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  )
}
