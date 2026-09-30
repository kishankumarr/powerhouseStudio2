'use client'

import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { Check, Send } from 'lucide-react'
import { useId, useMemo, useRef, useState } from 'react'
import type { Content } from '@/content/types'
import {
  mailtoTransport,
  validateEnquiry,
  type Enquiry,
  type EnquiryErrors,
} from '@/lib/enquiry/transport'
import { cn } from '@/lib/utils'

type EnquiryFormProps = {
  copy: Content['contact']['form']
  services: string[]
  to: string
}

const empty: Enquiry = {
  name: '',
  email: '',
  phone: '',
  company: '',
  services: [],
  engagement: '',
  message: '',
}

const field =
  'w-full rounded-md border-ph border-border-strong bg-surface-2 px-4 py-3.5 text-base text-fg placeholder:text-fg-muted/80 transition-[border-color,box-shadow] focus:border-fg focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-[color:var(--ph-fg)] aria-invalid:shadow-[inset_4px_0_0_var(--ph-accent-ink)]'

export function EnquiryForm({ copy, services, to }: EnquiryFormProps) {
  const [values, setValues] = useState<Enquiry>(empty)
  const [errors, setErrors] = useState<EnquiryErrors>({})
  const [sent, setSent] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const uid = useId()
  const id = (k: string) => `${uid}-${k}`
  const transport = useMemo(() => mailtoTransport(to, copy.mail), [to, copy.mail])

  const set = <K extends keyof Enquiry>(k: K, v: Enquiry[K]) => {
    setValues((prev) => ({ ...prev, [k]: v }))
    if (k in errors) setErrors((prev) => ({ ...prev, [k]: undefined }))
  }

  const toggleService = (s: string) =>
    set(
      'services',
      values.services.includes(s)
        ? values.services.filter((x) => x !== s)
        : [...values.services, s],
    )

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found = validateEnquiry(values)
    setErrors(found)
    if (Object.keys(found).length) {
      setSent(false)
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    const res = await transport.send(values)
    setSent(res.ok)
  }

  const errorIds = (Object.keys(errors) as (keyof EnquiryErrors)[]).filter((k) => errors[k])

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-7">
      <AnimatePresence>
        {errorIds.length > 0 && (
          <m.div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-md border-l-4 border-accent-ink bg-surface-2 p-4 text-fg"
          >
            <p className="font-semibold">{copy.errors.summary}</p>
            <ul className="mt-2 grid gap-1 text-sm">
              {errorIds.map((k) => (
                <li key={k}>
                  <a href={`#${id(k)}`} className="underline underline-offset-4">
                    {copy.errors[k]}
                  </a>
                </li>
              ))}
            </ul>
          </m.div>
        )}
      </AnimatePresence>

      <div className="grid gap-7 sm:grid-cols-2">
        <Field
          label={copy.name}
          htmlFor={id('name')}
          required
          requiredLabel={copy.required}
          error={errors.name && copy.errors.name}
          errorId={id('name-error')}
        >
          <input
            id={id('name')}
            name="name"
            autoComplete="name"
            required
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            aria-invalid={errors.name || undefined}
            aria-describedby={errors.name ? id('name-error') : undefined}
            className={field}
          />
        </Field>
        <Field
          label={copy.email}
          htmlFor={id('email')}
          required
          requiredLabel={copy.required}
          error={errors.email && copy.errors.email}
          errorId={id('email-error')}
        >
          <input
            id={id('email')}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            aria-invalid={errors.email || undefined}
            aria-describedby={errors.email ? id('email-error') : undefined}
            className={field}
          />
        </Field>
        <Field label={copy.phone} htmlFor={id('phone')} optionalLabel={copy.optional}>
          <input
            id={id('phone')}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            className={field}
          />
        </Field>
        <Field label={copy.company} htmlFor={id('company')} optionalLabel={copy.optional}>
          <input
            id={id('company')}
            name="company"
            autoComplete="organization"
            value={values.company}
            onChange={(e) => set('company', e.target.value)}
            className={field}
          />
        </Field>
      </div>

      <fieldset className="grid gap-3">
        <legend className="mb-3 font-semibold text-fg">
          {copy.services} <span className="font-normal text-fg-muted">{copy.optional}</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {services.map((s) => {
            const on = values.services.includes(s)
            return (
              <label
                key={s}
                className={cn(
                  'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-pill border-ph px-4 py-2 text-sm font-medium transition-colors select-none',
                  'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring',
                  on
                    ? 'border-accent bg-accent text-accent-fg'
                    : 'border-border-strong text-fg hover:border-fg',
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={on}
                  onChange={() => toggleService(s)}
                />
                {on && <Check aria-hidden="true" className="size-4" strokeWidth={3} />}
                {s}
              </label>
            )
          })}
        </div>
      </fieldset>

      <Field label={copy.engagement} htmlFor={id('engagement')} optionalLabel={copy.optional}>
        <select
          id={id('engagement')}
          name="engagement"
          value={values.engagement}
          onChange={(e) => set('engagement', e.target.value)}
          className={cn(
            field,
            'appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10',
          )}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
          }}
        >
          <option value="">{copy.engagementPlaceholder}</option>
          {copy.engagementOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label={copy.message}
        htmlFor={id('message')}
        required
        requiredLabel={copy.required}
        error={errors.message && copy.errors.message}
        errorId={id('message-error')}
      >
        <textarea
          id={id('message')}
          name="message"
          required
          rows={6}
          placeholder={copy.messagePlaceholder}
          value={values.message}
          onChange={(e) => set('message', e.target.value)}
          aria-invalid={errors.message || undefined}
          aria-describedby={errors.message ? id('message-error') : undefined}
          className={cn(field, 'resize-y')}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-6">
        <button
          type="submit"
          className="group/btn cut-fill inline-flex min-h-14 items-center justify-center gap-3 rounded-pill px-8 font-display font-semibold tracking-[0.06em] text-accent-fg uppercase [font-stretch:88%] [--fill:var(--ph-accent)] hover:text-bg hover:[--fill:var(--ph-fg)]"
        >
          {copy.submit}
          <Send
            aria-hidden="true"
            className="size-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
          />
        </button>
        <p className="text-sm text-fg-muted">{copy.submitNote}</p>
      </div>

      <p role="status" className={cn('text-fg', !sent && 'sr-only')}>
        {sent ? copy.success : ''}
      </p>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  required,
  requiredLabel,
  optionalLabel,
  error,
  errorId,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  requiredLabel?: string
  optionalLabel?: string
  error?: string | false
  errorId?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={htmlFor} className="font-semibold text-fg">
        {label}{' '}
        {required ? (
          <span className="text-fg-muted">
            <span aria-hidden="true">{'*'}</span>
            <span className="sr-only">{requiredLabel}</span>
          </span>
        ) : (
          optionalLabel && <span className="font-normal text-fg-muted">{optionalLabel}</span>
        )}
      </label>
      {children}
      {error && (
        <p id={errorId} className="text-sm font-medium text-fg">
          {error}
        </p>
      )}
    </div>
  )
}
