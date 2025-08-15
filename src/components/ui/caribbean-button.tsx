import React from 'react';
import { cn } from '@/lib/utils';
import { Button as BaseButton } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  hierarchy?: 'primary' | 'secondary' | 'tertiary';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  caribbean?: boolean;
  children: React.ReactNode;
}

interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'tight' | 'normal' | 'loose';
  attached?: boolean;
  className?: string;
}

/**
 * Caribbean-styled button component with hierarchical design
 * Optimized for Puerto Rico mobile-first interface
 */
export const CaribbeanButton: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  hierarchy = 'primary',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  caribbean = true,
  children,
  className,
  disabled,
  ...props
}) => {
  const { t } = useLanguage();

  // Size classes for different button sizes
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs h-6',
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-sm h-10',
    lg: 'px-6 py-3 text-base h-12',
    xl: 'px-8 py-4 text-lg h-14'
  };

  // Hierarchy-based styling for Caribbean theme
  const hierarchyClasses = {
    primary: {
      primary: caribbean ? 
        'bg-gradient-to-r from-primary-ocean to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl' :
        'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: caribbean ?
        'bg-gradient-to-r from-primary-sunrise to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg' :
        'bg-orange-500 hover:bg-orange-600 text-white',
      success: caribbean ?
        'bg-gradient-to-r from-primary-palm to-green-500 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg' :
        'bg-green-500 hover:bg-green-600 text-white',
      warning: 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-md hover:shadow-lg',
      danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300',
      link: 'bg-transparent hover:bg-transparent text-primary-ocean hover:text-primary-sunrise underline-offset-4 hover:underline p-0 h-auto'
    },
    secondary: {
      primary: 'bg-white border-2 border-primary-ocean text-primary-ocean hover:bg-primary-ocean hover:text-white',
      secondary: 'bg-white border-2 border-primary-sunrise text-primary-sunrise hover:bg-primary-sunrise hover:text-white',
      success: 'bg-white border-2 border-primary-palm text-primary-palm hover:bg-primary-palm hover:text-white',
      warning: 'bg-white border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white',
      danger: 'bg-white border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white',
      ghost: 'bg-transparent hover:bg-gray-50 text-gray-600 border border-gray-200',
      link: 'bg-transparent hover:bg-transparent text-gray-600 hover:text-primary-ocean underline-offset-4 hover:underline p-0 h-auto'
    },
    tertiary: {
      primary: 'bg-gray-100 hover:bg-gray-200 text-primary-ocean border border-gray-200',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-primary-sunrise border border-gray-200',
      success: 'bg-gray-100 hover:bg-gray-200 text-primary-palm border border-gray-200',
      warning: 'bg-gray-100 hover:bg-gray-200 text-yellow-600 border border-gray-200',
      danger: 'bg-gray-100 hover:bg-gray-200 text-red-600 border border-gray-200',
      ghost: 'bg-transparent hover:bg-gray-50 text-gray-500',
      link: 'bg-transparent hover:bg-transparent text-gray-500 hover:text-gray-700 underline-offset-4 hover:underline p-0 h-auto'
    }
  };

  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-primary-ocean focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    sizeClasses[size],
    hierarchyClasses[hierarchy][variant],
    fullWidth && 'w-full',
    loading && 'relative',
    className
  );

  const content = (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <div className={cn('flex items-center gap-2', loading && 'opacity-0')}>
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">
            {icon}
          </span>
        )}
        
        <span className={variant === 'link' ? '' : 'truncate'}>
          {children}
        </span>
        
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">
            {icon}
          </span>
        )}
      </div>
    </>
  );

  return (
    <button
      className={baseClasses}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
};

/**
 * Button group for organizing related actions
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  spacing = 'normal',
  attached = false,
  className
}) => {
  const orientationClasses = {
    horizontal: attached ? 'flex' : 'flex flex-wrap',
    vertical: attached ? 'flex flex-col' : 'flex flex-col'
  };

  const spacingClasses = {
    tight: orientation === 'horizontal' ? 'gap-1' : 'gap-1',
    normal: orientation === 'horizontal' ? 'gap-2' : 'gap-2',
    loose: orientation === 'horizontal' ? 'gap-4' : 'gap-3'
  };

  const attachedClasses = attached ? (
    orientation === 'horizontal' ? 
      '[&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:not(:first-child)]:border-l-0' :
      '[&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:not(:first-child)]:border-t-0'
  ) : '';

  return (
    <div className={cn(
      orientationClasses[orientation],
      !attached && spacingClasses[spacing],
      attachedClasses,
      className
    )}>
      {children}
    </div>
  );
};

/**
 * Pre-built button combinations for common PRMCMS scenarios
 */

