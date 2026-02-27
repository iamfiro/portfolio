import type { SpacingProps, StyleProps } from '@/shared/types/component-common'
import { cn, buildSpacingStyle } from '../_utils'
import styles from './Heading.module.scss'

type HeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  align?: 'left' | 'center' | 'right'
  children?: React.ReactNode
} & SpacingProps
  & StyleProps
  & React.HTMLAttributes<HTMLHeadingElement>

function Heading({
  as: Tag = 'h2',
  size = 'xl',
  align,
  className,
  style,
  m, mt, mr, mb, ml, mx, my,
  p, pt, pr, pb, pl, px, py,
  children,
  ...rest
}: HeadingProps) {
  return (
    <Tag
      className={cn(styles.heading, styles[size], className)}
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

export { Heading }
export type { HeadingProps }
