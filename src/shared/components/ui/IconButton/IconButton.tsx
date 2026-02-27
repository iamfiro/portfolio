import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './IconButton.module.scss'

type IconButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  'aria-label': string
  children?: React.ReactNode
} & StyleProps
  & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>

function IconButton({
  variant = 'ghost',
  size = 'md',
  className,
  style,
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      className={cn(styles.iconButton, styles[variant], styles[size], className)}
      style={style}
      {...rest}
    >
      {children}
    </button>
  )
}

export { IconButton }
export type { IconButtonProps }
