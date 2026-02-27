import { useState, useCallback } from 'react'
import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './CopyButton.module.scss'

type CopyButtonProps = {
  text: string
  size?: 'sm' | 'md'
  children?: React.ReactNode
} & StyleProps
  & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>

function CopyButton({
  text,
  size = 'md',
  className,
  style,
  children,
  ...rest
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [text])

  return (
    <button
      className={cn(styles.copyButton, styles[size], copied && styles.copied, className)}
      style={style}
      onClick={handleCopy}
      type="button"
      {...rest}
    >
      {children ? children : (
        copied ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
        )
      )}
    </button>
  )
}

export { CopyButton }
export type { CopyButtonProps }
