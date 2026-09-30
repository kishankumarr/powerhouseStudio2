#!/usr/bin/env node
// Contrast gate for the theme files (WCAG 2.2). Parses src/styles/themes/*.css,
// resolves each tone (base, contrast, accent) and fails on any pair below target.
// Run: npm run check:contrast
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const themeDir = path.join(root, 'src/styles/themes')
const globals = await readFile(path.join(root, 'src/styles/globals.css'), 'utf8')

// Brand constants from :root (--ph-yellow etc.)
const constants = Object.fromEntries(
  [...globals.matchAll(/--(ph-(?:yellow|black|white)):\s*(#[0-9a-f]{3,8})/gi)].map((m) => [
    m[1],
    m[2],
  ]),
)

const PAIRS = [
  ['fg', 'bg', 7],
  ['fg-muted', 'bg', 4.5],
  ['fg-muted', 'surface', 4.5],
  ['fg', 'surface', 4.5],
  ['accent-fg', 'accent', 4.5],
  ['ring', 'bg', 3],
  ['accent-ink', 'bg', 4.5],
  ['border-strong', 'bg', 3],
]

const hexToRgb = (hex) => {
  let h = hex.replace('#', '')
  if (h.length === 3) h = [...h].map((c) => c + c).join('')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}
const lum = ([r, g, b]) => {
  const f = (v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const ratio = (a, b) => {
  const [x, y] = [lum(hexToRgb(a)), lum(hexToRgb(b))].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

function parseBlocks(css) {
  const blocks = []
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1].replace(/\/\*[\s\S]*?\*\//g, '').trim()
    const tokens = Object.fromEntries(
      [...m[2].matchAll(/--ph-([\w-]+):\s*([^;]+);/g)].map((t) => [t[1], t[2].trim()]),
    )
    const tone = /data-tone='(\w+)'/.exec(selector)?.[1] ?? 'base'
    blocks.push({ selector, tone, tokens })
  }
  return blocks
}

function resolve(value, scope) {
  const v = /^var\(--([\w-]+)\)$/.exec(value)
  if (!v) return value
  const name = v[1]
  if (constants[name]) return constants[name]
  const key = name.replace(/^ph-/, '')
  return scope[key] ? resolve(scope[key], scope) : value
}

let failures = 0
let checks = 0
for (const file of (await readdir(themeDir)).filter((f) => f.endsWith('.css'))) {
  const theme = file.replace('.css', '')
  const blocks = parseBlocks(await readFile(path.join(themeDir, file), 'utf8'))
  const base = blocks.find((b) => b.tone === 'base')?.tokens ?? {}
  for (const block of blocks) {
    const scope = { ...base, ...block.tokens }
    for (const [fgKey, bgKey, min] of PAIRS) {
      const a = resolve(scope[fgKey] ?? '', scope)
      const b = resolve(scope[bgKey] ?? '', scope)
      if (!/^#/.test(a) || !/^#/.test(b)) continue
      checks++
      const r = ratio(a, b)
      const ok = r >= min
      if (!ok) failures++
      const line = `${ok ? 'ok  ' : 'FAIL'} ${theme}/${block.tone.padEnd(8)} ${fgKey.padEnd(13)} on ${bgKey.padEnd(8)} ${r.toFixed(2).padStart(5)} (min ${min})`
      if (!ok || process.argv.includes('--verbose')) console.log(line)
    }
  }
}
console.log(`\n${checks} pairs checked, ${failures} below target.`)
process.exit(failures ? 1 : 0)
