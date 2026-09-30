/**
 * The only copy error boundaries may import: they are client components, and
 * importing the full content index there would ship every page's text.
 */
export const boundary = {
  en: {
    title: 'Something went wrong on set.',
    body: 'We hit a problem loading this page. Please try again in a moment.',
    retry: 'Try again',
    home: 'Back to home',
  },
} as const
