import type { ImageLoaderProps } from 'next/image'

/**
 * Unsplash (imgix) and Pexels resize on their own CDNs, so responsive srcsets cost
 * no server work: `auto=format` negotiates AVIF/WebP per browser.
 */
export function cdnLoader({ src, width, quality }: ImageLoaderProps): string {
  const q = quality ?? 70
  if (src.startsWith('https://images.unsplash.com/')) {
    return `${src}?auto=format&fit=max&w=${width}&q=${q}`
  }
  if (src.startsWith('https://images.pexels.com/')) {
    return `${src}?auto=compress&cs=tinysrgb&w=${width}`
  }
  return src
}
