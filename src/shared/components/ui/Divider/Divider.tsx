import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Divider.module.scss'

type DividerProps = {
  orientation?: 'horizontal' | 'vertical'
  label?: string
} & StyleProps
  & React.HTMLAttributes<HTMLDivElement>

function Divider({
  orientation = 'horizontal',
  label,
  className,
  style,
  ...rest
}: DividerProps) {
  return (
    <div
      className={cn(styles.divider, styles[orientation], label && styles.withLabel, className)}
      style={style}
      role="separator"
      aria-orientation={orientation}
      {...rest}
    >
      {label ? <span className={styles.label}>{label}</span> : null}
    </div>
  )
}

export { Divider }
export type { DividerProps }
