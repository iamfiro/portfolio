import type { LayoutProps, StyleProps } from '@/shared/types/component-common'
import { cn, buildLayoutStyle } from '../_utils'
import styles from './Button.module.scss'

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
} & StyleProps
  & Pick<LayoutProps, 'width' | 'maxWidth'>
  & React.ButtonHTMLAttributes<HTMLButtonElement>

function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  style,
  width,
  maxWidth,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className,
      )}
      style={{ ...buildLayoutStyle({ width, maxWidth }), ...style }}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className={styles.spinner} /> : null}
      {leftIcon ? <span className={styles.icon}>{leftIcon}</span> : null}
      {children}
      {rightIcon ? <span className={styles.icon}>{rightIcon}</span> : null}
    </button>
  )
}

export { Button }
export type { ButtonProps }
