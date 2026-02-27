import { useRef, useState, useEffect } from 'react'

type LazyLoadProps = {
  placeholder?: React.ReactNode
  rootMargin?: string
  children: React.ReactNode
}

function LazyLoad({
  placeholder,
  rootMargin = '200px',
  children,
}: LazyLoadProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [rootMargin])

  return <div ref={ref}>{visible ? children : (placeholder ?? null)}</div>
}

export { LazyLoad }
export type { LazyLoadProps }
