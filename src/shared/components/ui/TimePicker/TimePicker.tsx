import type { LayoutProps, StyleProps } from '@/shared/types/component-common'
import { cn, buildLayoutStyle } from '../_utils'
import styles from './TimePicker.module.scss'

type TimePickerProps = {
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  fullWidth?: boolean
} & StyleProps
  & Pick<LayoutProps, 'width' | 'maxWidth'>
  & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>

function TimePicker({
  size = 'md',
  error = false,
  fullWidth = false,
  className,
  style,
  width,
  maxWidth,
  ...rest
}: TimePickerProps) {
  return (
    <input
      type="time"
      className={cn(
        styles.timePicker,
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

export { TimePicker }
export type { TimePickerProps }
