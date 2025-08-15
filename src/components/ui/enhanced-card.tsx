import React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { Card as BaseCard, CardHeader as BaseCardHeader, CardContent, CardFooter as BaseCardFooter } from './card';

export interface EnhancedCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost' | 'caribbean';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  avatar?: React.ReactNode;
  action?: React.ReactNode;
  subtitle?: string;
}

export interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:2';
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Enhanced Card component with Caribbean styling
 * Extends shadcn/ui card with PRMCMS-specific features
 */
export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  interactive = false,
  disabled = false,
  loading = false,
  className,
  onClick
}) => {
  const variantClasses = {
    default: '',
    elevated: 'shadow-lg border-0',
    outlined: 'border-2 border-gray-300',
    ghost: 'border-0 shadow-none bg-transparent',
    caribbean: 'bg-gradient-to-br from-white to-blue-50 border-primary-ocean/20 shadow-md'
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  const interactiveClasses = interactive ? 
    'cursor-pointer hover:shadow-lg hover:-translate-y-1 active:translate-y-0 transition-all duration-200' : '';

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  const loadingClasses = loading ? 'card-loading' : '';

  return (
    <BaseCard
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        interactiveClasses,
        disabledClasses,
        loadingClasses,
        className
      )}
      onClick={onClick && !disabled && !loading ? onClick : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled && !loading) {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </BaseCard>
  );
};

/**
 * Enhanced Card Header component
 */
export const EnhancedCardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  avatar,
  action,
  subtitle
}) => {
  return (
    <BaseCardHeader className={cn('flex-row items-start gap-3', className)}>
      {avatar && (
        <div className="flex-shrink-0">
          {avatar}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 caribbean-text truncate text-lg">
              {children}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {subtitle}
              </p>
            )}
          </div>
          
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      </div>
    </BaseCardHeader>
  );
};

/**
 * Card Image component
 */
export const CardImage: React.FC<CardImageProps> = ({
  src,
  alt,
  className,
  aspectRatio = '16:9',
  position = 'top'
}) => {
  const aspectRatioClasses = {
    '1:1': 'aspect-square',
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '3:2': 'aspect-[3/2]'
  };

  const positionClasses = {
    top: '-mt-6 -mx-6 mb-4 rounded-t-lg',
    bottom: '-mb-6 -mx-6 mt-4 rounded-b-lg',
    left: '-ml-6 -my-6 mr-4 rounded-l-lg',
    right: '-mr-6 -my-6 ml-4 rounded-r-lg'
  };

  return (
    <div className={cn(
      'overflow-hidden',
      aspectRatioClasses[aspectRatio],
      positionClasses[position],
      className
    )}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

/**
 * Pre-built card patterns for common PRMCMS use cases
 */

// Customer Card
export const CustomerCard: React.FC<{
  customer: {
    name: string;
    email: string;
    avatar?: string;
    mailboxNumber?: string;
    status?: 'active' | 'inactive' | 'overdue';
    packageCount?: number;
  };
  onClick?: () => void;
  className?: string;
}> = ({ customer, onClick, className }) => {
  const { t } = useLanguage();

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    overdue: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    active: t('active', 'Activo'),
    inactive: t('inactive', 'Inactivo'),
    overdue: t('overdue', 'Vencido')
  };

  return (
    <EnhancedCard
      variant="caribbean"
      interactive={!!onClick}
      onClick={onClick}
      className={className}
    >
      <EnhancedCardHeader
        avatar={
          customer.avatar ? (
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary-ocean text-white flex items-center justify-center font-semibold">
              {customer.name.charAt(0).toUpperCase()}
            </div>
          )
        }
        action={
          customer.status && (
            <span className={cn(
              'px-2 py-1 text-xs font-medium rounded-full',
              statusColors[customer.status]
            )}>
              {statusLabels[customer.status]}
            </span>
          )
        }
        subtitle={customer.email}
      >
        {customer.name}
      </EnhancedCardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {customer.mailboxNumber && (
            <div>
              <span className="text-gray-500">{t('mailbox', 'Buzón')}:</span>
              <span className="ml-2 font-medium">#{customer.mailboxNumber}</span>
            </div>
          )}
          {customer.packageCount !== undefined && (
            <div>
              <span className="text-gray-500">{t('packages', 'Paquetes')}:</span>
              <span className="ml-2 font-medium">{customer.packageCount}</span>
            </div>
          )}
        </div>
      </CardContent>
    </EnhancedCard>
  );
};

// Package Card
export const PackageCard: React.FC<{
  package: {
    trackingNumber: string;
    customer: string;
    status: 'received' | 'ready' | 'delivered' | 'returned';
    receivedDate: string;
    description?: string;
    urgent?: boolean;
  };
  onClick?: () => void;
  className?: string;
}> = ({ package: pkg, onClick, className }) => {
  const { t } = useLanguage();

  const statusColors = {
    received: 'bg-blue-100 text-blue-800',
    ready: 'bg-green-100 text-green-800',
    delivered: 'bg-gray-100 text-gray-800',
    returned: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    received: t('received', 'Recibido'),
    ready: t('ready', 'Listo'),
    delivered: t('delivered', 'Entregado'),
    returned: t('returned', 'Devuelto')
  };

  return (
    <EnhancedCard
      variant="default"
      interactive={!!onClick}
      onClick={onClick}
      className={cn(pkg.urgent && 'ring-2 ring-orange-300', className)}
    >
      <EnhancedCardHeader
        action={
          <div className="flex items-center gap-2">
            {pkg.urgent && (
              <span className="text-orange-500 text-sm font-medium">
                {t('urgent', 'Urgente')}
              </span>
            )}
            <span className={cn(
              'px-2 py-1 text-xs font-medium rounded-full',
              statusColors[pkg.status]
            )}>
              {statusLabels[pkg.status]}
            </span>
          </div>
        }
      >
        #{pkg.trackingNumber}
      </EnhancedCardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('customer', 'Cliente')}:</span>
            <span className="text-sm font-medium">{pkg.customer}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('received', 'Recibido')}:</span>
            <span className="text-sm">{pkg.receivedDate}</span>
          </div>
          {pkg.description && (
            <p className="text-sm text-gray-700 mt-3 line-clamp-2">
              {pkg.description}
            </p>
          )}
        </div>
      </CardContent>
    </EnhancedCard>
  );
};

