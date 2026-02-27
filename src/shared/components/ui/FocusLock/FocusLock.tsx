import { useRef, useEffect } from 'react'

type FocusLockProps = {
  active?: boolean
  children: React.ReactNode
}

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function FocusLock({ active = true, children }: FocusLockProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active || !ref.current) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !ref.current) return

      const focusable = ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [active])

  return <div ref={ref}>{children}</div>
}

export { FocusLock }
export type { FocusLockProps }
