import { ScrollFillText } from '@/components/motion/scroll-fill-text'
import { ButtonLink } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { getContent } from '@/content'

export function Intro() {
  const { intro } = getContent().home
  return (
    <Section id="intro" labelledBy="intro-title">
      <div className="container-ph grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Eyebrow>{intro.eyebrow}</Eyebrow>
        </div>
        <div className="grid gap-12 lg:col-span-9">
          <h2 id="intro-title" className="sr-only">
            {intro.eyebrow}
          </h2>
          <ScrollFillText
            text={intro.statement}
            className="display-type text-display-lg leading-[1.02] layout-editorial:text-display-md style-rounded:leading-[1.08]"
          />
          <div className="grid gap-8 sm:grid-cols-[minmax(0,34rem)_auto] sm:items-end sm:justify-between">
            <p className="text-lead text-fg-muted">{intro.body}</p>
            <ButtonLink href={intro.link.href} variant="secondary">
              {intro.link.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  )
}
