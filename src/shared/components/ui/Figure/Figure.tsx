import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Figure.module.scss'

type FigureProps = {
  caption?: string
  children?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLElement>

function Figure({ caption, className, style, children, ...rest }: FigureProps) {
  return (
    <figure className={cn(styles.figure, className)} style={style} {...rest}>
      {children}
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  )
}

export { Figure }
export type { FigureProps }
