import { Eyebrow } from '@/components/ui/eyebrow'
import { cn } from '@/lib/utils'

type SectionHeaderProps = {
  id: string
  eyebrow: string
  title: string
  lead?: string
  index?: string
  align?: 'start' | 'split'
  size?: 'lg' | 'xl'
  className?: string
  children?: React.ReactNode
}

/**
 * Eyebrow + h2 + optional lead. `split` puts the lead beside the title on wide
 * screens (editorial rhythm); the layout axis can still restack it.
 */
export function SectionHeader({
  id,
  eyebrow,
  title,
  lead,
  index,
  align = 'start',
  size = 'lg',
  className,
  children,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        'grid gap-6',
        align === 'split' && 'lg:grid-cols-12 lg:items-end lg:gap-10',
        className,
      )}
    >
      <div className={cn('grid gap-5', align === 'split' && 'lg:col-span-7')}>
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
        <h2
          id={id}
          className={cn(
            'display-type text-fg',
            size === 'xl' ? 'text-display-xl' : 'text-display-lg',
          )}
        >
          {title}
        </h2>
      </div>
      {(lead || children) && (
        <div
          className={cn(
            'grid max-w-2xl gap-6',
            align === 'split' && 'lg:col-span-5 lg:justify-self-end lg:pb-2',
          )}
        >
          {lead && <p className="text-lead text-fg-muted">{lead}</p>}
          {children}
        </div>
      )}
    </header>
  )
}
