import { IconBase, type IconProps } from './icon-base'

/** Video camera, drawn like the one in the logo: body plus a flared lens. */
export function IconVideo(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M2.5 7h12v10h-12z" />
      <path d="M14.5 10.5l7-3.5v10l-7-3.5" />
      <circle cx="8.5" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </IconBase>
  )
}
