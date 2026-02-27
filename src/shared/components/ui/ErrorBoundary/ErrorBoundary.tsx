import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

type ErrorBoundaryProps = {
  fallback?: ReactNode | ((error: Error) => ReactNode)
  onError?: (error: Error, info: ErrorInfo) => void
  children: ReactNode
}

type ErrorBoundaryState = {
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info)
  }

  render() {
    if (this.state.error) {
      const { fallback } = this.props
      if (typeof fallback === 'function') {
        return fallback(this.state.error)
      }
      return fallback ?? <div>Something went wrong.</div>
    }
    return this.props.children
  }
}

export { ErrorBoundary }
export type { ErrorBoundaryProps }
