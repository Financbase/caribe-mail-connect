import React from 'react'

type ErrorBoundaryProps = {
  name?: string
  level?: 'page' | 'component'
  children: React.ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Optional: forward to Sentry if configured
    const win = window as unknown as { Sentry?: { captureException: (e: unknown, ctx?: unknown) => void } }
    if (win.Sentry?.captureException) {
      win.Sentry.captureException(error, { extra: { info, boundary: this.props.name } })
    } else {
      // eslint-disable-next-line no-console
      console.error('[ErrorBoundary]', this.props.name || 'Unnamed', error, info)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="p-4 m-4 border rounded bg-destructive/10 text-destructive">
          <p className="font-semibold">Ha ocurrido un error</p>
          <p className="text-sm opacity-80">Intenta recargar la página o vuelve más tarde.</p>
          <button
            className="mt-3 inline-flex items-center px-3 py-2 bg-primary text-primary-foreground rounded"
            onClick={() => {
              this.setState({ hasError: false, error: undefined })
              // Attempt soft recovery
            }}
          >
            Reintentar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export function PageErrorBoundary({ name, children }: { name?: string; children: React.ReactNode }) {
  return <ErrorBoundary name={name} level="page">{children}</ErrorBoundary>
}

export default ErrorBoundary


