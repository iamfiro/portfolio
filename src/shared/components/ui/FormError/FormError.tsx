import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './FormError.module.scss'

type FormErrorProps = {
  children?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLParagraphElement>

function FormError({ className, style, children, ...rest }: FormErrorProps) {
  if (!children) return null

  return (
    <p className={cn(styles.error, className)} style={style} role="alert" {...rest}>
      {children}
    </p>
  )
}

export { FormError }
export type { FormErrorProps }
