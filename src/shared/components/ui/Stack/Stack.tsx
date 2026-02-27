import type { LayoutProps, SpacingProps, StyleProps } from '@/shared/types/component-common'
import type { SpacingToken } from '@/shared/types/component-common'
import { cn, buildLayoutStyle, buildSpacingStyle } from '../_utils'
import styles from './Stack.module.scss'

type StackProps = {
  gap?: SpacingToken
  align?: 'stretch' | 'center' | 'flex-start' | 'flex-end'
  children?: React.ReactNode
} & LayoutProps
  & SpacingProps
  & StyleProps
  & React.HTMLAttributes<HTMLDivElement>

function Stack({
  gap = 16,
  align,
  className,
  style,
  width, maxWidth, minWidth, height, maxHeight, minHeight,
  m, mt, mr, mb, ml, mx, my,
  p, pt, pr, pb, pl, px, py,
  children,
  ...rest
}: StackProps) {
  return (
    <div
      className={cn(styles.stack, className)}
      style={{
        gap,
        alignItems: align,
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

export { Stack }
export type { StackProps }
