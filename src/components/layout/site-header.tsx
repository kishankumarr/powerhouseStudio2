import NextLink from 'next/link'
import { Logo } from '@/components/brand/logo'
import { ButtonLink } from '@/components/ui/button'
import { getContent } from '@/content'
import { HeaderShell } from './header-shell'
import { MobileNav } from './mobile-nav'
import { NavLinks } from './nav-links'

export function SiteHeader() {
  const { common, site } = getContent()
  return (
    <HeaderShell>
      {/* Background lives on its own layer: a backdrop-filter on <header> itself would
          become the containing block for the fixed mobile menu. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 border-b border-transparent opacity-0 transition-[opacity,border-color] duration-500 group-data-scrolled/header:border-border group-data-scrolled/header:bg-bg/85 group-data-scrolled/header:opacity-100 group-data-scrolled/header:backdrop-blur-xl layout-blocks:group-data-scrolled/header:border-b-(length:--ph-border-width) layout-blocks:group-data-scrolled/header:border-border-strong"
      />
      <div className="container-ph flex h-(--ph-header-h) items-center justify-between gap-6">
        <NextLink
          href="/"
          aria-label={common.homeLabel}
          className="group/logo relative z-[70] flex shrink-0 items-center gap-3 transition-opacity duration-300 group-data-menu/header:pointer-events-none group-data-menu/header:opacity-0"
        >
          <Logo variant="mark" decorative className="h-9 w-auto sm:h-10" />
          <Logo variant="wordmark" decorative className="hidden h-[1.375rem] w-auto sm:block" />
        </NextLink>

        <div className="flex items-center gap-3 layout-editorial:gap-6">
          <NavLinks items={common.nav} label={common.navLabel} />
          {/* Wrapped: ButtonLink's own inline-flex would override a `hidden` passed in. */}
          <div className="hidden sm:block">
            <ButtonLink href={common.primaryCta.href} size="md">
              {common.primaryCta.label}
            </ButtonLink>
          </div>
          <MobileNav
            logo={<Logo variant="mark" decorative className="h-9 w-auto" />}
            items={common.nav}
            cta={common.primaryCta}
            labels={{
              open: common.menuOpen,
              close: common.menuClose,
              title: common.menuTitle,
              navLabel: common.navLabel,
            }}
            contact={{
              phone: { label: site.phone.display, href: site.phone.href },
              email: { label: site.email.display, href: site.email.href },
              instagram: { label: site.instagram.handle, href: site.instagram.url },
              signoff: common.footer.signoff,
            }}
          />
        </div>
      </div>
    </HeaderShell>
  )
}
