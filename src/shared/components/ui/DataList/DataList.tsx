import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './DataList.module.scss'

type DataListProps = {
  children?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLDListElement>

function DataList({ className, style, children, ...rest }: DataListProps) {
  return (
    <dl className={cn(styles.dataList, className)} style={style} {...rest}>
      {children}
    </dl>
  )
}

type DataListItemProps = {
  label: string
  children?: React.ReactNode
} & StyleProps

function DataListItem({ label, className, style, children }: DataListItemProps) {
  return (
    <div className={cn(styles.item, className)} style={style}>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.value}>{children}</dd>
    </div>
  )
}

export { DataList, DataListItem }
export type { DataListProps, DataListItemProps }
