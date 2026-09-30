import { Section } from '@/components/ui/section'
import { getContent } from '@/content'
import { BeliefSequence } from './belief-sequence'

export function Belief() {
  const { belief } = getContent().home
  return (
    <Section id="belief" labelledBy="belief-title" className="lg:py-0!">
      <BeliefSequence
        eyebrow={belief.eyebrow}
        title={belief.title}
        items={belief.items}
        closing={belief.closing}
      />
    </Section>
  )
}
