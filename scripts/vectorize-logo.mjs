#!/usr/bin/env node
/**
 * Vectorise the Powerhouse Studios logo (brand_assets/kogo.png) into layered, animatable vectors.
 *
 *   node scripts/vectorize-logo.mjs                 # regenerate every output
 *   node scripts/vectorize-logo.mjs --verify <dir>  # also write diff / centreline check images
 *
 * Pipeline (see .claude/skills/svg-vector-animation/SKILL.md, section 1):
 *   1. Downscale the 7620px source and classify each pixel as clear/black/yellow/white.
 *   2. Crop to the artwork, split the opaque pixels into connected components and name each one
 *      with a probe point (the nearest component to the probe wins; every component must be named).
 *   3. Build one binary mask per semantic part. The wordmark is layered: the pill and the STUDIOS
 *      inset are solid silhouettes, the letters sit on top, so colours never leave hairline seams.
 *   4. Trace every mask with potrace. All parts share one coordinate system (the cropped artwork,
 *      1 unit = 1px of the source scaled to 2000px), so the mark and wordmark are viewBox crops.
 *   5. Optimise with SVGO, then write logo-paths.ts, the SVG variants and the PNG app icons.
 *   6. Check that the hand-authored ribbon centreline covers the whole ribbon, and diff a raster
 *      of the new SVG against the source downscaled to 2000px.
 *
 * Resolution: the source is rasterised at 4000px, but coordinates are in 2000px units. potrace
 * places vertices to within about half a traced pixel, and the camera corners, play disc and mic
 * head are only 20–45 units across, so those small parts are traced at 4000px. The big shapes are
 * smoothed and traced at 2000px instead (see the *_TRACE settings below).
 *
 * brand_assets/ is read-only: this script never writes there.
 */
import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import potrace from 'potrace'
import sharp from 'sharp'
import { optimize } from 'svgo'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = path.join(ROOT, 'brand_assets', 'kogo.png')
const DIR = {
  assets: path.join(ROOT, 'src', 'assets', 'brand'),
  public: path.join(ROOT, 'public', 'brand'),
  app: path.join(ROOT, 'src', 'app'),
  components: path.join(ROOT, 'src', 'components', 'brand'),
}

const UNITS = 2000 // coordinate system: 1 unit = 1px of the source scaled to 2000px wide
const TRACE_SIZE = 4000 // raster that potrace sees (an integer multiple of UNITS)
const SCALE = TRACE_SIZE / UNITS
const TURD_UNITS = 20 // unit²; specks smaller than this are dropped
const TURD_SIZE = TURD_UNITS * SCALE ** 2 // the same, in raster px
const OPT_TOLERANCE_UNITS = 0.2
const POTRACE_PARAMS = { optCurve: true, threshold: 128, blackOnWhite: true }
// How each mask is traced: units per traced pixel, an optional pre-blur (units) and potrace's
// corner threshold. The source's big shapes (ribbon, pill, inset) were evidently upscaled from a
// low-resolution original: their curves and diagonals are ~2 unit stair-steps. A 2-unit blur melts
// the steps (a blur never moves a straight edge) and tracing at 2000px then gives smooth curves,
// with straight edges within ~0.75 units of the source. The mic, camera and letters are clean and
// are traced at the full 4000px raster. alphaMax 1.2 (rather than potrace's default 1) stops the
// camera's and inset's small corner radii from being read as chamfers, while true 90° corners
// (alpha ≈ 1.33) stay sharp. The ribbon keeps 1 so its obtuse terminal corners stay crisp.
const DETAIL_TRACE = { unitsPerPx: 1 / SCALE, alphaMax: 1.2 }
const SILHOUETTE_TRACE = { unitsPerPx: 1, blur: 2, alphaMax: 1.2 }
const RIBBON_TRACE = { unitsPerPx: 1, blur: 2, alphaMax: 1 }
const PRECISION = 1 // decimals kept in path data (0.1 unit is < 0.01% of the logo width)

const TITLE = 'Powerhouse Studios'
const BRAND = { black: '#000000', yellow: '#FEED01', white: '#FFFFFF' }

// Colour decisions. A pixel is opaque when alpha >= 128. Nearest-colour-in-RGB is not usable here:
// neutral grey (black/white anti-aliasing) is nearer to yellow than to black or white. So each
// edge is decided between the two colours that actually meet there, at the anti-aliasing midpoint:
// white is the only colour with blue (and the source's yellow edges carry JPEG-style ringing with
// some blue, hence the second test); yellow vs black is decided only inside the letter zone.
const RGB = { black: [0, 0, 0], yellow: [254, 237, 1], white: [255, 255, 255] }
const LETTER_ZONE_MARGIN = 3 // units kept clear of the pill's edge and the inset when finding letters
const GLYPHS = { wordPowerhouse: 10, wordStudios: 7 } // expected letter outlines, as a sanity check
const CLEAR = 0
const BLACK = 1
const YELLOW = 2
const WHITE = 3

/**
 * One probe per connected component, in crop units. The component nearest to the probe gets the
 * name; the run fails if a component is left unnamed or two probes land on the same one.
 */
const COMPONENT_PROBES = {
  ribbonMain: [200, 85], // P top bar → bowl → S middle bar, S bowl and tail (one piece)
  ribbonPLower: [300, 315], // the P bowl's lower stroke, hugging the mic
  ribbonSTop: [720, 85], // the S's top terminal, next to the camera
  micHead: [81, 300], // capsule head; the grille slots are open notches (transparent)
  micStand: [81, 505], // U-shaped holder, stem and base block
  micFoot: [81, 528], // thin line under the base
  cameraBody: [1000, 80], // body + side tab; the screen is a transparent hole
  cameraLens: [1120, 80], // triangular hood on the right
  cameraScreenFrame: [855, 81], // thin rounded-square frame floating inside the screen hole
  cameraPlayButton: [888, 62], // disc with the play triangle knocked out
  wordmark: [20, 630], // the whole pill: black, yellow and white pixels
}

/**
 * Where the P hands over to the S: a straight cut through the traced main ribbon stroke from the
 * outer corner where the S middle bar starts, aimed at the tip of the P's lower bowl stroke. The
 * cut is made on the vector outline, so both halves follow the ribbon's outline exactly; each
 * reaches `overlap` units past the cut so the two paths never show a seam.
 */
const RIBBON_CUT = { from: [668, 210], to: [552, 331], insideP: [200, 85], overlap: 1 }

