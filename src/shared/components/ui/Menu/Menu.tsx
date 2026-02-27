import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Menu.module.scss'

type MenuItemData = {
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  danger?: boolean
  onClick?: () => void
}

type MenuProps = {
  items: MenuItemData[]
} & StyleProps
  & React.HTMLAttributes<HTMLUListElement>

function Menu({ items, className, style, ...rest }: MenuProps) {
  return (
    <ul className={cn(styles.menu, className)} style={style} role="menu" {...rest}>
      {items.map((item, i) => (
        <li key={i} role="none">
          <button
            className={cn(styles.item, item.danger && styles.danger)}
            onClick={item.onClick}
            disabled={item.disabled}
            type="button"
            role="menuitem"
          >
            {item.icon ? <span className={styles.icon}>{item.icon}</span> : null}
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  )
}

export { Menu }
export type { MenuProps, MenuItemData }
