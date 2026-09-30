import { cn } from '@/lib/utils'

type EyebrowProps = { children: string; className?: string; index?: string }

/** Small uppercase label with a slate marker, like a clapperboard's scene tag. */
export function Eyebrow({ children, className, index }: EyebrowProps) {
  return (
    <p className={cn('flex items-center gap-3 label-type text-fg-muted', className)}>
      <span
        aria-hidden="true"
        className="inline-block size-2 shrink-0 bg-accent-ink style-rounded:rounded-full"
      />
      {index && (
        <span aria-hidden="true" className="text-fg tabular">
          {index}
        </span>
      )}
      <span>{children}</span>
    </p>
  )
}
