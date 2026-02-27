import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Result.module.scss'

type ResultProps = {
  status?: 'success' | 'error' | 'info' | 'warning'
  title: string
  description?: string
  icon?: React.ReactNode
  extra?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLDivElement>

function Result({
  status = 'info',
  title,
  description,
  icon,
  extra,
  className,
  style,
  ...rest
}: ResultProps) {
  return (
    <div className={cn(styles.result, styles[status], className)} style={style} {...rest}>
      {icon ? <div className={styles.icon}>{icon}</div> : null}
      <h3 className={styles.title}>{title}</h3>
      {description ? <p className={styles.description}>{description}</p> : null}
      {extra ? <div className={styles.extra}>{extra}</div> : null}
    </div>
  )
}

export { Result }
export type { ResultProps }
