'use client'

import { AnimatePresence, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import type { Link } from '@/content/types'
import { useMotionScale } from '@/hooks/use-motion-scale'
import { ease } from '@/lib/motion/tokens'
import { cn, pad2 } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectMobileNavOpen, setMobileNav } from '@/store/slices/ui-slice'
import { isActive } from './nav-links'

type MobileNavProps = {
  /** Server-rendered logo, shown inside the panel so it takes the panel's tone. */
  logo: React.ReactNode
  items: Link[]
  cta: Link
  labels: { open: string; close: string; title: string; navLabel: string }
  contact: { phone: Link; email: Link; instagram: Link; signoff: string }
}

const IRIS_ORIGIN = 'calc(100% - 2.75rem) 2.25rem'

export function MobileNav({ logo, items, cta, labels, contact }: MobileNavProps) {
  const open = useAppSelector(selectMobileNavOpen)
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const scale = useMotionScale()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    dispatch(setMobileNav(false))
    toggleRef.current?.focus()
  }, [dispatch])

  // Close when the route changes (link tapped).
  const lastPath = useRef(pathname)
  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname
      dispatch(setMobileNav(false))
    }
  }, [pathname, dispatch])

  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'
    const first = panelRef.current?.querySelector<HTMLElement>('a[href]')
    first?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current || !toggleRef.current) return
      const focusables = [
        toggleRef.current,
        ...panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ]
      const idx = focusables.indexOf(document.activeElement as HTMLElement)
      const next = e.shiftKey
        ? idx <= 0
          ? focusables.length - 1
          : idx - 1
        : idx === focusables.length - 1
          ? 0
          : idx + 1
      e.preventDefault()
      focusables[next]?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      root.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? labels.close : labels.open}
        onClick={() => dispatch(setMobileNav(!open))}
        className={cn(
          'relative z-[70] grid size-12 place-items-center rounded-pill border-ph transition-colors duration-300',
          open
            ? 'border-accent-fg/30 text-accent-fg'
            : 'border-border-strong/60 text-fg hover:border-fg',
        )}
      >
        <span aria-hidden="true" className="relative block h-3 w-5">
          <span
            className={cn(
              'absolute left-0 h-0.5 w-5 bg-current transition-transform duration-300',
              open ? 'top-[5px] rotate-45' : 'top-0',
            )}
          />
          <span
            className={cn(
              'absolute left-0 h-0.5 bg-current transition-all duration-300',
              open ? 'top-[5px] w-5 -rotate-45' : 'top-[10px] w-3.5',
            )}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            ref={panelRef}
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label={labels.title}
            data-tone="accent"
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto px-[var(--ph-gutter)] pt-24 pb-10"
            initial={reduce ? { opacity: 0 } : { clipPath: `circle(0% at ${IRIS_ORIGIN})` }}
            animate={reduce ? { opacity: 1 } : { clipPath: `circle(150% at ${IRIS_ORIGIN})` }}
            exit={reduce ? { opacity: 0 } : { clipPath: `circle(0% at ${IRIS_ORIGIN})` }}
            transition={{ duration: 0.7 * scale, ease: ease.inOut }}
          >
            <div className="absolute top-0 left-(--ph-gutter) flex h-(--ph-header-h) items-center">
              {logo}
            </div>
            <nav aria-label={labels.navLabel} className="flex-1">
              <m.ul
                className="grid gap-1"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.06 * scale, delayChildren: 0.18 * scale },
                  },
                }}
              >
                {[...items, cta].map((item, i) => {
                  const active = isActive(pathname, item.href)
                  return (
                    <m.li
                      key={item.href}
                      variants={{ hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0 } }}
                      transition={{ duration: 0.6 * scale, ease: ease.out }}
                    >
                      <NextLink
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => dispatch(setMobileNav(false))}
                        className="group flex items-baseline gap-4 border-b border-fg/15 py-3"
                      >
                        <span aria-hidden="true" className="label-type text-fg-muted">
                          {pad2(i + 1)}
                        </span>
                        <span
                          className={cn(
                            'display-type text-[clamp(2.4rem,11vw,4.5rem)] leading-[0.95] text-fg transition-transform duration-300 group-hover:translate-x-2',
                            active && 'underline decoration-4 underline-offset-8',
                          )}
                        >
                          {item.label}
                        </span>
                      </NextLink>
                    </m.li>
                  )
                })}
              </m.ul>
            </nav>
            <m.div
              className="mt-10 grid gap-2 text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 * scale, duration: 0.5 }}
            >
              <p className="display-type text-display-sm text-fg">{contact.signoff}</p>
              <a
                href={contact.phone.href}
                className="font-semibold text-fg underline-offset-4 hover:underline"
              >
                {contact.phone.label}
              </a>
              <a
                href={contact.email.href}
                className="break-all text-fg underline-offset-4 hover:underline"
              >
                {contact.email.label}
              </a>
              <a
                href={contact.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg underline-offset-4 hover:underline"
              >
                {contact.instagram.label}
              </a>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
