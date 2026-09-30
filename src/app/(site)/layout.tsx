import { ViewTransition } from 'react'
import { BackgroundLayers } from '@/components/layout/background-layers'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { SkipLink } from '@/components/layout/skip-link'
import { ThemeDock } from '@/components/layout/theme-dock'
import { getContent } from '@/content'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const { common, config } = getContent()
  return (
    <>
      <SkipLink label={common.skipLink} />
      <BackgroundLayers />
      <SiteHeader />
      <ViewTransition default="ph-page">
        <main id="main" tabIndex={-1} className="relative outline-none">
          {children}
        </main>
      </ViewTransition>
      <SiteFooter />
      <ThemeDock copy={config} />
    </>
  )
}
