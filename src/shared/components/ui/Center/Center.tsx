import type { LayoutProps, StyleProps } from '@/shared/types/component-common'
import { cn, buildLayoutStyle } from '../_utils'
import styles from './Center.module.scss'

type CenterProps = {
  inline?: boolean
  children?: React.ReactNode
} & LayoutProps
  & StyleProps
  & React.HTMLAttributes<HTMLDivElement>

function Center({
  inline = false,
  className,
  style,
  width, maxWidth, minWidth, height, maxHeight, minHeight,
  children,
  ...rest
}: CenterProps) {
  return (
    <div
      className={cn(styles.center, inline && styles.inline, className)}
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

export { Center }
export type { CenterProps }
