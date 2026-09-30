'use client'

import { boundary } from '@/content/boundary'
import '@/styles/globals.css'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = boundary.en
  return (
    <html lang="en-IN" data-theme="noir" data-layout="cinematic" data-style="sharp">
      <body>
        <main className="container-ph grid min-h-svh content-center gap-6">
          <h1 className="display-type text-display-lg text-fg">{t.title}</h1>
          <p className="max-w-lg text-lead text-fg-muted">{t.body}</p>
          <button
            type="button"
            onClick={reset}
            className="w-fit rounded-pill bg-accent px-6 py-3 font-semibold text-accent-fg"
          >
            {t.retry}
          </button>
        </main>
      </body>
    </html>
  )
}
