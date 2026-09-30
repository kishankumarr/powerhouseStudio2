import NextLink from 'next/link'

type Crumb = { name: string; path: string }

export function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-2 label-type text-fg-muted">
        {items.map((it, i) => {
          const last = i === items.length - 1
          return (
            <li key={it.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-fg">
                  {it.name}
                </span>
              ) : (
                <>
                  <NextLink
                    href={it.path}
                    className="underline-offset-4 hover:text-fg hover:underline"
                  >
                    {it.name}
                  </NextLink>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
