import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './FormGroup.module.scss'

type FormGroupProps = {
  children?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLDivElement>

function FormGroup({ className, style, children, ...rest }: FormGroupProps) {
  return (
    <div className={cn(styles.group, className)} style={style} {...rest}>
      {children}
    </div>
  )
}

export { FormGroup }
export type { FormGroupProps }
