import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
  preventScrollLock?: boolean;
}

export interface ModalHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
}

export interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  isLoading?: boolean;
}

/**
 * Main Modal component with Caribbean styling
 * Optimized for mobile-first responsive design
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  overlayClassName,
  preventScrollLock = false
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Size classes
  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full h-full'
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-white border-gray-200',
    destructive: 'bg-white border-red-200',
    success: 'bg-white border-green-200',
    warning: 'bg-white border-yellow-200'
  };

  // Scroll lock effect
  useEffect(() => {
    if (isOpen && !preventScrollLock) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, preventScrollLock]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div 
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-black bg-opacity-50 backdrop-blur-sm',
        overlayClassName
      )}
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={cn(
          'relative w-full rounded-lg shadow-xl border-2',
          'transform transition-all duration-200 ease-out',
          'animate-in fade-in-0 zoom-in-95',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={subtitle ? 'modal-subtitle' : undefined}
      >
        {/* Header */}
        {(title || subtitle || showCloseButton) && (
          <ModalHeader 
            onClose={onClose} 
            showCloseButton={showCloseButton}
            className={variant === 'destructive' ? 'border-red-200' : ''}
          >
            {title && (
              <h2 
                id="modal-title" 
                className={cn(
                  'text-xl font-semibold caribbean-text',
                  {
                    'text-red-900': variant === 'destructive',
                    'text-green-900': variant === 'success',
                    'text-yellow-900': variant === 'warning',
                    'text-gray-900': variant === 'default'
                  }
                )}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p 
                id="modal-subtitle" 
                className="text-sm text-gray-600 mt-1"
              >
                {subtitle}
              </p>
            )}
          </ModalHeader>
        )}

        {/* Body */}
        <ModalBody>
          {children}
        </ModalBody>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

/**
 * Modal Header component
 */
export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  onClose,
  showCloseButton = true,
  className
}) => {
  const { t } = useLanguage();

  return (
    <div className={cn(
      'flex items-start justify-between p-6 border-b border-gray-200',
      className
    )}>
      <div className="flex-1 pr-4">
        {children}
      </div>
      
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className={cn(
            'flex-shrink-0 p-1 text-gray-400 hover:text-gray-600',
            'rounded-md transition-colors focus:outline-none focus:ring-2',
            'focus:ring-primary-ocean focus:ring-offset-2'
          )}
          aria-label={t('close', 'Cerrar')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

/**
 * Modal Body component
 */
export const ModalBody: React.FC<ModalBodyProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  );
};

/**
 * Modal Footer component
 */
export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end gap-3',
      'p-6 border-t border-gray-200 bg-gray-50',
      className
    )}>
      {children}
    </div>
  );
};

/**
 * Confirmation Modal component
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'default',
  isLoading = false
}) => {
  const { t } = useLanguage();

  const defaultConfirmLabel = confirmLabel || t('confirm', 'Confirmar');
  const defaultCancelLabel = cancelLabel || t('cancel', 'Cancelar');

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      variant={variant}
      closeOnOverlayClick={!isLoading}
      closeOnEscape={!isLoading}
    >
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          {message}
        </p>
        
        <ModalFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="caribbean-button-secondary"
          >
            {defaultCancelLabel}
          </Button>
          
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            className={cn(
              variant === 'destructive' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'caribbean-button-primary'
            )}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t('processing', 'Procesando')}...
              </div>
            ) : (
              defaultConfirmLabel
            )}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

/**
 * Hook for managing modal state
 */
export const useModal = (defaultOpen = false) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const openModal = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleModal = React.useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
};

/**
 * Alert Modal for simple notifications
 */
export const AlertModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
}> = ({ isOpen, onClose, title, message, variant = 'info' }) => {
  const { t } = useLanguage();

  const icons = {
    info: '💡',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  const modalVariant = variant === 'error' ? 'destructive' : 
                      variant === 'success' ? 'success' : 
                      variant === 'warning' ? 'warning' : 'default';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      variant={modalVariant}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0 mt-1">
            {icons[variant]}
          </span>
          <p className="text-gray-700 leading-relaxed">
            {message}
          </p>
        </div>
        
        <ModalFooter>
          <Button
            onClick={onClose}
            className="caribbean-button-primary w-full"
          >
            {t('ok', 'OK')}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

export default Modal;
