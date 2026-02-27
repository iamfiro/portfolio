import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Stat.module.scss'

type StatProps = {
  label: string
  value: string | number
  helpText?: string
  trend?: 'up' | 'down'
  trendValue?: string
} & StyleProps
  & React.HTMLAttributes<HTMLDivElement>

function Stat({
  label,
  value,
  helpText,
  trend,
  trendValue,
  className,
  style,
  ...rest
}: StatProps) {
  return (
    <div className={cn(styles.stat, className)} style={style} {...rest}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {helpText || trendValue ? (
        <span className={styles.help}>
          {trend ? (
            <span className={cn(styles.trend, styles[trend])}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
          ) : null}
          {helpText}
        </span>
      ) : null}
    </div>
  )
}

export { Stat }
export type { StatProps }