/**
 * Hand-authored centreline through the ribbon (crop units), drawn from the P's top-left cut to the
 * S's tail. A single stroke cannot visit the ribbon's two spurs (the S's top terminal and the P's
 * lower bowl stroke) without doubling back, so `draw: false` marks the stretches that only travel
 * back over ribbon that is already revealed. Butt caps: the ends start/stop past the diagonal cuts.
 */
const CENTERLINE = [
  // P top bar, straight through the bowl's shoulder and on into the S's top terminal
  { draw: true, d: 'M 24 85 H 798' },
  // back to the bowl
  { draw: false, d: 'C 700 85 560 95 560 140' },
  // down the P's bowl, hooking back left along its lower stroke to the mic
  { draw: true, d: 'C 575 185 590 212 598 232 C 606 258 580 297 522 308 H 72' },
  // back along the lower stroke to the join
  { draw: false, d: 'H 500' },
  // through the join into the S middle bar, round the S bowl and out to the tail
  {
    draw: true,
    d: 'C 560 308 585 258 680 256 H 950 C 1015 256 1066 292 1066 346 C 1066 400 1012 436 950 436 H 486',
  },
]
const CENTERLINE_STROKE = 158 // must cover the thickest part of the ribbon (S bowl ≈ 145)
const CENTERLINE_MARGIN = 2 // coverage must hold even with the stroke this much thinner per side

// ---------------------------------------------------------------------------------------------
// Raster helpers (masks are Uint8Array, 1 = ink, row-major over the cropped trace raster)
// ---------------------------------------------------------------------------------------------

const isOpaque = (rgba, p) => rgba[p * 4 + 3] >= 128
const isWhite = (rgba, p) => {
  const [r, g, b] = rgba.subarray(p * 4, p * 4 + 3)
  return b >= 128 && b >= 0.8 * Math.min(r, g)
}
/** True when the pixel is nearer to colour `a` than to colour `b`. */
const nearer = (rgba, p, a, b) => {
  const px = rgba.subarray(p * 4, p * 4 + 3)
  const dist = (c) => (px[0] - c[0]) ** 2 + (px[1] - c[1]) ** 2 + (px[2] - c[2]) ** 2
  return dist(a) < dist(b)
}
/** Brand-colour class of one pixel, for the diff report. */
function classify(rgba, p) {
  if (!isOpaque(rgba, p)) return CLEAR
  if (isWhite(rgba, p)) return WHITE
  return nearer(rgba, p, RGB.yellow, RGB.black) ? YELLOW : BLACK
}

async function loadRaster() {
  const { data, info } = await sharp(SOURCE)
    .resize({ width: TRACE_SIZE, kernel: 'lanczos3' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  return { w: info.width, h: info.height, rgba: data }
}

/** Grow a mask by r pixels (square structuring element, as two separable passes). */
function grow(mask, w, h, r) {
  const pass = (src, alongRows) => {
    const out = new Uint8Array(src.length)
    const [lines, len, step, stride] = alongRows ? [h, w, 1, w] : [w, h, w, 1]
    for (let line = 0; line < lines; line++) {
      const base = line * stride
      let count = 0 // set pixels in the window [i - r, i + r]
      for (let i = 0; i < Math.min(r, len); i++) count += src[base + i * step]
      for (let i = 0; i < len; i++) {
        if (i + r < len) count += src[base + (i + r) * step]
        if (i - r - 1 >= 0) count -= src[base + (i - r - 1) * step]
        out[base + i * step] = count > 0 ? 1 : 0
      }
    }
    return out
  }
  return pass(pass(mask, true), false)
}

/** 8-connected components of a mask, with pixel lists and inclusive bounding boxes. */
function components(mask, w, h) {
  const labels = new Int32Array(mask.length).fill(-1)
  const stack = new Int32Array(mask.length)
  const found = []
  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || labels[start] !== -1) continue
    const id = found.length
    const pixels = []
    let x0 = w
    let y0 = h
    let x1 = -1
    let y1 = -1
    let top = 0
    stack[top++] = start
    labels[start] = id
    while (top) {
      const p = stack[--top]
      pixels.push(p)
      const x = p % w
      const y = (p - x) / w
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
          const q = ny * w + nx
          if (mask[q] && labels[q] === -1) {
            labels[q] = id
            stack[top++] = q
          }
        }
      }
    }
    found.push({ id, pixels: Int32Array.from(pixels), x0, y0, x1, y1 })
  }
  return found
}

/** 4-connected flood fill over `mask` from a seed point; returns the reached pixels. */
function floodFill(mask, w, h, seeds) {
  const reached = new Uint8Array(mask.length)
  const stack = new Int32Array(mask.length)
  let top = 0
  for (const p of seeds) {
    if (mask[p] && !reached[p]) {
      reached[p] = 1
      stack[top++] = p
    }
  }
  while (top) {
    const p = stack[--top]
    const x = p % w
    const neighbours = [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, p - w, p + w]
    for (const q of neighbours) {
      if (q < 0 || q >= mask.length || !mask[q] || reached[q]) continue
      reached[q] = 1
      stack[top++] = q
    }
  }
  return reached
}

/** Fill enclosed holes: everything the outside cannot reach becomes ink. */
function fillHoles(mask, w, h) {
  const background = mask.map((v) => (v ? 0 : 1))
  const border = []
  for (let x = 0; x < w; x++) border.push(x, (h - 1) * w + x)
  for (let y = 0; y < h; y++) border.push(y * w, y * w + w - 1)
  const outside = floodFill(background, w, h, border)
  return outside.map((v) => (v ? 0 : 1))
}

function maskOf(size, ...comps) {
  const mask = new Uint8Array(size)
  for (const c of comps) for (const p of c.pixels) mask[p] = 1
  return mask
}

// ---------------------------------------------------------------------------------------------
// Semantic parts
// ---------------------------------------------------------------------------------------------

function nameComponents(comps, w) {
  const named = {}
  const owner = new Map()
  for (const [name, probe] of Object.entries(COMPONENT_PROBES)) {
    const [px, py] = probe.map((v) => v * SCALE)
    let best = null
    let bestDist = Infinity
    for (const c of comps) {
      const bx = Math.max(c.x0 - px, 0, px - c.x1 - 1)
      const by = Math.max(c.y0 - py, 0, py - c.y1 - 1)
      if (bx * bx + by * by >= bestDist) continue
      for (const p of c.pixels) {
        const x = p % w
        const dist = (x + 0.5 - px) ** 2 + ((p - x) / w + 0.5 - py) ** 2
        if (dist < bestDist) {
          bestDist = dist
          best = c
        }
      }
    }
    if (owner.has(best)) throw new Error(`Probes ${owner.get(best)} and ${name} hit one component`)
    owner.set(best, name)
    named[name] = best
  }
  const orphans = comps.filter((c) => !owner.has(c))
  if (orphans.length) {
    const boxes = orphans.map((c) => `[${c.x0},${c.y0}]-[${c.x1},${c.y1}]`).join(', ')
    throw new Error(`Unnamed components (add a probe): ${boxes}`)
  }
  return named
}

