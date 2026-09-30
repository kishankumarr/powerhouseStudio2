import { Marquee } from '@/components/patterns/marquee'
import { SectionHeader } from '@/components/patterns/section-header'
import { ButtonLink } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { getContent } from '@/content'

/** Sixteen industries running as two strips of film in opposite directions. */
export function Industries() {
  const { home, work } = getContent()
  const s = home.industries
  const items = work.industries.items
  const half = Math.ceil(items.length / 2)
  const rows = [items.slice(0, half), items.slice(half)]

  return (
    <Section id="industries" labelledBy="industries-title" className="overflow-hidden">
      <div className="container-ph">
        <SectionHeader
          id="industries-title"
          eyebrow={s.eyebrow}
          title={s.title}
          lead={s.lead}
          align="split"
        >
          <ButtonLink href={s.link.href} variant="secondary" className="w-fit">
            {s.link.label}
          </ButtonLink>
        </SectionHeader>
      </div>

      {/* Screen readers get the list once; the moving strips below are decorative. */}
      <ul className="sr-only">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>

      <div aria-hidden="true" className="mt-16 grid -rotate-1 gap-3 [--sp:var(--ph-bg)]">
        {rows.map((row, r) => (
          <div
            key={r}
            data-tone={r === 0 ? 'contrast' : undefined}
            className="ph-sprockets bg-surface-2 py-6 data-tone:bg-bg"
          >
            <Marquee duration={48} reverse={r === 1}>
              {row.map((it) => (
                <span key={it} className="flex items-center">
                  <span className="px-7 display-type text-[clamp(2rem,4.5vw,4.25rem)] leading-none whitespace-nowrap text-fg">
                    {it}
                  </span>
                  <span className="inline-block size-3 rounded-full bg-accent-ink" />
                </span>
              ))}
            </Marquee>
          </div>
        ))}
      </div>
    </Section>
  )
}
