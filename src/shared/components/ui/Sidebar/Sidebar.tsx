import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Sidebar.module.scss'

type SidebarProps = {
  width?: number
  collapsed?: boolean
  children?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLElement>

function Sidebar({
  width = 260,
  collapsed = false,
  className,
  style,
  children,
  ...rest
}: SidebarProps) {
  return (
    <aside
      className={cn(styles.sidebar, collapsed && styles.collapsed, className)}
      style={{ width: collapsed ? 64 : width, ...style }}
      {...rest}
    >
      {children}
    </aside>
  )
}

export { Sidebar }
export type { SidebarProps }
