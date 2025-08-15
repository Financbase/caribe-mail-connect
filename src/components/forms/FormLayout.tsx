import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

export interface FormLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onSubmit?: (e: React.FormEvent) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  isDirty?: boolean;
  variant?: 'default' | 'card' | 'modal' | 'inline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface FormFieldGroupProps {
  legend?: string;
  description?: string;
  children: React.ReactNode;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

/**
 * Main form layout component with Caribbean styling
 * Optimized for Puerto Rico bilingual forms
 */
export const FormLayout: React.FC<FormLayoutProps> = ({
  children,
  title,
  subtitle,
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel,
  isLoading = false,
  isDirty = false,
  variant = 'default',
  size = 'md',
  actions,
  footer,
  className
}) => {
  const { t, language } = useLanguage();

  const defaultSubmitLabel = submitLabel || t('save', 'Guardar');
  const defaultCancelLabel = cancelLabel || t('cancel', 'Cancelar');

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const variantClasses = {
    default: 'space-y-6',
    card: 'bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6',
    modal: 'bg-white rounded-lg shadow-lg p-6 space-y-6',
    inline: 'space-y-4'
  };

  return (
    <div className={cn(
      'w-full mx-auto',
      sizeClasses[size],
      className
    )}>
      <form onSubmit={onSubmit} className={cn(variantClasses[variant])}>
        {/* Header */}
        {(title || subtitle) && (
          <div className="space-y-2">
            {title && (
              <h2 className="text-2xl font-semibold text-gray-900 caribbean-text">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Form Content */}
        <div className="space-y-6">
          {children}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-gray-200">
          {/* Cancel Button */}
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="caribbean-button-secondary"
            >
              {defaultCancelLabel}
            </Button>
          )}

          {/* Custom Actions */}
          {actions}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="caribbean-button-primary"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t('saving', 'Guardando')}...
              </div>
            ) : (
              defaultSubmitLabel
            )}
          </Button>
        </div>

        {/* Dirty State Indicator */}
        {isDirty && (
          <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
            <div className="flex items-center gap-2">
              <span className="text-amber-500">⚠️</span>
              {t('unsaved_changes', 'Tienes cambios sin guardar')}
            </div>
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div className="pt-4 border-t border-gray-100">
            {footer}
          </div>
        )}
      </form>
    </div>
  );
};

/**
 * Form section with collapsible functionality
 */
export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className,
  collapsible = false,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Section Header */}
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 caribbean-text">
                {title}
              </h3>
              {collapsible && (
                <button
                  type="button"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="text-sm text-primary-ocean hover:text-primary-sunrise transition-colors"
                >
                  {isCollapsed ? '▼' : '▲'}
                </button>
              )}
            </div>
          )}
          {description && (
            <p className="text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Section Content */}
      {(!collapsible || !isCollapsed) && (
        <div className="space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Field group for organizing related form fields
 */
export const FormFieldGroup: React.FC<FormFieldGroupProps> = ({
  legend,
  description,
  children,
  orientation = 'vertical',
  className
}) => {
  const orientationClasses = {
    vertical: 'space-y-4',
    horizontal: 'grid grid-cols-1 md:grid-cols-2 gap-4'
  };

  return (
    <fieldset className={cn('space-y-3', className)}>
      {/* Legend and Description */}
      {(legend || description) && (
        <div className="space-y-1">
          {legend && (
            <legend className="text-sm font-medium text-gray-900 caribbean-text">
              {legend}
            </legend>
          )}
          {description && (
            <p className="text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Fields */}
      <div className={orientationClasses[orientation]}>
        {children}
      </div>
    </fieldset>
  );
};

/**
 * Pre-built form layouts for common use cases
 */

// Customer Form Layout
export const CustomerFormLayout: React.FC<{
  children: React.ReactNode;
  title?: string;
  onSubmit?: (e: React.FormEvent) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}> = ({ children, title, onSubmit, onCancel, isLoading }) => {
  const { t } = useLanguage();
  
  return (
    <FormLayout
      title={title || t('customer_information', 'Información del Cliente')}
      variant="card"
      size="lg"
      onSubmit={onSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      submitLabel={t('save_customer', 'Guardar Cliente')}
    >
      {children}
    </FormLayout>
  );
};

// Package Form Layout
export const PackageFormLayout: React.FC<{
  children: React.ReactNode;
  title?: string;
  onSubmit?: (e: React.FormEvent) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}> = ({ children, title, onSubmit, onCancel, isLoading }) => {
  const { t } = useLanguage();
  
  return (
    <FormLayout
      title={title || t('package_information', 'Información del Paquete')}
      variant="card"
      size="lg"
      onSubmit={onSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      submitLabel={t('save_package', 'Guardar Paquete')}
    >
      {children}
    </FormLayout>
  );
};

// Settings Form Layout
export const SettingsFormLayout: React.FC<{
  children: React.ReactNode;
  title?: string;
  onSubmit?: (e: React.FormEvent) => void;
  isLoading?: boolean;
}> = ({ children, title, onSubmit, isLoading }) => {
  const { t } = useLanguage();
  
  return (
    <FormLayout
      title={title || t('settings', 'Configuración')}
      variant="default"
      size="xl"
      onSubmit={onSubmit}
      isLoading={isLoading}
      submitLabel={t('save_settings', 'Guardar Configuración')}
    >
      {children}
    </FormLayout>
  );
};

export default FormLayout;
