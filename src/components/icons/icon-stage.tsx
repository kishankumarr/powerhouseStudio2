import { IconBase, type IconProps } from './icon-base'

/** Stage with two spotlight beams: event management and production. */
export function IconStage(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M2.5 17.5h19v4h-19z" />
      <path d="M5 3l4 11M19 3l-4 11" />
      <path d="M9 14h6" />
    </IconBase>
  )
}
