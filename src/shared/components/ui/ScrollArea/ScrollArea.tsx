import type { LayoutProps, StyleProps } from '@/shared/types/component-common'
import { cn, buildLayoutStyle } from '../_utils'
import styles from './ScrollArea.module.scss'

type ScrollAreaProps = {
  direction?: 'vertical' | 'horizontal' | 'both'
  children?: React.ReactNode
} & LayoutProps
  & StyleProps
  & React.HTMLAttributes<HTMLDivElement>

function ScrollArea({
  direction = 'vertical',
  className,
  style,
  width, maxWidth, minWidth, height, maxHeight, minHeight,
  children,
  ...rest
}: ScrollAreaProps) {
  return (
    <div
      className={cn(styles.scrollArea, styles[direction], className)}
      style={{
        ...buildLayoutStyle({ width, maxWidth, minWidth, height, maxHeight, minHeight }),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

export { ScrollArea }
export type { ScrollAreaProps }