// Stat Card
export const StatCard: React.FC<{
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}> = ({ title, value, change, icon, variant = 'default', className }) => {
  const variantClasses = {
    default: 'border-gray-200',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    error: 'border-red-200 bg-red-50'
  };

  const iconColors = {
    default: 'text-gray-500',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  return (
    <EnhancedCard
      variant="outlined"
      className={cn(variantClasses[variant], className)}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 caribbean-text">
              {value}
            </p>
            {change && (
              <p className={cn(
                'text-xs mt-1',
                change.value >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {change.value >= 0 ? '+' : ''}{change.value}% {change.period}
              </p>
            )}
          </div>
          
          {icon && (
            <div className={cn('text-2xl', iconColors[variant])}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </EnhancedCard>
  );
};

// Notification Card
export const NotificationCard: React.FC<{
  notification: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
    read?: boolean;
  };
  onMarkAsRead?: () => void;
  onDismiss?: () => void;
  className?: string;
}> = ({ notification, onMarkAsRead, onDismiss, className }) => {
  const { t } = useLanguage();

  const typeColors = {
    info: 'border-blue-200 bg-blue-50',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    error: 'border-red-200 bg-red-50'
  };

  const typeIcons = {
    info: '💡',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  return (
    <EnhancedCard
      variant="outlined"
      className={cn(
        typeColors[notification.type],
        !notification.read && 'ring-2 ring-primary-ocean/20',
        className
      )}
    >
      <EnhancedCardHeader
        avatar={
          <span className="text-2xl">
            {typeIcons[notification.type]}
          </span>
        }
        action={
          <div className="flex items-center gap-2">
            {!notification.read && onMarkAsRead && (
              <button
                onClick={onMarkAsRead}
                className="text-xs text-primary-ocean hover:text-primary-sunrise"
              >
                {t('mark_read', 'Marcar leído')}
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-gray-400 hover:text-gray-600"
                aria-label={t('dismiss', 'Descartar')}
              >
                ✕
              </button>
            )}
          </div>
        }
        subtitle={notification.timestamp}
      >
        {notification.title}
      </EnhancedCardHeader>

      <CardContent>
        <p className="text-gray-700 leading-relaxed">
          {notification.message}
        </p>
      </CardContent>
    </EnhancedCard>
  );
};

export { CardContent, BaseCardFooter as CardFooter };
export default EnhancedCard;
