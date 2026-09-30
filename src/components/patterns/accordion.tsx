import { cn, pad2 } from '@/lib/utils'

type AccordionItem = { id: string; question: string; answer: string }

type AccordionProps = {
  items: AccordionItem[]
  headingLevel?: 'h2' | 'h3'
  numbered?: boolean
  className?: string
}

/**
 * Native <details>: keyboard and screen-reader support built in, answers always in the
 * server HTML (SEO + FAQPage parity). Height animates where ::details-content is supported.
 */
export function Accordion({
  items,
  headingLevel = 'h3',
  numbered = true,
  className,
}: AccordionProps) {
  const H = headingLevel
  return (
    <div
      className={cn(
        'border-t border-border layout-blocks:border-t-(length:--ph-border-width) layout-blocks:border-border-strong',
        className,
      )}
    >
      {items.map((item, i) => (
        <details
          key={item.id}
          id={`faq-${item.id}`}
          name="faq"
          className="ph-accordion group/acc border-b border-border layout-blocks:border-b-(length:--ph-border-width) layout-blocks:border-border-strong"
        >
          <summary className="flex cursor-pointer list-none items-center gap-5 py-6 outline-offset-4 sm:gap-8 sm:py-7 [&::-webkit-details-marker]:hidden">
            {numbered && (
              <span aria-hidden="true" className="w-8 shrink-0 label-type text-fg-muted tabular">
                {pad2(i + 1)}
              </span>
            )}
            <H className="flex-1 text-xl font-semibold text-fg transition-colors sm:text-2xl">
              {item.question}
            </H>
            <span
              aria-hidden="true"
              className="relative grid size-11 shrink-0 place-items-center rounded-pill border-ph border-border-strong transition-[background-color,border-color,transform] duration-500 group-open/acc:rotate-45 group-open/acc:border-accent group-open/acc:bg-accent group-open/acc:text-accent-fg"
            >
              <span className="absolute h-0.5 w-4 bg-current" />
              <span className="absolute h-4 w-0.5 bg-current" />
            </span>
          </summary>
          <div className={cn('pb-8 text-lead text-fg-muted', numbered && 'sm:pl-16')}>
            <p className="max-w-3xl">{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  )
}
