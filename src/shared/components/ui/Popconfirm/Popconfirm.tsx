import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Popconfirm.module.scss'

type PopconfirmProps = {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
  children: React.ReactNode
} & StyleProps

function Popconfirm({
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  className,
  style,
  children,
}: PopconfirmProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (triggerRef.current?.contains(e.target as Node) || contentRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function getPosition(): React.CSSProperties {
    if (!triggerRef.current) return {}
    const rect = triggerRef.current.getBoundingClientRect()
    return { top: rect.bottom + 8, left: rect.left + rect.width / 2, transform: 'translateX(-50%)' }
  }

  return (
    <>
      <div ref={triggerRef} className={styles.trigger} onClick={() => setOpen(true)}>
        {children}
      </div>
      {open
        ? createPortal(
            <div ref={contentRef} className={cn(styles.popconfirm, className)} style={{ ...getPosition(), ...style }}>
              <p className={styles.title}>{title}</p>
              {description ? <p className={styles.description}>{description}</p> : null}
              <div className={styles.actions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => { onCancel?.(); setOpen(false) }}
                  type="button"
                >
                  {cancelText}
                </button>
                <button
                  className={styles.confirmBtn}
                  onClick={() => { onConfirm(); setOpen(false) }}
                  type="button"
                >
                  {confirmText}
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

export { Popconfirm }
export type { PopconfirmProps }
