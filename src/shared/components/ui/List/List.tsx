import type { SpacingProps, StyleProps } from '@/shared/types/component-common'
import type { SpacingToken } from '@/shared/types/component-common'
import { cn, buildSpacingStyle } from '../_utils'
import styles from './List.module.scss'

type ListProps = {
  as?: 'ul' | 'ol'
  variant?: 'none' | 'disc' | 'decimal'
  gap?: SpacingToken
  children?: React.ReactNode
} & SpacingProps
  & StyleProps
  & React.HTMLAttributes<HTMLUListElement | HTMLOListElement>

function List({
  as: Tag = 'ul',
  variant = 'disc',
  gap = 8,
  className,
  style,
  m, mt, mr, mb, ml, mx, my,
  p, pt, pr, pb, pl, px, py,
  children,
  ...rest
}: ListProps) {
  return (
    <Tag
      className={cn(styles.list, styles[variant], className)}
      style={{
        gap,
        ...buildSpacingStyle({ m, mt, mr, mb, ml, mx, my, p, pt, pr, pb, pl, px, py }),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

type ListItemProps = {
  children?: React.ReactNode
} & StyleProps
  & React.LiHTMLAttributes<HTMLLIElement>

function ListItem({ className, style, children, ...rest }: ListItemProps) {
  return (
    <li className={cn(styles.item, className)} style={style} {...rest}>
      {children}
    </li>
  )
}

export { List, ListItem }
export type { ListProps, ListItemProps }
