import type { SpacingProps, StyleProps } from '@/shared/types/component-common'
import { cn, buildSpacingStyle } from '../_utils'
import styles from './Card.module.scss'

type CardProps = {
  variant?: 'elevated' | 'outlined' | 'filled'
  hoverable?: boolean
  children?: React.ReactNode
} & SpacingProps
  & StyleProps
  & React.HTMLAttributes<HTMLDivElement>

function Card({
  variant = 'elevated',
  hoverable = false,
  className,
  style,
  m, mt, mr, mb, ml, mx, my,
  p, pt, pr, pb, pl, px, py,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(styles.card, styles[variant], hoverable && styles.hoverable, className)}
      style={{
        ...buildSpacingStyle({ m, mt, mr, mb, ml, mx, my, p, pt, pr, pb, pl, px, py }),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

export { Card }
export type { CardProps }
