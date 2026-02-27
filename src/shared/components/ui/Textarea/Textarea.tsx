import type { LayoutProps, StyleProps } from '@/shared/types/component-common'
import { cn, buildLayoutStyle } from '../_utils'
import styles from './Textarea.module.scss'

type TextareaProps = {
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  fullWidth?: boolean
} & StyleProps
  & Pick<LayoutProps, 'width' | 'maxWidth'>
  & React.TextareaHTMLAttributes<HTMLTextAreaElement>

function Textarea({
  size = 'md',
  error = false,
  resize = 'vertical',
  fullWidth = false,
  className,
  style,
  width,
  maxWidth,
  ...rest
}: TextareaProps) {
  return (
    <textarea
      className={cn(
        styles.textarea,
        styles[size],
        error && styles.error,
        fullWidth && styles.fullWidth,
        className,
      )}
      style={{ resize, ...buildLayoutStyle({ width, maxWidth }), ...style }}
      {...rest}
    />
  )
}

export { Textarea }
export type { TextareaProps }
