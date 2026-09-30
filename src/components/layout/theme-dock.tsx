'use client'

import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { Check, RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import NextLink from 'next/link'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AxisRadioGroup } from '@/components/config/axis-radio-group'
import {
  LAYOUT_IDS,
  PRESET_IDS,
  PRESET_SWATCHES,
  STYLE_IDS,
  THEME_IDS,
  type PresetId,
} from '@/config/themes'
import { DOCK_NUDGE_KEY } from '@/constants/storage-keys'
import type { Content } from '@/content/types'
import { useMotionScale } from '@/hooks/use-motion-scale'
import { ease } from '@/lib/motion/tokens'
import { cn } from '@/lib/utils'
import { centerOf, withThemeTransition } from '@/lib/view-transition'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  applyPreset,
  resetPreferences,
  selectLayout,
  selectPreset,
  selectStyle,
  selectTheme,
  setLayout,
  setStyle,
  setTheme,
} from '@/store/slices/preferences-slice'
import { selectMobileNavOpen, selectThemeDockOpen, setThemeDock } from '@/store/slices/ui-slice'

type ThemeDockProps = { copy: Content['config'] }

/** The floating "change the look" control, bottom-right on every page. */
export function ThemeDock({ copy }: ThemeDockProps) {
  const dispatch = useAppDispatch()
  const open = useAppSelector(selectThemeDockOpen)
  const menuOpen = useAppSelector(selectMobileNavOpen)
  const preset = useAppSelector(selectPreset)
  const theme = useAppSelector(selectTheme)
  const layout = useAppSelector(selectLayout)
  const style = useAppSelector(selectStyle)
  const scale = useMotionScale()
  const [fineTune, setFineTune] = useState(false)
  const [nudge, setNudge] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const titleId = useId()

  const close = useCallback(
    (refocus = true) => {
      dispatch(setThemeDock(false))
      if (refocus) buttonRef.current?.focus()
    },
    [dispatch],
  )

  // A one-time hint on the first visit so the client finds the control.
  useEffect(() => {
    let seen = true
    try {
      seen = localStorage.getItem(DOCK_NUDGE_KEY) === '1'
      localStorage.setItem(DOCK_NUDGE_KEY, '1')
    } catch {}
    if (seen) return
    const show = window.setTimeout(() => setNudge(true), 1800)
    const hide = window.setTimeout(() => setNudge(false), 7800)
    return () => {
      window.clearTimeout(show)
      window.clearTimeout(hide)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLInputElement>('input:checked, input')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node
      if (!panelRef.current?.contains(t) && !buttonRef.current?.contains(t)) close(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open, close])

  const run = (update: () => void, el: HTMLElement | null) =>
    withThemeTransition(update, centerOf(el?.closest('label') ?? el))

  return (
    <div
      className={cn(
        'fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-[55] flex flex-col items-end gap-3 transition-opacity duration-300',
        menuOpen && 'pointer-events-none opacity-0',
      )}
    >
      <AnimatePresence>
        {open && (
          <m.div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-labelledby={titleId}
            className="max-h-[min(78dvh,44rem)] w-[min(calc(100vw-2rem),24rem)] origin-bottom-right overflow-y-auto overscroll-contain rounded-lg border-ph border-border-strong bg-surface p-5 text-fg shadow-[0_30px_80px_-20px_rgb(0_0_0/0.55)]"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.35 * scale, ease: ease.out }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="grid gap-1">
                <h2 id={titleId} className="display-type text-2xl leading-none">
                  {copy.dock.title}
                </h2>
                <p className="text-sm text-fg-muted">{copy.dock.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => close()}
                aria-label={copy.dock.close}
                className="-mt-1 -mr-1 grid size-10 shrink-0 place-items-center rounded-pill text-fg-muted hover:bg-surface-2 hover:text-fg"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <fieldset className="grid gap-2.5">
              <legend className="sr-only">{copy.dock.title}</legend>
              {PRESET_IDS.map((id) => (
                <PresetOption
                  key={id}
                  id={id}
                  name={copy.presets[id].name}
                  tagline={copy.presets[id].tagline}
                  currentLabel={copy.dock.current}
                  checked={preset === id}
                  onSelect={(el) => run(() => dispatch(applyPreset(id)), el)}
                />
              ))}
            </fieldset>

            {preset === 'custom' && (
              <p className="mt-3 label-type text-fg-muted">{copy.dock.custom}</p>
            )}

            <div className="mt-5 border-t border-border pt-4">
              <button
                type="button"
                aria-expanded={fineTune}
                onClick={() => setFineTune((v) => !v)}
                className="flex min-h-11 w-full items-center justify-between gap-3 font-semibold"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal aria-hidden="true" className="size-4" />
                  {copy.dock.fineTune}
                </span>
                <span
                  aria-hidden="true"
                  className={cn('transition-transform', fineTune && 'rotate-45')}
                >
                  {'+'}
                </span>
              </button>
              {fineTune && (
                <div className="mt-3 grid gap-4">
                  <AxisRadioGroup
                    name="dock-theme"
                    legend={copy.axes.theme.label}
                    value={theme}
                    options={THEME_IDS.map((id) => ({ id, ...copy.axes.theme.options[id] }))}
                    onChange={(id, el) => run(() => dispatch(setTheme(id)), el)}
                  />
                  <AxisRadioGroup
                    name="dock-layout"
                    legend={copy.axes.layout.label}
                    value={layout}
                    options={LAYOUT_IDS.map((id) => ({ id, ...copy.axes.layout.options[id] }))}
                    onChange={(id, el) => run(() => dispatch(setLayout(id)), el)}
                  />
                  <AxisRadioGroup
                    name="dock-style"
                    legend={copy.axes.style.label}
                    value={style}
                    options={STYLE_IDS.map((id) => ({ id, ...copy.axes.style.options[id] }))}
                    onChange={(id, el) => run(() => dispatch(setStyle(id)), el)}
                  />
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm">
              <button
                type="button"
                onClick={(e) => run(() => dispatch(resetPreferences()), e.currentTarget)}
                className="inline-flex min-h-11 items-center gap-2 text-fg-muted hover:text-fg"
              >
                <RotateCcw aria-hidden="true" className="size-4" />
                {copy.dock.reset}
              </button>
              <NextLink
                href="/config"
                onClick={() => close(false)}
                className="inline-flex min-h-11 items-center font-semibold underline decoration-2 underline-offset-4"
              >
                {copy.dock.openConfig}
              </NextLink>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <AnimatePresence>
          {nudge && !open && (
            <m.p
              aria-hidden="true"
              className="rounded-pill border-ph border-border-strong bg-surface px-4 py-2.5 label-type text-fg shadow-lg"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.4 * scale, ease: ease.out }}
            >
              {copy.dock.open}
            </m.p>
          )}
        </AnimatePresence>
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          aria-label={open ? copy.dock.close : copy.dock.open}
          onClick={() => dispatch(setThemeDock(!open))}
          className="group/dock relative grid size-14 place-items-center rounded-full bg-[conic-gradient(from_225deg,var(--ph-black)_0_50%,var(--ph-white)_0)] shadow-[0_12px_40px_-8px_rgb(0_0_0/0.5)] ring-2 ring-fg/15 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 hover:rotate-180 focus-visible:outline-offset-4"
        >
          <span className="grid size-8 place-items-center rounded-full bg-brand-black text-brand-yellow ring-2 ring-brand-yellow transition-transform duration-500 group-hover/dock:-rotate-180">
            {open ? (
              <X aria-hidden="true" className="size-4" strokeWidth={2.5} />
            ) : (
              <span
                aria-hidden="true"
                className="ph-rec-dot size-2.5 rounded-full bg-brand-yellow"
              />
            )}
          </span>
        </button>
      </div>
    </div>
  )
}

function PresetOption({
  id,
  name,
  tagline,
  checked,
  currentLabel,
  onSelect,
}: {
  id: PresetId
  name: string
  tagline: string
  checked: boolean
  currentLabel: string
  onSelect: (el: HTMLElement) => void
}) {
  const [bg, ink, accent] = PRESET_SWATCHES[id]
  return (
    <label
      className={cn(
        'group/preset relative flex cursor-pointer items-center gap-4 rounded-md border-ph p-3 transition-colors',
        checked ? 'border-fg bg-surface-2' : 'border-border hover:border-border-strong',
        'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring',
      )}
    >
      <input
        type="radio"
        name="dock-preset"
        value={id}
        checked={checked}
        onChange={(e) => onSelect(e.currentTarget)}
        className="sr-only"
      />
      {/* Mini "poster" of the preset: its three brand surfaces */}
      <span
        aria-hidden="true"
        className="relative grid h-14 w-16 shrink-0 overflow-hidden rounded-sm ring-1 ring-fg/15"
        style={{ background: bg }}
      >
        <span className="absolute top-2 left-2 h-1.5 w-8" style={{ background: ink }} />
        <span className="absolute top-5 left-2 h-1.5 w-5" style={{ background: ink }} />
        <span className="absolute bottom-2 left-2 h-3 w-7" style={{ background: accent }} />
      </span>
      <span className="grid min-w-0 gap-0.5">
        <span className="font-semibold text-fg">{name}</span>
        <span className="text-sm text-fg-muted">{tagline}</span>
      </span>
      {checked && (
        <span className="ml-auto flex items-center gap-1 text-fg">
          <Check aria-hidden="true" className="size-4" strokeWidth={2.5} />
          <span className="sr-only">{currentLabel}</span>
        </span>
      )}
    </label>
  )
}
