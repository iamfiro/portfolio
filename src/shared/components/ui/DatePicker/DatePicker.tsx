import type { LayoutProps, StyleProps } from '@/shared/types/component-common'
import { cn, buildLayoutStyle } from '../_utils'
import styles from './DatePicker.module.scss'

type DatePickerProps = {
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  fullWidth?: boolean
} & StyleProps
  & Pick<LayoutProps, 'width' | 'maxWidth'>
  & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>

function DatePicker({
  size = 'md',
  error = false,
  fullWidth = false,
  className,
  style,
  width,
  maxWidth,
  ...rest
}: DatePickerProps) {
  return (
    <input
      type="date"
      className={cn(
        styles.datePicker,
        styles[size],
        error && styles.error,
        fullWidth && styles.fullWidth,
        className,
      )}
      style={{ ...buildLayoutStyle({ width, maxWidth }), ...style }}
      {...rest}
    />
  )
}

export { DatePicker }
export type { DatePickerProps }
