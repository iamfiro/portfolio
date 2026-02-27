import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Label.module.scss'

type LabelProps = {
  required?: boolean
  children?: React.ReactNode
} & StyleProps
  & React.LabelHTMLAttributes<HTMLLabelElement>

function Label({ required = false, className, style, children, ...rest }: LabelProps) {
  return (
    <label className={cn(styles.label, className)} style={style} {...rest}>
      {children}
      {required ? <span className={styles.required} aria-hidden="true">*</span> : null}
    </label>
  )
}

export { Label }
export type { LabelProps }
