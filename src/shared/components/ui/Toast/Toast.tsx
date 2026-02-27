import { createContext, useCallback, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../_utils'
import styles from './Toast.module.scss'

type ToastVariant = 'info' | 'success' | 'warning' | 'error'

type ToastItem = {
  id: string
  message: string
  variant: ToastVariant
  duration: number
}

type ToastContextValue = {
  toast: (message: string, options?: { variant?: ToastVariant; duration?: number }) => void
}

const EMPTY_CONTEXT: ToastContextValue = {
  toast: () => {},
}

const ToastContext = createContext<ToastContextValue>(EMPTY_CONTEXT)

function useToast() {
  return useContext(ToastContext)
}

type ToastProviderProps = {
  children: React.ReactNode
}

function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, options?: { variant?: ToastVariant; duration?: number }) => {
    const id = Math.random().toString(36).slice(2)
    const variant = options?.variant ?? 'info'
    const duration = options?.duration ?? 3000

    setToasts((prev) => [...prev, { id, message, variant, duration }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div className={styles.container}>
          {toasts.map((t) => (
            <div key={t.id} className={cn(styles.toast, styles[t.variant])}>
              <span className={styles.message}>{t.message}</span>
              <button className={styles.close} onClick={() => remove(t.id)} type="button" aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

export { ToastProvider, useToast }
export type { ToastVariant, ToastItem }
