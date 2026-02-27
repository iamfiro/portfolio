import type { LayoutProps, StyleProps } from '@/shared/types/component-common'
import type { SpacingToken } from '@/shared/types/component-common'
import { cn, buildLayoutStyle } from '../_utils'
import styles from './Wrap.module.scss'

type WrapProps = {
  gap?: SpacingToken
  align?: 'flex-start' | 'center' | 'flex-end'
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between'
  children?: React.ReactNode
} & LayoutProps
  & StyleProps
  & React.HTMLAttributes<HTMLDivElement>

function Wrap({
  gap = 8,
  align,
  justify,
  className,
  style,
  width, maxWidth, minWidth, height, maxHeight, minHeight,
  children,
  ...rest
}: WrapProps) {
  return (
    <div
      className={cn(styles.wrap, className)}
      style={{
        gap,
        alignItems: align,
        justifyContent: justify,
        ...buildLayoutStyle({ width, maxWidth, minWidth, height, maxHeight, minHeight }),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

export { Wrap }
export type { WrapProps }
