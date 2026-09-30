import { IconBase, type IconProps } from './icon-base'

/** Megaphone: campaigns that carry one idea across many formats. */
export function IconCampaign(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 9.5h4l10-5.5v16l-10-5.5H3z" />
      <path d="M7 14.5l1.5 6h3L10 15" />
      <path d="M20 9.5v5" />
    </IconBase>
  )
}
