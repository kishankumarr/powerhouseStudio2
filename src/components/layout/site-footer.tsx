import { ArrowUp, ArrowUpRight } from 'lucide-react'
import NextLink from 'next/link'
import { Logo } from '@/components/brand/logo'
import { servicePath } from '@/config/routes'
import { IMAGES } from '@/constants/images'
import { getContent } from '@/content'
import { fill } from '@/lib/utils'

export function SiteFooter() {
  const { common, site, services } = getContent()
  const f = common.footer
  const year = new Date(site.lastModified).getFullYear()
  const credits = Array.from(
    new Map(Object.values(IMAGES).map((img) => [img.credit.profileUrl, img.credit])).values(),
  )

  return (
    <footer data-tone="contrast" className="relative overflow-hidden">
      <div className="container-ph pt-20 pb-10 sm:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="grid content-start gap-8 lg:col-span-5">
            <Logo variant="full" decorative className="h-auto w-44 sm:w-52" />
            <p className="max-w-sm text-fg-muted">{f.blurb}</p>
            <p className="display-type text-display-md text-fg">{site.tagline}</p>
          </div>

          <nav
            aria-label={common.footerNavLabel}
            className="grid gap-10 sm:grid-cols-3 lg:col-span-7"
          >
            <div className="grid content-start gap-4">
              <h2 className="label-type text-fg-muted">{f.exploreTitle}</h2>
              <ul className="grid gap-2">
                {common.nav.map((item) => (
                  <li key={item.href}>
                    <NextLink
                      href={item.href}
                      className="text-fg underline-offset-4 hover:underline"
                    >
                      {item.label}
                    </NextLink>
                  </li>
                ))}
                <li>
                  <NextLink
                    href={common.primaryCta.href}
                    className="font-semibold text-fg underline-offset-4 hover:underline"
                  >
                    {common.primaryCta.label}
                  </NextLink>
                </li>
              </ul>
            </div>
            <div className="grid content-start gap-4">
              <h2 className="label-type text-fg-muted">{f.servicesTitle}</h2>
              <ul className="grid gap-2">
                {services.items.map((s) => (
                  <li key={s.slug}>
                    <NextLink
                      href={servicePath(s.slug)}
                      className="text-fg underline-offset-4 hover:underline"
                    >
                      {s.name}
                    </NextLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid content-start gap-4">
              <h2 className="label-type text-fg-muted">{f.contactTitle}</h2>
              <address className="grid gap-3 not-italic">
                <p className="font-semibold text-fg">
                  {site.name}
                  <br />
                  <span className="font-normal text-fg-muted">{f.location}</span>
                </p>
                <p>
                  <span className="sr-only">{f.phoneLabel}</span>
                  <a href={site.phone.href} className="text-fg underline-offset-4 hover:underline">
                    {site.phone.display}
                  </a>
                </p>
                <p>
                  <span className="sr-only">{f.emailLabel}</span>
                  <a
                    href={site.email.href}
                    className="break-all text-fg underline-offset-4 hover:underline"
                  >
                    {site.email.display}
                  </a>
                </p>
                <p>
                  <span className="sr-only">{f.instagramLabel}</span>
                  <a
                    href={site.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-fg underline-offset-4 hover:underline"
                  >
                    {site.instagram.handle}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                    <span className="sr-only">{common.external}</span>
                  </a>
                </p>
              </address>
            </div>
          </nav>
        </div>

        <div className="mt-16 grid gap-6 border-t border-border pt-8 text-sm text-fg-muted lg:grid-cols-12 lg:items-start">
          <p className="lg:col-span-4">{fill(f.rights, { year })}</p>
          <details className="group lg:col-span-6">
            <summary className="cursor-pointer list-none text-fg-muted underline-offset-4 hover:text-fg hover:underline [&::-webkit-details-marker]:hidden">
              {f.creditsTitle}
            </summary>
            <div className="mt-3 grid gap-2">
              <p>{f.creditsNote}</p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {credits.map((c) => (
                  <li key={c.profileUrl}>
                    <a
                      href={c.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-4 hover:text-fg hover:underline"
                    >
                      {fill(f.creditLine, { name: c.name })}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </details>
          <a
            href="#main"
            className="inline-flex items-center gap-2 justify-self-start text-fg-muted hover:text-fg lg:col-span-2 lg:justify-self-end"
          >
            {common.backToTop}
            <ArrowUp aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>

      {/* Sized with container-query units from the word's measured width, so every
          letter fits edge to edge in each style (never clipped). */}
      <div
        aria-hidden="true"
        className="[container-type:inline-size] pointer-events-none container-ph pb-24 select-none sm:pb-[clamp(1.5rem,3vw,2.5rem)]"
      >
        {/* Decorative: drawn by ::after from data-word, so it is not page text. */}
        <p
          data-word={site.shortName}
          className="text-center display-type leading-[0.86] tracking-normal whitespace-nowrap text-fg/[0.08] [--ph-display-case:uppercase] after:content-[attr(data-word)]"
          style={{ fontSize: 'calc(100cqw / (var(--ph-wordmark-em) * 1.015))', letterSpacing: 0 }}
        />
      </div>
    </footer>
  )
}
