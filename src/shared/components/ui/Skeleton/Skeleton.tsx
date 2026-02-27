import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Skeleton.module.scss'

type SkeletonProps = {
  width?: string | number
  height?: string | number
  variant?: 'text' | 'circular' | 'rectangular'
} & StyleProps

function Skeleton({
  width,
  height,
  variant = 'text',
  className,
  style,
}: SkeletonProps) {
  return (
    <span
      className={cn(styles.skeleton, styles[variant], className)}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  )
}

export { Skeleton }
export type { SkeletonProps }
