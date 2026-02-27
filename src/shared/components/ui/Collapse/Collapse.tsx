import { useRef, useState, useEffect } from 'react'
import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Collapse.module.scss'

type CollapseProps = {
  open: boolean
  children?: React.ReactNode
} & StyleProps

function Collapse({ open, className, style, children }: CollapseProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | undefined>(open ? undefined : 0)

  useEffect(() => {
    if (!ref.current) return
    if (open) {
      setHeight(ref.current.scrollHeight)
      const timer = setTimeout(() => setHeight(undefined), 200)
      return () => clearTimeout(timer)
    } else {
      setHeight(ref.current.scrollHeight)
      requestAnimationFrame(() => setHeight(0))
    }
  }, [open])

  return (
    <div
      ref={ref}
      className={cn(styles.collapse, open && styles.open, className)}
      style={{ height, ...style }}
    >
      {children}
    </div>
  )
}

export { Collapse }
export type { CollapseProps }
