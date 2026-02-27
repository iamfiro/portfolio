import { useId } from 'react'
import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Switch.module.scss'

type SwitchProps = {
  label?: string
  size?: 'sm' | 'md' | 'lg'
} & StyleProps
  & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>

function Switch({
  label,
  size = 'md',
  className,
  style,
  id,
  ...rest
}: SwitchProps) {
  const autoId = useId()
  const switchId = id ?? autoId

  return (
    <label className={cn(styles.switch, styles[size], className)} style={style} htmlFor={switchId}>
      <input type="checkbox" className={styles.input} id={switchId} role="switch" {...rest} />
      <span className={styles.track}>
        <span className={styles.thumb} />
      </span>
      {label ? <span className={styles.label}>{label}</span> : null}
    </label>
  )
}

export { Switch }
export type { SwitchProps }
