import { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/useMobile';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
  threshold?: number;
}

export function PullToRefresh({ 
  children, 
  onRefresh, 
  disabled = false,
  threshold = 80 
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { hapticFeedback, isTouchDevice } = useMobile();

  const maxPull = threshold * 1.5;
  const canRefresh = pullDistance >= threshold && !isRefreshing;

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || !isTouchDevice || isRefreshing) return;
    
    // Only start if at top of scroll
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsDragging(true);
    }
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || disabled || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;

    if (deltaY > 0) {
      // Prevent default scroll behavior when pulling down
      e.preventDefault();
      
      // Apply resistance to pull distance
      const resistance = 0.5;
      const constrainedDelta = Math.min(deltaY * resistance, maxPull);
      setPullDistance(constrainedDelta);

      // Haptic feedback at threshold
      if (constrainedDelta >= threshold && pullDistance < threshold) {
        hapticFeedback.medium();
      }
    }
  };

  // Handle touch end
  const handleTouchEnd = async () => {
    if (!isDragging || disabled) return;

    setIsDragging(false);

    if (canRefresh) {
      setIsRefreshing(true);
      hapticFeedback.success();
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
        hapticFeedback.error();
      } finally {
        setIsRefreshing(false);
      }
    }

    // Reset pull distance with animation
    setPullDistance(0);
  };

  const getIconRotation = () => {
    if (isRefreshing) return 'animate-spin';
    if (canRefresh) return 'rotate-180';
    return '';
  };

  const getIconScale = () => {
    const scale = Math.min(pullDistance / threshold, 1);
    return `scale(${scale})`;
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 z-10",
          "bg-gradient-to-b from-background to-transparent"
        )}
        style={{
          height: `${Math.min(pullDistance, maxPull)}px`,
          transform: `translateY(-${maxPull - pullDistance}px)`,
        }}
      >
        <div
          className={cn(
            "flex flex-col items-center text-muted-foreground transition-all duration-200",
            pullDistance > 20 ? 'opacity-100' : 'opacity-0'
          )}
        >
          <RefreshCw
            className={cn(
              "w-6 h-6 mb-2 transition-all duration-200",
              getIconRotation()
            )}
            style={{ transform: getIconScale() }}
          />
          <span className="text-sm font-medium">
            {isRefreshing 
              ? 'Actualizando...' 
              : canRefresh 
                ? 'Suelta para actualizar'
                : 'Desliza para actualizar'
            }
          </span>
        </div>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "transition-transform duration-200",
          isDragging ? "duration-0" : ""
        )}
        style={{
          transform: `translateY(${Math.min(pullDistance, maxPull)}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}