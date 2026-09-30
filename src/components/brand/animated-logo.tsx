import { cn } from '@/lib/utils'
import { IntroFlag } from './intro-flag'
import {
  CAMERA_PLAY_CENTER,
  LOGO_FILL_RULE,
  LOGO_PATHS,
  LOGO_VIEWBOX,
  MIC_HEAD,
  RIBBON_CENTERLINE,
} from './logo-paths'

type AnimatedLogoProps = { label: string; className?: string; id?: string }

/**
 * The signature moment: input → output.
 *   0.00s the PS ribbon draws (a thick centreline stroke inside a mask)
 *   0.55s the mic pops and pings
 *   0.85s the camera rolls in, its play button blinks, REC flashes
 *   1.10s the wordmark pill wipes open, then STUDIOS snaps in
 * Pure CSS keyframes (see globals.css → "Logo"), so it plays at first paint, never
 * leaves an empty box, runs once per session and is static under reduced motion.
 */
export function AnimatedLogo({ label, className, id = 'ph-logo' }: AnimatedLogoProps) {
  const maskId = `${id}-ribbon-mask`
  const mic = MIC_HEAD
  const play = CAMERA_PLAY_CENTER
  return (
    <IntroFlag className={cn('ph-logo-anim relative', className)}>
      <svg
        viewBox={LOGO_VIEWBOX.full}
        role="img"
        aria-label={label}
        fillRule={LOGO_FILL_RULE}
        className="block h-auto w-full overflow-visible"
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="-200" y="-200" width="1540" height="1100">
            <path
              className="ph-logo-draw"
              d={RIBBON_CENTERLINE.d}
              pathLength={1}
              fill="none"
              stroke="#fff"
              strokeWidth={RIBBON_CENTERLINE.strokeWidth}
              strokeLinecap="butt"
              strokeLinejoin="round"
            />
          </mask>
        </defs>

        <g className="fill-(--ph-logo-ink)">
          <path d={LOGO_PATHS.ribbon} mask={`url(#${maskId})`} />

          <g className="ph-logo-mic" style={{ transformOrigin: `${mic.cx}px ${mic.cy}px` }}>
            <path d={LOGO_PATHS.mic} />
          </g>
          {/* Sonar ping from the mic head */}
          <ellipse
            aria-hidden="true"
            className="ph-logo-ping fill-none stroke-(--ph-logo-ink)"
            cx={mic.cx}
            cy={mic.cy}
            rx={mic.r + 10}
            ry={mic.ry + 10}
            strokeWidth={6}
            style={{ transformOrigin: `${mic.cx}px ${mic.cy}px` }}
          />

          <g className="ph-logo-cam">
            <path d={LOGO_PATHS.cameraBody} />
            <path d={LOGO_PATHS.cameraLens} />
            <path d={LOGO_PATHS.cameraScreenFrame} />
            <path
              d={LOGO_PATHS.cameraPlayButton}
              className="ph-logo-play"
              style={{ transformOrigin: `${play.cx}px ${play.cy}px` }}
            />
          </g>
        </g>

        {/* REC dot above the camera */}
        <circle
          aria-hidden="true"
          className="ph-logo-rec fill-(--ph-logo-word)"
          cx={1000}
          cy={-22}
          r={11}
        />

        <g className="ph-logo-word">
          <path
            d={LOGO_PATHS.pill}
            className="fill-(--ph-logo-pill) stroke-(--ph-logo-pill-edge)"
            strokeWidth={3}
            vectorEffect="non-scaling-stroke"
          />
          <path d={LOGO_PATHS.wordPowerhouse} className="fill-(--ph-logo-word)" />
          <g className="ph-logo-inset" style={{ transformOrigin: '894px 630px' }}>
            <path d={LOGO_PATHS.studiosInset} className="fill-(--ph-logo-inset)" />
            <path d={LOGO_PATHS.wordStudios} className="fill-(--ph-logo-inset-ink)" />
          </g>
        </g>
      </svg>
    </IntroFlag>
  )
}
