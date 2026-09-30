import { ArrowRight } from 'lucide-react'
import NextLink from 'next/link'
import { SectionHeader } from '@/components/patterns/section-header'
import { Media } from '@/components/ui/media'
import { Section } from '@/components/ui/section'
import { getContent } from '@/content'
import { pad2 } from '@/lib/utils'

/**
 * Brands / Creators / Events as three tall panels. On wide screens the hovered or
 * focused panel widens (pure CSS flex-grow), like picking a shot on a contact sheet.
 */
export function Audiences() {
  const { audiences } = getContent().home
  return (
    <Section id="audiences" labelledBy="audiences-title" tone="contrast">
      <div className="container-ph grid gap-14">
        <SectionHeader id="audiences-title" eyebrow={audiences.eyebrow} title={audiences.title} />
        <ul className="flex flex-col gap-3 lg:h-[38rem] lg:flex-row layout-blocks:gap-(--ph-border-width)">
          {audiences.items.map((item, i) => (
            <li
              key={item.id}
              className="group/aud relative min-h-[26rem] overflow-hidden rounded-lg transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:min-h-0 lg:flex-1 lg:hover:grow-[1.9] lg:has-focus-visible:grow-[1.9]"
            >
              <Media
                image={item.image}
                sizes="(min-width: 1024px) 50vw, 100vw"
                decorative
                fill
                imgClassName="scale-105 transition-[transform,filter] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/aud:scale-100 group-hover/aud:[filter:var(--ph-img-filter-hover)]"
              />
              <span aria-hidden="true" className="ph-scrim" />
              <div className="on-media relative flex h-full flex-col justify-between gap-10 p-6 sm:p-8">
                <p className="flex items-center justify-between label-type text-fg">
                  <span>{item.name}</span>
                  <span aria-hidden="true" className="text-fg-muted tabular">
                    {pad2(i + 1)}
                  </span>
                </p>
                <div className="grid gap-4">
                  <h3 className="max-w-md display-type text-display-sm text-fg">{item.headline}</h3>
                  <p className="max-w-sm text-fg-muted lg:max-h-0 lg:overflow-hidden lg:opacity-0 lg:transition-all lg:duration-700 lg:group-hover/aud:max-h-40 lg:group-hover/aud:opacity-100 lg:group-has-focus-visible/aud:max-h-40 lg:group-has-focus-visible/aud:opacity-100">
                    {item.body}
                  </p>
                  <NextLink
                    href={item.link.href}
                    className="group/link inline-flex w-fit items-center gap-2 font-semibold text-fg after:absolute after:inset-0 after:content-['']"
                  >
                    <span className="underline decoration-accent-ink decoration-2 underline-offset-8">
                      {item.link.label}
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover/link:translate-x-1"
                    />
                  </NextLink>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
