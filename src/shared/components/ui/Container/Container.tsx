import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Container.module.scss'

type ContainerProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLDivElement>

function Container({
  size = 'lg',
  className,
  style,
  children,
  ...rest
}: ContainerProps) {
  return (
    <div
      className={cn(styles.container, styles[size], className)}
      style={style}
      {...rest}
    >
      {children}
    </div>
  )
}

export { Container }
export type { ContainerProps }
