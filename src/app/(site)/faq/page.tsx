import { Accordion } from '@/components/patterns/accordion'
import { CtaBand } from '@/components/patterns/cta-band'
import { PageHero } from '@/components/patterns/page-hero'
import { JsonLd } from '@/components/seo/json-ld'
import { Section } from '@/components/ui/section'
import { getContent } from '@/content'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { faqSchema } from '@/lib/seo/schema'

export const metadata = buildMetadata({ ...getContent().seo.faq, path: '/faq' })

export default function FaqPage() {
  const { faq } = getContent()
  return (
    <>
      <PageHero eyebrow={faq.hero.eyebrow} title={faq.hero.title} lead={faq.hero.lead} scene="?" />
      <Section id="questions" labelledBy="questions-title" className="pt-0!">
        <div className="container-ph">
          <h2 id="questions-title" className="sr-only">
            {faq.hero.title}
          </h2>
          <Accordion items={faq.items} />
        </div>
      </Section>
      <CtaBand title={faq.ctaTitle} body={faq.ctaBody} />
      {/* Built from the same array that renders the visible answers. */}
      <JsonLd data={faqSchema(faq.items)} />
    </>
  )
}
