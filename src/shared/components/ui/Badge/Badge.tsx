import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Badge.module.scss'

type BadgeProps = {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md'
  dot?: boolean
  children?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLSpanElement>

function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  className,
  style,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span className={cn(styles.badge, styles[variant], styles[size], dot && styles.dot, className)} style={style} {...rest}>
      {children}
    </span>
  )
}

export { Badge }
export type { BadgeProps }
