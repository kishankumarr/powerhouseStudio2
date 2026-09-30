import { IconBase, type IconProps } from './icon-base'

/** Softbox on a stand: studio space. */
export function IconStudio(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 3.5h14l-3 8H8z" />
      <path d="M12 11.5v10M7.5 21.5l4.5-5 4.5 5" />
    </IconBase>
  )
}
