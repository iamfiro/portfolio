import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Spinner.module.scss'

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  color?: string
} & StyleProps

function Spinner({
  size = 'md',
  color,
  className,
  style,
}: SpinnerProps) {
  return (
    <span
      className={cn(styles.spinner, styles[size], className)}
      style={{ borderTopColor: color, ...style }}
      role="status"
      aria-label="Loading"
    />
  )
}

export { Spinner }
export type { SpinnerProps }
