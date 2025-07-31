import React from 'react';

// Comprehensive error monitoring and reporting system
export interface ErrorEvent {
  id: string;
  timestamp: number;
  type: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  component?: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface ErrorReport {
  errors: ErrorEvent[];
  summary: {
    totalErrors: number;
    criticalErrors: number;
    warnings: number;
    timeRange: { start: number; end: number };
  };
}

export class ErrorMonitor {
  private errors: ErrorEvent[] = [];
  private sessionId: string;
  private isInitialized = false;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  initialize() {
    if (this.isInitialized) return;
    
    this.setupGlobalErrorHandlers();
    this.setupUnhandledRejectionHandler();
    this.setupResourceErrorHandler();
    this.setupConsoleErrorHandler();
    
    this.isInitialized = true;
    console.log('Error monitoring initialized');
  }

  private setupGlobalErrorHandlers() {
    window.addEventListener('error', (event) => {
      this.captureError({
        type: 'error',
        message: event.message,
        stack: event.error?.stack,
        component: this.getComponentFromStack(event.error?.stack),
        userAgent: navigator.userAgent,
        url: window.location.href,
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });
  }

  private setupUnhandledRejectionHandler() {
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        type: 'error',
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        component: this.getComponentFromStack(event.reason?.stack),
        userAgent: navigator.userAgent,
        url: window.location.href,
        metadata: {
          promise: event.promise
        }
      });
    });
  }

  private setupResourceErrorHandler() {
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        const target = event.target as HTMLElement;
        this.captureError({
          type: 'error',
          message: `Resource load failed: ${target.tagName}`,
          userAgent: navigator.userAgent,
          url: window.location.href,
          metadata: {
            resourceType: target.tagName,
            resourceUrl: (target as any).src || (target as any).href
          }
        });
      }
    }, true);
  }

  private setupConsoleErrorHandler() {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.error = (...args) => {
      this.captureError({
        type: 'error',
        message: args.join(' '),
        userAgent: navigator.userAgent,
        url: window.location.href,
        metadata: { source: 'console.error' }
      });
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args) => {
      this.captureError({
        type: 'warning',
        message: args.join(' '),
        userAgent: navigator.userAgent,
        url: window.location.href,
        metadata: { source: 'console.warn' }
      });
      originalConsoleWarn.apply(console, args);
    };
  }

  captureError(errorData: Omit<ErrorEvent, 'id' | 'timestamp' | 'sessionId'>) {
    const error: ErrorEvent = {
      id: this.generateErrorId(),
      timestamp: Date.now(),
      sessionId: this.sessionId,
      ...errorData
    };

    this.errors.push(error);
    this.logError(error);
    this.sendErrorToAnalytics(error);
  }

  private getComponentFromStack(stack?: string): string | undefined {
    if (!stack) return undefined;
    
    const lines = stack.split('\n');
    for (const line of lines) {
      if (line.includes('src/components/') || line.includes('src/pages/')) {
        const match = line.match(/src\/(components|pages)\/([^/]+)/);
        return match ? match[2] : undefined;
      }
    }
    return undefined;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private logError(error: ErrorEvent) {
    const logLevel = error.type === 'error' ? 'ERROR' : 'WARN';
    console.group(`[${logLevel}] ${error.message}`);
    console.log('Component:', error.component || 'Unknown');
    console.log('URL:', error.url);
    console.log('Timestamp:', new Date(error.timestamp).toISOString());
    if (error.stack) {
      console.log('Stack:', error.stack);
    }
    if (error.metadata) {
      console.log('Metadata:', error.metadata);
    }
    console.groupEnd();
  }

  private sendErrorToAnalytics(error: ErrorEvent) {
    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: error.type === 'error',
        custom_map: {
          component: error.component,
          session_id: error.sessionId
        }
      });
    }

    // Send to custom analytics endpoint
    this.sendToCustomEndpoint(error);
  }

  private async sendToCustomEndpoint(error: ErrorEvent) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error)
      });
    } catch (e) {
      console.warn('Failed to send error to custom endpoint:', e);
    }
  }

  getErrorReport(): ErrorReport {
    const now = Date.now();
    const timeRange = { start: now - 24 * 60 * 60 * 1000, end: now }; // Last 24 hours
    
    const errors = this.errors.filter(error => 
      error.timestamp >= timeRange.start && error.timestamp <= timeRange.end
    );

    return {
      errors,
      summary: {
        totalErrors: errors.length,
        criticalErrors: errors.filter(e => e.type === 'error').length,
        warnings: errors.filter(e => e.type === 'warning').length,
        timeRange
      }
    };
  }

  clearErrors() {
    this.errors = [];
  }

  // React Error Boundary integration
  static captureReactError(error: Error, errorInfo: React.ErrorInfo) {
    const monitor = ErrorMonitor.getInstance();
    monitor.captureError({
      type: 'error',
      message: error.message,
      stack: error.stack,
      component: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      metadata: {
        source: 'react-error-boundary',
        componentStack: errorInfo.componentStack
      }
    });
  }

  private static instance: ErrorMonitor;
  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor();
    }
    return ErrorMonitor.instance;
  }
}

// React Error Boundary component
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error?: Error }> },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    ErrorMonitor.captureReactError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return React.createElement(FallbackComponent, { error: this.state.error });
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error }> = ({ error }) => 
  React.createElement('div', { className: 'min-h-screen flex items-center justify-center bg-gray-50' },
    React.createElement('div', { className: 'text-center' },
      React.createElement('div', { className: 'mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100' }, '⚠️'),
      React.createElement('h2', { className: 'text-lg font-semibold text-gray-900 mb-2' }, 'Something went wrong'),
      React.createElement('p', { className: 'text-gray-600 mb-4' }, 'We\'re sorry, but something unexpected happened.'),
      error && React.createElement('details', { className: 'text-sm text-gray-500' },
        React.createElement('summary', null, 'Error Details'),
        React.createElement('pre', { className: 'mt-2 text-left bg-gray-100 p-2 rounded' }, error.message)
      ),
      React.createElement('button', {
        onClick: () => window.location.reload(),
        className: 'mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
      }, 'Reload Page')
    )
  ); 