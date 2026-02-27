import type { LayoutProps, StyleProps } from '@/shared/types/component-common'
import { cn, buildLayoutStyle } from '../_utils'
import styles from './Slider.module.scss'

type SliderProps = {
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  fullWidth?: boolean
} & StyleProps
  & Pick<LayoutProps, 'width'>
  & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>

function Slider({
  size = 'md',
  showValue = false,
  fullWidth = false,
  className,
  style,
  width,
  value,
  ...rest
}: SliderProps) {
  return (
    <div
      className={cn(styles.slider, styles[size], fullWidth && styles.fullWidth, className)}
      style={{ ...buildLayoutStyle({ width }), ...style }}
    >
      <input type="range" className={styles.input} value={value} {...rest} />
      {showValue ? <span className={styles.value}>{value}</span> : null}
    </div>
  )
}

export { Slider }
export type { SliderProps }
