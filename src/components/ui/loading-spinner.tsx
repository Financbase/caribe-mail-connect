import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary ${sizeClasses[size]}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

// Optimized full-screen loading component
export const FullScreenLoader: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
    <LoadingSpinner size="lg" />
  </div>
);

// Optimized page loading component
export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingSpinner size="md" />
  </div>
);

export default LoadingSpinner; 