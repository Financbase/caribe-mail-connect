import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  text?: string;
  showText?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  text = 'Loading...',
  showText = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const variantClasses = {
    default: 'text-gray-600',
    primary: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} ${variantClasses[variant]} animate-spin`}
        role="status"
        aria-label="Loading"
      >
        <svg
          className="w-full h-full"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {showText && text && (
        <p className={`mt-2 text-sm ${variantClasses[variant]}`}>{text}</p>
      )}
    </div>
  );
};

// Page loading overlay
export const PageLoadingOverlay: React.FC<{ message?: string }> = ({ 
  message = 'Loading page...' 
}) => (
  <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
    <div className="text-center">
      <LoadingSpinner size="xl" variant="primary" text={message} />
    </div>
  </div>
);

// Skeleton loading component
export const Skeleton: React.FC<{
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}> = ({ className = '', variant = 'text' }) => {
  const baseClasses = 'animate-pulse bg-gray-200';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
};

// Content skeleton
export const ContentSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={`h-4 ${i === 0 ? 'w-3/4' : 'w-full'}`}
        variant="text"
      />
    ))}
  </div>
);

// Card skeleton
export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-6 space-y-4">
    <div className="flex items-center space-x-4">
      <Skeleton className="w-12 h-12" variant="circular" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2" variant="text" />
        <Skeleton className="h-3 w-3/4" variant="text" />
      </div>
    </div>
    <ContentSkeleton lines={3} />
  </div>
);

// Table skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4
}) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <Skeleton className="h-6 w-1/3" variant="text" />
    </div>
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4 flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={`h-4 ${colIndex === 0 ? 'w-1/4' : 'w-1/6'}`}
              variant="text"
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Progress bar
export const ProgressBar: React.FC<{
  progress: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  className?: string;
}> = ({ progress, variant = 'default', showPercentage = true, className = '' }) => {
  const variantClasses = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${variantClasses[variant]}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}; 