// Form Action Buttons
export const FormActionButtons: React.FC<{
  onSubmit?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  saveLabel?: string;
  isLoading?: boolean;
  variant?: 'horizontal' | 'vertical';
  className?: string;
}> = ({
  onSubmit,
  onCancel,
  onSave,
  submitLabel,
  cancelLabel,
  saveLabel,
  isLoading = false,
  variant = 'horizontal',
  className
}) => {
  const { t } = useLanguage();

  const defaultSubmitLabel = submitLabel || t('submit', 'Enviar');
  const defaultCancelLabel = cancelLabel || t('cancel', 'Cancelar');
  const defaultSaveLabel = saveLabel || t('save', 'Guardar');

  return (
    <ButtonGroup 
      orientation={variant} 
      className={cn('justify-end', className)}
    >
      {onCancel && (
        <CaribbeanButton
          variant="ghost"
          hierarchy="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          {defaultCancelLabel}
        </CaribbeanButton>
      )}
      
      {onSave && (
        <CaribbeanButton
          variant="secondary"
          hierarchy="secondary"
          onClick={onSave}
          loading={isLoading}
        >
          {defaultSaveLabel}
        </CaribbeanButton>
      )}
      
      {onSubmit && (
        <CaribbeanButton
          variant="primary"
          hierarchy="primary"
          onClick={onSubmit}
          loading={isLoading}
        >
          {defaultSubmitLabel}
        </CaribbeanButton>
      )}
    </ButtonGroup>
  );
};

// Package Action Buttons
export const PackageActionButtons: React.FC<{
  onScan?: () => void;
  onNotify?: () => void;
  onDeliver?: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ onScan, onNotify, onDeliver, disabled = false, className }) => {
  const { t } = useLanguage();

  return (
    <ButtonGroup className={className}>
      {onScan && (
        <CaribbeanButton
          variant="primary"
          hierarchy="primary"
          size="md"
          disabled={disabled}
          onClick={onScan}
          icon={<span>📷</span>}
        >
          {t('scan', 'Escanear')}
        </CaribbeanButton>
      )}
      
      {onNotify && (
        <CaribbeanButton
          variant="secondary"
          hierarchy="secondary"
          size="md"
          disabled={disabled}
          onClick={onNotify}
          icon={<span>📧</span>}
        >
          {t('notify', 'Notificar')}
        </CaribbeanButton>
      )}
      
      {onDeliver && (
        <CaribbeanButton
          variant="success"
          hierarchy="primary"
          size="md"
          disabled={disabled}
          onClick={onDeliver}
          icon={<span>✅</span>}
        >
          {t('deliver', 'Entregar')}
        </CaribbeanButton>
      )}
    </ButtonGroup>
  );
};

// Customer Action Buttons
export const CustomerActionButtons: React.FC<{
  onEdit?: () => void;
  onView?: () => void;
  onDelete?: () => void;
  onContact?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}> = ({ onEdit, onView, onDelete, onContact, disabled = false, size = 'sm', className }) => {
  const { t } = useLanguage();

  return (
    <ButtonGroup spacing="tight" className={className}>
      {onView && (
        <CaribbeanButton
          variant="ghost"
          hierarchy="tertiary"
          size={size}
          disabled={disabled}
          onClick={onView}
          icon={<span>👁️</span>}
        >
          {t('view', 'Ver')}
        </CaribbeanButton>
      )}
      
      {onEdit && (
        <CaribbeanButton
          variant="ghost"
          hierarchy="tertiary"
          size={size}
          disabled={disabled}
          onClick={onEdit}
          icon={<span>✏️</span>}
        >
          {t('edit', 'Editar')}
        </CaribbeanButton>
      )}
      
      {onContact && (
        <CaribbeanButton
          variant="secondary"
          hierarchy="secondary"
          size={size}
          disabled={disabled}
          onClick={onContact}
          icon={<span>📞</span>}
        >
          {t('contact', 'Contactar')}
        </CaribbeanButton>
      )}
      
      {onDelete && (
        <CaribbeanButton
          variant="danger"
          hierarchy="tertiary"
          size={size}
          disabled={disabled}
          onClick={onDelete}
          icon={<span>🗑️</span>}
        >
          {t('delete', 'Eliminar')}
        </CaribbeanButton>
      )}
    </ButtonGroup>
  );
};

// Floating Action Button (FAB)
export const FloatingActionButton: React.FC<{
  onClick: () => void;
  icon: React.ReactNode;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  variant?: 'primary' | 'secondary' | 'success';
  className?: string;
}> = ({
  onClick,
  icon,
  label,
  position = 'bottom-right',
  variant = 'primary',
  className
}) => {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-ocean to-blue-600 hover:from-blue-700 hover:to-blue-800',
    secondary: 'bg-gradient-to-r from-primary-sunrise to-orange-500 hover:from-orange-600 hover:to-orange-700',
    success: 'bg-gradient-to-r from-primary-palm to-green-500 hover:from-green-600 hover:to-green-700'
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center w-14 h-14 rounded-full shadow-lg',
        'text-white transition-all duration-300 hover:shadow-xl hover:scale-105',
        'focus:outline-none focus:ring-4 focus:ring-primary-ocean/30',
        'z-50',
        positionClasses[position],
        variantClasses[variant],
        className
      )}
      aria-label={label}
    >
      <span className="text-xl">
        {icon}
      </span>
    </button>
  );
};

export { BaseButton as Button };
export default CaribbeanButton;
