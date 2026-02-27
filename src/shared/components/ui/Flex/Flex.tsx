import type { LayoutProps, SpacingProps, StyleProps } from '@/shared/types/component-common'
import type { SpacingToken } from '@/shared/types/component-common'
import { cn, buildLayoutStyle, buildSpacingStyle } from '../_utils'
import styles from './Flex.module.scss'

type FlexProps = {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  gap?: SpacingToken
  align?: 'stretch' | 'center' | 'flex-start' | 'flex-end' | 'baseline'
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  wrap?: boolean
  children?: React.ReactNode
} & LayoutProps
  & SpacingProps
  & StyleProps
  & React.HTMLAttributes<HTMLDivElement>

function Flex({
  direction = 'row',
  gap,
  align,
  justify,
  wrap = false,
  className,
  style,
  width, maxWidth, minWidth, height, maxHeight, minHeight,
  m, mt, mr, mb, ml, mx, my,
  p, pt, pr, pb, pl, px, py,
  children,
  ...rest
}: FlexProps) {
  return (
    <div
      className={cn(styles.flex, className)}
      style={{
        flexDirection: direction,
        gap,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : undefined,
        ...buildLayoutStyle({ width, maxWidth, minWidth, height, maxHeight, minHeight }),
        ...buildSpacingStyle({ m, mt, mr, mb, ml, mx, my, p, pt, pr, pb, pl, px, py }),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

export { Flex }
export type { FlexProps }
