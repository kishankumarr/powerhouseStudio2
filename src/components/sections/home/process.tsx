import { ButtonLink } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { getContent } from '@/content'
import { ProcessTimeline } from './process-timeline'

export function Process() {
  const { process } = getContent().home
  return (
    <Section id="process" labelledBy="process-title" className="lg:py-0!">
      <ProcessTimeline
        eyebrow={process.eyebrow}
        title={process.title}
        lead={process.lead}
        steps={process.steps}
        labels={{ video: process.trackVideo, audio: process.trackAudio }}
        footer={
          <ButtonLink href={process.link.href} variant="secondary" className="w-fit">
            {process.link.label}
          </ButtonLink>
        }
      />
    </Section>
  )
}
