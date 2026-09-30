import { ArrowUpRight, Mail, Phone } from 'lucide-react'
import { IconInstagram } from '@/components/icons/icon-instagram'
import { Reveal } from '@/components/motion/reveal'
import { ButtonLink } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { getContent } from '@/content'

type CtaBandProps = {
  id?: string
  eyebrow?: string
  title?: string
  body?: string
}

/** The closing "Let's talk" band used across pages. The loudest block in each theme. */
export function CtaBand({ id = 'cta', eyebrow, title, body }: CtaBandProps) {
  const { home, site, common } = getContent()
  const c = home.cta
  const headingId = `${id}-title`
  return (
    <Section id={id} tone="accent" labelledBy={headingId} className="overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-[repeating-linear-gradient(90deg,var(--ph-fg)_0_18px,transparent_18px_30px)] opacity-90 layout-blocks:hidden"
      />
      <div className="container-ph grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="grid gap-8 lg:col-span-8">
          <Eyebrow className="text-fg">{eyebrow ?? c.eyebrow}</Eyebrow>
          <Reveal>
            <h2 id={headingId} className="display-type text-display-xl text-fg">
              {title ?? c.title}
            </h2>
          </Reveal>
          <p className="max-w-xl text-lead text-fg-muted">{body ?? c.body}</p>
        </div>
        <div className="grid gap-6 lg:col-span-4 lg:justify-items-end">
          <ButtonLink href={c.primary.href} size="lg">
            {c.primary.label}
          </ButtonLink>
          <ul className="grid gap-3 text-fg lg:justify-items-end">
            <li>
              <a
                href={site.phone.href}
                className="group inline-flex min-h-11 items-center gap-3 font-semibold"
              >
                <Phone aria-hidden="true" className="size-4" />
                <span className="sr-only">{c.callLabel}</span>
                <span className="underline-offset-4 group-hover:underline">
                  {site.phone.display}
                </span>
              </a>
            </li>
            <li>
              <a
                href={site.email.href}
                className="group inline-flex min-h-11 items-center gap-3 font-semibold"
              >
                <Mail aria-hidden="true" className="size-4" />
                <span className="sr-only">{c.emailLabel}</span>
                <span className="break-all underline-offset-4 group-hover:underline">
                  {site.email.display}
                </span>
              </a>
            </li>
            <li>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-center gap-3 font-semibold"
              >
                <IconInstagram className="size-4" />
                <span className="sr-only">{c.instagramLabel}</span>
                <span className="underline-offset-4 group-hover:underline">
                  {site.instagram.handle}
                </span>
                <ArrowUpRight aria-hidden="true" className="size-4" />
                <span className="sr-only">{common.external}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Section>
  )
}
