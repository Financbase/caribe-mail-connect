import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

export default class RouteErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    retryCount: 0,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryCount: 0 };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Route Error Boundary caught an error:', error, errorInfo);
    
    // Log to error reporting service if available
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }
  }

  private handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      retryCount: prevState.retryCount + 1
    }));
    
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  private handleGoHome = () => {
    window.location.hash = '#/';
    this.setState({
      hasError: false,
      error: null,
      retryCount: 0
    });
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Component Loading Error
            </h2>
            
            <p className="text-muted-foreground mb-6">
              {this.state.retryCount >= 2 
                ? "We're having trouble loading this component. Please try refreshing the page or contact support."
                : "Something went wrong while loading this component. This might be a temporary issue."
              }
            </p>

            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Technical Details
                </summary>
                <div className="mt-2 p-3 bg-muted rounded text-xs font-mono text-muted-foreground overflow-auto">
                  {this.state.error.message}
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                disabled={this.state.retryCount >= 3}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="h-4 w-4" />
                {this.state.retryCount >= 3 ? 'Max Retries' : 'Try Again'}
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                <Home className="h-4 w-4" />
                Go Home
              </button>
            </div>

            {this.state.retryCount >= 3 && (
              <p className="mt-4 text-xs text-muted-foreground">
                If the problem persists, please refresh the page or contact support.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
