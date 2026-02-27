import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Breadcrumb.module.scss'

type BreadcrumbItem = {
  label: string
  href?: string
  onClick?: () => void
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLElement>

function Breadcrumb({
  items,
  separator = '/',
  className,
  style,
  ...rest
}: BreadcrumbProps) {
  return (
    <nav className={cn(styles.breadcrumb, className)} style={style} aria-label="Breadcrumb" {...rest}>
      <ol className={styles.list}>
        {items.map((item, i) => (
          <li key={i} className={styles.item}>
            {i > 0 ? <span className={styles.separator} aria-hidden="true">{separator}</span> : null}
            {item.href ? (
              <a href={item.href} className={styles.link}>{item.label}</a>
            ) : item.onClick ? (
              <button className={styles.link} onClick={item.onClick} type="button">{item.label}</button>
            ) : (
              <span className={styles.current} aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export { Breadcrumb }
export type { BreadcrumbProps, BreadcrumbItem }