function wordmarkMasks(rgba, pillComp, w, h) {
  const inPill = maskOf(w * h, pillComp)
  const pill = fillHoles(inPill, w, h) // solid silhouette; letters and inset are painted on top
  const white = inPill.map((v, p) => (v && isWhite(rgba, p) ? 1 : 0))
  const insetComp = components(white, w, h).sort((a, b) => b.pixels.length - a.pixels.length)[0]
  const studiosInset = fillHoles(maskOf(w * h, insetComp), w, h) // solid; STUDIOS sits on top

  // POWERHOUSE: yellow vs black, only in the zone clear of the pill's edge and of the inset.
  const margin = LETTER_ZONE_MARGIN * SCALE
  const nearEdge = grow(
    pill.map((v) => 1 - v),
    w,
    h,
    margin,
  )
  const nearInset = grow(studiosInset, w, h, margin)
  const letterZone = pill.map((v, p) => v & (1 - nearEdge[p]) & (1 - nearInset[p]))
  const masks = {
    pill,
    wordPowerhouse: letterZone.map((v, p) => (v && nearer(rgba, p, RGB.yellow, RGB.black) ? 1 : 0)),
    studiosInset,
    wordStudios: studiosInset.map((v, p) => (v && nearer(rgba, p, RGB.black, RGB.white) ? 1 : 0)),
  }
  for (const [name, expected] of Object.entries(GLYPHS)) {
    const found = components(masks[name], w, h).filter((c) => c.pixels.length >= TURD_SIZE).length
    if (found !== expected) throw new Error(`${name}: expected ${expected} letters, found ${found}`)
  }
  return masks
}

// ---------------------------------------------------------------------------------------------
// Tracing and optimisation
// ---------------------------------------------------------------------------------------------

/**
 * Trace a mask with potrace. `unitsPerPx` 0.5 traces the full 4000px raster; 1 traces a 2000px
 * raster made by averaging 2x2 blocks (after the optional blur), which potrace thresholds at 50%.
 * Returns path data in units, wound so it renders correctly under either fill rule.
 */
async function traceMask(mask, w, h, { unitsPerPx, blur = 0, alphaMax = 1 }) {
  let cover = Buffer.from(mask.map((v) => v * 255)) // 255 = ink
  if (blur) {
    cover = await sharp(cover, { raw: { width: w, height: h, channels: 1 } })
      .blur(blur * SCALE)
      .extractChannel(0) // blur() promotes to sRGB; keep one channel
      .raw()
      .toBuffer()
  }
  const f = unitsPerPx * SCALE // raster px per traced px
  if (!Number.isInteger(f) || f < 1) throw new Error(`Unsupported trace resolution ${unitsPerPx}`)
  const [tw, th] = [Math.ceil(w / f), Math.ceil(h / f)]
  const ink = new Uint32Array(tw * th)
  for (let p = 0; p < cover.length; p++) {
    ink[Math.floor(Math.floor(p / w) / f) * tw + Math.floor((p % w) / f)] += cover[p]
  }
  const grey = Buffer.from(ink.map((n) => 255 - Math.round(n / (f * f))))
  const png = await sharp(grey, { raw: { width: tw, height: th, channels: 1 } })
    .png()
    .toBuffer()
  const tracer = new potrace.Potrace({
    ...POTRACE_PARAMS,
    alphaMax,
    turdSize: Math.max(1, Math.round(TURD_UNITS / unitsPerPx ** 2)),
    optTolerance: OPT_TOLERANCE_UNITS / unitsPerPx,
  })
  await new Promise((resolve, reject) => {
    tracer.loadImage(png, (err) => (err ? reject(err) : resolve()))
  })
  const d = /\sd="([^"]*)"/.exec(tracer.getPathTag())?.[1]?.trim()
  if (!d) throw new Error('potrace returned an empty path')
  return normaliseWinding(d, unitsPerPx)
}

// ---------------------------------------------------------------------------------------------
// Path geometry. Subpaths are { start, segments } with absolute points; a segment is a line
// { p } or a cubic { c1, c2, p }. Only potrace's output and our own M/C/L/Z format are parsed.
// ---------------------------------------------------------------------------------------------

function parsePath(d) {
  return d
    .split(/(?=M)/)
    .map((chunk) => {
      const tokens = chunk.match(/[MCLZ]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? []
      const start = [Number(tokens[1]), Number(tokens[2])]
      const segments = []
      let cmd = ''
      for (let i = 3; i < tokens.length;) {
        if (tokens[i] === 'Z') break
        if (/[CL]/.test(tokens[i])) cmd = tokens[i++]
        const pt = () => [Number(tokens[i++]), Number(tokens[i++])]
        segments.push(cmd === 'C' ? { c1: pt(), c2: pt(), p: pt() } : { p: pt() })
      }
      return { start, segments }
    })
    .filter((s) => s.segments.length)
}

function formatPath(subpaths) {
  const pt = ([x, y]) => `${round(x, 3)} ${round(y, 3)}`
  return subpaths
    .map(({ start, segments }) => {
      const body = segments.map((s) =>
        s.c1 ? `C ${pt(s.c1)} ${pt(s.c2)} ${pt(s.p)}` : `L ${pt(s.p)}`,
      )
      return `M ${pt(start)} ${body.join(' ')} Z`
    })
    .join(' ')
}

/** Polygon through every on-curve and control point: enough for winding sign and nesting. */
const hullPolygon = ({ start, segments }) => [
  start,
  ...segments.flatMap((s) => (s.c1 ? [s.c1, s.c2, s.p] : [s.p])),
]

function signedArea(poly) {
  let area = 0
  poly.forEach(([x1, y1], i) => {
    const [x2, y2] = poly[(i + 1) % poly.length]
    area += x1 * y2 - x2 * y1
  })
  return area
}

function pointInPolygon([px, py], poly) {
  let hit = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) hit = !hit
  }
  return hit
}

