import { useId } from 'react'
import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Checkbox.module.scss'

type CheckboxProps = {
  label?: string
  error?: boolean
} & StyleProps
  & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>

function Checkbox({
  label,
  error = false,
  className,
  style,
  id,
  ...rest
}: CheckboxProps) {
  const autoId = useId()
  const checkboxId = id ?? autoId

  return (
    <label className={cn(styles.checkbox, error && styles.error, className)} style={style} htmlFor={checkboxId}>
      <input type="checkbox" className={styles.input} id={checkboxId} {...rest} />
      <span className={styles.check}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      {label ? <span className={styles.label}>{label}</span> : null}
    </label>
  )
}

type CheckboxGroupProps = {
  label?: string
  direction?: 'row' | 'column'
  children?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLFieldSetElement>

function CheckboxGroup({
  label,
  direction = 'column',
  className,
  style,
  children,
  ...rest
}: CheckboxGroupProps) {
  return (
    <fieldset className={cn(styles.group, className)} style={style} {...rest}>
      {label ? <legend className={styles.legend}>{label}</legend> : null}
      <div className={cn(styles.items, styles[direction])}>
        {children}
      </div>
    </fieldset>
  )
}

export { Checkbox, CheckboxGroup }
export type { CheckboxProps, CheckboxGroupProps }
