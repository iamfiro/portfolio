import { useRef, useEffect } from 'react'

type InfiniteScrollProps = {
  onLoadMore: () => void
  hasMore: boolean
  loading?: boolean
  threshold?: number
  loader?: React.ReactNode
  children: React.ReactNode
}

function InfiniteScroll({
  onLoadMore,
  hasMore,
  loading = false,
  threshold = 200,
  loader,
  children,
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore()
      },
      { rootMargin: `${threshold}px` },
    )

    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, onLoadMore, threshold])

  return (
    <>
      {children}
      {hasMore ? (
        <div ref={sentinelRef}>
          {loading ? (loader ?? <div style={{ textAlign: 'center', padding: 16 }}>Loading...</div>) : null}
        </div>
      ) : null}
    </>
  )
}

export { InfiniteScroll }
export type { InfiniteScrollProps }
