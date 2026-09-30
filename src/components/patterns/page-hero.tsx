import { Eyebrow } from '@/components/ui/eyebrow'
import { cn } from '@/lib/utils'

type PageHeroProps = {
  eyebrow: string
  title: string
  lead?: string
  /** Big ghosted scene number behind the title. */
  scene?: string
  before?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

/** Inner-page opener: eyebrow, h1 with a shutter wipe, lead. The h1 paints immediately. */
export function PageHero({
  eyebrow,
  title,
  lead,
  scene,
  before,
  children,
  className,
}: PageHeroProps) {
  return (
    <section
      aria-labelledby="page-title"
      className={cn(
        'relative isolate overflow-hidden pt-[calc(var(--ph-header-h)+clamp(3rem,9vw,8rem))] pb-[clamp(3rem,7vw,6rem)]',
        className,
      )}
    >
      <div aria-hidden="true" className="ph-pattern" />
      {scene && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-[0.08em] right-[-0.04em] display-type text-[clamp(10rem,32vw,30rem)] leading-none text-transparent opacity-50 select-none [-webkit-text-stroke:1px_var(--ph-border-strong)]"
        >
          {scene}
        </span>
      )}
      <div className="relative container-ph grid gap-8 lg:grid-cols-12">
        {before && <div className="lg:col-span-12">{before}</div>}
        <div className="grid gap-7 lg:col-span-11">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1
            id="page-title"
            className="ph-shutter-line max-w-[18ch] display-type text-display-xl text-fg style-rounded:max-w-[20ch]"
          >
            {title}
          </h1>
        </div>
        {lead && (
          <p className="ph-fade-late max-w-2xl text-lead text-fg-muted lg:col-span-7 lg:col-start-6">
            {lead}
          </p>
        )}
        {children && <div className="lg:col-span-12">{children}</div>}
      </div>
    </section>
  )
}
