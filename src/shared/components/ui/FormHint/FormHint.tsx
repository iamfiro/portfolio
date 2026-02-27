import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './FormHint.module.scss'

type FormHintProps = {
  children?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLParagraphElement>

function FormHint({ className, style, children, ...rest }: FormHintProps) {
  if (!children) return null

  return (
    <p className={cn(styles.hint, className)} style={style} {...rest}>
      {children}
    </p>
  )
}

export { FormHint }
export type { FormHintProps }
