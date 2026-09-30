import { Reveal } from '@/components/motion/reveal'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Media } from '@/components/ui/media'
import { Section } from '@/components/ui/section'
import { getContent } from '@/content'

export function Story() {
  const { story } = getContent().about
  const [first, ...rest] = story.paragraphs
  return (
    <Section id="story" labelledBy="story-title">
      <div className="container-ph grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="grid content-start gap-8 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <Eyebrow>{story.eyebrow}</Eyebrow>
          <h2 id="story-title" className="display-type text-display-md text-fg">
            {story.promiseLine}
          </h2>
          <Media
            image="aboutTeam"
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="aspect-[4/3] rounded-lg"
          />
        </div>
        <div className="grid content-start gap-8 lg:col-span-7 lg:pt-16">
          <p className="display-type text-display-sm leading-[1.15] text-fg [--ph-display-case:none] style-rounded:leading-[1.2]">
            {first}
          </p>
          {rest.map((p) => (
            <Reveal key={p}>
              <p className="text-lead text-fg-muted">{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
