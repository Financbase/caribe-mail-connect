/**
 * Enhanced Component Library
 * Professional UI System - Component Library
 * 
 * Reusable, accessible components with shadcn/ui integration
 * Built for enterprise SaaS applications
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  X,
  ChevronDown,
  ChevronRight,
  Star,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

// =====================================================
// STATUS INDICATOR COMPONENT
// =====================================================

const statusIndicatorVariants = cva(
  'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
  {
    variants: {
      status: {
        success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base'
      }
    },
    defaultVariants: {
      status: 'neutral',
      size: 'md'
    }
  }
);

export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusIndicatorVariants> {
  label: string;
  showIcon?: boolean;
}

export const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ className, status, size, label, showIcon = true, ...props }, ref) => {
    const getIcon = () => {
      if (!showIcon) return null;
      
      switch (status) {
        case 'success': return <CheckCircle className="h-4 w-4" />;
        case 'warning': return <AlertTriangle className="h-4 w-4" />;
        case 'error': return <AlertCircle className="h-4 w-4" />;
        case 'info': return <Info className="h-4 w-4" />;
        default: return null;
      }
    };

    return (
      <div
        className={cn(statusIndicatorVariants({ status, size, className }))}
        ref={ref}
        {...props}
      >
        {getIcon()}
        {label}
      </div>
    );
  }
);
StatusIndicator.displayName = 'StatusIndicator';

// =====================================================
// METRIC CARD COMPONENT
// =====================================================

export interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ title, value, description, trend, trendValue, icon, className }, ref) => {
    const getTrendIcon = () => {
      switch (trend) {
        case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
        case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
        case 'neutral': return <Minus className="h-4 w-4 text-gray-500" />;
        default: return null;
      }
    };

    const getTrendColor = () => {
      switch (trend) {
        case 'up': return 'text-green-600';
        case 'down': return 'text-red-600';
        case 'neutral': return 'text-gray-600';
        default: return 'text-gray-600';
      }
    };

    return (
      <Card ref={ref} className={cn('', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            {icon && (
              <div className="ml-4 p-2 bg-primary/10 rounded-lg">
                {icon}
              </div>
            )}
          </div>
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-3">
              {getTrendIcon()}
              <span className={cn('text-sm font-medium', getTrendColor())}>
                {trendValue}
              </span>
              <span className="text-sm text-muted-foreground">vs last period</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);
MetricCard.displayName = 'MetricCard';

// =====================================================
// PROGRESS RING COMPONENT
// =====================================================

export interface ProgressRingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  thickness?: number;
  showValue?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const ProgressRing = React.forwardRef<HTMLDivElement, ProgressRingProps>(
  ({ value, max = 100, size = 'md', thickness = 4, showValue = true, className, children }, ref) => {
    const sizes = {
      sm: { width: 60, height: 60, radius: 26 },
      md: { width: 80, height: 80, radius: 36 },
      lg: { width: 120, height: 120, radius: 56 }
    };

    const { width, height, radius } = sizes[size];
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (value / max) * circumference;

    return (
      <div ref={ref} className={cn('relative inline-flex items-center justify-center', className)}>
        <svg width={width} height={height} className="transform -rotate-90">
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={thickness}
            fill="none"
            className="text-muted-foreground/20"
          />
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={thickness}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-300 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {children || (showValue && (
            <span className="text-sm font-semibold">
              {Math.round((value / max) * 100)}%
            </span>
          ))}
        </div>
      </div>
    );
  }
);
ProgressRing.displayName = 'ProgressRing';

// =====================================================
// RATING COMPONENT
// =====================================================

export interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  ({ value, max = 5, size = 'md', readonly = true, onChange, className }, ref) => {
    const sizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    const handleClick = (rating: number) => {
      if (!readonly && onChange) {
        onChange(rating);
      }
    };

    return (
      <div ref={ref} className={cn('flex items-center gap-1', className)}>
        {Array.from({ length: max }, (_, index) => {
          const rating = index + 1;
          const isFilled = rating <= value;
          const isHalfFilled = rating - 0.5 <= value && value < rating;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(rating)}
              disabled={readonly}
              className={cn(
                'transition-colors',
                !readonly && 'hover:scale-110 cursor-pointer',
                readonly && 'cursor-default'
              )}
            >
              <Star
                className={cn(
                  sizes[size],
                  isFilled || isHalfFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                )}
              />
            </button>
          );
        })}
      </div>
    );
  }
);
Rating.displayName = 'Rating';

// =====================================================
// COLLAPSIBLE SECTION COMPONENT
// =====================================================

export interface CollapsibleSectionProps {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const CollapsibleSection = React.forwardRef<HTMLDivElement, CollapsibleSectionProps>(
  ({ title, description, defaultOpen = false, children, className }, ref) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    return (
      <div ref={ref} className={cn('border rounded-lg', className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </button>
        {isOpen && (
          <div className="px-4 pb-4 border-t">
            <div className="pt-4">
              {children}
            </div>
          </div>
        )}
      </div>
    );
  }
);
CollapsibleSection.displayName = 'CollapsibleSection';

// =====================================================
// EMPTY STATE COMPONENT
// =====================================================

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className }, ref) => {
    return (
      <div ref={ref} className={cn('text-center py-12', className)}>
        {icon && (
          <div className="mx-auto mb-4 text-muted-foreground">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {description}
          </p>
        )}
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';

// =====================================================
// LOADING SKELETON COMPONENT
// =====================================================

export interface LoadingSkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const LoadingSkeleton = React.forwardRef<HTMLDivElement, LoadingSkeletonProps>(
  ({ variant = 'text', width, height, className }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'circular':
          return 'rounded-full';
        case 'rectangular':
          return 'rounded-md';
        case 'text':
        default:
          return 'rounded';
      }
    };

    const getDefaultSize = () => {
      switch (variant) {
        case 'circular':
          return { width: '2rem', height: '2rem' };
        case 'rectangular':
          return { width: '100%', height: '8rem' };
        case 'text':
        default:
          return { width: '100%', height: '1rem' };
      }
    };

    const defaultSize = getDefaultSize();
    const style = {
      width: width || defaultSize.width,
      height: height || defaultSize.height,
    };

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-muted',
          getVariantClasses(),
          className
        )}
        style={style}
      />
    );
  }
);
LoadingSkeleton.displayName = 'LoadingSkeleton';

// =====================================================
// DATA TABLE COMPONENT
// =====================================================

export interface DataTableColumn<T> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  className
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: 5 }).map((_, index) => (
          <LoadingSkeleton key={index} variant="rectangular" height="3rem" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title="No Data"
        description={emptyMessage}
        className={className}
      />
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="text-left p-4 font-medium text-muted-foreground"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b hover:bg-muted/50">
              {columns.map((column) => (
                <td key={String(column.key)} className="p-4">
                  {column.render
                    ? column.render(row[column.key], row)
                    : String(row[column.key] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =====================================================
// NOTIFICATION TOAST COMPONENT
// =====================================================

export interface NotificationToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  className?: string;
}

export const NotificationToast = React.forwardRef<HTMLDivElement, NotificationToastProps>(
  ({ type, title, message, onClose, autoClose = true, duration = 5000, className }, ref) => {
    React.useEffect(() => {
      if (autoClose && onClose) {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
      }
    }, [autoClose, duration, onClose]);

    const getIcon = () => {
      switch (type) {
        case 'success': return <CheckCircle className="h-5 w-5" />;
        case 'error': return <AlertCircle className="h-5 w-5" />;
        case 'warning': return <AlertTriangle className="h-5 w-5" />;
        case 'info': return <Info className="h-5 w-5" />;
      }
    };

    const getColorClasses = () => {
      switch (type) {
        case 'success': return 'bg-green-50 border-green-200 text-green-800';
        case 'error': return 'bg-red-50 border-red-200 text-red-800';
        case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start gap-3 p-4 border rounded-lg shadow-sm',
          getColorClasses(),
          className
        )}
      >
        {getIcon()}
        <div className="flex-1">
          <h4 className="font-medium">{title}</h4>
          {message && <p className="text-sm mt-1">{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-current hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
NotificationToast.displayName = 'NotificationToast';
