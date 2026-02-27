import type { LayoutProps, SpacingProps, StyleProps } from '@/shared/types/component-common'
import type { SpacingToken } from '@/shared/types/component-common'
import { cn, buildLayoutStyle, buildSpacingStyle } from '../_utils'
import styles from './Grid.module.scss'

type GridProps = {
  columns?: number | string
  rows?: string
  gap?: SpacingToken
  columnGap?: SpacingToken
  rowGap?: SpacingToken
  align?: 'stretch' | 'center' | 'start' | 'end'
  justify?: 'stretch' | 'center' | 'start' | 'end'
  children?: React.ReactNode
} & LayoutProps
  & SpacingProps
  & StyleProps
  & React.HTMLAttributes<HTMLDivElement>

function Grid({
  columns,
  rows,
  gap,
  columnGap,
  rowGap,
  align,
  justify,
  className,
  style,
  width, maxWidth, minWidth, height, maxHeight, minHeight,
  m, mt, mr, mb, ml, mx, my,
  p, pt, pr, pb, pl, px, py,
  children,
  ...rest
}: GridProps) {
  const gridTemplateColumns = typeof columns === 'number'
    ? `repeat(${columns}, 1fr)`
    : columns

  return (
    <div
      className={cn(styles.grid, className)}
      style={{
        gridTemplateColumns,
        gridTemplateRows: rows,
        gap,
        columnGap,
        rowGap,
        alignItems: align,
        justifyItems: justify,
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

export { Grid }
export type { GridProps }
