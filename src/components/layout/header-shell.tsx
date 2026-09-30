'use client'

import { useMotionValueEvent, useScroll } from 'motion/react'
import { useRef, useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectMobileNavOpen } from '@/store/slices/ui-slice'

/**
 * Sticky header behaviour: transparent at the top, solid once scrolled, tucked away
 * while scrolling down and back on scroll up. State is written as data-* attributes
 * so all styling stays in CSS.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const { scrollY } = useScroll()
  const last = useRef(0)
  const [state, setState] = useState<{ scrolled: boolean; hidden: boolean }>({
    scrolled: false,
    hidden: false,
  })
  const menuOpen = useAppSelector(selectMobileNavOpen)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const delta = y - last.current
    last.current = y
    const scrolled = y > 12
    const hidden = y > 320 && delta > 4 ? true : delta < -4 || y < 320 ? false : state.hidden
    if (scrolled !== state.scrolled || hidden !== state.hidden) setState({ scrolled, hidden })
  })

  return (
    <header
      data-scrolled={state.scrolled || undefined}
      data-hidden={(state.hidden && !menuOpen) || undefined}
      data-menu={menuOpen || undefined}
      className="group/header fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-hidden:-translate-y-full"
    >
      {children}
    </header>
  )
}
