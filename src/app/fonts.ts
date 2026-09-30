import { Instrument_Sans, Saira } from 'next/font/google'

/**
 * Saira is one variable family; each style axis picks a width on `wdth`
 * (sharp 75%, rounded 100%, condensed 56%). Its fallbacks are width-matched
 * per style in styles/styles.css, so Next's single auto fallback is disabled.
 */
export const saira = Saira({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-saira',
  display: 'swap',
  adjustFontFallback: false,
})

export const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'optional',
})
