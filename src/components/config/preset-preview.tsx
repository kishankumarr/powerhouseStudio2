import { ArrowRight } from 'lucide-react'
import { MarkParts } from '@/components/brand/logo'
import { LOGO_FILL_RULE, LOGO_VIEWBOX } from '@/components/brand/logo-paths'
import { PRESETS, type PresetId } from '@/config/themes'

type PresetPreviewProps = {
  preset: PresetId
  copy: { headline: string; body: string; button: string; card: string }
}

/**
 * A live miniature of the site in a given preset: real tokens, real type, real logo.
 * It sets its own data-theme/layout/style, so it never drifts from the site.
 */
export function PresetPreview({ preset, copy }: PresetPreviewProps) {
  const axes = PRESETS[preset]
  return (
    <div
      aria-hidden="true"
      data-theme={axes.theme}
      data-layout={axes.layout}
      data-style={axes.style}
      className="relative isolate grid aspect-[4/3] content-between gap-3 overflow-hidden bg-bg p-5 text-fg"
    >
      <div className="ph-pattern" />
      <div className="relative flex items-center justify-between">
        <svg viewBox={LOGO_VIEWBOX.mark} fillRule={LOGO_FILL_RULE} className="h-6 w-auto">
          <MarkParts />
        </svg>
        <span className="flex gap-1.5">
          <span className="h-1 w-6 bg-fg/40" />
          <span className="h-1 w-6 bg-fg/40" />
          <span className="h-1 w-6 bg-fg/40" />
        </span>
      </div>
      <div className="relative grid gap-2">
        <p className="display-type text-[calc(2.1rem*var(--ph-display-scale))] leading-(--ph-leading-display)">
          <span className="hl theme-noir:bg-transparent theme-noir:px-0 theme-noir:text-accent-ink">
            {copy.headline}
          </span>
        </p>
        <p className="max-w-[18rem] text-xs text-fg-muted">{copy.body}</p>
      </div>
      <div className="relative flex items-end justify-between gap-3">
        <span className="cut-fill inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[0.6rem] font-bold tracking-wider text-accent-fg uppercase [--fill:var(--ph-accent)]">
          {copy.button}
          <ArrowRight className="size-3" />
        </span>
        <span className="rounded-md border-ph border-border bg-surface px-3 py-2 text-[0.65rem] font-semibold">
          {copy.card}
        </span>
      </div>
    </div>
  )
}
