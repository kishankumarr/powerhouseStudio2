import { CtaBand } from '@/components/patterns/cta-band'
import { PageHero } from '@/components/patterns/page-hero'
import { Beliefs } from '@/components/sections/about/beliefs'
import { Founders } from '@/components/sections/about/founders'
import { Note } from '@/components/sections/about/note'
import { Philosophy } from '@/components/sections/about/philosophy'
import { Story } from '@/components/sections/about/story'
import { VisionMission } from '@/components/sections/about/vision-mission'
import { WhoWeAre } from '@/components/sections/about/who-we-are'
import { JsonLd } from '@/components/seo/json-ld'
import { getContent } from '@/content'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { aboutPageSchema } from '@/lib/seo/schema'

export const metadata = buildMetadata({ ...getContent().seo.about, path: '/about' })

export default function AboutPage() {
  const { hero } = getContent().about
  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} lead={hero.lead} scene="PS" />
      <Story />
      <WhoWeAre />
      <Beliefs />
      <Philosophy />
      <Founders />
      <VisionMission />
      <Note />
      <CtaBand />
      <JsonLd data={aboutPageSchema()} />
    </>
  )
}
