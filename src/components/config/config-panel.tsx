'use client'

import { Check, Copy, RotateCcw } from 'lucide-react'
import NextLink from 'next/link'
import { useState } from 'react'
import { AxisRadioGroup } from '@/components/config/axis-radio-group'
import {
  LAYOUT_IDS,
  PRESET_IDS,
  PRESET_QUERY_PARAM,
  STYLE_IDS,
  THEME_IDS,
  type PresetId,
} from '@/config/themes'
import type { Content } from '@/content/types'
import { useHydrated } from '@/hooks/use-hydrated'
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

type ConfigPanelProps = {
  copy: Content['config']
  previews: Record<PresetId, React.ReactNode>
}

export function ConfigPanel({ copy, previews }: ConfigPanelProps) {
  const dispatch = useAppDispatch()
  const hydrated = useHydrated()
  const preset = useAppSelector(selectPreset)
  const theme = useAppSelector(selectTheme)
  const layout = useAppSelector(selectLayout)
  const style = useAppSelector(selectStyle)
  const [copied, setCopied] = useState<PresetId | null>(null)
  // ?preset= on this (or any) URL is already applied by the pre-paint boot script.

  const p = copy.page
  const current = hydrated ? preset : null

  const copyLink = async (id: PresetId) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/?${PRESET_QUERY_PARAM}=${id}`)
      setCopied(id)
      window.setTimeout(() => setCopied(null), 1800)
    } catch {}
  }

  return (
    <div className="grid gap-20">
      <section aria-labelledby="presets-title" className="grid gap-8">
        <h2 id="presets-title" className="display-type text-display-md">
          {p.presetsTitle}
        </h2>
        <ul className="grid gap-6 md:grid-cols-2">
          {PRESET_IDS.map((id) => {
            const active = current === id
            return (
              <li
                key={id}
                className={cn(
                  'grid overflow-hidden rounded-lg border-ph bg-surface transition-[border-color,box-shadow] duration-300',
                  active ? 'border-fg shadow-[0_0_0_3px_var(--ph-accent)]' : 'border-border',
                )}
              >
                {previews[id]}
                <div className="grid gap-4 p-6">
                  <div className="grid gap-1">
                    <h3 className="display-type text-2xl">{copy.presets[id].name}</h3>
                    <p className="label-type text-fg-muted">{copy.presets[id].tagline}</p>
                  </div>
                  <p className="text-fg-muted">{copy.presets[id].description}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={(e) =>
                        withThemeTransition(
                          () => dispatch(applyPreset(id)),
                          centerOf(e.currentTarget),
                        )
                      }
                      className={cn(
                        'inline-flex min-h-11 items-center gap-2 rounded-pill px-5 font-semibold transition-colors',
                        active
                          ? 'bg-fg text-bg'
                          : 'bg-accent text-accent-fg hover:bg-fg hover:text-bg',
                      )}
                    >
                      {active && <Check aria-hidden="true" className="size-4" strokeWidth={3} />}
                      {active ? p.applied : p.apply}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyLink(id)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-pill border-ph border-border-strong px-4 text-sm font-semibold hover:border-fg"
                    >
                      {copied === id ? (
                        <Check aria-hidden="true" className="size-4" />
                      ) : (
                        <Copy aria-hidden="true" className="size-4" />
                      )}
                      <span aria-live="polite">{copied === id ? p.copied : p.copy}</span>
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="finetune-title" className="grid gap-8 lg:grid-cols-12">
        <div className="grid content-start gap-3 lg:col-span-4">
          <h2 id="finetune-title" className="display-type text-display-md">
            {p.fineTuneTitle}
          </h2>
          <p className="text-fg-muted">{p.fineTuneLead}</p>
          {hydrated && preset === 'custom' && (
            <p className="label-type text-fg">{copy.dock.custom}</p>
          )}
        </div>
        <div className="grid gap-8 lg:col-span-8">
          <AxisRadioGroup
            name="config-theme"
            legend={copy.axes.theme.label}
            size="md"
            value={hydrated ? theme : null}
            options={THEME_IDS.map((id) => ({ id, ...copy.axes.theme.options[id] }))}
            onChange={(id, el) =>
              withThemeTransition(() => dispatch(setTheme(id)), centerOf(el.closest('label')))
            }
          />
          <AxisRadioGroup
            name="config-layout"
            legend={copy.axes.layout.label}
            size="md"
            value={hydrated ? layout : null}
            options={LAYOUT_IDS.map((id) => ({ id, ...copy.axes.layout.options[id] }))}
            onChange={(id, el) =>
              withThemeTransition(() => dispatch(setLayout(id)), centerOf(el.closest('label')))
            }
          />
          <AxisRadioGroup
            name="config-style"
            legend={copy.axes.style.label}
            size="md"
            value={hydrated ? style : null}
            options={STYLE_IDS.map((id) => ({ id, ...copy.axes.style.options[id] }))}
            onChange={(id, el) =>
              withThemeTransition(() => dispatch(setStyle(id)), centerOf(el.closest('label')))
            }
          />
          <div className="flex flex-wrap gap-3">
            <NextLink
              href="/"
              className="inline-flex min-h-12 items-center rounded-pill bg-accent px-6 font-semibold text-accent-fg hover:bg-fg hover:text-bg"
            >
              {p.viewSite}
            </NextLink>
            <button
              type="button"
              onClick={(e) =>
                withThemeTransition(() => dispatch(resetPreferences()), centerOf(e.currentTarget))
              }
              className="inline-flex min-h-12 items-center gap-2 rounded-pill border-ph border-border-strong px-6 font-semibold hover:border-fg"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              {p.reset}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
