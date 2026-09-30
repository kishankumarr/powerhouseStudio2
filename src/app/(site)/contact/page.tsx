import { ArrowUpRight } from 'lucide-react'
import { PageHero } from '@/components/patterns/page-hero'
import { EnquiryForm } from '@/components/sections/contact/enquiry-form'
import { JsonLd } from '@/components/seo/json-ld'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Media } from '@/components/ui/media'
import { Section } from '@/components/ui/section'
import { getContent } from '@/content'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { localBusinessSchema } from '@/lib/seo/schema'

export const metadata = buildMetadata({ ...getContent().seo.contact, path: '/contact' })

export default function ContactPage() {
  const { contact, site, services, common } = getContent()
  const d = contact.details
  const rows = [
    { label: d.phoneLabel, value: site.phone.display, href: site.phone.href },
    { label: d.emailLabel, value: site.email.display, href: site.email.href },
    {
      label: d.instagramLabel,
      value: site.instagram.handle,
      href: site.instagram.url,
      external: true,
    },
    { label: d.websiteLabel, value: site.website.display, href: site.website.url, external: true },
  ]

  return (
    <>
      <PageHero
        eyebrow={contact.hero.eyebrow}
        title={contact.hero.title}
        lead={contact.hero.lead}
      />

      <Section id="enquiry" labelledBy="enquiry-title" className="pt-0!">
        <div className="container-ph grid gap-12 lg:grid-cols-12 lg:gap-16">
          <aside className="grid content-start gap-8 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <div data-tone="accent" className="grid gap-6 rounded-lg p-7 sm:p-9">
              <p className="flex items-center gap-2 label-type text-fg">
                <span className="ph-rec-dot inline-block size-2.5 rounded-full bg-fg" />
                {common.hud.live}
              </p>
              <address className="grid gap-5 not-italic">
                <p className="grid">
                  <span className="display-type text-display-sm text-fg">{d.title}</span>
                  <span className="text-fg-muted">
                    <span className="sr-only">{d.locationLabel}</span> {common.footer.location}
                  </span>
                </p>
                <dl className="grid gap-4">
                  {rows.map((r) => (
                    <div key={r.label} className="grid gap-0.5 border-t border-fg/20 pt-4">
                      <dt className="label-type text-fg-muted">{r.label}</dt>
                      <dd>
                        <a
                          href={r.href}
                          {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="inline-flex items-center gap-1.5 text-lg font-semibold break-all text-fg underline-offset-4 hover:underline sm:text-xl"
                        >
                          {r.value}
                          {r.external && (
                            <>
                              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
                              <span className="sr-only">{common.external}</span>
                            </>
                          )}
                        </a>
                      </dd>
                    </div>
                  ))}
                </dl>
              </address>
            </div>
            <Media
              image="contactCoast"
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="hidden aspect-[16/10] rounded-lg sm:block"
            />
          </aside>

          <div className="grid content-start gap-8 lg:col-span-7">
            <div className="grid gap-4">
              <Eyebrow>{contact.hero.eyebrow}</Eyebrow>
              <h2 id="enquiry-title" className="display-type text-display-md text-fg">
                {contact.form.title}
              </h2>
              <p className="text-lead text-fg-muted">{contact.form.intro}</p>
            </div>
            <EnquiryForm
              copy={contact.form}
              services={services.items.map((s) => s.name)}
              to={site.email.display}
            />
          </div>
        </div>
      </Section>

      <section aria-label={contact.signoff} className="overflow-hidden pb-24">
        <p className="container-ph text-center display-type text-display-xl text-fg">
          <span className="hl">{contact.signoff}</span>
        </p>
      </section>

      <JsonLd data={localBusinessSchema()} />
    </>
  )
}
