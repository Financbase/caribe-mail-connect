import { AlertTriangle, XCircle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export type ErrorSeverity = 'error' | 'warning' | 'success' | 'info';

export interface ErrorInfo {
  id?: string;
  title: string;
  message: string;
  severity: ErrorSeverity;
  action?: {
    label: string;
    handler: () => void;
  };
  dismissible?: boolean;
  autoHide?: boolean;
  duration?: number;
}

interface ErrorDisplayProps {
  error: ErrorInfo;
  onDismiss?: (id?: string) => void;
  className?: string;
}

const severityConfig = {
  error: {
    icon: XCircle,
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/20',
    textColor: 'text-destructive',
    iconColor: 'text-destructive'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-600'
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    iconColor: 'text-green-600'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-600'
  }
};

export function ErrorDisplay({ error, onDismiss, className }: ErrorDisplayProps) {
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  const config = severityConfig[error.severity];
  const Icon = config.icon;

  const dismissLabel = isSpanish ? 'Cerrar' : 'Dismiss';

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border",
        config.bgColor,
        config.borderColor,
        className
      )}
      role="alert"
      aria-live="polite"
      aria-labelledby={error.id ? `error-title-${error.id}` : undefined}
      aria-describedby={error.id ? `error-message-${error.id}` : undefined}
    >
      <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", config.iconColor)} />
      
      <div className="flex-1 space-y-1">
        <h4 
          id={error.id ? `error-title-${error.id}` : undefined}
          className={cn("font-semibold text-sm", config.textColor)}
        >
          {error.title}
        </h4>
        <p 
          id={error.id ? `error-message-${error.id}` : undefined}
          className={cn("text-sm", config.textColor)}
        >
          {error.message}
        </p>
        
        {error.action && (
          <Button
            variant="outline"
            size="sm"
            onClick={error.action.handler}
            className="mt-2"
            aria-label={error.action.label}
          >
            {error.action.label}
          </Button>
        )}
      </div>

      {(error.dismissible !== false && onDismiss) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDismiss(error.id)}
          className="h-6 w-6 p-0 flex-shrink-0"
          aria-label={dismissLabel}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// Error boundary fallback component
interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const { language } = useLanguage();
  const isSpanish = language === 'es';

  const errorInfo: ErrorInfo = {
    title: isSpanish ? 'Ha ocurrido un error' : 'Something went wrong',
    message: isSpanish 
      ? 'Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta de nuevo.'
      : 'Sorry, something unexpected happened. Please try again.',
    severity: 'error',
    action: {
      label: isSpanish ? 'Intentar de nuevo' : 'Try again',
      handler: resetError
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <div className="max-w-md w-full">
        <ErrorDisplay error={errorInfo} />
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 p-3 bg-muted rounded text-xs">
            <summary className="cursor-pointer font-medium">
              {isSpanish ? 'Detalles técnicos' : 'Technical details'}
            </summary>
            <pre className="mt-2 whitespace-pre-wrap break-words">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// Common error types for consistent messaging
export const ErrorTypes = {
  NETWORK: {
    title: { en: 'Connection Error', es: 'Error de Conexión' },
    message: { 
      en: 'Please check your internet connection and try again.',
      es: 'Por favor verifica tu conexión a internet e intenta de nuevo.'
    }
  },
  VALIDATION: {
    title: { en: 'Invalid Input', es: 'Entrada Inválida' },
    message: { 
      en: 'Please check your input and try again.',
      es: 'Por favor verifica tu entrada e intenta de nuevo.'
    }
  },
  PERMISSION: {
    title: { en: 'Access Denied', es: 'Acceso Denegado' },
    message: { 
      en: 'You do not have permission to perform this action.',
      es: 'No tienes permisos para realizar esta acción.'
    }
  },
  NOT_FOUND: {
    title: { en: 'Not Found', es: 'No Encontrado' },
    message: { 
      en: 'The requested resource could not be found.',
      es: 'El recurso solicitado no pudo ser encontrado.'
    }
  }
} as const;
