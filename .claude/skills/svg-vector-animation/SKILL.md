---
name: svg-vector-animation
description: Vector and SVG workflow for the Powerhouse site. Covers turning the raster logo (brand_assets/kogo.png) into a clean, layered, animatable SVG, building the animated logo, authoring decorative background vectors (grain, film strip, waveform, timecode, grid) and icons, SVGO optimisation, accessibility and performance of inline SVG. Use when creating or editing any SVG, icon, illustration, logo, background pattern or path animation.
---

# SVG & Vector Animation

## 1. Vectorise the logo (one-time pipeline, keep it reproducible)

The only logo source is `brand_assets/kogo.png`: 7620×7620 RGBA with a transparent background, using exactly three flat colours (`#000000`, `#FEED01`, `#FFFFFF`). Flat colour on transparency traces cleanly, so **trace, don't redraw**.

Script: `scripts/vectorize-logo.mjs` (Node) or `scripts/vectorize_logo.py`. Commit the script, not only its output.

1. **Separate colour layers.** Threshold the PNG into three binary masks: black, yellow (R>200, G>180, B<120) and white-opaque (alpha>0 and all channels>230). Downscale to about 2000 px first. That is plenty for curves and much faster.
2. **Trace each mask** with potrace. Use `potrace` on npm (`2.x`) or `potracer`/`vtracer` on pip, with `turdSize ≈ 20` to drop specks, `optCurve: true` and `alphaMax ≈ 1.0`. Output one compound path per mask.
3. **Split into semantic parts** by connected components or bounding boxes, and name them as groups:
   ```
   <svg viewBox="…" role="img" aria-labelledby="ph-logo-title">
     <title id="ph-logo-title">Powerhouse Studios</title>
     <g id="mark">
       <path id="mark-p"/> <path id="mark-s"/>   ← the ribbon (split where P meets S if feasible)
       <g id="mic"/>                              ← bottom-left
       <g id="camera"><path id="camera-body"/><path id="camera-lens"/><path id="camera-play"/></g>
     </g>
     <g id="wordmark">
       <path id="pill"/> <path id="word-powerhouse"/> <path id="studios-inset"/> <path id="word-studios"/>
     </g>
   </svg>
   ```
4. **Crop the viewBox** to the artwork. The PNG has about 20% empty margin on every side.
5. **Optimise with SVGO 4** (`svgo --multipass`). Keep `id`s used for animation (config: `cleanupIds: false` or `prefixIds`), keep `viewBox`, `removeDimensions: true`, and round to 1–2 decimals. Target under 12 KB for the full logo.
6. **Verify** by rasterising the SVG back at 1000 px and diffing it against the downscaled PNG. There should be no missing parts and edges should match. Look at it, don't assume.
7. **Emit variants:** `logo-full.svg` (mark and wordmark), `logo-mark.svg` (PS, mic and camera only; favicon and app icons), `logo-wordmark.svg`, plus a mono version (single `currentColor`) for use on yellow and in dark UI.

Store generated SVGs in `src/assets/brand/` for React components and in `public/brand/` for `metadata.icons`, OG images and email. Generate `app/icon.svg` and `app/apple-icon.png` from the mark.

## 2. Logo as a React component

- `src/components/brand/logo.tsx` is a **server component**: static inline SVG with `fill` values from theme tokens (`var(--ph-logo-ink)`, `var(--ph-logo-accent)`). The logo then adapts to all three themes without separate files. On the yellow `signal` theme the pill inverts, with the black pill kept and the yellow word becoming black on white.
- `src/components/brand/animated-logo.tsx` is a **client island** that imports the same path data (from a shared `logo-paths.ts`) and adds motion. The static logo renders first. The animated one progressively enhances it, so there is never an empty box.

## 3. Logo animation (the signature moment)

Story: **input → output** (mic → ribbon → camera → wordmark). Total ≤ 1.8 s, play once per session (store a `sessionStorage` flag), and render it fully static under reduced motion.

