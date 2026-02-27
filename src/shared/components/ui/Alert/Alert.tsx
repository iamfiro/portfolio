import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Alert.module.scss'

type AlertProps = {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  icon?: React.ReactNode
  onClose?: () => void
  children?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLDivElement>

function Alert({
  variant = 'info',
  title,
  icon,
  onClose,
  className,
  style,
  children,
  ...rest
}: AlertProps) {
  return (
    <div className={cn(styles.alert, styles[variant], className)} style={style} role="alert" {...rest}>
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <div className={styles.content}>
        {title ? <strong className={styles.title}>{title}</strong> : null}
        {children ? <div className={styles.message}>{children}</div> : null}
      </div>
      {onClose ? (
        <button className={styles.close} onClick={onClose} type="button" aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6L6 18" /><path d="M6 6l12 12" />
          </svg>
        </button>
      ) : null}
    </div>
  )
}

export { Alert }
export type { AlertProps }
