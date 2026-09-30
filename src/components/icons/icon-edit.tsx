import { IconBase, type IconProps } from './icon-base'

/** Editing timeline: clips on two tracks and a playhead. */
export function IconEdit(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M2.5 8.5h7M12.5 8.5h9M2.5 15.5h11M16.5 15.5h5" />
      <path d="M11 3v18" />
      <path d="M9 3h4" />
    </IconBase>
  )
}
