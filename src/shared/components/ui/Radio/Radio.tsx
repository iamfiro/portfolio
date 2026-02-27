import { useId } from 'react'
import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Radio.module.scss'

type RadioProps = {
  label?: string
} & StyleProps
  & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>

function Radio({
  label,
  className,
  style,
  id,
  ...rest
}: RadioProps) {
  const autoId = useId()
  const radioId = id ?? autoId

  return (
    <label className={cn(styles.radio, className)} style={style} htmlFor={radioId}>
      <input type="radio" className={styles.input} id={radioId} {...rest} />
      <span className={styles.circle} />
      {label ? <span className={styles.label}>{label}</span> : null}
    </label>
  )
}

type RadioGroupProps = {
  label?: string
  direction?: 'row' | 'column'
  children?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLFieldSetElement>

function RadioGroup({
  label,
  direction = 'column',
  className,
  style,
  children,
  ...rest
}: RadioGroupProps) {
  return (
    <fieldset className={cn(styles.group, className)} style={style} {...rest}>
      {label ? <legend className={styles.legend}>{label}</legend> : null}
      <div className={cn(styles.items, styles[direction])}>
        {children}
      </div>
    </fieldset>
  )
}

export { Radio, RadioGroup }
export type { RadioProps, RadioGroupProps }
