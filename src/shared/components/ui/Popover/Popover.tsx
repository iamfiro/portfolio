import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Popover.module.scss'

type PopoverProps = {
  placement?: 'top' | 'bottom' | 'left' | 'right'
  children: React.ReactNode
} & StyleProps

function Popover({ placement = 'bottom', className, style, children }: PopoverProps) {
  return (
    <PopoverInternalProvider placement={placement} className={className} style={style}>
      {children}
    </PopoverInternalProvider>
  )
}

type PopoverContextValue = {
  open: boolean
  setOpen: (v: boolean) => void
  triggerRef: React.RefObject<HTMLDivElement>
  placement: string
}

const EMPTY_CONTEXT: PopoverContextValue = {
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
  placement: 'bottom',
}

import { createContext, useContext } from 'react'

const PopoverContext = createContext<PopoverContextValue>(EMPTY_CONTEXT)

function PopoverInternalProvider({ placement, className, style, children }: { placement: string; children: React.ReactNode } & StyleProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        popoverRef.current?.contains(e.target as Node)
      ) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef, placement }}>
      <div ref={popoverRef} className={cn(styles.popover, className)} style={style}>
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

type PopoverTriggerProps = {
  children: React.ReactNode
}

function PopoverTrigger({ children }: PopoverTriggerProps) {
  const { setOpen, triggerRef } = useContext(PopoverContext)

  return (
    <div ref={triggerRef} onClick={() => setOpen(true)} className={styles.trigger}>
      {children}
    </div>
  )
}

type PopoverContentProps = {
  children: React.ReactNode
} & StyleProps

function PopoverContent({ className, style, children }: PopoverContentProps) {
  const { open, triggerRef, placement } = useContext(PopoverContext)
  const contentRef = useRef<HTMLDivElement>(null)
  const [adjusted, setAdjusted] = useState<React.CSSProperties | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
    } else if (mounted) {
      setVisible(false)
    }
  }, [open, mounted])

  useEffect(() => {
    if (!mounted || !triggerRef.current || !contentRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const content = contentRef.current.getBoundingClientRect()
    const pos: React.CSSProperties = {}
    const margin = 8

    switch (placement) {
      case 'top': {
        pos.bottom = window.innerHeight - rect.top + margin
        let left = rect.left + rect.width / 2 - content.width / 2
        left = Math.max(margin, Math.min(left, window.innerWidth - content.width - margin))
        pos.left = left
        break
      }
      case 'bottom': {
        pos.top = rect.bottom + margin
        let left = rect.left + rect.width / 2 - content.width / 2
        left = Math.max(margin, Math.min(left, window.innerWidth - content.width - margin))
        pos.left = left
        break
      }
      case 'left': {
        let top = rect.top + rect.height / 2 - content.height / 2
        top = Math.max(margin, Math.min(top, window.innerHeight - content.height - margin))
        pos.top = top
        pos.right = window.innerWidth - rect.left + margin
        break
      }
      case 'right': {
        let top = rect.top + rect.height / 2 - content.height / 2
        top = Math.max(margin, Math.min(top, window.innerHeight - content.height - margin))
        pos.top = top
        pos.left = rect.right + margin
        break
      }
    }

    setAdjusted(pos)
    requestAnimationFrame(() => setVisible(true))
  }, [mounted, placement, triggerRef])

  function handleTransitionEnd() {
    if (!visible) {
      setMounted(false)
      setAdjusted(null)
    }
  }

  if (!mounted || !triggerRef.current) return null

  return createPortal(
    <div
      ref={contentRef}
      className={cn(styles.content, visible && styles.visible, className)}
      style={{ ...adjusted, ...style }}
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </div>,
    document.body,
  )
}

export { Popover, PopoverTrigger, PopoverContent }
export type { PopoverProps, PopoverTriggerProps, PopoverContentProps }
