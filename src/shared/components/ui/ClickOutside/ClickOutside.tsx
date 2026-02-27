import { useRef, useEffect } from 'react'

type ClickOutsideProps = {
  onClickOutside: () => void
  children: React.ReactNode
}

function ClickOutside({ onClickOutside, children }: ClickOutsideProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickOutside()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClickOutside])

  return <div ref={ref}>{children}</div>
}

export { ClickOutside }
export type { ClickOutsideProps }
