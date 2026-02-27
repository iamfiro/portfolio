import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Progress.module.scss'

type ProgressProps = {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  color?: string
} & StyleProps

function Progress({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  color,
  className,
  style,
}: ProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn(styles.progress, styles[size], className)} style={style}>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${percent}%`, backgroundColor: color }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel ? <span className={styles.label}>{Math.round(percent)}%</span> : null}
    </div>
  )
}

type ProgressCircleProps = {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  showLabel?: boolean
  color?: string
} & StyleProps

function ProgressCircle({
  value,
  max = 100,
  size = 48,
  strokeWidth = 4,
  showLabel = false,
  color,
  className,
  style,
}: ProgressCircleProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className={cn(styles.circle, className)} style={{ width: size, height: size, ...style }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={styles.circleTrack}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color ?? undefined}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={styles.circleFill}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {showLabel ? (
        <span className={styles.circleLabel}>{Math.round(percent)}%</span>
      ) : null}
    </div>
  )
}

export { Progress, ProgressCircle }
export type { ProgressProps, ProgressCircleProps }
