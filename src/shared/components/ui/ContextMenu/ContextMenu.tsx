import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './ContextMenu.module.scss'

type ContextMenuItem = {
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  danger?: boolean
  onClick?: () => void
}

type ContextMenuProps = {
  items: ContextMenuItem[]
  children: React.ReactNode
} & StyleProps

function ContextMenu({
  items,
  className,
  style,
  children,
}: ContextMenuProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setPosition({ x: e.clientX, y: e.clientY })
  }, [])

  useEffect(() => {
    if (!position) return
    function close() { setPosition(null) }
    document.addEventListener('click', close)
    document.addEventListener('contextmenu', close)
    return () => {
      document.removeEventListener('click', close)
      document.removeEventListener('contextmenu', close)
    }
  }, [position])

  return (
    <>
      <div onContextMenu={handleContextMenu}>{children}</div>
      {position
        ? createPortal(
            <ul
              className={cn(styles.menu, className)}
              style={{ left: position.x, top: position.y, ...style }}
              role="menu"
            >
              {items.map((item, i) => (
                <li key={i} role="none">
                  <button
                    className={cn(styles.item, item.danger && styles.danger)}
                    onClick={() => { item.onClick?.(); setPosition(null) }}
                    disabled={item.disabled}
                    type="button"
                    role="menuitem"
                  >
                    {item.icon ? <span className={styles.icon}>{item.icon}</span> : null}
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>,
            document.body,
          )
        : null}
    </>
  )
}

export { ContextMenu }
export type { ContextMenuProps, ContextMenuItem }