/**
 * potrace's JS port winds holes the same way as outlines, so they only render as holes under
 * even-odd. Re-wind every subpath by nesting depth (outlines one way, holes the other) so the
 * paths are correct under both fill rules. Coordinates are multiplied by `scale`.
 */
function normaliseWinding(d, scale) {
  const scalePt = ([x, y]) => [x * scale, y * scale]
  const subpaths = parsePath(d).map(({ start, segments }) => ({
    start: scalePt(start),
    segments: segments.map((s) =>
      s.c1 ? { c1: scalePt(s.c1), c2: scalePt(s.c2), p: scalePt(s.p) } : { p: scalePt(s.p) },
    ),
  }))
  const polys = subpaths.map(hullPolygon)
  return formatPath(
    subpaths.map((s, i) => {
      const depth = polys.filter((poly, j) => j !== i && pointInPolygon(s.start, poly)).length
      if (signedArea(polys[i]) > 0 === (depth % 2 === 0)) return s
      // Walk the segments backwards: each one now runs from its end point to its start point.
      const ends = [s.start, ...s.segments.map((seg) => seg.p)]
      const segments = s.segments
        .map((seg, k) => (seg.c1 ? { c1: seg.c2, c2: seg.c1, p: ends[k] } : { p: ends[k] }))
        .reverse()
      return { start: ends[ends.length - 1], segments }
    }),
  )
}

/** Reflect point p across the line through a and b. */
function mirrorAcross(p, a, b) {
  const len2 = (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2
  const t = ((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / len2
  const foot = [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]
  return [2 * foot[0] - p[0], 2 * foot[1] - p[1]]
}

const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

function pointAt(from, seg, t) {
  if (!seg.c1) return lerp(from, seg.p, t)
  const [a, b, c] = [lerp(from, seg.c1, t), lerp(seg.c1, seg.c2, t), lerp(seg.c2, seg.p, t)]
  return lerp(lerp(a, b, t), lerp(b, c, t), t)
}

/** The part of a segment between parameters t0 < t1 (de Casteljau), as { from, seg }. */
function subSegment(from, seg, t0, t1) {
  if (!seg.c1) return { from: lerp(from, seg.p, t0), seg: { p: lerp(from, seg.p, t1) } }
  const split = (p0, s, t) => {
    const [a, b, c] = [lerp(p0, s.c1, t), lerp(s.c1, s.c2, t), lerp(s.c2, s.p, t)]
    const [d, e] = [lerp(a, b, t), lerp(b, c, t)]
    const m = lerp(d, e, t)
    return [
      { from: p0, seg: { c1: a, c2: d, p: m } },
      { from: m, seg: { c1: e, c2: c, p: s.p } },
    ]
  }
  const head = t1 < 1 ? split(from, seg, t1)[0] : { from, seg }
  return t0 > 0 ? split(head.from, head.seg, t0 / t1)[1] : head
}

/**
 * Cut one closed subpath with the straight line through `from`→`to` (only crossings whose
 * projection lies between -0.3 and 1.2 along the segment count; there must be exactly two) and
 * keep the side containing `keep`. The line is pushed `overlap` units away from the kept side,
 * so two halves cut this way overlap by 2 × overlap and never show a seam. The kept outline is
 * the original outline exactly, closed by a straight line along the cut.
 */
function cutSubpath({ start, segments }, from, to, keep, overlap) {
  const len = Math.hypot(to[0] - from[0], to[1] - from[1])
  const u = [(to[0] - from[0]) / len, (to[1] - from[1]) / len]
  const side = (p) => (p[1] - from[1]) * u[0] - (p[0] - from[0]) * u[1]
  const sign = Math.sign(side(keep))
  const g = (p) => sign * side(p) + overlap // > 0 on the kept side
  const along = (p) => ((p[0] - from[0]) * u[0] + (p[1] - from[1]) * u[1]) / len
  const starts = segments.map((_, k) => (k === 0 ? start : segments[k - 1].p))

  const hits = []
  segments.forEach((seg, k) => {
    const steps = seg.c1 ? 64 : 1
    for (let i = 0; i < steps; i++) {
      let [a, b] = [i / steps, (i + 1) / steps]
      if (Math.sign(g(pointAt(starts[k], seg, a))) === Math.sign(g(pointAt(starts[k], seg, b))))
        continue
      for (let n = 0; n < 50; n++) {
        const m = (a + b) / 2
        const same =
          Math.sign(g(pointAt(starts[k], seg, m))) === Math.sign(g(pointAt(starts[k], seg, a)))
        ;[a, b] = same ? [m, b] : [a, m]
      }
      const t = (a + b) / 2
      const at = along(pointAt(starts[k], seg, t))
      if (at >= -0.3 && at <= 1.2) hits.push({ k, t })
    }
  })
  if (hits.length !== 2) throw new Error(`Ribbon cut crosses the outline ${hits.length} times`)

  // Walk from one crossing to the other along the outline; pick the arc on the kept side.
  const arc = (h0, h1) => {
    const out = []
    let k = h0.k
    let t0 = h0.t
    for (;;) {
      const last = k === h1.k && (t0 < h1.t || out.length > 0)
      out.push(subSegment(starts[k], segments[k], t0, last ? h1.t : 1))
      if (last) return out
      k = (k + 1) % segments.length
      t0 = 0
    }
  }
  const [h0, h1] = hits
  const first = arc(h0, h1)
  const mid = first[Math.floor(first.length / 2)]
  const kept = g(pointAt(mid.from, mid.seg, 0.5)) > 0 ? first : arc(h1, h0)
  return {
    start: kept[0].from,
    segments: [...kept.map((s) => s.seg), { p: kept[0].from }], // closing line runs along the cut
  }
}

const layeredSvgo = {
  multipass: true,
  floatPrecision: PRECISION,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false, // ids are animation hooks
          mergePaths: false,
          collapseGroups: false,
          removeUnknownsAndDefaults: { keepRoleAttr: true },
        },
      },
    },
    'removeDimensions',
  ],
}
const flatSvgo = {
  multipass: true,
  floatPrecision: PRECISION,
  plugins: [
    {
      name: 'preset-default',
      params: { overrides: { removeUnknownsAndDefaults: { keepRoleAttr: true } } },
    },
    'removeDimensions',
  ],
}

