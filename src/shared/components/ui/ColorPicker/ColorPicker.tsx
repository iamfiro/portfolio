import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './ColorPicker.module.scss'

type ColorPickerProps = {
  label?: string
  size?: 'sm' | 'md' | 'lg'
} & StyleProps
  & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>

function ColorPicker({
  label,
  size = 'md',
  className,
  style,
  ...rest
}: ColorPickerProps) {
  return (
    <label className={cn(styles.colorPicker, styles[size], className)} style={style}>
      <input type="color" className={styles.input} {...rest} />
      {label ? <span className={styles.label}>{label}</span> : null}
    </label>
  )
}

export { ColorPicker }
export type { ColorPickerProps }
