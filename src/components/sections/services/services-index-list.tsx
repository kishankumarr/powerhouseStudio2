import { ArrowUpRight } from 'lucide-react'
import NextLink from 'next/link'
import { SERVICE_ICONS } from '@/components/icons/service-icons'
import { Reveal } from '@/components/motion/reveal'
import { Media } from '@/components/ui/media'
import { Section } from '@/components/ui/section'
import { servicePath } from '@/config/routes'
import { getContent } from '@/content'
import { cn, pad2 } from '@/lib/utils'

/** All eight services as alternating magazine spreads. */
export function ServicesIndexList() {
  const { services, common } = getContent()
  return (
    <Section id="all-services" labelledBy="all-services-title" className="pt-0!">
      <div className="container-ph grid gap-6">
        <h2 id="all-services-title" className="sr-only">
          {services.index.listTitle}
        </h2>
        {services.items.map((s, i) => {
          const Icon = SERVICE_ICONS[s.slug]
          const flip = i % 2 === 1
          return (
            <Reveal key={s.slug}>
              <article
                className={cn(
                  'group/svc relative grid gap-8 border-t border-border py-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-14',
                  'layout-blocks:border-t-(length:--ph-border-width) layout-blocks:border-border-strong',
                )}
              >
                <div className={cn('relative lg:col-span-5', flip && 'lg:order-2 lg:col-start-8')}>
                  <Media
                    image={s.image}
                    decorative
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="aspect-[4/3] rounded-lg"
                    imgClassName="transition-[transform,filter] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/svc:scale-105 group-hover/svc:[filter:var(--ph-img-filter-hover)]"
                  />
                  <span className="ph-viewfinder opacity-0 transition-opacity duration-500 [--vf-c:var(--ph-white)] [--vf-inset:0.9rem] group-hover/svc:opacity-100" />
                </div>
                <div
                  className={cn(
                    'grid content-center gap-6 lg:col-span-6',
                    flip ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-7',
                  )}
                >
                  <div className="flex items-center gap-4 text-fg-muted">
                    <span aria-hidden="true" className="label-type tabular">
                      {pad2(i + 1)}
                    </span>
                    <span aria-hidden="true" className="h-px flex-1 bg-border" />
                    <Icon className="size-7 text-fg" />
                  </div>
                  <h3 className="display-type text-display-md text-fg">
                    <NextLink
                      href={servicePath(s.slug)}
                      className="after:absolute after:inset-0 after:content-[''] hover:underline hover:decoration-accent-ink hover:decoration-4 hover:underline-offset-8"
                    >
                      {s.name}
                    </NextLink>
                  </h3>
                  <p className="text-lead text-fg-muted">{s.summary}</p>
                  <ul className="flex flex-wrap gap-2">
                    {s.capabilities.slice(0, 6).map((c) => (
                      <li
                        key={c}
                        className="rounded-pill border-ph border-border px-3 py-1.5 text-sm text-fg"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-2 font-semibold text-fg">
                    {common.viewService}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover/svc:rotate-45"
                    />
                  </span>
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
