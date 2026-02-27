import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './JsonDisplay.module.scss'

type JsonDisplayProps = {
  data: unknown
  indent?: number
} & StyleProps
  & React.HTMLAttributes<HTMLPreElement>

function JsonDisplay({
  data,
  indent = 2,
  className,
  style,
  ...rest
}: JsonDisplayProps) {
  let formatted: string
  try {
    formatted = JSON.stringify(data, null, indent)
  } catch {
    formatted = String(data)
  }

  return (
    <pre className={cn(styles.json, className)} style={style} {...rest}>
      <code>{formatted}</code>
    </pre>
  )
}

export { JsonDisplay }
export type { JsonDisplayProps }
