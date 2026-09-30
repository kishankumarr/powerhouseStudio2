import { IconBase, type IconProps } from './icon-base'

/** Phone with a play cut: social content. */
export function IconSocial(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 2.5h10v19H7z" />
      <path d="M10.5 9.5v5l4-2.5z" fill="currentColor" stroke="none" />
      <path d="M10.5 18.5h3" />
    </IconBase>
  )
}
