import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ErrorInfo, ErrorDisplay } from '@/components/ui/error-display';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ErrorContextType {
  errors: ErrorInfo[];
  addError: (error: Omit<ErrorInfo, 'id'>) => string;
  removeError: (id: string) => void;
  clearErrors: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
  maxErrors?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
}

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2'
};

export function ErrorProvider({ 
  children, 
  maxErrors = 5,
  position = 'top-right'
}: ErrorProviderProps) {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);

  const addError = useCallback((errorData: Omit<ErrorInfo, 'id'>) => {
    const id = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const error: ErrorInfo = {
      ...errorData,
      id,
      dismissible: errorData.dismissible !== false
    };

    setErrors(prev => {
      const newErrors = [error, ...prev];
      return newErrors.slice(0, maxErrors);
    });

    // Auto-hide if specified
    if (error.autoHide !== false) {
      const duration = error.duration || (error.severity === 'success' ? 3000 : 5000);
      setTimeout(() => {
        removeError(id);
      }, duration);
    }

    return id;
  }, [maxErrors]);

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, clearErrors }}>
      {children}
      
      {/* Error Toast Container */}
      <div 
        className={cn(
          "fixed z-50 w-full max-w-sm pointer-events-none",
          positionClasses[position]
        )}
        aria-live="polite"
        aria-label="Error notifications"
      >
        <AnimatePresence mode="popLayout">
          {errors.map((error) => (
            <motion.div
              key={error.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mb-2 pointer-events-auto"
            >
              <ErrorDisplay
                error={error}
                onDismiss={removeError}
                className="shadow-lg"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}

// Convenience hooks for different error types
export function useErrorHandling() {
  const { addError } = useError();

  const showError = useCallback((message: string, title?: string) => {
    return addError({
      title: title || 'Error',
      message,
      severity: 'error'
    });
  }, [addError]);

  const showWarning = useCallback((message: string, title?: string) => {
    return addError({
      title: title || 'Warning',
      message,
      severity: 'warning'
    });
  }, [addError]);

  const showSuccess = useCallback((message: string, title?: string) => {
    return addError({
      title: title || 'Success',
      message,
      severity: 'success'
    });
  }, [addError]);

  const showInfo = useCallback((message: string, title?: string) => {
    return addError({
      title: title || 'Information',
      message,
      severity: 'info'
    });
  }, [addError]);

  return {
    showError,
    showWarning,
    showSuccess,
    showInfo
  };
}
