import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Pagination.module.scss'

type PaginationProps = {
  current: number
  total: number
  onPageChange: (page: number) => void
  siblings?: number
} & StyleProps

function Pagination({
  current,
  total,
  onPageChange,
  siblings = 1,
  className,
  style,
}: PaginationProps) {
  function getPages(): (number | '...')[] {
    const pages: (number | '...')[] = []
    const left = Math.max(1, current - siblings)
    const right = Math.min(total, current + siblings)

    if (left > 1) { pages.push(1); if (left > 2) pages.push('...') }
    for (let i = left; i <= right; i++) pages.push(i)
    if (right < total) { if (right < total - 1) pages.push('...'); pages.push(total) }

    return pages
  }

  return (
    <nav className={cn(styles.pagination, className)} style={style} aria-label="Pagination">
      <button
        className={styles.btn}
        onClick={() => onPageChange(current - 1)}
        disabled={current <= 1}
        type="button"
        aria-label="Previous page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      {getPages().map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className={styles.dots}>...</span>
        ) : (
          <button
            key={page}
            className={cn(styles.btn, page === current && styles.active)}
            onClick={() => onPageChange(page)}
            type="button"
            aria-current={page === current ? 'page' : undefined}
          >
            {page}
          </button>
        ),
      )}
      <button
        className={styles.btn}
        onClick={() => onPageChange(current + 1)}
        disabled={current >= total}
        type="button"
        aria-label="Next page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
      </button>
    </nav>
  )
}

export { Pagination }
export type { PaginationProps }
