import { cn } from '@/lib/utils'
import { LOGO_FILL_RULE, LOGO_PATHS, LOGO_VIEWBOX } from './logo-paths'

type LogoProps = {
  variant?: 'full' | 'mark' | 'wordmark'
  className?: string
  /** Accessible name; omit with `decorative` when a parent link already names it. */
  label?: string
  decorative?: boolean
}

/**
 * Static, theme-aware logo. Every part is filled from --ph-logo-* tokens, so one
 * artwork serves all three themes (and the light/dark tones inside them).
 */
export function Logo({ variant = 'full', className, label, decorative = false }: LogoProps) {
  const showMark = variant !== 'wordmark'
  const showWord = variant !== 'mark'
  return (
    <svg
      viewBox={LOGO_VIEWBOX[variant]}
      className={cn('overflow-visible', className)}
      fillRule={LOGO_FILL_RULE}
      {...(decorative
        ? { 'aria-hidden': true, focusable: false }
        : { role: 'img', 'aria-label': label })}
    >
      {showMark && <MarkParts />}
      {showWord && <WordmarkParts />}
    </svg>
  )
}

export function MarkParts({ playClassName }: { playClassName?: string }) {
  return (
    <g className="fill-(--ph-logo-ink)">
      <path d={LOGO_PATHS.ribbon} />
      <path d={LOGO_PATHS.mic} />
      <path d={LOGO_PATHS.cameraBody} />
      <path d={LOGO_PATHS.cameraLens} />
      <path d={LOGO_PATHS.cameraScreenFrame} />
      <path d={LOGO_PATHS.cameraPlayButton} className={cn('ph-logo-play-static', playClassName)} />
    </g>
  )
}

export function WordmarkParts() {
  return (
    <g>
      <path
        d={LOGO_PATHS.pill}
        className="fill-(--ph-logo-pill) stroke-(--ph-logo-pill-edge)"
        strokeWidth={3}
        vectorEffect="non-scaling-stroke"
      />
      <path d={LOGO_PATHS.wordPowerhouse} className="fill-(--ph-logo-word)" />
      <path d={LOGO_PATHS.studiosInset} className="fill-(--ph-logo-inset)" />
      <path d={LOGO_PATHS.wordStudios} className="fill-(--ph-logo-inset-ink)" />
    </g>
  )
}
