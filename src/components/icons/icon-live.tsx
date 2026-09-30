import { IconBase, type IconProps } from './icon-base'

/** "On air" signal: coverage of a live moment. */
export function IconLive(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <path d="M8 8a5.5 5.5 0 0 0 0 8M16 8a5.5 5.5 0 0 1 0 8" strokeLinecap="round" />
      <path d="M4.8 4.8a10 10 0 0 0 0 14.4M19.2 4.8a10 10 0 0 1 0 14.4" strokeLinecap="round" />
    </IconBase>
  )
}
