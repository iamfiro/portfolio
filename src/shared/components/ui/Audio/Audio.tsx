import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Audio.module.scss'

type AudioProps = {
  src: string
} & StyleProps
  & Omit<React.AudioHTMLAttributes<HTMLAudioElement>, 'src'>

function Audio({ src, className, style, ...rest }: AudioProps) {
  return (
    <audio
      src={src}
      className={cn(styles.audio, className)}
      style={style}
      controls
      {...rest}
    />
  )
}

export { Audio }
export type { AudioProps }
