'use client'

import NextLink from 'next/link'
import { useEffect } from 'react'
import { boundary } from '@/content/boundary'

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = boundary.en
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <section className="container-ph grid min-h-[70svh] content-center gap-6 pt-(--ph-header-h)">
      <h1 className="display-type text-display-lg text-fg">{t.title}</h1>
      <p className="max-w-lg text-lead text-fg-muted">{t.body}</p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-12 items-center rounded-pill bg-accent px-6 font-semibold text-accent-fg hover:bg-fg hover:text-bg"
        >
          {t.retry}
        </button>
        <NextLink
          href="/"
          className="inline-flex min-h-12 items-center rounded-pill border-ph border-fg px-6 font-semibold text-fg"
        >
          {t.home}
        </NextLink>
      </div>
    </section>
  )
}
