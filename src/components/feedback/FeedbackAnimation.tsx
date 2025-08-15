import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useAriaLive } from '@/components/a11y/AriaLiveProvider';

export type FeedbackType = 'success' | 'error' | 'warning' | 'info';

export interface FeedbackAnimationProps {
  type: FeedbackType;
  message: string;
  visible: boolean;
  onDismiss?: () => void;
  duration?: number;
  position?: 'top' | 'bottom' | 'center';
  variant?: 'toast' | 'banner' | 'inline' | 'overlay';
  showIcon?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Caribbean-styled feedback animations for success/error states
 * Includes ARIA announcements and Puerto Rico cultural elements
 */
export function FeedbackAnimation({
  type,
  message,
  visible,
  onDismiss,
  duration = 5000,
  position = 'top',
  variant = 'toast',
  showIcon = true,
  actions,
  className
}: FeedbackAnimationProps) {
  const { t } = useLanguage();
  const { announceStatus, announceAlert } = useAriaLive();
  const [isExiting, setIsExiting] = useState(false);

  // Announce feedback to screen readers
  useEffect(() => {
    if (visible) {
      if (type === 'error') {
        announceAlert(message);
      } else {
        announceStatus(message);
      }
    }
  }, [visible, type, message, announceAlert, announceStatus]);

  // Auto-dismiss after duration
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      onDismiss?.();
    }, 300);
  };

  if (!visible && !isExiting) return null;

  // Icon mapping
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  // Color classes
  const colorClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  // Animation classes
  const animationClasses = {
    toast: {
      enter: 'animate-slide-in-from-top',
      exit: 'animate-slide-out-to-top'
    },
    banner: {
      enter: 'animate-expand-down',
      exit: 'animate-collapse-up'
    },
    inline: {
      enter: 'animate-fade-in',
      exit: 'animate-fade-out'
    },
    overlay: {
      enter: 'animate-scale-in',
      exit: 'animate-scale-out'
    }
  };

  // Position classes
  const positionClasses = {
    top: 'top-4 left-1/2 transform -translate-x-1/2',
    bottom: 'bottom-4 left-1/2 transform -translate-x-1/2',
    center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };

  const baseClasses = cn(
    'feedback-animation',
    'border rounded-lg shadow-lg transition-all duration-300 ease-in-out',
    'max-w-md mx-auto z-50',
    colorClasses[type],
    variant === 'toast' && 'fixed',
    variant === 'banner' && 'w-full',
    variant === 'overlay' && 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50',
    variant === 'toast' && positionClasses[position],
    isExiting ? animationClasses[variant].exit : animationClasses[variant].enter,
    className
  );

  const contentClasses = cn(
    'p-4',
    variant === 'overlay' && 'bg-white rounded-lg shadow-xl max-w-sm mx-4'
  );

  return (
    <div
      className={baseClasses}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <div className={contentClasses}>
        <div className="flex items-start gap-3">
          {showIcon && (
            <span className="text-xl flex-shrink-0 mt-0.5">
              {icons[type]}
            </span>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="font-medium caribbean-text">
              {message}
            </p>
          </div>
          
          {(onDismiss || actions) && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions}
              
              {onDismiss && (
                <button
                  onClick={handleDismiss}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
                  aria-label={t('dismiss', 'Cerrar')}
                >
                  <span className="sr-only">{t('dismiss', 'Cerrar')}</span>
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for managing feedback animations
 */
export function useFeedback() {
  const [feedbacks, setFeedbacks] = useState<Array<{
    id: string;
    type: FeedbackType;
    message: string;
    duration?: number;
    actions?: React.ReactNode;
  }>>([]);

  const showFeedback = (
    type: FeedbackType,
    message: string,
    options: {
      duration?: number;
      actions?: React.ReactNode;
    } = {}
  ) => {
    const id = `feedback-${Date.now()}-${Math.random()}`;
    const feedback = {
      id,
      type,
      message,
      duration: options.duration || 5000,
      actions: options.actions
    };

    setFeedbacks(prev => [...prev, feedback]);

    // Auto-remove after duration
    if (feedback.duration > 0) {
      setTimeout(() => {
        setFeedbacks(prev => prev.filter(f => f.id !== id));
      }, feedback.duration);
    }

    return id;
  };

  const dismissFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  const clearAll = () => {
    setFeedbacks([]);
  };

  return {
    feedbacks,
    showSuccess: (message: string, options?: { duration?: number; actions?: React.ReactNode }) => 
      showFeedback('success', message, options),
    showError: (message: string, options?: { duration?: number; actions?: React.ReactNode }) => 
      showFeedback('error', message, options),
    showWarning: (message: string, options?: { duration?: number; actions?: React.ReactNode }) => 
      showFeedback('warning', message, options),
    showInfo: (message: string, options?: { duration?: number; actions?: React.ReactNode }) => 
      showFeedback('info', message, options),
    dismissFeedback,
    clearAll
  };
}

/**
 * Feedback container component to render multiple feedbacks
 */
export function FeedbackContainer() {
  const { feedbacks, dismissFeedback } = useFeedback();

  return (
    <div className="feedback-container">
      {feedbacks.map((feedback, index) => (
        <FeedbackAnimation
          key={feedback.id}
          type={feedback.type}
          message={feedback.message}
          visible={true}
          onDismiss={() => dismissFeedback(feedback.id)}
          duration={0} // Controlled by hook
          position="top"
          variant="toast"
          actions={feedback.actions}
          style={{
            top: `${1 + index * 4}rem`, // Stack multiple feedbacks
            zIndex: 1000 + index
          }}
        />
      ))}
    </div>
  );
}

/**
 * Pre-built Caribbean feedback messages
 */
export function useCaribbeanFeedback() {
  const { showSuccess, showError, showWarning, showInfo } = useFeedback();
  const { t } = useLanguage();

  const packageScanned = (packageId: string) => 
    showSuccess(t('package_scanned_success', `Paquete ${packageId} escaneado exitosamente`));

  const customerCreated = (customerName: string) => 
    showSuccess(t('customer_created_success', `Cliente ${customerName} creado exitosamente`));

  const formSaved = () => 
    showSuccess(t('form_saved_success', 'Formulario guardado automáticamente'));

  const connectionLost = () => 
    showWarning(t('connection_lost', 'Conexión perdida. Trabajando en modo sin conexión.'));

  const connectionRestored = () => 
    showSuccess(t('connection_restored', 'Conexión restablecida. Sincronizando datos...'));

  const validationError = (field: string, error: string) => 
    showError(t('validation_error_detailed', `Error en ${field}: ${error}`));

  const syncError = () => 
    showError(t('sync_error', 'Error al sincronizar datos. Se reintentará automáticamente.'));

  const cameraPermissionDenied = () => 
    showError(t('camera_permission_denied', 'Acceso a cámara denegado. Habilítalo en configuración.'));

  const barcodeNotFound = () => 
    showWarning(t('barcode_not_found', 'Código de barras no encontrado. Intenta de nuevo.'));

  const systemMaintenance = () => 
    showInfo(t('system_maintenance', 'Mantenimiento del sistema programado para esta noche.'));

  const weatherAlert = (condition: string) => 
    showWarning(t('weather_alert', `Alerta meteorológica: ${condition}. Toma precauciones.`));

  return {
    packageScanned,
    customerCreated,
    formSaved,
    connectionLost,
    connectionRestored,
    validationError,
    syncError,
    cameraPermissionDenied,
    barcodeNotFound,
    systemMaintenance,
    weatherAlert
  };
}

/**
 * Loading feedback with Caribbean styling
 */
export function LoadingFeedback({ 
  message, 
  visible,
  variant = 'inline' 
}: { 
  message: string; 
  visible: boolean; 
  variant?: 'inline' | 'overlay' | 'banner';
}) {
  const { t } = useLanguage();

  if (!visible) return null;

  const spinner = (
    <div className="w-5 h-5 border-2 border-primary-ocean border-t-transparent rounded-full animate-spin" />
  );

  if (variant === 'overlay') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm mx-4">
          <div className="flex items-center gap-3">
            {spinner}
            <p className="text-gray-900 font-medium caribbean-text">
              {message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="bg-blue-50 border-l-4 border-primary-ocean p-4 animate-fade-in">
        <div className="flex items-center gap-3">
          {spinner}
          <p className="text-primary-ocean font-medium caribbean-text">
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-fade-in">
      {spinner}
      <p className="text-gray-700 caribbean-text">
        {message}
      </p>
    </div>
  );
}

export default FeedbackAnimation;
