import { ArrowUpRight } from 'lucide-react'
import NextLink from 'next/link'
import { SERVICE_ICONS } from '@/components/icons/service-icons'
import { SectionHeader } from '@/components/patterns/section-header'
import { ButtonLink } from '@/components/ui/button'
import { Media, mediaProps } from '@/components/ui/media'
import { Section } from '@/components/ui/section'
import { servicePath } from '@/config/routes'
import { getContent } from '@/content'
import { cn, pad2 } from '@/lib/utils'
import { ServiceHoverPreview } from './service-hover-preview'

/**
 * The eight services. One list, three compositions:
 * cinematic = rows with a cursor-following preview, editorial = photo cards,
 * blocks = heavy-ruled rows with thumbnails.
 */
export function ServicesReel({ headingLevel = 'h2' }: { headingLevel?: 'h2' | 'h3' } = {}) {
  const { home, services } = getContent()
  const s = home.services
  const Title = headingLevel === 'h2' ? 'h3' : 'h4'
  return (
    <Section id="services" labelledBy="services-title">
      <div className="container-ph grid gap-14">
        <SectionHeader
          id="services-title"
          eyebrow={s.eyebrow}
          title={s.title}
          lead={s.lead}
          align="split"
        >
          <ButtonLink href={s.link.href} variant="secondary" className="w-fit">
            {s.link.label}
          </ButtonLink>
        </SectionHeader>

        <ServiceHoverPreview images={services.items.map((it) => mediaProps(it.image, '336px'))}>
          <ol
            className={cn(
              'grid',
              'layout-editorial:gap-x-6 layout-editorial:gap-y-12 sm:layout-editorial:grid-cols-2 xl:layout-editorial:grid-cols-4',
              'layout-cinematic:border-b layout-cinematic:border-border',
              'layout-blocks:border-b-(length:--ph-border-width) layout-blocks:border-border-strong',
            )}
          >
            {services.items.map((item, i) => {
              const Icon = SERVICE_ICONS[item.slug]
              return (
                <li key={item.slug} data-preview-index={i}>
                  <NextLink
                    href={servicePath(item.slug)}
                    className={cn(
                      'group/row relative isolate grid items-center gap-x-6 gap-y-3 overflow-hidden outline-offset-[-3px]',
                      // rows (cinematic + blocks)
                      'layout-cinematic:grid-cols-[auto_1fr_auto] layout-cinematic:border-t layout-cinematic:border-border layout-cinematic:py-7 lg:layout-cinematic:py-9',
                      'layout-blocks:grid-cols-[auto_1fr_auto] layout-blocks:border-t-(length:--ph-border-width) layout-blocks:border-border-strong layout-blocks:py-6 lg:layout-blocks:grid-cols-[auto_1fr_auto_auto]',
                      // cards (editorial)
                      'layout-editorial:content-start layout-editorial:gap-4',
                    )}
                  >
                    {/* Hover wipe (rows) */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/row:scale-y-100 group-focus-visible/row:scale-y-100 layout-editorial:hidden"
                    />

                    {/* Card image (editorial) / thumbnail (blocks) */}
                    <Media
                      image={item.image}
                      sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw"
                      decorative
                      className={cn(
                        'hidden',
                        'layout-editorial:block layout-editorial:aspect-[4/3] layout-editorial:rounded-lg sm:layout-editorial:aspect-[4/5]',
                        'lg:layout-blocks:order-last lg:layout-blocks:block lg:layout-blocks:h-20 lg:layout-blocks:w-32 lg:layout-blocks:rounded-sm',
                      )}
                      imgClassName="transition-[transform,filter] duration-700 group-hover/row:scale-105 group-hover/row:[filter:var(--ph-img-filter-hover)]"
                    />

                    <span
                      aria-hidden="true"
                      className="self-start pt-2 label-type text-fg-muted tabular transition-colors group-hover/row:text-accent-fg layout-editorial:hidden layout-editorial:group-hover/row:text-fg-muted"
                    >
                      {pad2(i + 1)}
                    </span>

                    <span className="grid gap-2 pr-2">
                      <Title
                        className={cn(
                          'display-type text-fg transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                          'layout-cinematic:text-display-md layout-editorial:text-2xl layout-blocks:text-display-md',
                          'group-hover/row:text-accent-fg layout-editorial:group-hover/row:text-fg',
                          'layout-cinematic:group-hover/row:translate-x-3 layout-blocks:group-hover/row:translate-x-3',
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="mr-3 hidden align-middle label-type text-fg-muted layout-editorial:inline"
                        >
                          {pad2(i + 1)}
                        </span>
                        {item.name}
                      </Title>
                      <span className="max-w-md text-fg-muted transition-colors group-hover/row:text-accent-fg layout-editorial:group-hover/row:text-fg-muted">
                        {item.summary}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className="flex items-center gap-3 text-fg transition-colors group-hover/row:text-accent-fg layout-editorial:hidden"
                    >
                      <Icon className="hidden size-8 sm:block" />
                      <span className="grid size-12 place-items-center rounded-pill border-ph border-current transition-transform duration-500 group-hover/row:rotate-45">
                        <ArrowUpRight className="size-5" />
                      </span>
                    </span>
                  </NextLink>
                </li>
              )
            })}
          </ol>
        </ServiceHoverPreview>
      </div>
    </Section>
  )
}
