'use client'

import { useEffect, useRef } from 'react'

const FPS = 25
const pad = (n: number) => String(n).padStart(2, '0')

function format(frames: number) {
  const f = frames % FPS
  const s = Math.floor(frames / FPS)
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`
}

/**
 * A running SMPTE-style timecode (25 fps), purely decorative. Writes textContent
 * directly so React never re-renders; pauses off-screen and under reduced motion.
 */
export function Timecode({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let running = false
    let start = performance.now()
    let offset = 0
    const tick = (now: number) => {
      el.textContent = format(offset + Math.floor(((now - start) / 1000) * FPS))
      raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && !running) {
        running = true
        start = performance.now()
        raf = requestAnimationFrame(tick)
      } else if (!entry?.isIntersecting && running) {
        running = false
        offset += Math.floor(((performance.now() - start) / 1000) * FPS)
        cancelAnimationFrame(raf)
      }
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <span ref={ref} aria-hidden="true" className={className}>
      {format(0)}
    </span>
  )
}
