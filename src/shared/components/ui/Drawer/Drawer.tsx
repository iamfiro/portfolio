import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import { FocusLock } from '../FocusLock/FocusLock.tsx'
import styles from './Drawer.module.scss'

type DrawerProps = {
  open: boolean
  onClose: () => void
  side?: 'left' | 'right'
  width?: number | string
  title?: string
  children?: React.ReactNode
} & StyleProps

function Drawer({
  open,
  onClose,
  side = 'right',
  width = 360,
  title,
  className,
  style,
  children,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <FocusLock>
        <div
          className={cn(styles.drawer, styles[side], className)}
          style={{ width, ...style }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          {title ? (
            <div className={styles.header}>
              <h2 className={styles.title}>{title}</h2>
              <button className={styles.close} onClick={onClose} type="button" aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : null}
          <div className={styles.body}>{children}</div>
        </div>
      </FocusLock>
    </div>,
    document.body,
  )
}

export { Drawer }
export type { DrawerProps }
