import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Global Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log error to external service in production
    if (import.meta.env.PROD) {
      // TODO: Send to error reporting service
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error} 
        onRetry={this.handleRetry}
        onGoHome={this.handleGoHome}
      />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
  onGoHome: () => void;
}

function ErrorFallback({ error, onRetry, onGoHome }: ErrorFallbackProps) {
  // Simple error fallback without context dependencies
  const isBackendError = error?.message?.includes('500') || 
                        error?.message?.includes('Internal Server Error') ||
                        error?.message?.includes('Failed to fetch');

  const isNetworkError = error?.message?.includes('Network') ||
                        error?.message?.includes('fetch') ||
                        error?.message?.includes('connection');

  const getErrorType = () => {
    if (isBackendError) return 'Backend Connection Error';
    if (isNetworkError) return 'Network Connection Error';
    return 'Unknown Error';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Something went wrong
          </CardTitle>
          <CardDescription className="text-gray-600">
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-sm font-medium text-gray-700 mb-1">
              {getErrorType()}
            </p>
            {error && (
              <p className="text-xs text-gray-500 break-words">
                {error.message}
              </p>
            )}
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button onClick={onRetry} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" onClick={onGoHome} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </div>

          {import.meta.env.DEV && error && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                Error Details
              </summary>
              <pre className="mt-2 text-xs text-gray-500 bg-gray-100 p-2 rounded overflow-auto max-h-32">
                {error.stack}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 