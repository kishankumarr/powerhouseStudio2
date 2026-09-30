import { getImageProps } from 'next/image'
import { IMAGES, type ImageKey } from '@/constants/images'
import { getContent } from '@/content'
import { cdnLoader } from '@/lib/image-loader'
import { cn } from '@/lib/utils'

type MediaProps = {
  image: ImageKey
  sizes: string
  className?: string
  imgClassName?: string
  /**
   * Only for the single LCP image of a page: eager + high fetch priority. (No react-dom
   * preload(): its hint rides along in Link prefetches and would fetch every linked
   * page's hero image.)
   */
  preload?: boolean
  /** Decorative images get alt="" */
  decorative?: boolean
  quality?: 60 | 70 | 75
  treat?: boolean
  /** Cover the nearest positioned ancestor instead of sizing itself. */
  fill?: boolean
}

/**
 * Plain server <img> with a responsive CDN srcset: zero client JS, zero hydration.
 * Fills its (positioned, sized) parent; theme treatment comes from CSS tokens.
 */
export function Media({
  image,
  sizes,
  className,
  imgClassName,
  preload = false,
  decorative = false,
  quality = 70,
  treat = true,
  fill = false,
}: MediaProps) {
  const asset = IMAGES[image]
  const alt = decorative ? '' : getContent().images[image]
  const { props } = getImageProps({
    src: asset.src,
    alt,
    fill: true,
    sizes,
    quality,
    loader: cdnLoader,
    loading: preload ? 'eager' : 'lazy',
    fetchPriority: preload ? 'high' : 'auto',
  })
  return (
    <div className={cn('overflow-hidden', fill ? 'absolute inset-0' : 'relative', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- getImageProps output */}
      <img
        {...props}
        alt={alt}
        className={cn('object-cover', treat && 'img-treat', imgClassName)}
        style={{ ...props.style, objectPosition: asset.focal ?? '50% 50%' }}
      />
    </div>
  )
}

/** Props for client islands that render an image (e.g. the hover preview). */
export function mediaProps(image: ImageKey, sizes: string) {
  const asset = IMAGES[image]
  const { props } = getImageProps({
    src: asset.src,
    alt: '',
    fill: true,
    sizes,
    quality: 70,
    loader: cdnLoader,
  })
  return {
    src: props.src,
    srcSet: props.srcSet,
    sizes: props.sizes,
    focal: asset.focal ?? '50% 50%',
  }
}
export type MediaImgProps = ReturnType<typeof mediaProps>
