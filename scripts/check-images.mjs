#!/usr/bin/env node
/**
 * Verifies every remote image in src/constants/images.ts.
 *
 * - Parses `src: '...'` values with a regex (no TS import, no dependencies).
 * - Fails on any host other than images.unsplash.com / images.pexels.com, and on plus.unsplash.com
 *   (Unsplash+ needs a paid licence).
 * - HEAD-requests each URL (following redirects) and fails on any final status other than 200.
 *
 * Usage: node scripts/check-images.mjs   (exit code 1 on any failure)
 */
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const ALLOWED_HOSTS = new Set(['images.unsplash.com', 'images.pexels.com'])
const TIMEOUT_MS = 20_000
const CONCURRENCY = 6

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const registryPath = path.join(root, 'src', 'constants', 'images.ts')

const source = await readFile(registryPath, 'utf8')
const srcs = [...source.matchAll(/\bsrc:\s*(['"`])(.*?)\1/g)].map((m) => m[2])

if (srcs.length === 0) {
  console.error(`No \`src: '...'\` entries found in ${path.relative(root, registryPath)}`)
  process.exit(1)
}

/** @param {string} url */
function checkHost(url) {
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return 'not a valid absolute URL'
  }
  if (parsed.protocol !== 'https:') return `protocol ${parsed.protocol} is not https`
  if (parsed.hostname === 'plus.unsplash.com' || url.includes('plus.unsplash.com')) {
    return 'plus.unsplash.com (Unsplash+) is not allowed'
  }
  if (!ALLOWED_HOSTS.has(parsed.hostname)) return `host ${parsed.hostname} is not allowed`
  return null
}

/** @param {string} url */
async function checkUrl(url) {
  const hostError = checkHost(url)
  if (hostError) return { url, ok: false, detail: hostError }

  /** @param {'HEAD' | 'GET'} method */
  const attempt = async (method) => {
    const res = await fetch(url, {
      method,
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    // Discard any body so sockets are released.
    await res.body?.cancel().catch(() => {})
    return res
  }

  try {
    let res = await attempt('HEAD')
    // Some CDNs reject HEAD outright; retry once with GET before failing.
    if (res.status === 405) res = await attempt('GET')
    if (res.url && res.url !== url) {
      const redirectError = checkHost(res.url)
      if (redirectError) return { url, ok: false, detail: `redirect: ${redirectError}` }
    }
    return { url, ok: res.status === 200, detail: String(res.status) }
  } catch (error) {
    return { url, ok: false, detail: error instanceof Error ? error.message : String(error) }
  }
}

const results = []
for (let i = 0; i < srcs.length; i += CONCURRENCY) {
  results.push(...(await Promise.all(srcs.slice(i, i + CONCURRENCY).map(checkUrl))))
}

const duplicates = srcs.filter((s, i) => srcs.indexOf(s) !== i)
for (const r of results) console.log(`${r.ok ? 'ok  ' : 'FAIL'} ${r.detail.padEnd(5)} ${r.url}`)
for (const d of new Set(duplicates)) console.log(`WARN duplicate src ${d}`)

const failures = results.filter((r) => !r.ok)
console.log(`\n${results.length - failures.length}/${results.length} images OK`)
if (failures.length > 0) process.exit(1)
