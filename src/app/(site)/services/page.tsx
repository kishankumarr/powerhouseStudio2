import { CtaBand } from '@/components/patterns/cta-band'
import { PageHero } from '@/components/patterns/page-hero'
import { ServicesIndexList } from '@/components/sections/services/services-index-list'
import { JsonLd } from '@/components/seo/json-ld'
import { Section } from '@/components/ui/section'
import { getContent } from '@/content'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { serviceListSchema } from '@/lib/seo/schema'

export const metadata = buildMetadata({ ...getContent().seo.services, path: '/services' })

export default function ServicesPage() {
  const { services } = getContent()
  const { hero } = services.index
  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} lead={hero.lead} scene="08" />
      <ServicesIndexList />
      <Section id="bigger-picture" tone="contrast" labelledBy="bigger-picture-title">
        <div className="container-ph grid gap-8 lg:grid-cols-12">
          <h2
            id="bigger-picture-title"
            className="display-type text-display-md text-fg lg:col-span-5"
          >
            {services.index.listTitle}
          </h2>
          <p className="text-lead text-fg-muted lg:col-span-6 lg:col-start-7">
            {services.index.closing}
          </p>
        </div>
      </Section>
      <CtaBand />
      <JsonLd data={serviceListSchema()} />
    </>
  )
}
