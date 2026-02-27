import styles from './VisuallyHidden.module.scss'

type VisuallyHiddenProps = {
  as?: 'span' | 'div'
  children?: React.ReactNode
}

function VisuallyHidden({ as: Tag = 'span', children }: VisuallyHiddenProps) {
  return <Tag className={styles.hidden}>{children}</Tag>
}

export { VisuallyHidden }
export type { VisuallyHiddenProps }
