import { useState } from 'react'
import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Rating.module.scss'

type RatingProps = {
  value?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  readOnly?: boolean
  onChange?: (value: number) => void
} & StyleProps

function Rating({
  value = 0,
  max = 5,
  size = 'md',
  readOnly = false,
  onChange,
  className,
  style,
}: RatingProps) {
  const [hovered, setHovered] = useState(0)

  return (
    <div
      className={cn(styles.rating, styles[size], readOnly && styles.readOnly, className)}
      style={style}
      role="radiogroup"
      aria-label="Rating"
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1
        const filled = starValue <= (hovered || value)

        return (
          <button
            key={starValue}
            type="button"
            className={cn(styles.star, filled && styles.filled)}
            onClick={readOnly ? undefined : () => onChange?.(starValue)}
            onMouseEnter={readOnly ? undefined : () => setHovered(starValue)}
            onMouseLeave={readOnly ? undefined : () => setHovered(0)}
            disabled={readOnly}
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
          >
            <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        )
      })}
    </div>
  )
}

export { Rating }
export type { RatingProps }
