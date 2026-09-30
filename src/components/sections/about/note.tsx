import { Stagger, StaggerItem } from '@/components/motion/stagger'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { getContent } from '@/content'

/** "A note from Powerhouse": set like closing credits. */
export function Note() {
  const { note, promise } = getContent().about
  return (
    <Section id="note" labelledBy="note-title">
      <div className="container-ph grid gap-12 lg:grid-cols-12">
        <div className="grid content-start gap-6 lg:col-span-5">
          <Eyebrow>{note.eyebrow}</Eyebrow>
          <h2 id="note-title" className="display-type text-display-lg text-fg">
            {note.title}
          </h2>
        </div>
        <div className="grid gap-10 lg:col-span-6 lg:col-start-7">
          <Stagger as="ul" className="grid gap-2">
            {note.lines.map((l) => (
              <StaggerItem as="li" key={l}>
                <p className="display-type text-display-sm text-fg-muted transition-colors hover:text-fg">
                  {l}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="grid gap-4">
            {note.closing.map((p) => (
              <p key={p} className="text-lead text-fg-muted">
                {p}
              </p>
            ))}
          </div>
          <p className="display-type text-display-sm text-fg">
            <span className="hl">{promise.title}</span>
          </p>
        </div>
      </div>
    </Section>
  )
}
