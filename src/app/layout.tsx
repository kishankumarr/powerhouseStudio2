import type { Metadata, Viewport } from 'next'
import { MotionProvider } from '@/components/motion/motion-provider'
import { JsonLd } from '@/components/seo/json-ld'
import { DEFAULT_PRESET, PRESETS, THEME_COLOR } from '@/config/themes'
import { getContent } from '@/content'
import { buildPrefsBootScript } from '@/lib/prefs-boot-script'
import { organizationSchema, websiteSchema } from '@/lib/seo/schema'
import { cn } from '@/lib/utils'
import { StoreProvider } from '@/store/store-provider'
import { instrument, saira } from './fonts'
import '@/styles/globals.css'

const content = getContent()
const defaults = PRESETS[DEFAULT_PRESET]

export const metadata: Metadata = {
  metadataBase: new URL(content.site.url),
  title: { default: content.seo.home.title, template: `%s | ${content.site.name}` },
  description: content.seo.home.description,
  applicationName: content.site.name,
  authors: [{ name: content.site.name, url: content.site.url }],
  creator: content.site.name,
  publisher: content.site.name,
  category: 'business',
  formatDetection: { telephone: true, email: true, address: false },
  openGraph: { siteName: content.site.name, locale: content.locale.ogLocale, type: 'website' },
}

export const viewport: Viewport = {
  themeColor: THEME_COLOR[defaults.theme],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const NOSCRIPT_CSS =
  '[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={content.locale.lang}
      data-theme={defaults.theme}
      data-layout={defaults.layout}
      data-style={defaults.style}
      data-preset={DEFAULT_PRESET}
      suppressHydrationWarning
      className={cn(saira.variable, instrument.variable)}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: buildPrefsBootScript() }} />
        <noscript>
          <style>{NOSCRIPT_CSS}</style>
        </noscript>
      </head>
      <body>
        <StoreProvider>
          <MotionProvider>{children}</MotionProvider>
        </StoreProvider>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
      </body>
    </html>
  )
}
