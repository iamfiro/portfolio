import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Timeline.module.scss'

type TimelineItem = {
  title: string
  description?: string
  time?: string
  icon?: React.ReactNode
}

type TimelineProps = {
  items: TimelineItem[]
} & StyleProps

function Timeline({ items, className, style }: TimelineProps) {
  return (
    <div className={cn(styles.timeline, className)} style={style}>
      {items.map((item, i) => (
        <div key={i} className={styles.item}>
          <div className={styles.line}>
            <div className={styles.dot}>
              {item.icon ? item.icon : null}
            </div>
            {i < items.length - 1 ? <div className={styles.connector} /> : null}
          </div>
          <div className={styles.content}>
            <span className={styles.title}>{item.title}</span>
            {item.description ? <p className={styles.description}>{item.description}</p> : null}
            {item.time ? <span className={styles.time}>{item.time}</span> : null}
          </div>
        </div>
      ))}
    </div>
  )
}

export { Timeline }
export type { TimelineProps, TimelineItem }
