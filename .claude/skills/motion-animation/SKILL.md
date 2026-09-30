---
name: motion-animation
description: Animation rules and patterns for the Powerhouse site using Motion 13 (the library formerly called Framer Motion, imported from "motion/react") in Next.js 16 App Router with React 19.3. Covers LazyMotion bundle-splitting, server/client boundaries, scroll reveals, parallax, page and theme transitions, the reduced-motion policy and performance limits. Use whenever adding, reviewing or debugging any animation, transition, hover or scroll effect, or when importing framer-motion or motion.
---

# Motion Animation (Motion 13.x)

`framer-motion` was renamed to **`motion`**. Install `motion`, never `framer-motion`. Import React APIs from `motion/react`. Motion 13 is API-compatible with 12. The only 13.0 breaking change is that `@emotion/is-prop-valid` is no longer auto-detected; pass `<MotionConfig isValidProp={…}>` if ever needed. When unsure of an API, look it up with Context7 (`/motiondivision/motion`) instead of guessing.

## Art direction first

Motion is part of the brand story (a production studio: record, cut, roll). Follow the `frontend-design` skill's restraint rule:

- **One orchestrated moment per view.** Examples: the hero logo reveal, a "roll camera" section wipe, a timeline scrub. Everything around it stays calm.
- **No blanket fade-up-on-every-section.** Reveal only what benefits from sequencing: lists that read in order, process steps, stats that count.
- **Responsive motion is always welcome**: menu open, accordion, theme switch, hover on interactive items, focus. It shows the user what changed.
- Motion vocabulary from the brand world, used sparingly: shutter or iris wipes (`clip-path`), a REC dot pulse, timeline scrubbing, focus-pull (blur to sharp), clapper snap and film-strip marquee.

## Architecture (bundle-conscious)

1. **Provider, once, in the root layout:**

   ```tsx
   // src/components/motion/motion-provider.tsx
   'use client'
   import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'

   export function MotionProvider({ children }: { children: React.ReactNode }) {
     return (
       <LazyMotion features={domAnimation} strict>
         <MotionConfig reducedMotion="user">{children}</MotionConfig>
       </LazyMotion>
     )
   }
   ```
   - `strict` makes any accidental full `motion.*` import throw. Use the lightweight `m` components: `import * as m from 'motion/react-m'`.
   - Use `domAnimation` (animations, variants, exit, tap/hover/focus, inView). Load `domMax` **only** inside the island that needs `layout`/`layoutId` or `drag`, with a nested `<LazyMotion features={() => import('./dom-max').then(r => r.default)}>`.

2. **Pages stay Server Components.** Animation lives in small client primitives under `src/components/motion/`, such as `Reveal`, `Stagger`, `StaggerItem`, `Parallax`, `Marquee`, `Counter`, `SplitText` and `ShutterWipe`. Server components pass children into them. Never put `'use client'` on a page or section just to animate one element.
3. **Tokens, not magic numbers.** Put durations, easings and springs in `src/lib/motion/tokens.ts`:
   ```ts
   export const ease = { out: [0.22, 1, 0.36, 1], inOut: [0.65, 0, 0.35, 1] } as const
   export const dur = { xs: 0.15, sm: 0.25, md: 0.45, lg: 0.8, hero: 1.4 } as const
   export const spring = {
     snappy: { type: 'spring', stiffness: 420, damping: 32 },
     soft: { type: 'spring', stiffness: 160, damping: 22 },
   } as const
   ```
   Multiply by the theme's `--ph-motion-scale` (read once via `getComputedStyle`, exposed through a hook) so the "Style" axis can calm or amplify motion globally.

## Core patterns

**In-view reveal.** Motion server-renders `initial` as inline styles, so `opacity: 0` content stays **hidden until hydration** and stays hidden forever without JS. Therefore:

- Never wrap above-the-fold or LCP content in a hidden-start reveal. The LCP element must be fully visible (opacity 1, unclipped) at first paint. Hero entrances either animate _around_ it or use CSS `@keyframes`, which run at first paint without waiting for hydration.
- Every reveal wrapper carries `data-reveal`. The root layout includes `<noscript><style>{'[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}'}</style></noscript>`.

```tsx
'use client'
import * as m from 'motion/react-m'
import { dur, ease } from '@/lib/motion/tokens'

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <m.div
      data-reveal=""
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: dur.md, ease: ease.out, delay }}
    >
      {children}
    </m.div>
  )
}
```

**Stagger** uses parent `variants` with `transition: { staggerChildren: 0.06, delayChildren: 0.1 }`. Children use the same variant keys. Cap it at about 8 staggered items, and past that reveal as a group.

**Scroll-linked** (`useScroll` + `useTransform`) is for parallax and progress. Scroll callbacks are cheap in 13.4, but still:

- Animate only `transform`, `opacity`, `filter` and `clip-path`, never `top`, `left`, `width`, `height` or `margin`.
- Bind motion values to `style` so React never re-renders on scroll.
- Disable parallax on coarse pointers and small viewports if it causes jank. Test on a mid-range Android.

**Presence**: menus, modals, toasts and the mobile nav use `<AnimatePresence mode="wait">` with `exit`. Each child needs a stable `key`.

**Page transitions**: prefer the platform. React 19.3 `ViewTransition`, via Motion 13.4's `AnimateView` from `motion/react-animate-view`, handles enter, exit and shared transitions between routes without keeping old pages mounted. Gate it behind feature detection and fall back to no transition. Do not wrap `{children}` in the root layout with `AnimatePresence` to fake route exits; it breaks streaming and scroll restoration.

**Theme switch**: use `document.startViewTransition(() => setTheme(...))` with a circular `clip-path` reveal from the clicked control. It is instant under reduced motion.

**Text effects**: split headlines into words (not characters) for reveals, which means fewer nodes. Keep the full string in the DOM once for screen readers (`aria-label` on the wrapper, with the split spans `aria-hidden`).

**Counters and marquees**: only count real numbers from the content files. Never animate invented stats (see `powerhouse-brand`). Marquees use CSS `@keyframes` translate on duplicated content (`aria-hidden` on the duplicate), pause on hover and focus, and stop under reduced motion.

## Reduced motion policy (required)

- `MotionConfig reducedMotion="user"` turns off transform and layout animations but keeps opacity. That's the baseline.
- Autoplaying loops (marquee, logo idle loop, background drift, video) **stop** under `prefers-reduced-motion: reduce`. Check with `useReducedMotion()` or a CSS media query.
- Smooth-scroll hijacking (Lenis and similar) is **off by default**. If added for a theme, it must be disabled under reduced motion and must not break native keyboard scrolling, anchor links or `scroll-margin`.
- Nothing flashes more than 3 times per second (WCAG 2.3.1).

## Performance limits

- At most one scroll-linked effect running per viewport, and no infinite animation in off-screen components (`useInView` to pause).
- `will-change` only during the animation, never globally.
- Heavy hero animations (logo SVG timeline) must not delay LCP. The LCP element is text or a poster image that paints immediately, and the animation layers on top.
- Keep the `motion` client JS on the home route well under 40 KB gzipped. Check with `next experimental-analyze` (see `web-performance`).
- Verify with a Chrome DevTools performance trace (`chrome-devtools-mcp` plugin). There should be no long tasks over 50 ms from animation setup, and INP should stay under 200 ms while animations run.

## Testing hooks

- Every autoplaying animation respects `prefers-reduced-motion`. Playwright runs one project with `reducedMotion: 'reduce'` and asserts content is visible and no element has a running infinite animation.
- Visual snapshots are taken after `page.emulateMedia({ reducedMotion: 'reduce' })` so they are deterministic.
