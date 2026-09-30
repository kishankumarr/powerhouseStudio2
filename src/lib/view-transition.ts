import { flushSync } from 'react-dom'

type Point = { x: number; y: number }

/**
 * Runs a theme change inside a View Transition with a circular reveal from `origin`
 * (usually the control that was clicked). Instant when unsupported or under reduced motion.
 */
export function withThemeTransition(update: () => void, origin?: Point) {
  const root = document.documentElement
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (typeof document.startViewTransition !== 'function' || reduce) {
    update()
    return
  }
  const scale = parseFloat(getComputedStyle(root).getPropertyValue('--ph-motion-scale')) || 1
  const { x, y } = origin ?? { x: window.innerWidth - 48, y: window.innerHeight - 48 }
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

  root.dataset.vt = 'theme'
  const transition = document.startViewTransition(() => {
    flushSync(update)
  })
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 720 * scale,
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
    .catch(() => {})
  transition.finished.finally(() => {
    delete root.dataset.vt
  })
}

export function centerOf(el: Element | null): Point | undefined {
  if (!el) return undefined
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}
