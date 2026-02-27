import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Code.module.scss'

type CodeProps = {
  block?: boolean
  children?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLElement>

function Code({
  block = false,
  className,
  style,
  children,
  ...rest
}: CodeProps) {
  if (block) {
    return (
      <pre className={cn(styles.block, className)} style={style} {...rest}>
        <code>{children}</code>
      </pre>
    )
  }

  return (
    <code className={cn(styles.code, className)} style={style} {...rest}>
      {children}
    </code>
  )
}

export { Code }
export type { CodeProps }
