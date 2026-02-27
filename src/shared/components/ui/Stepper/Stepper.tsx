import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Stepper.module.scss'

type StepperItem = {
  label: string
  description?: string
}

type StepperProps = {
  steps: StepperItem[]
  current: number
  direction?: 'horizontal' | 'vertical'
} & StyleProps

function Stepper({
  steps,
  current,
  direction = 'horizontal',
  className,
  style,
}: StepperProps) {
  return (
    <div className={cn(styles.stepper, styles[direction], className)} style={style}>
      {steps.map((step, i) => {
        const status = i < current ? 'completed' : i === current ? 'active' : 'pending'

        return (
          <div key={i} className={cn(styles.step, styles[status])}>
            <div className={styles.indicator}>
              {status === 'completed' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <div className={styles.content}>
              <span className={styles.label}>{step.label}</span>
              {step.description ? <span className={styles.description}>{step.description}</span> : null}
            </div>
            {i < steps.length - 1 ? <div className={styles.connector} /> : null}
          </div>
        )
      })}
    </div>
  )
}

export { Stepper }
export type { StepperProps, StepperItem }
