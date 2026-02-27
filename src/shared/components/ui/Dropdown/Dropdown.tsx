import { useState, useRef, useEffect } from 'react'
import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Dropdown.module.scss'

type DropdownItemData = {
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}

type DropdownProps = {
  trigger: React.ReactNode
  items: DropdownItemData[]
  align?: 'left' | 'right'
} & StyleProps

function Dropdown({
  trigger,
  items,
  align = 'left',
  className,
  style,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={ref} className={cn(styles.dropdown, className)} style={style}>
      <div onClick={() => setOpen((p) => !p)}>{trigger}</div>
      {open ? (
        <ul className={cn(styles.menu, styles[align])} role="menu">
          {items.map((item, i) => (
            <li key={i} role="none">
              <button
                className={styles.item}
                onClick={() => { item.onClick?.(); setOpen(false) }}
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
      ) : null}
    </div>
  )
}

export { Dropdown }
export type { DropdownProps, DropdownItemData }
