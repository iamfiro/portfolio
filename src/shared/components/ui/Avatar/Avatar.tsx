import { useState } from 'react'
import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Avatar.module.scss'

type AvatarProps = {
  src?: string
  alt?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
} & StyleProps
  & React.HTMLAttributes<HTMLDivElement>

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Avatar({
  src,
  alt,
  name,
  size = 'md',
  className,
  style,
  ...rest
}: AvatarProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className={cn(styles.avatar, styles[size], className)} style={style} {...rest}>
      {src && !imgError ? (
        <img src={src} alt={alt ?? name ?? ''} className={styles.img} onError={() => setImgError(true)} />
      ) : name ? (
        <span className={styles.initials}>{getInitials(name)}</span>
      ) : (
        <svg className={styles.placeholder} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      )}
    </div>
  )
}

type AvatarGroupProps = {
  max?: number
  children: React.ReactNode
} & StyleProps

function AvatarGroup({
  max,
  className,
  style,
  children,
}: AvatarGroupProps) {
  const childArray = Array.isArray(children) ? children : [children]
  const visible = max ? childArray.slice(0, max) : childArray
  const remaining = max ? childArray.length - max : 0

  return (
    <div className={cn(styles.group, className)} style={style}>
      {visible}
      {remaining > 0 ? (
        <div className={cn(styles.avatar, styles.md, styles.overflow)}>
          <span className={styles.initials}>+{remaining}</span>
        </div>
      ) : null}
    </div>
  )
}

export { Avatar, AvatarGroup }
export type { AvatarProps, AvatarGroupProps }
