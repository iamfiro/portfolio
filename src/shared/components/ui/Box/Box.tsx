import type { LayoutProps, SpacingProps, StyleProps } from '@/shared/types/component-common'
import { cn, buildLayoutStyle, buildSpacingStyle } from '../_utils'
import styles from './Box.module.scss'

type BoxProps = {
  as?: 'div' | 'span' | 'article' | 'section' | 'aside' | 'main' | 'header' | 'footer' | 'nav'
  children?: React.ReactNode
} & LayoutProps
  & SpacingProps
  & StyleProps
  & React.HTMLAttributes<HTMLElement>

function Box({
  as: Tag = 'div',
  className,
  style,
  width, maxWidth, minWidth, height, maxHeight, minHeight,
  m, mt, mr, mb, ml, mx, my,
  p, pt, pr, pb, pl, px, py,
  children,
  ...rest
}: BoxProps) {
  return (
    <Tag
      className={cn(styles.box, className)}
      style={{
        ...buildLayoutStyle({ width, maxWidth, minWidth, height, maxHeight, minHeight }),
        ...buildSpacingStyle({ m, mt, mr, mb, ml, mx, my, p, pt, pr, pb, pl, px, py }),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export { Box }
export type { BoxProps }
