import type { StyleProps } from '@/shared/types/component-common'
import type { SpacingToken } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Spacer.module.scss'

type SpacerProps = {
  size?: SpacingToken
  axis?: 'horizontal' | 'vertical'
} & StyleProps

function Spacer({
  size = 16,
  axis = 'vertical',
  className,
  style,
}: SpacerProps) {
  const width = axis === 'horizontal' ? size : undefined
  const height = axis === 'vertical' ? size : undefined

  return (
    <div
      className={cn(styles.spacer, className)}
      style={{ width, minWidth: width, height, minHeight: height, ...style }}
      aria-hidden="true"
    />
  )
}

export { Spacer }
export type { SpacerProps }
