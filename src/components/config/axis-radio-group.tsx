'use client'

import { cn } from '@/lib/utils'

type Option<T extends string> = { id: T; name: string; description?: string }

type AxisRadioGroupProps<T extends string> = {
  name: string
  legend: string
  options: Option<T>[]
  value: T | null
  onChange: (id: T, el: HTMLElement) => void
  size?: 'sm' | 'md'
}

/** Segmented control built on native radios: arrow keys, labels and forms work for free. */
export function AxisRadioGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  size = 'sm',
}: AxisRadioGroupProps<T>) {
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 label-type text-fg-muted">{legend}</legend>
      <div
        className="grid gap-1.5 max-sm:data-[size=sm]:grid-cols-(--cols) sm:grid-cols-(--cols)"
        data-size={size}
        style={{ ['--cols' as string]: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((opt) => (
          <label
            key={opt.id}
            className={cn(
              'relative flex cursor-pointer flex-col justify-center rounded-md border-ph border-border bg-surface-2 text-fg transition-colors',
              'has-checked:border-fg has-checked:bg-fg has-checked:text-bg',
              'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring',
              'hover:border-border-strong',
              size === 'sm' ? 'min-h-11 px-2 py-2 text-center' : 'min-h-16 px-4 py-3',
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.id}
              checked={value === opt.id}
              onChange={(e) => onChange(opt.id, e.currentTarget)}
              className="sr-only"
            />
            <span className={cn('font-semibold', size === 'sm' ? 'text-[0.8125rem]' : 'text-base')}>
              {opt.name}
            </span>
            {size === 'md' && opt.description && (
              <span className="text-sm opacity-75">{opt.description}</span>
            )}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
