import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './PageError.module.scss'

type PageErrorProps = {
  code?: number | string
  title?: string
  description?: string
  action?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLDivElement>

function PageError({
  code = 404,
  title = 'Page not found',
  description = 'The page you are looking for does not exist.',
  action,
  className,
  style,
  ...rest
}: PageErrorProps) {
  return (
    <div className={cn(styles.pageError, className)} style={style} {...rest}>
      <span className={styles.code}>{code}</span>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  )
}

export { PageError }
export type { PageErrorProps }
