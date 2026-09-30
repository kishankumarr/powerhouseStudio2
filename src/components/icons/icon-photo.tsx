import { IconBase, type IconProps } from './icon-base'

/** Stills camera with a cut top-left corner, echoing the ribbon terminals. */
export function IconPhoto(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 7.5h3l1.5-2.5h5L16 7.5h5.5v12h-19v-9.5z" />
      <circle cx="12" cy="13.5" r="3.25" />
    </IconBase>
  )
}