| t (s) | Beat                                                                                      | Technique                                                                                                                                                                                                                                       |
| ----- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.00  | Ribbon draws from the P's top-left cut to the S's tail                                    | **Mask reveal.** Filled shapes can't use stroke-dash directly, so hand-author a centreline `<path>` through the ribbon, give it a thick stroke inside a `<mask>` and animate its `pathLength` 0→1 (`m.path` with `initial={{ pathLength: 0 }}`) |
| 0.55  | Mic pops in and emits two "sound" arcs                                                    | scale 0.6→1 with spring; arcs `pathLength` + opacity, from a `transform-origin` at the mic head                                                                                                                                                 |
| 0.85  | Camera slides in along the S direction, play triangle blinks, and a REC dot flashes twice | translate + opacity; play `opacity` keyframes `[0,1,0,1]` (≤ 3 flashes/s)                                                                                                                                                                       |
| 1.10  | Wordmark pill wipes open left→right, then STUDIOS inset snaps in                          | `clip-path: inset(0 100% 0 0 round 999px)` → `inset(0 0 0 0 round 999px)`; letters stagger by word, not glyph                                                                                                                                   |
| idle  | Optional subtle idle: camera play icon pulses every ~6 s                                  | paused when off-screen (`useInView`) and under reduced motion                                                                                                                                                                                   |

Other logo uses: a **hover** on the nav logo replays a 0.4 s micro version (camera blink only), the **preloader** stays none (never block content for a logo), and the **404** page uses the ribbon drawing in a loop with a "lost the shot" message from content.

## 4. Decorative background vectors

All decorative SVG is `aria-hidden="true"` and `focusable="false"`, sits behind content (`pointer-events: none`), and is coloured with tokens so it adapts per theme.

| Motif                                      | Build                                                                                                                                                                  | Where                             |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Film grain                                 | `<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch">` as a CSS `background-image` data-URI, **not** a live filter over the page | noir theme body                   |
| Film strip / sprocket holes                | `<pattern>` of rounded rects, repeat-x; marquee via CSS                                                                                                                | service lists, industries ticker  |
| Audio waveform                             | bars generated deterministically from a seeded array (no `Math.random()` during render, which causes hydration mismatch)                                               | podcast, studio sections          |
| Timecode / REC overlay                     | text in the mono token font plus a red-free REC dot (use `--ph-accent`)                                                                                                | signal theme hero, video sections |
| Viewfinder corners and rule-of-thirds grid | 4 L-shaped paths + hairlines                                                                                                                                           | image frames, hero                |
| Ribbon echo                                | the PS ribbon centreline, scaled huge at 4–6% opacity                                                                                                                  | section transitions               |

Prefer **CSS backgrounds** for repeating textures (no DOM nodes). Use **inline SVG** only when a part animates. Keep each decorative SVG under about 150 nodes. Any animated decorative layer pauses off-screen and under reduced motion.

## 5. Icons

- Use `lucide-react` for UI icons (tree-shakeable, `currentColor`, consistent 1.5–2 px stroke). Import icons individually.
- Service icons are custom-drawn in the logo's language (thick strokes, 52° cut terminals, rounded caps) so they feel owned: social, video camera, edit timeline, camera shutter, stage, coverage/live, studio light, campaign megaphone. Keep them on a 24 grid, `stroke="currentColor"`, in one file per icon under `src/components/icons/`.
- Icon-only buttons need an accessible name (`aria-label` from content). Decorative icons next to text are `aria-hidden`.

## 6. Rules of thumb

- `viewBox` always, never fixed `width`/`height` inside the SVG, and size with CSS.
- Unique IDs for `mask`, `clipPath`, `pattern` and `filter` per instance (`useId()`). Duplicate IDs break when the logo appears twice (nav and footer).
- Animate `transform`, `opacity`, `pathLength`, `clip-path` and `stroke-dashoffset`. Do not animate `d` morphs on large paths or `filter` blur on large areas on mobile.
- Set `transform-box: fill-box; transform-origin: center` on SVG children you scale or rotate.
- No external `<use href="…sprite.svg#…">` across origins, and no `<foreignObject>` in logos. Both are fragile in OG image renderers and email.
