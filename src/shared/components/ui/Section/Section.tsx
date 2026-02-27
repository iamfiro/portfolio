import type { SpacingProps, StyleProps } from '@/shared/types/component-common'
import { cn, buildSpacingStyle } from '../_utils'
import styles from './Section.module.scss'

type SectionProps = {
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
} & SpacingProps
  & StyleProps
  & React.HTMLAttributes<HTMLElement>

function Section({
  size = 'md',
  className,
  style,
  m, mt, mr, mb, ml, mx, my,
  p, pt, pr, pb, pl, px, py,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      className={cn(styles.section, styles[size], className)}
      style={{
        ...buildSpacingStyle({ m, mt, mr, mb, ml, mx, my, p, pt, pr, pb, pl, px, py }),
        ...style,
      }}
      {...rest}
    >
      {children}
    </section>
  )
}

export { Section }
export type { SectionProps }
