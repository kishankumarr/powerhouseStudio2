/** Motion tokens. Durations are multiplied by the style axis' --ph-motion-scale via useMotionScale(). */
export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  snap: [0.7, 0, 0.2, 1],
} as const

export const dur = { xs: 0.15, sm: 0.25, md: 0.45, lg: 0.8, hero: 1.4 } as const

export const spring = {
  snappy: { type: 'spring', stiffness: 420, damping: 32 },
  soft: { type: 'spring', stiffness: 160, damping: 22 },
} as const

export const stagger = { children: 0.06, delay: 0.1, max: 8 } as const
