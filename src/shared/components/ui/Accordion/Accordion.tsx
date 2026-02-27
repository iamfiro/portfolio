import { useState } from 'react'
import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Accordion.module.scss'

type AccordionItemProps = {
  title: string
  defaultOpen?: boolean
  children?: React.ReactNode
} & StyleProps

function AccordionItem({
  title,
  defaultOpen = false,
  className,
  style,
  children,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={cn(styles.item, open && styles.open, className)} style={style}>
      <button className={styles.trigger} onClick={() => setOpen((p) => !p)} type="button" aria-expanded={open}>
        <span className={styles.title}>{title}</span>
        <svg className={styles.chevron} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open ? <div className={styles.content}>{children}</div> : null}
    </div>
  )
}

type AccordionProps = {
  children?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLDivElement>

function Accordion({ className, style, children, ...rest }: AccordionProps) {
  return (
    <div className={cn(styles.accordion, className)} style={style} {...rest}>
      {children}
    </div>
  )
}

export { Accordion, AccordionItem }
export type { AccordionProps, AccordionItemProps }
