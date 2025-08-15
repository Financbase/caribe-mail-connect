import { useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  className?: string;
  disabled?: boolean;
}

export function PullToRefresh({ 
  onRefresh, 
  children, 
  threshold = 80, 
  className,
  disabled = false 
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const [canPull, setCanPull] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    
    const touch = e.touches[0];
    setStartY(touch.clientY);
    
    // Only allow pull-to-refresh at the top of the scroll container
    const scrollElement = e.currentTarget as HTMLElement;
    setCanPull(scrollElement.scrollTop === 0);
  }, [disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || isRefreshing || !canPull) return;

    const touch = e.touches[0];
    const currentY = touch.clientY;
    const distance = Math.max(0, currentY - startY);
    
    if (distance > 0) {
      // Prevent default scrolling when pulling down
      e.preventDefault();
      // Apply resistance - slower movement as distance increases
      const resistance = Math.min(distance * 0.6, threshold * 1.5);
      setPullDistance(resistance);
    }
  }, [disabled, isRefreshing, canPull, startY, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (disabled || isRefreshing || !canPull) return;

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull to refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
    setCanPull(false);
  }, [disabled, isRefreshing, canPull, pullDistance, threshold, onRefresh]);

  const refreshIndicatorOpacity = Math.min(pullDistance / threshold, 1);
  const shouldShowIndicator = pullDistance > 20 || isRefreshing;

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ transform: `translateY(${Math.min(pullDistance * 0.3, 40)}px)` }}
    >
      {/* Pull to refresh indicator */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 flex items-center justify-center py-4 transition-opacity duration-200",
          shouldShowIndicator ? "opacity-100" : "opacity-0"
        )}
        style={{
          transform: `translateY(${shouldShowIndicator ? 0 : -100}%)`,
          opacity: refreshIndicatorOpacity
        }}
        aria-live="polite"
        aria-label={isRefreshing ? "Refreshing content" : "Pull down to refresh"}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw 
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isRefreshing ? "animate-spin" : "",
              pullDistance >= threshold ? "rotate-180" : ""
            )} 
          />
          <span className="text-sm font-medium">
            {isRefreshing 
              ? "Refreshing..." 
              : pullDistance >= threshold 
                ? "Release to refresh" 
                : "Pull to refresh"
            }
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-full">
        {children}
      </div>
    </div>
  );
}

// Mobile-specific hook for better touch detection
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh, isRefreshing]);

  return { refresh, isRefreshing };
}
