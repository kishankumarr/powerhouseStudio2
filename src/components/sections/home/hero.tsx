import { AnimatedLogo } from '@/components/brand/animated-logo'
import { Timecode } from '@/components/motion/timecode'
import { ButtonLink } from '@/components/ui/button'
import { Media } from '@/components/ui/media'
import { getContent } from '@/content'
import { cn } from '@/lib/utils'

/**
 * The home hero: one DOM, three compositions.
 * - cinematic: black stage, giant headline, the logo "shot" top-right, viewfinder HUD
 * - editorial: headline left, a taped photo collage right
 * - blocks: headline fills the width, then an on-air band with the logo
 * The h1 paints immediately (LCP); only decorative shutters and the logo animate.
 */
export function Hero() {
  const { home, common } = getContent()
  const h = home.hero
  const last = h.lines.length - 1

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-(--ph-header-h) layout-editorial:pb-16 lg:layout-editorial:pb-24"
    >
      <div aria-hidden="true" className="ph-pattern" />

      {/* Viewfinder HUD (cinematic) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-(--ph-header-h) bottom-0 hidden layout-cinematic:block"
      >
        <div className="ph-viewfinder opacity-60 [--vf-c:var(--ph-fg-muted)] [--vf-inset:clamp(0.75rem,2vw,1.5rem)]" />
        <div className="absolute top-[clamp(1.5rem,3vw,2.5rem)] left-[clamp(1.5rem,3.5vw,3rem)] flex items-center gap-3 label-type text-fg">
          <span className="ph-rec-dot inline-block size-2.5 rounded-full bg-accent-ink" />
          <span>{common.hud.rec}</span>
          <Timecode className="text-fg-muted tabular" />
        </div>
        <div className="absolute bottom-[clamp(1.5rem,3vw,2.5rem)] left-[clamp(1.5rem,3.5vw,3rem)] hidden gap-6 label-type text-fg-muted sm:flex">
          <span>{common.hud.scene}</span>
          <span>{common.hud.take}</span>
          <span className="text-fg">{common.hud.location}</span>
        </div>
      </div>

      <div
        className={cn(
          'relative container-ph grid',
          'layout-cinematic:min-h-[calc(100svh-var(--ph-header-h))] layout-cinematic:content-center layout-cinematic:pt-16 layout-cinematic:pb-32',
          // Cinematic, wide: the logo sits in a right-hand column overlaying lines 1–2 only.
          'lg:layout-cinematic:grid-cols-[minmax(0,1fr)_min(28vw,30rem)]',
          'layout-editorial:gap-12 layout-editorial:pt-10 lg:layout-editorial:grid-cols-12 lg:layout-editorial:items-center lg:layout-editorial:pt-16',
          'layout-blocks:gap-10 layout-blocks:pt-8 layout-blocks:pb-0',
        )}
      >
        {/* Logo stage: the one orchestrated moment on the page */}
        <div
          className={cn(
            'relative layout-editorial:hidden',
            'layout-cinematic:mx-auto layout-cinematic:mb-10 layout-cinematic:w-[min(78vw,22rem)]',
            'lg:layout-cinematic:col-start-2 lg:layout-cinematic:row-start-1 lg:layout-cinematic:mx-0 lg:layout-cinematic:mt-[2.6vw] lg:layout-cinematic:mb-0 lg:layout-cinematic:w-full lg:layout-cinematic:self-start',
            'layout-blocks:order-2',
          )}
        >
          <div
            aria-hidden="true"
            className="absolute -inset-[18%] rounded-full bg-[radial-gradient(closest-side,var(--ph-glow),transparent)] layout-blocks:hidden"
          />
          <div className="tone-accent-in-blocks relative layout-blocks:mx-[calc(50%-50vw)] layout-blocks:grid layout-blocks:gap-8 layout-blocks:bg-bg layout-blocks:px-[max(var(--ph-gutter),calc(50vw-var(--ph-container)/2))] layout-blocks:py-10 layout-blocks:text-fg lg:layout-blocks:grid-cols-12 lg:layout-blocks:items-center lg:layout-blocks:py-14">
            <AnimatedLogo
              label={h.stageLabel}
              className="w-full layout-blocks:mx-auto layout-blocks:max-w-md lg:layout-blocks:col-span-5 lg:layout-blocks:col-start-2"
            />
            {/* Lower-third (blocks layout) */}
            <div className="hidden gap-4 lg:col-span-5 lg:col-start-8 layout-blocks:grid">
              <p className="flex items-center gap-3 label-type text-fg">
                <span className="ph-rec-dot inline-block size-3 rounded-full bg-accent" />
                <span>{common.hud.live}</span>
                <Timecode className="text-fg-muted tabular" />
              </p>
              <p className="display-type text-display-sm text-fg">{common.hud.location}</p>
              <p className="max-w-md text-fg-muted">{h.lead}</p>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div
          className={cn(
            'relative grid gap-8 layout-blocks:order-1',
            'lg:layout-editorial:col-span-7',
            'lg:layout-cinematic:col-[1/-1] lg:layout-cinematic:row-start-1',
          )}
        >
          <h1 id="hero-title" className="grid gap-6">
            <span className="flex items-center gap-3 label-type text-fg-muted">
              <span aria-hidden="true" className="inline-block h-px w-10 bg-accent-ink" />
              {h.kicker}
            </span>
            <span
              className={cn(
                'block display-type text-fg',
                'text-[calc(clamp(3rem,10vw,10.5rem)*var(--ph-display-scale))] leading-(--ph-leading-display)',
                'layout-editorial:text-[calc(clamp(2.9rem,6.6vw,7rem)*var(--ph-display-scale))]',
                'layout-blocks:text-[calc(clamp(3.2rem,10.6vw,12.5rem)*var(--ph-display-scale))]',
              )}
            >
              {h.lines.map((line, i) => (
                <span key={line} className="ph-shutter-line w-fit" style={{ ['--i' as string]: i }}>
                  <span
                    className={cn(
                      i === last &&
                        'hl layout-cinematic:bg-transparent layout-cinematic:px-0 layout-cinematic:text-accent-ink',
                    )}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <div className="grid gap-8 lg:max-w-2xl layout-cinematic:lg:max-w-none layout-cinematic:lg:grid-cols-[1fr_auto] layout-cinematic:lg:items-end layout-blocks:hidden">
            <p className="ph-fade-late max-w-xl text-lead text-fg-muted">{h.lead}</p>
          </div>
          <div className="ph-fade-late flex flex-wrap gap-3">
            <ButtonLink href={h.primary.href} size="lg">
              {h.primary.label}
            </ButtonLink>
            <ButtonLink href={h.secondary.href} size="lg" variant="secondary">
              {h.secondary.label}
            </ButtonLink>
          </div>
        </div>

        {/* Editorial collage: three taped frames. Lazy, so other layouts never fetch them. */}
        <div className="relative hidden h-[30rem] sm:h-[36rem] lg:h-[40rem] layout-editorial:block lg:layout-editorial:col-span-5">
          <CollageFrame
            image="heroCollageA"
            tape={h.tapes[0]}
            className="absolute top-0 left-0 h-[72%] w-[62%] -rotate-2"
            sizes="(min-width: 1024px) 26vw, 60vw"
          />
          <CollageFrame
            image="heroCollageB"
            tape={h.tapes[1]}
            className="absolute right-0 bottom-[6%] h-[58%] w-[52%] rotate-3"
            sizes="(min-width: 1024px) 22vw, 50vw"
          />
          <CollageFrame
            image="heroCollageC"
            tape={h.tapes[2]}
            className="absolute top-[6%] right-[4%] h-[30%] w-[36%] rotate-1"
            sizes="(min-width: 1024px) 16vw, 36vw"
          />
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 label-type text-fg-muted layout-cinematic:lg:flex"
      >
        <span>{h.scroll}</span>
        <span className="relative block h-10 w-px overflow-hidden bg-border">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[ph-scroll-cue_2s_var(--ph-ease-in-out)_infinite] bg-fg" />
        </span>
      </div>
    </section>
  )
}

function CollageFrame({
  image,
  tape,
  className,
  sizes,
}: {
  image: 'heroCollageA' | 'heroCollageB' | 'heroCollageC'
  tape?: string
  className?: string
  sizes: string
}) {
  return (
    <figure
      className={cn(
        'rounded-lg bg-surface p-2 shadow-[0_24px_60px_-24px_rgb(0_0_0/0.45)]',
        className,
      )}
    >
      <Media image={image} sizes={sizes} className="size-full rounded-md" />
      {tape && (
        <figcaption className="absolute -top-3 left-6 -rotate-3 bg-accent px-3 py-1.5 label-type text-accent-fg shadow-sm">
          {tape}
        </figcaption>
      )}
    </figure>
  )
}
