import { CtaBand } from '@/components/patterns/cta-band'
import { Audiences } from '@/components/sections/home/audiences'
import { Belief } from '@/components/sections/home/belief'
import { Hero } from '@/components/sections/home/hero'
import { Industries } from '@/components/sections/home/industries'
import { Intro } from '@/components/sections/home/intro'
import { Process } from '@/components/sections/home/process'
import { ReasonsMarquee } from '@/components/sections/home/reasons-marquee'
import { ServicesReel } from '@/components/sections/home/services-reel'
import { Why } from '@/components/sections/home/why'
import { JsonLd } from '@/components/seo/json-ld'
import { getContent } from '@/content'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { localBusinessSchema } from '@/lib/seo/schema'

export const metadata = buildMetadata({ ...getContent().seo.home, path: '/', absoluteTitle: true })

export default function HomePage() {
  return (
    <>
      <Hero />
      <ReasonsMarquee />
      <Intro />
      <Belief />
      <ServicesReel />
      <Audiences />
      <Process />
      <Why />
      <Industries />
      <CtaBand />
      <JsonLd data={localBusinessSchema()} />
    </>
  )
}
