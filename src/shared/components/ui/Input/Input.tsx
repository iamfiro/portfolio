import type { LayoutProps, StyleProps } from '@/shared/types/component-common'
import { cn, buildLayoutStyle } from '../_utils'
import styles from './Input.module.scss'

type InputProps = {
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
} & StyleProps
  & Pick<LayoutProps, 'width' | 'maxWidth'>
  & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>

function Input({
  size = 'md',
  error = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  style,
  width,
  maxWidth,
  ...rest
}: InputProps) {
  return (
    <div
      className={cn(
        styles.wrapper,
        styles[size],
        error && styles.error,
        fullWidth && styles.fullWidth,
        className,
      )}
      style={{ ...buildLayoutStyle({ width, maxWidth }), ...style }}
    >
      {leftIcon ? <span className={styles.icon}>{leftIcon}</span> : null}
      <input className={styles.input} {...rest} />
      {rightIcon ? <span className={styles.icon}>{rightIcon}</span> : null}
    </div>
  )
}

export { Input }
export type { InputProps }
