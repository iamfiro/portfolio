import { createPortal } from 'react-dom'
import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Overlay.module.scss'

type OverlayProps = {
  visible: boolean
  onClick?: () => void
  blur?: boolean
  children?: React.ReactNode
} & StyleProps

function Overlay({
  visible,
  onClick,
  blur = false,
  className,
  style,
  children,
}: OverlayProps) {
  if (!visible) return null

  return createPortal(
    <div
      className={cn(styles.overlay, blur && styles.blur, className)}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>,
    document.body,
  )
}

type BackdropProps = {
  visible: boolean
  onClick?: () => void
} & StyleProps

function Backdrop({ visible, onClick, className, style }: BackdropProps) {
  if (!visible) return null

  return createPortal(
    <div className={cn(styles.backdrop, className)} style={style} onClick={onClick} />,
    document.body,
  )
}

export { Overlay, Backdrop }
export type { OverlayProps, BackdropProps }
