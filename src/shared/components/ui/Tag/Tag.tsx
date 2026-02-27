import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Tag.module.scss'

type TagProps = {
  variant?: 'filled' | 'outlined'
  size?: 'sm' | 'md'
  onRemove?: () => void
  children?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLSpanElement>

function Tag({
  variant = 'filled',
  size = 'md',
  onRemove,
  className,
  style,
  children,
  ...rest
}: TagProps) {
  return (
    <span className={cn(styles.tag, styles[variant], styles[size], className)} style={style} {...rest}>
      {children}
      {onRemove ? (
        <button className={styles.remove} onClick={onRemove} type="button" aria-label="Remove">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6L6 18" /><path d="M6 6l12 12" />
          </svg>
        </button>
      ) : null}
    </span>
  )
}

export { Tag }
export type { TagProps }
