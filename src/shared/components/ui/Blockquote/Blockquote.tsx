import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Blockquote.module.scss'

type BlockquoteProps = {
  children?: React.ReactNode
} & StyleProps
  & React.BlockquoteHTMLAttributes<HTMLQuoteElement>

function Blockquote({ className, style, children, ...rest }: BlockquoteProps) {
  return (
    <blockquote className={cn(styles.blockquote, className)} style={style} {...rest}>
      {children}
    </blockquote>
  )
}

export { Blockquote }
export type { BlockquoteProps }
