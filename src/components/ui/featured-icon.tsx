import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface FeaturedIconProps {
  icon: LucideIcon;
  variant?: 'light' | 'gradient' | 'dark' | 'outline' | 'modern' | 'modern-neue';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  iconClassName?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12', 
  lg: 'w-16 h-16',
  xl: 'w-20 h-20'
};

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8', 
  xl: 'w-10 h-10'
};

const variantClasses = {
  light: {
    container: 'bg-primary/10 border border-primary/20 shadow-sm',
    icon: 'text-primary'
  },
  gradient: {
    container: 'bg-gradient-to-br from-primary via-primary-sunrise to-primary-palm border-0 shadow-lg',
    icon: 'text-white'
  },
  dark: {
    container: 'bg-gray-900 border border-gray-800 shadow-lg',
    icon: 'text-white'
  },
  outline: {
    container: 'bg-white border-2 border-primary/30 shadow-sm hover:border-primary/50 transition-colors',
    icon: 'text-primary'
  },
  modern: {
    container: 'bg-white border border-gray-200 shadow-lg ring-1 ring-gray-900/5',
    icon: 'text-gray-600'
  },
  'modern-neue': {
    container: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl ring-1 ring-black/5',
    icon: 'text-gray-800'
  }
};

export const FeaturedIcon: React.FC<FeaturedIconProps> = ({
  icon: Icon,
  variant = 'light',
  size = 'md',
  className,
  iconClassName
}) => {
  const containerClasses = cn(
    'flex items-center justify-center rounded-xl transition-all duration-200',
    sizeClasses[size],
    variantClasses[variant].container,
    className
  );

  const iconClasses = cn(
    iconSizeClasses[size],
    variantClasses[variant].icon,
    iconClassName
  );

  return (
    <div className={containerClasses}>
      <Icon className={iconClasses} />
    </div>
  );
};

// Specialized variants for common PRMCMS use cases
export const CaribeFeaturedIcon: React.FC<Omit<FeaturedIconProps, 'variant'>> = (props) => (
  <FeaturedIcon {...props} variant="gradient" />
);

export const BusinessFeaturedIcon: React.FC<Omit<FeaturedIconProps, 'variant'>> = (props) => (
  <FeaturedIcon {...props} variant="modern" />
);

export const NotificationFeaturedIcon: React.FC<Omit<FeaturedIconProps, 'variant'>> = (props) => (
  <FeaturedIcon {...props} variant="outline" />
);

export const StatusFeaturedIcon: React.FC<FeaturedIconProps & { status?: 'success' | 'warning' | 'error' | 'info' }> = ({
  status = 'info',
  ...props
}) => {
  const statusVariants = {
    success: 'bg-green-50 border-green-200 text-green-600',
    warning: 'bg-amber-50 border-amber-200 text-amber-600', 
    error: 'bg-red-50 border-red-200 text-red-600',
    info: 'bg-blue-50 border-blue-200 text-blue-600'
  };

  return (
    <FeaturedIcon
      {...props}
      variant="light"
      className={cn(statusVariants[status], props.className)}
    />
  );
};
