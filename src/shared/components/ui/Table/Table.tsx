import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Table.module.scss'

type TableProps = {
  striped?: boolean
  hoverable?: boolean
  compact?: boolean
  children?: React.ReactNode
} & StyleProps
  & React.TableHTMLAttributes<HTMLTableElement>

function Table({
  striped = false,
  hoverable = false,
  compact = false,
  className,
  style,
  children,
  ...rest
}: TableProps) {
  return (
    <div className={styles.wrapper}>
      <table
        className={cn(
          styles.table,
          striped && styles.striped,
          hoverable && styles.hoverable,
          compact && styles.compact,
          className,
        )}
        style={style}
        {...rest}
      >
        {children}
      </table>
    </div>
  )
}

type TableRowProps = {
  children?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLTableRowElement>

function TableRow({ className, style, children, ...rest }: TableRowProps) {
  return (
    <tr className={cn(styles.row, className)} style={style} {...rest}>
      {children}
    </tr>
  )
}

type TableCellProps = {
  as?: 'td' | 'th'
  children?: React.ReactNode
} & StyleProps
  & React.TdHTMLAttributes<HTMLTableCellElement>

function TableCell({ as: Tag = 'td', className, style, children, ...rest }: TableCellProps) {
  return (
    <Tag className={cn(styles.cell, Tag === 'th' && styles.header, className)} style={style} {...rest}>
      {children}
    </Tag>
  )
}

export { Table, TableRow, TableCell }
export type { TableProps, TableRowProps, TableCellProps }
