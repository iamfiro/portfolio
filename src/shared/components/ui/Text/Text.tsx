import type { SpacingProps, StyleProps } from '@/shared/types/component-common'
import { cn, buildSpacingStyle } from '../_utils'
import styles from './Text.module.scss'

type TextProps = {
  as?: 'p' | 'span' | 'div' | 'label' | 'strong' | 'em' | 'small'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'default' | 'subtle' | 'inverse' | 'brand'
  align?: 'left' | 'center' | 'right'
  truncate?: boolean
  children?: React.ReactNode
} & SpacingProps
  & StyleProps
  & React.HTMLAttributes<HTMLElement>

function Text({
  as: Tag = 'p',
  size = 'md',
  weight = 'normal',
  color = 'default',
  align,
  truncate = false,
  className,
  style,
  m, mt, mr, mb, ml, mx, my,
  p, pt, pr, pb, pl, px, py,
  children,
  ...rest
}: TextProps) {
  return (
    <Tag
      className={cn(
        styles.text,
        styles[`size-${size}`],
        styles[`weight-${weight}`],
        styles[`color-${color}`],
        truncate && styles.truncate,
        className,
      )}
      style={{
        textAlign: align,
        ...buildSpacingStyle({ m, mt, mr, mb, ml, mx, my, p, pt, pr, pb, pl, px, py }),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export { Text }
export type { TextProps }