/** Run every path through SVGO once so logo-paths.ts and the SVG files share identical data. */
function optimisePaths(paths, viewBox) {
  const body = Object.entries(paths)
    .map(([id, d]) => `<path id="${id}" d="${d}"/>`)
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>`
  const { data } = optimize(svg, layeredSvgo)
  const out = {}
  for (const [tag] of data.matchAll(/<path\b[^>]*>/g)) {
    const id = /\bid="([^"]+)"/.exec(tag)?.[1]
    const d = /\bd="([^"]+)"/.exec(tag)?.[1]
    if (id && d) out[id] = d
  }
  for (const id of Object.keys(paths)) if (!out[id]) throw new Error(`SVGO dropped path ${id}`)
  return out
}

// ---------------------------------------------------------------------------------------------
// Centreline geometry (absolute M/H/V/L/C only, which is all CENTERLINE uses)
// ---------------------------------------------------------------------------------------------

function segmentLengths(segments) {
  let x = 0
  let y = 0
  return segments.map(({ d }) => {
    const tokens = d.match(/[MHVLC]|-?\d*\.?\d+/g) ?? []
    let length = 0
    let cmd = ''
    for (let i = 0; i < tokens.length;) {
      if (/[MHVLC]/.test(tokens[i])) cmd = tokens[i++]
      const n = (k) => Number(tokens[i + k])
      if (cmd === 'M') {
        ;[x, y] = [n(0), n(1)]
        i += 2
      } else if (cmd === 'H' || cmd === 'V' || cmd === 'L') {
        const [nx, ny] = cmd === 'H' ? [n(0), y] : cmd === 'V' ? [x, n(0)] : [n(0), n(1)]
        length += Math.hypot(nx - x, ny - y)
        ;[x, y] = [nx, ny]
        i += cmd === 'L' ? 2 : 1
      } else if (cmd === 'C') {
        const pts = [
          [x, y],
          [n(0), n(1)],
          [n(2), n(3)],
          [n(4), n(5)],
        ]
        let [px, py] = [x, y]
        for (let s = 1; s <= 64; s++) {
          const t = s / 64
          const k = [(1 - t) ** 3, 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t ** 2, t ** 3]
          const qx = k.reduce((sum, c, j) => sum + c * pts[j][0], 0)
          const qy = k.reduce((sum, c, j) => sum + c * pts[j][1], 0)
          length += Math.hypot(qx - px, qy - py)
          ;[px, py] = [qx, qy]
        }
        ;[x, y] = pts[3]
        i += 6
      } else {
        throw new Error(`Unsupported centreline command in "${d}"`)
      }
    }
    return length
  })
}

function centrelineInfo() {
  const lengths = segmentLengths(CENTERLINE)
  const total = lengths.reduce((a, b) => a + b, 0)
  const retraceSpans = []
  let at = 0
  CENTERLINE.forEach(({ draw }, i) => {
    const next = at + lengths[i]
    if (!draw) retraceSpans.push([round(at / total, 3), round(next / total, 3)])
    at = next
  })
  return { d: CENTERLINE.map((s) => s.d).join(' '), length: Math.round(total), retraceSpans }
}

// ---------------------------------------------------------------------------------------------
// SVG documents
// ---------------------------------------------------------------------------------------------

const round = (v, digits = 1) => Number(v.toFixed(digits))
const svgDoc = (viewBox, body, attrs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" fill-rule="evenodd"${attrs}>` +
  `<title>${TITLE}</title>${body}</svg>`
const pathEl = (d, attrs = '') => `<path${attrs} d="${d}"/>`

function markLayers(p) {
  return (
    pathEl(p.ribbonP, ' id="mark-p"') +
    pathEl(p.ribbonS, ' id="mark-s"') +
    pathEl(p.mic, ' id="mic"') +
    `<g id="camera">${pathEl(p.cameraBody, ' id="camera-body"')}` +
    `${pathEl(p.cameraLens, ' id="camera-lens"')}${pathEl(p.cameraPlay, ' id="camera-play"')}</g>`
  )
}

function wordmarkLayers(p) {
  return (
    `<g id="wordmark">${pathEl(p.pill, ` id="pill" fill="${BRAND.black}"`)}` +
    pathEl(p.wordPowerhouse, ` id="word-powerhouse" fill="${BRAND.yellow}"`) +
    pathEl(p.studiosInset, ` id="studios-inset" fill="${BRAND.white}"`) +
    `${pathEl(p.wordStudios, ` id="word-studios" fill="${BRAND.black}"`)}</g>`
  )
}

/** A square frame around the mark: `markWidth` is the share of the side the mark spans. */
function squareFrame(markBox, markWidth) {
  const side = Math.round(markBox.w / markWidth)
  return {
    x: round(markBox.x + markBox.w / 2 - side / 2),
    y: round(markBox.y + markBox.h / 2 - side / 2),
    side,
  }
}

function markOnSquare(p, frame, cornerRadius) {
  const { x, y, side } = frame
  const markPaths = [p.ribbon, p.mic, p.cameraBody, p.cameraLens, p.cameraPlay]
  return svgDoc(
    `${x} ${y} ${side} ${side}`,
    `<rect x="${x}" y="${y}" width="${side}" height="${side}" rx="${cornerRadius}" fill="${BRAND.yellow}"/>` +
      `<g fill="${BRAND.black}">${markPaths.map((d) => pathEl(d)).join('')}</g>`,
  )
}

/** Rasterise an SVG string at an exact pixel size (width/height are injected, never saved). */
function rasterise(svg, width, height) {
  const sized = svg.replace('<svg ', `<svg width="${width}" height="${height}" `)
  return sharp(Buffer.from(sized))
}

// ---------------------------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------------------------

/** Fail the run if the centreline stroke (thinned by the margin) leaves any ribbon pixel bare. */
async function checkCentreline(ribbonD, centreline, crop) {
  const vb = `0 0 ${crop.w} ${crop.h}`
  const fill = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"><path d="${ribbonD}"/></svg>`
  const stroke =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"><path d="${centreline.d}" fill="none" ` +
    `stroke="#000" stroke-width="${CENTERLINE_STROKE - 2 * CENTERLINE_MARGIN}"/></svg>`
  const alpha = async (svg) =>
    await rasterise(svg, crop.w, crop.h).ensureAlpha().extractChannel(3).raw().toBuffer()
  const [ribbon, cover] = await Promise.all([alpha(fill), alpha(stroke)])
  let bare = 0
  for (let p = 0; p < ribbon.length; p++) if (ribbon[p] >= 128 && cover[p] < 250) bare++
  if (bare) throw new Error(`Centreline leaves ${bare} ribbon pixels uncovered; widen or re-route`)
}

/** Diff a raster of the full SVG against the downscaled source, class by class. */
async function diffAgainstSource(fullSvg, crop, verifyDir) {
  const width = 1000
  const height = Math.round((width * crop.h) / crop.w)
  const reference = await sharp(SOURCE)
    .resize({ width: UNITS, kernel: 'lanczos3' })
    .extract({ left: crop.x, top: crop.y, width: crop.w, height: crop.h })
    .toBuffer()
  const ref = await sharp(reference)
    .resize(width, height, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer()
  const out = await rasterise(fullSvg, width, height).ensureAlpha().raw().toBuffer()
  let opaque = 0
  let mismatched = 0
  const diff = Buffer.alloc(width * height * 4)
  for (let p = 0; p < width * height; p++) {
    const a = classify(ref, p)
    const b = classify(out, p)
    const px = diff.subarray(p * 4, p * 4 + 4)
    if (a === CLEAR && b === CLEAR) px.set([255, 255, 255, 255])
    else {
      opaque++
      if (a !== b) {
        mismatched++
        px.set([230, 0, 0, 255])
      } else px.set([190, 190, 190, 255])
    }
  }
  const percent = (100 * mismatched) / opaque
  if (verifyDir) {
    const tile = (buf) =>
      sharp(buf, { raw: { width, height, channels: 4 } })
        .flatten({ background: '#ff9be6' }) // magenta shows transparent holes
        .extend({ top: 10, bottom: 10, left: 10, right: 10, background: '#ffffff' })
        .png()
        .toBuffer()
    const tiles = await Promise.all([tile(ref), tile(out), tile(diff)])
    await sharp({
      create: { width: (width + 20) * 3, height: height + 20, channels: 3, background: '#fff' },
    })
      .composite(tiles.map((input, i) => ({ input, left: i * (width + 20), top: 0 })))
      .png()
      .toFile(path.join(verifyDir, 'compare-source-svg-diff.png'))
  }
  return { opaque, mismatched, percent }
}

/** Draw the centreline over the mark and render the mask reveal at several progress points. */
async function writeCentrelineChecks(p, centreline, viewBoxes, crop, verifyDir) {
  const [mx, my, mw, mh] = viewBoxes.mark.split(' ').map(Number)
  const scale = 1.2
  const size = [Math.round(mw * scale), Math.round(mh * scale)]
  const others = [p.mic, p.cameraBody, p.cameraLens, p.cameraPlay].map((d) => pathEl(d)).join('')
  const overlay = svgDoc(
    viewBoxes.mark,
    `<rect x="${mx}" y="${my}" width="${mw}" height="${mh}" fill="#fff"/>` +
      `<g fill="#bbb">${others}</g>${pathEl(p.ribbon, ' fill="#000"')}` +
      `<path d="${centreline.d}" fill="none" stroke="#f00" stroke-opacity=".45" stroke-width="${CENTERLINE_STROKE}"/>` +
      `<path d="${centreline.d}" fill="none" stroke="#00f" stroke-width="2"/>`,
  )
  await rasterise(overlay, ...size)
    .png()
    .toFile(path.join(verifyDir, 'centreline-overlay.png'))

  const steps = [0.08, 0.16, 0.24, 0.32, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
  const frames = await Promise.all(
    steps.map(async (t) => {
      const dash = `${centreline.length * t} ${centreline.length * 2}`
      const svg = svgDoc(
        viewBoxes.mark,
        `<defs><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${crop.w}" height="${crop.h}">` +
          `<path d="${centreline.d}" fill="none" stroke="#fff" stroke-width="${CENTERLINE_STROKE}" stroke-dasharray="${dash}"/></mask></defs>` +
          `<rect x="${mx}" y="${my}" width="${mw}" height="${mh}" fill="#fff"/>` +
          `${pathEl(p.ribbon, ' fill="#eee"')}${pathEl(p.ribbon, ' fill="#000" mask="url(#m)"')}` +
          `<path d="${centreline.d}" fill="none" stroke="#f00" stroke-width="3" stroke-dasharray="${dash}"/>`,
      )
      return rasterise(svg, Math.round(mw / 2), Math.round(mh / 2))
        .png()
        .toBuffer()
    }),
  )
  const fw = Math.round(mw / 2) + 10
  const fh = Math.round(mh / 2) + 10
  await sharp({ create: { width: fw * 4, height: fh * 3, channels: 3, background: '#888' } })
    .composite(
      frames.map((input, i) => ({ input, left: (i % 4) * fw, top: Math.floor(i / 4) * fh })),
    )
    .png()
    .toFile(path.join(verifyDir, 'centreline-reveal-frames.png'))
}

// ---------------------------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------------------------

/** Pixel bounds of components in raster px (pixel x covers [x, x + 1]). */
function rasterBox(comps) {
  const x0 = Math.min(...comps.map((c) => c.x0))
  const y0 = Math.min(...comps.map((c) => c.y0))
  const x1 = Math.max(...comps.map((c) => c.x1)) + 1
  const y1 = Math.max(...comps.map((c) => c.y1)) + 1
  return { x0, y0, x1, y1 }
}

/** Bounds in units, snapped outwards to whole units (for crops and viewBoxes). */
function unitBox(comps) {
  const b = rasterBox(comps)
  const x = Math.floor(b.x0 / SCALE)
  const y = Math.floor(b.y0 / SCALE)
  return { x, y, w: Math.ceil(b.x1 / SCALE) - x, h: Math.ceil(b.y1 / SCALE) - y }
}

/** Exact bounds in units, relative to the crop (for centres and radii). */
function exactBox(comp) {
  const b = rasterBox([comp])
  return { x: b.x0 / SCALE, y: b.y0 / SCALE, w: (b.x1 - b.x0) / SCALE, h: (b.y1 - b.y0) / SCALE }
}

async function main() {
  const verifyArg = process.argv.indexOf('--verify')
  const verifyDir = verifyArg > -1 ? path.resolve(process.argv[verifyArg + 1] ?? '.') : null

  // 1. Crop to the artwork (ignoring specks), snapped outwards to whole units.
  const full = await loadRaster()
  const fullOpaque = new Uint8Array(full.w * full.h).map((_, p) => (isOpaque(full.rgba, p) ? 1 : 0))
  const fullComps = components(fullOpaque, full.w, full.h).filter(
    (c) => c.pixels.length >= TURD_SIZE,
  )
  const crop = unitBox(fullComps) // in units
  const [rx, ry, w, h] = [crop.x, crop.y, crop.w, crop.h].map((v) => v * SCALE) // in raster px
  const rgba = new Uint8Array(w * h * 4)
  for (let y = 0; y < h; y++) {
    const from = (y + ry) * full.w + rx
    rgba.set(full.rgba.subarray(from * 4, (from + w) * 4), y * w * 4)
  }
  const opaque = new Uint8Array(w * h).map((_, p) => (isOpaque(rgba, p) ? 1 : 0))

  // 2. Name the components.
  const comps = components(opaque, w, h).filter((c) => c.pixels.length >= TURD_SIZE)
  const part = nameComponents(comps, w)
  const size = w * h

  // 3. Masks per semantic part.
  const masks = {
    ribbonMain: maskOf(size, part.ribbonMain),
    ribbonPLower: maskOf(size, part.ribbonPLower),
    ribbonSTop: maskOf(size, part.ribbonSTop),
    mic: maskOf(size, part.micHead, part.micStand, part.micFoot),
    cameraBody: maskOf(size, part.cameraBody),
    cameraLens: maskOf(size, part.cameraLens),
    cameraScreenFrame: maskOf(size, part.cameraScreenFrame),
    cameraPlayButton: maskOf(size, part.cameraPlayButton),
    ...wordmarkMasks(rgba, part.wordmark, w, h),
  }

  // 4. Trace (potrace is synchronous per image, so run them one after another).
  const traced = {}
  for (const [name, mask] of Object.entries(masks)) {
    const how = name.startsWith('ribbon')
      ? RIBBON_TRACE
      : name === 'pill' || name === 'studiosInset'
        ? SILHOUETTE_TRACE
        : DETAIL_TRACE
    traced[name] = await traceMask(mask, w, h, how)
  }
  const [mainOutline, ...extra] = parsePath(traced.ribbonMain)
  if (extra.length) throw new Error('Expected the main ribbon stroke to be a single outline')
  const cutHalf = (keep) => {
    const { from, to, overlap } = RIBBON_CUT
    return formatPath([cutSubpath(mainOutline, from, to, keep, overlap)])
  }
  traced.ribbonPMain = cutHalf(RIBBON_CUT.insideP)
  // The S half keeps the other side: mirror the P probe across the cut line.
  traced.ribbonSMain = cutHalf(mirrorAcross(RIBBON_CUT.insideP, RIBBON_CUT.from, RIBBON_CUT.to))

  // Bounds in units (viewBoxes snap outwards to whole units; centres stay exact).
  const markBox = unitBox(comps.filter((c) => c !== part.wordmark))
  const wordBox = unitBox([part.wordmark])
  const vb = (b) => `${b.x} ${b.y} ${b.w} ${b.h}`
  const viewBoxes = { full: `0 0 ${crop.w} ${crop.h}`, mark: vb(markBox), wordmark: vb(wordBox) }

  // 5. Compose the public parts and optimise them together.
  const paths = optimisePaths(
    {
      ribbon: [traced.ribbonMain, traced.ribbonPLower, traced.ribbonSTop].join(' '),
      ribbonP: [traced.ribbonPMain, traced.ribbonPLower].join(' '),
      ribbonS: [traced.ribbonSTop, traced.ribbonSMain].join(' '),
      mic: traced.mic,
      cameraBody: traced.cameraBody,
      cameraLens: traced.cameraLens,
      cameraPlay: [traced.cameraScreenFrame, traced.cameraPlayButton].join(' '),
      cameraScreenFrame: traced.cameraScreenFrame,
      cameraPlayButton: traced.cameraPlayButton,
      pill: traced.pill,
      wordPowerhouse: traced.wordPowerhouse,
      studiosInset: traced.studiosInset,
      wordStudios: traced.wordStudios,
    },
    viewBoxes.full,
  )

  const head = exactBox(part.micHead)
  const micHead = {
    cx: round(head.x + head.w / 2),
    cy: round(head.y + head.h / 2),
    r: round(head.w / 2),
    ry: round(head.h / 2),
  }
  const play = exactBox(part.cameraPlayButton)
  const playCenter = {
    cx: round(play.x + play.w / 2),
    cy: round(play.y + play.h / 2),
    r: round((play.w + play.h) / 4),
  }

  const centreline = centrelineInfo()
  await checkCentreline(paths.ribbon, centreline, crop)

  // 6. SVG variants.
  const monoWordmark = [paths.pill, paths.wordPowerhouse, paths.studiosInset, paths.wordStudios]
  const iconFrame = squareFrame(markBox, 0.84)
  const svgs = {
    'logo-full.svg': svgDoc(
      viewBoxes.full,
      `<g id="mark" fill="${BRAND.black}">${markLayers(paths)}</g>${wordmarkLayers(paths)}`,
    ),
    'logo-mark.svg': svgDoc(
      viewBoxes.mark,
      `<g id="mark" fill="${BRAND.black}">${markLayers(paths)}</g>`,
    ),
    'logo-wordmark.svg': svgDoc(viewBoxes.wordmark, wordmarkLayers(paths)),
    // One colour: the pill keeps POWERHOUSE and the STUDIOS window knocked out (even-odd nesting),
    // with STUDIOS solid inside the window, so it reads on yellow, dark UI and photos alike.
    'logo-mono.svg': svgDoc(
      viewBoxes.full,
      `<g id="mark">${markLayers(paths)}</g>${pathEl(monoWordmark.join(''), ' id="wordmark"')}`,
      ' fill="currentColor"',
    ),
    'logo-mark-on-yellow.svg': markOnSquare(paths, iconFrame, Math.round(iconFrame.side * 0.22)),
  }
  const optimised = {}
  for (const [file, svg] of Object.entries(svgs)) {
    optimised[file] = optimize(
      svg,
      file === 'logo-mark-on-yellow.svg' ? flatSvgo : layeredSvgo,
    ).data
  }

  await Promise.all(Object.values(DIR).map((dir) => mkdir(dir, { recursive: true })))
  for (const [file, svg] of Object.entries(optimised)) {
    await writeFile(path.join(DIR.assets, file), svg)
    await copyFile(path.join(DIR.assets, file), path.join(DIR.public, file))
  }
  await writeFile(path.join(DIR.app, 'icon.svg'), optimised['logo-mark-on-yellow.svg'])

  // 7. PNGs. Apple and maskable icons are full-bleed and opaque (the OS applies its own mask).
  const fullBleed = (frame) => markOnSquare(paths, frame, 0)
  const maskableFrame = squareFrame(markBox, 0.68) // mark diagonal stays inside the 80% circle
  const iconSvg = optimised['logo-mark-on-yellow.svg']
  const flattenedPng = (img) => img.flatten({ background: BRAND.yellow }).removeAlpha().png()
  await flattenedPng(rasterise(fullBleed(iconFrame), 180, 180)).toFile(
    path.join(DIR.app, 'apple-icon.png'),
  )
  await rasterise(iconSvg, 192, 192).png().toFile(path.join(DIR.public, 'icon-192.png'))
  await rasterise(iconSvg, 512, 512).png().toFile(path.join(DIR.public, 'icon-512.png'))
  await flattenedPng(rasterise(fullBleed(maskableFrame), 512, 512)).toFile(
    path.join(DIR.public, 'icon-maskable-512.png'),
  )
  await rasterise(optimised['logo-full.svg'], 1200, Math.round((1200 * crop.h) / crop.w))
    .png()
    .toFile(path.join(DIR.public, 'logo-full-1200.png'))

  // 8. Shared path data for React.
  await writeFile(
    path.join(DIR.components, 'logo-paths.ts'),
    logoPathsModule({ paths, viewBoxes, centreline, micHead, playCenter, crop }),
  )

  // 9. Report.
  if (verifyDir) await mkdir(verifyDir, { recursive: true })
  const diff = await diffAgainstSource(optimised['logo-full.svg'], crop, verifyDir)
  if (verifyDir) await writeCentrelineChecks(paths, centreline, viewBoxes, crop, verifyDir)
  console.log(`crop (units, in the 2000px-wide source): ${JSON.stringify(crop)}`)
  console.log(`viewBoxes: ${JSON.stringify(viewBoxes)}`)
  for (const [file, svg] of Object.entries(optimised)) {
    console.log(`${file.padEnd(26)} ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`)
  }
  console.log(
    `centreline: ${centreline.length} units, retrace spans ${JSON.stringify(centreline.retraceSpans)}`,
  )
  console.log(
    `diff vs source @1000px: ${diff.mismatched}/${diff.opaque} opaque px = ${diff.percent.toFixed(2)}%`,
  )
}

function logoPathsModule({ paths, viewBoxes, centreline, micHead, playCenter, crop }) {
  const q = (s) => `'${s}'`
  const doc = {
    ribbon: 'P + S ribbon: main stroke, the P bowl’s lower stroke and the S top terminal.',
    ribbonP: 'P half: top bar and bowl down to the join, plus the lower bowl stroke.',
    ribbonS:
      'S half: top terminal, middle bar, bowl and tail. Overlaps ribbonP by ~2 units at the cut.',
    mic: 'Microphone: capsule head (grille slots are open notches), holder, stem, base and foot line.',
    cameraBody: 'Camera body incl. the side tab. The screen is a transparent hole.',
    cameraLens: 'Triangular lens hood on the right.',
    cameraPlay:
      'Screen detail inside the body’s screen hole: the thin rounded-square frame plus the play disc with its triangle knocked out (holes, not white).',
    cameraScreenFrame: 'Just the frame from cameraPlay.',
    cameraPlayButton: 'Just the play disc (triangle knocked out) from cameraPlay; blink this one.',
    pill: 'Wordmark pill as a solid silhouette (paint first).',
    wordPowerhouse: 'POWERHOUSE letters; counters are holes that show the pill.',
    studiosInset: 'STUDIOS inset as a solid silhouette (opaque white in the brand logo).',
    wordStudios: 'STUDIOS letters; counters are holes that show the inset.',
  }
  // Emit what Prettier would: a long value moves to its own line after the key, unless the key
  // is shorter than 5 characters (Prettier's "short key" rule).
  const prop = (key, value) => {
    const line = `  ${key}: ${value},`
    return line.length <= 100 || key.length < 5 ? line : `  ${key}:\n    ${value},`
  }
  const entries = Object.entries(paths)
    .map(([k, d]) => `  /** ${doc[k]} */\n${prop(k, q(d))}`)
    .join('\n')
  const spans = centreline.retraceSpans.map(([a, b]) => `    [${a}, ${b}],`).join('\n')
  return `// Generated by scripts/vectorize-logo.mjs from brand_assets/kogo.png. Do not edit by hand;
// run \`npm run logo\` instead.
//
// One shared coordinate system: the cropped full logo (1 unit = 1px of the source scaled to
// ${UNITS}px; crop origin ${crop.x},${crop.y}). The mark and wordmark are viewBox crops of it.
// No colours live here; components fill each part with theme tokens.
//
// Paint order: ribbon, mic and camera parts in any order (they never overlap). The wordmark is
// layered: pill → wordPowerhouse → studiosInset → wordStudios. Transparent details (mic grille,
// camera screen, play triangle, letter counters) are real holes, so the page shows through.

export const LOGO_VIEWBOX = {
  full: ${q(viewBoxes.full)},
  mark: ${q(viewBoxes.mark)},
  wordmark: ${q(viewBoxes.wordmark)},
} as const

export const LOGO_PATHS = {
${entries}
} as const

export type LogoPart = keyof typeof LOGO_PATHS

/** Every path is well nested and consistently wound, so 'nonzero' also works per path, but
 * 'evenodd' is required when you concatenate parts (e.g. a one-colour knockout wordmark). */
export const LOGO_FILL_RULE = 'evenodd'

/**
 * Centreline for the ribbon mask reveal: stroke it white inside a <mask> with
 * \`strokeWidth\` and butt caps, animate pathLength 0 → 1 and the filled \`ribbon\` is revealed
 * from the P's top-left cut, along the P, through the join into the S and out to the S's tail.
 * It doubles back twice (after the S top terminal and after the P's lower bowl stroke);
 * \`retraceSpans\` are those stretches as fractions of the path length, where nothing new is
 * revealed. Keyframe pathLength through them quickly if the pause shows.
 */
export const RIBBON_CENTERLINE = {
${prop('d', q(centreline.d))}
  strokeWidth: ${CENTERLINE_STROKE},
  strokeLinecap: 'butt',
  length: ${centreline.length},
  retraceSpans: [
${spans}
  ],
} as const

/** Mic head (a vertical capsule): centre, cap radius (half its width) and half its height. */
export const MIC_HEAD = { cx: ${micHead.cx}, cy: ${micHead.cy}, r: ${micHead.r}, ry: ${micHead.ry} } as const

/** Centre (and radius) of the camera's play disc, for a blink/pulse transform-origin. */
export const CAMERA_PLAY_CENTER = { cx: ${playCenter.cx}, cy: ${playCenter.cy}, r: ${playCenter.r} } as const
`
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
