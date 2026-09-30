import NextLink from 'next/link'
import { Logo } from '@/components/brand/logo'
import { ConfigPanel } from '@/components/config/config-panel'
import { PresetPreview } from '@/components/config/preset-preview'
import { Eyebrow } from '@/components/ui/eyebrow'
import { PRESET_IDS, type PresetId } from '@/config/themes'
import { getContent } from '@/content'
import { buildMetadata } from '@/lib/seo/build-metadata'

export const metadata = buildMetadata({
  ...getContent().seo.config,
  path: '/config',
  noindex: true,
})

export default function ConfigPage() {
  const { config, common } = getContent()
  const p = config.page
  const previewCopy = {
    headline: p.previewHeadline,
    body: p.previewBody,
    button: p.previewButton,
    card: p.previewCard,
  }
  const previews = Object.fromEntries(
    PRESET_IDS.map((id) => [id, <PresetPreview key={id} preset={id} copy={previewCopy} />]),
  ) as Record<PresetId, React.ReactNode>

  return (
    <>
      <header className="container-ph flex h-(--ph-header-h) items-center justify-between">
        <NextLink href="/" aria-label={common.homeLabel} className="flex items-center gap-3">
          <Logo variant="mark" decorative className="h-9 w-auto" />
          <Logo variant="wordmark" decorative className="hidden h-5 w-auto sm:block" />
        </NextLink>
        <NextLink href="/" className="font-semibold underline decoration-2 underline-offset-4">
          {p.viewSite}
        </NextLink>
      </header>
      <main id="main" className="container-ph grid gap-14 pt-12 pb-24">
        <div className="grid gap-6">
          <Eyebrow>{p.eyebrow}</Eyebrow>
          <h1 className="max-w-4xl display-type text-display-lg">{p.title}</h1>
          <p className="max-w-2xl text-lead text-fg-muted">{p.lead}</p>
        </div>
        <ConfigPanel copy={config} previews={previews} />
      </main>
    </>
  )
}
