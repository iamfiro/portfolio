import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Kbd.module.scss'

type KbdProps = {
  children?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLElement>

function Kbd({ className, style, children, ...rest }: KbdProps) {
  return (
    <kbd className={cn(styles.kbd, className)} style={style} {...rest}>
      {children}
    </kbd>
  )
}

export { Kbd }
export type { KbdProps }
