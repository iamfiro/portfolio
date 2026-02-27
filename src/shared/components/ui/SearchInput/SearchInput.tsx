import type { LayoutProps, StyleProps } from '@/shared/types/component-common'
import { cn, buildLayoutStyle } from '../_utils'
import styles from './SearchInput.module.scss'

type SearchInputProps = {
  size?: 'sm' | 'md' | 'lg'
  onClear?: () => void
  fullWidth?: boolean
} & StyleProps
  & Pick<LayoutProps, 'width' | 'maxWidth'>
  & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>

function SearchInput({
  size = 'md',
  onClear,
  fullWidth = false,
  className,
  style,
  width,
  maxWidth,
  value,
  ...rest
}: SearchInputProps) {
  return (
    <div
      className={cn(styles.wrapper, styles[size], fullWidth && styles.fullWidth, className)}
      style={{ ...buildLayoutStyle({ width, maxWidth }), ...style }}
    >
      <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input className={styles.input} type="search" value={value} {...rest} />
      {value && onClear ? (
        <button className={styles.clearBtn} onClick={onClear} type="button" aria-label="Clear search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      ) : null}
    </div>
  )
}

export { SearchInput }
export type { SearchInputProps }
