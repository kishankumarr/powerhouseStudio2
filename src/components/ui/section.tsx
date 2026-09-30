import { cn } from '@/lib/utils'

export type Tone = 'base' | 'contrast' | 'accent'

type SectionProps = {
  children: React.ReactNode
  id?: string
  tone?: Tone
  labelledBy?: string
  className?: string
  bleed?: boolean
  as?: 'section' | 'div' | 'aside'
}

/**
 * Page band. `tone` flips the local token set (see themes/*.css) so a band can be
 * the paper, black or yellow block of the current theme without per-theme code.
 */
export function Section({
  children,
  id,
  tone = 'base',
  labelledBy,
  className,
  bleed = false,
  as: Tag = 'section',
}: SectionProps) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      data-tone={tone === 'base' ? undefined : tone}
      className={cn(
        'relative scroll-mt-[var(--ph-header-h)]',
        !bleed && 'section-py',
        'layout-blocks:border-t-(length:--ph-band-rule) layout-blocks:border-border-strong',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

export function Container({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('container-ph', className)}>{children}</div>
}
