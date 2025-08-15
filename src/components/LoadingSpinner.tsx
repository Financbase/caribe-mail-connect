import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex items-center justify-center gap-2" role="status" aria-live="polite" aria-atomic="true">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} aria-hidden="true" />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
      {!text && <span className="sr-only">Loading…</span>}
    </div>
  );
}