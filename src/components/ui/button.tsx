import { ArrowRight, ArrowUpRight } from 'lucide-react'
import NextLink from 'next/link'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

type ButtonLinkProps = {
  href: string
  children: string
  variant?: Variant
  size?: Size
  icon?: 'arrow' | 'external' | 'none'
  external?: boolean
  externalLabel?: string
  className?: string
}

const base =
  'group/btn inline-flex items-center justify-center gap-3 rounded-pill font-display font-semibold tracking-[0.06em] uppercase transition-[color,background-color,border-color,transform] duration-300 ease-out select-none [font-stretch:88%] active:scale-[0.98]'

const variants: Record<Variant, string> = {
  primary:
    'cut-fill text-accent-fg [--fill:var(--ph-accent)] hover:[--fill:var(--ph-fg)] hover:text-bg',
  secondary: 'border-ph border-fg/80 text-fg hover:bg-fg hover:text-bg hover:border-fg',
  ghost: 'text-fg underline-offset-8 hover:underline decoration-2 decoration-accent px-0!',
}

const sizes: Record<Size, string> = {
  md: 'min-h-12 px-6 text-[0.8125rem]',
  lg: 'min-h-14 px-8 text-[0.875rem] sm:min-h-16 sm:px-10 sm:text-[0.9375rem]',
}

/** Text that rolls up to a duplicate on hover — a small "cut" between two takes. */
function RollLabel({ children }: { children: string }) {
  return (
    <span className="relative block overflow-hidden leading-[1.3]">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-y-0"
      >
        {children}
      </span>
    </span>
  )
}

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  icon = 'arrow',
  external = false,
  externalLabel,
  className,
}: ButtonLinkProps) {
  const Icon = icon === 'external' ? ArrowUpRight : ArrowRight
  const inner = (
    <>
      <RollLabel>{children}</RollLabel>
      {icon !== 'none' && (
        <Icon
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-px"
          strokeWidth={2.25}
        />
      )}
      {external && externalLabel && <span className="sr-only">{externalLabel}</span>}
    </>
  )
  const cls = cn(base, variants[variant], sizes[size], className)
  const isInternal = href.startsWith('/') || href.startsWith('#')
  if (isInternal && !external) {
    return (
      <NextLink href={href} className={cls}>
        {inner}
      </NextLink>
    )
  }
  return (
    <a
      href={href}
      className={cls}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {inner}
    </a>
  )
}
