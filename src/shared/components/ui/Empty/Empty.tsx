import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Empty.module.scss'

type EmptyProps = {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLDivElement>

function Empty({
  title = 'No data',
  description,
  icon,
  action,
  className,
  style,
  ...rest
}: EmptyProps) {
  return (
    <div className={cn(styles.empty, className)} style={style} {...rest}>
      {icon ? <div className={styles.icon}>{icon}</div> : null}
      <p className={styles.title}>{title}</p>
      {description ? <p className={styles.description}>{description}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  )
}

export { Empty }
export type { EmptyProps }
