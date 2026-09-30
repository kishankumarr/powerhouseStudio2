'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import type { Link } from '@/content/types'
import { cn } from '@/lib/utils'

export function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

export function NavLinks({ items, label }: { items: Link[]; label: string }) {
  const pathname = usePathname()
  return (
    <nav aria-label={label} className="hidden lg:block">
      <ul className="flex items-center gap-1 layout-editorial:gap-3">
        {items.map((item) => {
          const active = isActive(pathname, item.href)
          return (
            <li key={item.href}>
              <NextLink
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group/nav relative inline-flex min-h-11 items-center px-3 font-display text-[0.8125rem] font-semibold tracking-[0.12em] text-fg uppercase [font-stretch:88%] transition-colors',
                  'hover:text-fg',
                )}
              >
                <span className="relative">
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute -bottom-1.5 left-0 h-0.5 w-full origin-left bg-accent-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                      active ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100',
                    )}
                  />
                </span>
              </NextLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
