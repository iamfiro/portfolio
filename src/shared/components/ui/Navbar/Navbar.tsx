import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Navbar.module.scss'

type NavbarProps = {
  sticky?: boolean
  children?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLElement>

function Navbar({
  sticky = false,
  className,
  style,
  children,
  ...rest
}: NavbarProps) {
  return (
    <nav className={cn(styles.navbar, sticky && styles.sticky, className)} style={style} {...rest}>
      <div className={styles.inner}>
        {children}
      </div>
    </nav>
  )
}

export { Navbar }
export type { NavbarProps }
