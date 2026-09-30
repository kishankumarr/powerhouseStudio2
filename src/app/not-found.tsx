import {
  LOGO_FILL_RULE,
  LOGO_PATHS,
  LOGO_VIEWBOX,
  RIBBON_CENTERLINE,
} from '@/components/brand/logo-paths'
import { BackgroundLayers } from '@/components/layout/background-layers'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { SkipLink } from '@/components/layout/skip-link'
import { ThemeDock } from '@/components/layout/theme-dock'
import { ButtonLink } from '@/components/ui/button'
import { getContent } from '@/content'

export default function NotFound() {
  const { notFound, common, config } = getContent()
  return (
    <>
      <SkipLink label={common.skipLink} />
      <BackgroundLayers />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <section
          aria-labelledby="nf-title"
          className="container-ph grid min-h-[100svh] content-center gap-12 pt-(--ph-header-h) pb-20 lg:grid-cols-12 lg:items-center"
        >
          <div className="grid gap-8 lg:col-span-6">
            <p className="flex items-center gap-3 label-type text-fg-muted">
              <span
                aria-hidden="true"
                className="inline-block size-2.5 rounded-full border-2 border-fg-muted"
              />
              <span>{common.hud.rec}</span>
              <span className="text-fg tabular">{notFound.code}</span>
            </p>
            <h1 id="nf-title" className="display-type text-display-xl text-fg">
              {notFound.title}
            </h1>
            <p className="max-w-lg text-lead text-fg-muted">{notFound.body}</p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={notFound.home.href} size="lg">
                {notFound.home.label}
              </ButtonLink>
              <ButtonLink href={notFound.services.href} size="lg" variant="secondary">
                {notFound.services.label}
              </ButtonLink>
            </div>
          </div>
          {/* The ribbon keeps drawing and un-drawing: a take that never lands. */}
          <div aria-hidden="true" className="relative lg:col-span-5 lg:col-start-8">
            <div className="ph-viewfinder [--vf-c:var(--ph-border-strong)] [--vf-inset:-1.5rem]" />
            <svg
              viewBox={LOGO_VIEWBOX.mark}
              fillRule={LOGO_FILL_RULE}
              className="w-full overflow-visible"
            >
              <defs>
                <mask
                  id="nf-mask"
                  maskUnits="userSpaceOnUse"
                  x="-200"
                  y="-200"
                  width="1540"
                  height="1100"
                >
                  <path
                    className="ph-logo-draw-loop"
                    d={RIBBON_CENTERLINE.d}
                    pathLength={1}
                    fill="none"
                    stroke="#fff"
                    strokeWidth={RIBBON_CENTERLINE.strokeWidth}
                  />
                </mask>
              </defs>
              <path d={LOGO_PATHS.ribbon} className="fill-(--ph-border)" />
              <path d={LOGO_PATHS.ribbon} mask="url(#nf-mask)" className="fill-(--ph-logo-ink)" />
              <g className="fill-(--ph-logo-ink)">
                <path d={LOGO_PATHS.mic} />
                <path d={LOGO_PATHS.cameraBody} />
                <path d={LOGO_PATHS.cameraLens} />
                <path d={LOGO_PATHS.cameraScreenFrame} />
                <path d={LOGO_PATHS.cameraPlayButton} />
              </g>
            </svg>
          </div>
        </section>
      </main>
      <SiteFooter />
      <ThemeDock copy={config} />
    </>
  )
}
