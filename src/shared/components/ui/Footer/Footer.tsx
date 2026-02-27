import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Footer.module.scss'

type FooterProps = {
  children?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLElement>

function Footer({ className, style, children, ...rest }: FooterProps) {
  return (
    <footer className={cn(styles.footer, className)} style={style} {...rest}>
      <div className={styles.inner}>
        {children}
      </div>
    </footer>
  )
}

export { Footer }
export type { FooterProps }
