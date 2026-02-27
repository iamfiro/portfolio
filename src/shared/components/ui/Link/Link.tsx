import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Link.module.scss'

type LinkProps = {
  variant?: 'default' | 'subtle' | 'brand'
  external?: boolean
  children?: React.ReactNode
} & StyleProps
  & React.AnchorHTMLAttributes<HTMLAnchorElement>

function Link({
  variant = 'default',
  external = false,
  className,
  style,
  children,
  ...rest
}: LinkProps) {
  return (
    <a
      className={cn(styles.link, styles[variant], className)}
      style={style}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  )
}

export { Link }
export type { LinkProps }
