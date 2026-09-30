import { cn } from '@/lib/utils'

export type IconProps = { className?: string }

/** 24-grid icon frame in the logo's language: 2px strokes, square caps, currentColor. */
export function IconBase({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      className={cn('size-6', className)}
    >
      {children}
    </svg>
  )
}
