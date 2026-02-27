import { useRef, useState, useCallback } from 'react'
import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Resizable.module.scss'

type ResizableProps = {
  direction?: 'horizontal' | 'vertical' | 'both'
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  defaultWidth?: number
  defaultHeight?: number
  children?: React.ReactNode
} & StyleProps

function Resizable({
  direction = 'horizontal',
  minWidth = 100,
  minHeight = 100,
  maxWidth = Infinity,
  maxHeight = Infinity,
  defaultWidth = 300,
  defaultHeight = 200,
  className,
  style,
  children,
}: ResizableProps) {
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight })
  const startRef = useRef({ x: 0, y: 0, w: 0, h: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    startRef.current = { x: e.clientX, y: e.clientY, w: size.width, h: size.height }

    function handleMouseMove(ev: MouseEvent) {
      const dx = ev.clientX - startRef.current.x
      const dy = ev.clientY - startRef.current.y

      setSize({
        width: Math.min(maxWidth, Math.max(minWidth, startRef.current.w + dx)),
        height: Math.min(maxHeight, Math.max(minHeight, startRef.current.h + dy)),
      })
    }

    function handleMouseUp() {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [size, minWidth, minHeight, maxWidth, maxHeight])

  return (
    <div
      className={cn(styles.resizable, className)}
      style={{
        width: direction !== 'vertical' ? size.width : undefined,
        height: direction !== 'horizontal' ? size.height : undefined,
        ...style,
      }}
    >
      {children}
      <div className={cn(styles.handle, styles[direction])} onMouseDown={handleMouseDown} />
    </div>
  )
}

export { Resizable }
export type { ResizableProps }
