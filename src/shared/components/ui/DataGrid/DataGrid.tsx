import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './DataGrid.module.scss'

type Column<T> = {
  key: string
  header: string
  width?: string | number
  render?: (row: T) => React.ReactNode
}

type DataGridProps<T> = {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  striped?: boolean
  hoverable?: boolean
  emptyMessage?: string
} & StyleProps

function DataGrid<T>({
  columns,
  data,
  keyExtractor,
  striped = false,
  hoverable = true,
  emptyMessage = 'No data',
  className,
  style,
}: DataGridProps<T>) {
  return (
    <div className={cn(styles.wrapper, className)} style={style}>
      <table className={cn(styles.table, striped && styles.striped, hoverable && styles.hoverable)}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={styles.th} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className={styles.empty} colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={keyExtractor(row)}>
                {columns.map((col) => (
                  <td key={col.key} className={styles.td}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export { DataGrid }
export type { DataGridProps, Column }
