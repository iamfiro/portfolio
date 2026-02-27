import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Tooltip.module.scss'

type TooltipProps = {
  content: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  children: React.ReactNode
} & StyleProps

function Tooltip({
  content,
  placement = 'top',
  delay = 200,
  className,
  style,
  children,
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  function show() {
    timeoutRef.current = setTimeout(() => setVisible(true), delay)
  }

  function hide() {
    clearTimeout(timeoutRef.current)
    setVisible(false)
  }

  function getPosition(): React.CSSProperties {
    if (!triggerRef.current) return {}
    const rect = triggerRef.current.getBoundingClientRect()

    switch (placement) {
      case 'top': return { bottom: window.innerHeight - rect.top + 6, left: rect.left + rect.width / 2, transform: 'translateX(-50%)' }
      case 'bottom': return { top: rect.bottom + 6, left: rect.left + rect.width / 2, transform: 'translateX(-50%)' }
      case 'left': return { top: rect.top + rect.height / 2, right: window.innerWidth - rect.left + 6, transform: 'translateY(-50%)' }
      case 'right': return { top: rect.top + rect.height / 2, left: rect.right + 6, transform: 'translateY(-50%)' }
    }
  }

  return (
    <>
      <div
        ref={triggerRef}
        className={styles.trigger}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </div>
      {visible
        ? createPortal(
            <div className={cn(styles.tooltip, className)} style={{ ...getPosition(), ...style }} role="tooltip">
              {content}
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

export { Tooltip }
export type { TooltipProps }
