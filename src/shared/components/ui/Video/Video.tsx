import type { LayoutProps, StyleProps } from '@/shared/types/component-common'
import { cn, buildLayoutStyle } from '../_utils'
import styles from './Video.module.scss'

type VideoProps = {
  src: string
  poster?: string
  rounded?: boolean
} & LayoutProps
  & StyleProps
  & Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'width' | 'height'>

function Video({
  src,
  poster,
  rounded = false,
  className,
  style,
  width, maxWidth, minWidth, height, maxHeight, minHeight,
  ...rest
}: VideoProps) {
  return (
    <video
      src={src}
      poster={poster}
      className={cn(styles.video, rounded && styles.rounded, className)}
      style={{
        ...buildLayoutStyle({ width, maxWidth, minWidth, height, maxHeight, minHeight }),
        ...style,
      }}
      controls
      {...rest}
    />
  )
}

export { Video }
export type { VideoProps }
