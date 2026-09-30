import { SpotlightTracker } from './spotlight-tracker'

/** Fixed, decorative texture layers. Tokens decide their strength per theme. */
export function BackgroundLayers() {
  return (
    <>
      <div aria-hidden="true" className="ph-spotlight" />
      <div aria-hidden="true" className="ph-grain" />
      <SpotlightTracker />
    </>
  )
}
