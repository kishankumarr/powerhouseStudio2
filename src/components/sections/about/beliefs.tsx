import { Stagger, StaggerItem } from '@/components/motion/stagger'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { getContent } from '@/content'
import { pad2 } from '@/lib/utils'

export function Beliefs() {
  const { beliefs } = getContent().about
  const chain = beliefs.chain.split('→').map((s) => s.trim())
  return (
    <Section id="beliefs" labelledBy="beliefs-title">
      <div className="container-ph grid gap-14">
        <div className="grid gap-6">
          <Eyebrow>{beliefs.eyebrow}</Eyebrow>
          <h2
            id="beliefs-title"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 display-type text-display-xl text-fg"
          >
            {chain.map((word, i) => (
              <span key={word} className="flex items-center gap-x-5">
                <span className={i === chain.length - 1 ? 'hl' : undefined}>{word}</span>
                {i < chain.length - 1 && (
                  <span aria-hidden="true" className="text-fg-muted">
                    {'→'}
                  </span>
                )}
              </span>
            ))}
          </h2>
        </div>
        <Stagger as="ol" className="grid gap-10 md:grid-cols-3 md:gap-8">
          {beliefs.items.map((b, i) => (
            <StaggerItem
              as="li"
              key={b.title}
              className="grid content-start gap-4 border-t-2 border-accent-ink pt-6"
            >
              <span aria-hidden="true" className="label-type text-fg-muted tabular">
                {pad2(i + 1)}
              </span>
              <h3 className="display-type text-display-sm text-fg">{b.title}</h3>
              <p className="text-fg-muted">{b.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="label-type text-fg-muted">{beliefs.closing}</p>
      </div>
    </Section>
  )
}
