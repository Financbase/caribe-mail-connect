import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface AriaLiveMessage {
  id: string;
  message: string;
  type: 'status' | 'alert' | 'log';
  priority: 'polite' | 'assertive';
  timestamp: number;
  duration?: number;
}

interface AriaLiveContextType {
  announceStatus: (message: string, duration?: number) => void;
  announceAlert: (message: string, duration?: number) => void;
  announceLog: (message: string, duration?: number) => void;
  clearMessages: () => void;
  messages: AriaLiveMessage[];
}

const AriaLiveContext = createContext<AriaLiveContextType | null>(null);

/**
 * ARIA Live Region Provider for announcing dynamic content changes
 * Supports Spanish/English announcements for Puerto Rico users
 */
export function AriaLiveProvider({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<AriaLiveMessage[]>([]);
  const messageIdRef = useRef(0);

  const addMessage = useCallback((
    message: string,
    type: 'status' | 'alert' | 'log',
    priority: 'polite' | 'assertive',
    duration: number = 5000
  ) => {
    const id = `aria-live-${messageIdRef.current++}`;
    const newMessage: AriaLiveMessage = {
      id,
      message,
      type,
      priority,
      timestamp: Date.now(),
      duration
    };

    setMessages(prev => [...prev, newMessage]);

    // Auto-remove message after duration
    if (duration > 0) {
      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
      }, duration);
    }
  }, []);

  const announceStatus = useCallback((message: string, duration?: number) => {
    addMessage(message, 'status', 'polite', duration);
  }, [addMessage]);

  const announceAlert = useCallback((message: string, duration?: number) => {
    addMessage(message, 'alert', 'assertive', duration);
  }, [addMessage]);

  const announceLog = useCallback((message: string, duration?: number) => {
    addMessage(message, 'log', 'polite', duration);
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const value: AriaLiveContextType = {
    announceStatus,
    announceAlert,
    announceLog,
    clearMessages,
    messages
  };

  // Group messages by priority for separate live regions
  const politeMessages = messages.filter(msg => msg.priority === 'polite');
  const assertiveMessages = messages.filter(msg => msg.priority === 'assertive');

  return (
    <AriaLiveContext.Provider value={value}>
      {children}
      
      {/* Polite live region for status updates */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="sr-only"
        id="aria-live-polite"
      >
        {politeMessages.map(msg => (
          <div key={msg.id} role={msg.type}>
            {msg.message}
          </div>
        ))}
      </div>

      {/* Assertive live region for alerts */}
      <div
        aria-live="assertive"
        aria-atomic="false"
        className="sr-only"
        id="aria-live-assertive"
      >
        {assertiveMessages.map(msg => (
          <div key={msg.id} role={msg.type}>
            {msg.message}
          </div>
        ))}
      </div>
    </AriaLiveContext.Provider>
  );
}

export function useAriaLive() {
  const context = useContext(AriaLiveContext);
  if (!context) {
    throw new Error('useAriaLive must be used within an AriaLiveProvider');
  }
  return context;
}

/**
 * Hook for common ARIA announcements in Caribbean mail operations
 */
export function useCaribbeanAnnouncements() {
  const { announceStatus, announceAlert } = useAriaLive();
  const { t } = useLanguage();

  const announcePackageScanned = useCallback((packageId: string) => {
    announceStatus(t('package_scanned', 'Paquete escaneado') + `: ${packageId}`);
  }, [announceStatus, t]);

  const announceCustomerFound = useCallback((customerName: string) => {
    announceStatus(t('customer_found', 'Cliente encontrado') + `: ${customerName}`);
  }, [announceStatus, t]);

  const announceFormSaved = useCallback(() => {
    announceStatus(t('form_saved', 'Formulario guardado automáticamente'));
  }, [announceStatus, t]);

  const announceOfflineMode = useCallback(() => {
    announceAlert(t('offline_mode', 'Modo sin conexión activado. Los datos se sincronizarán cuando se restablezca la conexión.'));
  }, [announceAlert, t]);

  const announceOnlineMode = useCallback(() => {
    announceStatus(t('online_mode', 'Conexión restablecida. Sincronizando datos...'));
  }, [announceStatus, t]);

  const announceError = useCallback((error: string) => {
    announceAlert(t('error_occurred', 'Error') + `: ${error}`);
  }, [announceAlert, t]);

  const announceSuccess = useCallback((message: string) => {
    announceStatus(t('success', 'Éxito') + `: ${message}`);
  }, [announceStatus, t]);

  const announceLoading = useCallback((action: string) => {
    announceStatus(t('loading', 'Cargando') + `: ${action}`);
  }, [announceStatus, t]);

  const announceValidationError = useCallback((field: string, error: string) => {
    announceAlert(t('validation_error', 'Error de validación en') + ` ${field}: ${error}`);
  }, [announceAlert, t]);

  const announcePageChange = useCallback((pageName: string) => {
    announceStatus(t('navigated_to', 'Navegado a') + `: ${pageName}`);
  }, [announceStatus, t]);

  return {
    announcePackageScanned,
    announceCustomerFound,
    announceFormSaved,
    announceOfflineMode,
    announceOnlineMode,
    announceError,
    announceSuccess,
    announceLoading,
    announceValidationError,
    announcePageChange
  };
}

/**
 * Component for visually displaying live region messages (optional)
 * Useful for debugging and sighted users
 */
export function AriaLiveDebugger({ show = false }: { show?: boolean }) {
  const { messages } = useAriaLive();

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
      <h3 className="text-sm font-semibold mb-2">ARIA Live Messages</h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {messages.slice(-5).map(msg => (
          <div
            key={msg.id}
            className={`text-xs p-2 rounded ${
              msg.priority === 'assertive' 
                ? 'bg-red-600' 
                : msg.type === 'status' 
                  ? 'bg-blue-600' 
                  : 'bg-gray-600'
            }`}
          >
            <div className="font-medium">{msg.type} ({msg.priority})</div>
            <div>{msg.message}</div>
            <div className="text-gray-300 text-xs">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * HOC to add automatic ARIA announcements to async operations
 */
export function withAriaAnnouncements<T extends object>(
  Component: React.ComponentType<T>,
  options: {
    onLoadingStart?: string;
    onLoadingEnd?: string;
    onError?: string;
    onSuccess?: string;
  } = {}
) {
  return function WithAriaAnnouncementsComponent(props: T) {
    const { announceStatus, announceAlert } = useAriaLive();
    const { t } = useLanguage();

    // This would typically be integrated with loading/error states from props
    // For now, it's a structure for future implementation

    return <Component {...props} />;
  };
}

/**
 * Hook for form ARIA announcements
 */
export function useFormAnnouncements() {
  const { announceStatus, announceAlert } = useAriaLive();
  const { t } = useLanguage();

  const announceFieldError = useCallback((fieldName: string, error: string) => {
    announceAlert(`${fieldName}: ${error}`);
  }, [announceAlert]);

  const announceFormSubmitted = useCallback(() => {
    announceStatus(t('form_submitted', 'Formulario enviado exitosamente'));
  }, [announceStatus, t]);

  const announceFormValidation = useCallback((errorCount: number) => {
    if (errorCount > 0) {
      announceAlert(
        t('form_errors_count', `Formulario tiene ${errorCount} errores que necesitan corrección`)
      );
    } else {
      announceStatus(t('form_valid', 'Formulario válido y listo para enviar'));
    }
  }, [announceAlert, announceStatus, t]);

  const announceFieldCompleted = useCallback((fieldName: string) => {
    announceStatus(t('field_completed', `Campo completado: ${fieldName}`));
  }, [announceStatus, t]);

  return {
    announceFieldError,
    announceFormSubmitted,
    announceFormValidation,
    announceFieldCompleted
  };
}

export default AriaLiveProvider;
