import { useRef } from 'react'
import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './FileUpload.module.scss'

type FileUploadProps = {
  accept?: string
  multiple?: boolean
  maxSize?: number
  onFiles?: (files: File[]) => void
  children?: React.ReactNode
} & StyleProps
  & Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop'>

function FileUpload({
  accept,
  multiple = false,
  onFiles,
  className,
  style,
  children,
  ...rest
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    onFiles?.(files)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    onFiles?.(files)
  }

  return (
    <div
      className={cn(styles.upload, className)}
      style={style}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
      }}
      {...rest}
    >
      <input
        ref={inputRef}
        type="file"
        className={styles.input}
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        tabIndex={-1}
      />
      {children ? children : (
        <div className={styles.placeholder}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>Click or drag files here</span>
        </div>
      )}
    </div>
  )
}

export { FileUpload }
export type { FileUploadProps }
