import type { Content } from '../types'

export const notFound = {
  code: '404',
  title: 'We lost the shot.',
  body: "This page isn't in the final cut. It may have moved, or the link may be wrong.",
  home: { label: 'Back to home', href: '/' },
  services: { label: 'Explore services', href: '/services' },
} satisfies Content['notFound']
