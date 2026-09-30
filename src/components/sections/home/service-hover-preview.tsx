'use client'

import { AnimatePresence, useReducedMotion, useSpring } from 'motion/react'
import * as m from 'motion/react-m'
import { useRef, useState } from 'react'
import type { MediaImgProps } from '@/components/ui/media'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useAppSelector } from '@/store/hooks'
import { selectLayout } from '@/store/slices/preferences-slice'

type ServiceHoverPreviewProps = {
  children: React.ReactNode
  images: MediaImgProps[]
}

/**
 * Cinematic layout only: a photo "monitor" follows the cursor over the service
 * list and cuts between shots as rows are hovered. Pure enhancement: the list is
 * complete without it, and it never renders on touch or under reduced motion.
 */
export function ServiceHoverPreview({ children, images }: ServiceHoverPreviewProps) {
  const layout = useAppSelector(selectLayout)
  const fine = useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 1024px)')
  const reduce = useReducedMotion()
  const enabled = layout === 'cinematic' && fine && !reduce
  const [active, setActive] = useState<number | null>(null)
  const [armed, setArmed] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const x = useSpring(0, { stiffness: 260, damping: 30, mass: 0.6 })
  const y = useSpring(0, { stiffness: 260, damping: 30, mass: 0.6 })

  const onMove = (e: React.PointerEvent) => {
    if (!enabled) return
    x.set(e.clientX)
    y.set(e.clientY)
    const row = (e.target as Element).closest<HTMLElement>('[data-preview-index]')
    setActive(row ? Number(row.dataset.previewIndex) : null)
  }

  return (
    <div
      onPointerEnter={() => enabled && setArmed(true)}
      onPointerMove={onMove}
      onPointerLeave={() => setActive(null)}
    >
      {children}
      {enabled && armed && (
        <m.div
          ref={box}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-40 h-[15rem] w-[21rem] -translate-x-1/2 -translate-y-1/2"
          style={{ x, y }}
        >
          <AnimatePresence>
            {active !== null && (
              <m.div
                className="absolute inset-0 overflow-hidden rounded-md bg-surface-2 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.7)]"
                initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {images.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element -- pre-sized CDN srcset from the server
                  <img
                    key={img.src}
                    src={img.src}
                    srcSet={img.srcSet}
                    sizes="336px"
                    alt=""
                    className="absolute inset-0 size-full object-cover transition-opacity duration-300"
                    style={{ objectPosition: img.focal, opacity: i === active ? 1 : 0 }}
                  />
                ))}
                <span className="ph-viewfinder [--vf-c:var(--ph-white)] [--vf-inset:0.6rem] [--vf-l:1rem]" />
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      )}
    </div>
  )
}
