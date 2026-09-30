import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'
import { LOGO_FILL_RULE, LOGO_PATHS, LOGO_VIEWBOX } from '@/components/brand/logo-paths'
import { getContent } from '@/content'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

const YELLOW = '#FEED01'
const INK = '#F5F4EE'
const BLACK = '#000000'

/** The full logo as an SVG data URI, coloured for the black OG stage. */
function logoDataUri(): string {
  const [, , w, h] = LOGO_VIEWBOX.full.split(' ')
  const p = LOGO_PATHS
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_VIEWBOX.full}" width="${w}" height="${h}" fill-rule="${LOGO_FILL_RULE}">
<g fill="${INK}"><path d="${p.ribbon}"/><path d="${p.mic}"/><path d="${p.cameraBody}"/><path d="${p.cameraLens}"/><path d="${p.cameraScreenFrame}"/><path d="${p.cameraPlayButton}"/></g>
<path d="${p.pill}" fill="#141413" stroke="#3a3a36" stroke-width="3"/><path d="${p.wordPowerhouse}" fill="${YELLOW}"/>
<path d="${p.studiosInset}" fill="${INK}"/><path d="${p.wordStudios}" fill="${BLACK}"/></svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

async function fonts() {
  const dir = path.join(process.cwd(), 'src/assets/fonts')
  const [display, body] = await Promise.all([
    readFile(path.join(dir, 'saira-75-700.woff')),
    readFile(path.join(dir, 'instrument-sans-500.woff')),
  ])
  return [
    { name: 'Saira', data: display, weight: 700 as const, style: 'normal' as const },
    { name: 'Instrument Sans', data: body, weight: 500 as const, style: 'normal' as const },
  ]
}

type OgInput = { eyebrow: string; title: string }

const CORNERS = [
  { top: 28, left: 28, borderWidth: '3px 0 0 3px' },
  { top: 28, right: 28, borderWidth: '3px 3px 0 0' },
  { bottom: 118, left: 28, borderWidth: '0 0 3px 3px' },
  { bottom: 118, right: 28, borderWidth: '0 3px 3px 0' },
]

/**
 * Shared 1200×630 composition: black stage, yellow key light, logo top-right, page
 * title in the display face, the brand promise and site URL on a yellow strip.
 */
export async function renderOg({ eyebrow, title }: OgInput) {
  const { site } = getContent()
  const titleSize = title.length > 42 ? 76 : title.length > 26 ? 92 : 112
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: `radial-gradient(circle at 78% 30%, rgba(254,237,1,0.22), rgba(0,0,0,0) 55%), ${BLACK}`,
        color: INK,
        fontFamily: 'Instrument Sans',
        position: 'relative',
      }}
    >
      {/* viewfinder corners (Satori rejects undefined style values, so build them explicitly) */}
      {CORNERS.map((style, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 34,
            height: 34,
            borderColor: '#6b6a64',
            borderStyle: 'solid',
            ...style,
          }}
        />
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '64px 72px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: YELLOW }} />
          <div
            style={{
              fontFamily: 'Saira',
              fontSize: 24,
              letterSpacing: 5,
              textTransform: 'uppercase',
              color: '#bdbbaf',
            }}
          >
            {eyebrow}
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain img */}
        <img src={logoDataUri()} width={300} height={184} alt="" />
      </div>

      <div
        style={{
          display: 'flex',
          padding: '0 72px',
          fontFamily: 'Saira',
          fontSize: titleSize,
          lineHeight: 0.92,
          textTransform: 'uppercase',
          maxWidth: 1060,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 96,
          padding: '0 72px',
          background: YELLOW,
          color: BLACK,
        }}
      >
        <div style={{ fontFamily: 'Saira', fontSize: 34, textTransform: 'uppercase' }}>
          {site.tagline}
        </div>
        <div style={{ fontSize: 26 }}>{site.website.display}</div>
      </div>
    </div>,
    { ...OG_SIZE, fonts: await fonts() },
  )
}
