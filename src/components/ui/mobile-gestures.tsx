import { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SwipeDirection {
  x: number;
  y: number;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
}

interface SwipeGestureProps {
  onSwipe?: (direction: SwipeDirection) => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function SwipeGesture({
  onSwipe,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  children,
  className,
  disabled = false
}: SwipeGestureProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd(null);
  }, [disabled]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || !touchStart) return;
    
    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  }, [disabled, touchStart]);

  const handleTouchEnd = useCallback(() => {
    if (disabled || !touchStart || !touchEnd) return;

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < threshold) return;

    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
    let direction: SwipeDirection['direction'] = null;

    if (isHorizontal) {
      direction = deltaX > 0 ? 'left' : 'right';
    } else {
      direction = deltaY > 0 ? 'up' : 'down';
    }

    const swipeData: SwipeDirection = {
      x: deltaX,
      y: deltaY,
      direction,
      distance
    };

    // Call the appropriate handlers
    onSwipe?.(swipeData);
    
    switch (direction) {
      case 'left':
        onSwipeLeft?.();
        break;
      case 'right':
        onSwipeRight?.();
        break;
      case 'up':
        onSwipeUp?.();
        break;
      case 'down':
        onSwipeDown?.();
        break;
    }

    // Reset state
    setTouchStart(null);
    setTouchEnd(null);
  }, [disabled, touchStart, touchEnd, threshold, onSwipe, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return (
    <div
      ref={elementRef}
      className={cn(className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }} // Allow vertical scrolling but capture horizontal swipes
    >
      {children}
    </div>
  );
}

// Hook for handling swipe navigation between pages
export function useSwipeNavigation(
  pages: string[],
  currentPageIndex: number,
  onNavigate: (page: string) => void,
  options: {
    enableSwipe?: boolean;
    wrapAround?: boolean;
  } = {}
) {
  const { enableSwipe = true, wrapAround = false } = options;

  const handleSwipeLeft = useCallback(() => {
    if (!enableSwipe) return;
    
    let nextIndex = currentPageIndex + 1;
    if (nextIndex >= pages.length) {
      nextIndex = wrapAround ? 0 : pages.length - 1;
    }
    
    if (nextIndex !== currentPageIndex) {
      onNavigate(pages[nextIndex]);
    }
  }, [enableSwipe, currentPageIndex, pages, wrapAround, onNavigate]);

  const handleSwipeRight = useCallback(() => {
    if (!enableSwipe) return;
    
    let prevIndex = currentPageIndex - 1;
    if (prevIndex < 0) {
      prevIndex = wrapAround ? pages.length - 1 : 0;
    }
    
    if (prevIndex !== currentPageIndex) {
      onNavigate(pages[prevIndex]);
    }
  }, [enableSwipe, currentPageIndex, pages, wrapAround, onNavigate]);

  return {
    handleSwipeLeft,
    handleSwipeRight
  };
}

// Mobile-optimized card swipe component
interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: {
    icon: React.ReactNode;
    color: string;
    label: string;
  };
  rightAction?: {
    icon: React.ReactNode;
    color: string;
    label: string;
  };
  className?: string;
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  className
}: SwipeableCardProps) {
  const [isRevealing, setIsRevealing] = useState<'left' | 'right' | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSwipe = useCallback((direction: SwipeDirection) => {
    const { distance, direction: dir } = direction;
    
    if (distance > 100) {
      if (dir === 'left' && onSwipeLeft) {
        onSwipeLeft();
      } else if (dir === 'right' && onSwipeRight) {
        onSwipeRight();
      }
    }
    
    // Reset position
    setTranslateX(0);
    setIsRevealing(null);
  }, [onSwipeLeft, onSwipeRight]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!cardRef.current) return;
    
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const deltaX = touch.clientX - rect.left - rect.width / 2;
    
    // Limit the translation to prevent over-swiping
    const maxTranslate = 100;
    const clampedDelta = Math.max(-maxTranslate, Math.min(maxTranslate, deltaX));
    
    setTranslateX(clampedDelta);
    
    if (Math.abs(clampedDelta) > 30) {
      setIsRevealing(clampedDelta > 0 ? 'right' : 'left');
    } else {
      setIsRevealing(null);
    }
  }, []);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Left action background */}
      {leftAction && (
        <div 
          className={cn(
            "absolute inset-y-0 left-0 flex items-center justify-start pl-4 transition-opacity",
            leftAction.color,
            isRevealing === 'left' ? 'opacity-100' : 'opacity-0'
          )}
          style={{ width: Math.max(0, -translateX) }}
        >
          <div className="flex items-center gap-2 text-white">
            {leftAction.icon}
            <span className="text-sm font-medium">{leftAction.label}</span>
          </div>
        </div>
      )}
      
      {/* Right action background */}
      {rightAction && (
        <div 
          className={cn(
            "absolute inset-y-0 right-0 flex items-center justify-end pr-4 transition-opacity",
            rightAction.color,
            isRevealing === 'right' ? 'opacity-100' : 'opacity-0'
          )}
          style={{ width: Math.max(0, translateX) }}
        >
          <div className="flex items-center gap-2 text-white">
            <span className="text-sm font-medium">{rightAction.label}</span>
            {rightAction.icon}
          </div>
        </div>
      )}
      
      {/* Card content */}
      <SwipeGesture
        onSwipe={handleSwipe}
        className="relative z-10 transition-transform duration-200"
        style={{ transform: `translateX(${translateX}px)` }}
      >
        <div
          ref={cardRef}
          onTouchMove={handleTouchMove}
          className="bg-background"
        >
          {children}
        </div>
      </SwipeGesture>
    </div>
  );
}

// Long press gesture component
interface LongPressProps {
  onLongPress: () => void;
  onPress?: () => void;
  duration?: number;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function LongPress({
  onLongPress,
  onPress,
  duration = 500,
  children,
  className,
  disabled = false
}: LongPressProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  const handleStart = useCallback(() => {
    if (disabled) return;
    
    setIsPressed(true);
    timeoutRef.current = setTimeout(() => {
      onLongPress();
      setIsPressed(false);
    }, duration);
  }, [disabled, onLongPress, duration]);

  const handleEnd = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (isPressed && onPress) {
      onPress();
    }
    
    setIsPressed(false);
  }, [isPressed, onPress]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={cn(
        "select-none transition-opacity duration-150",
        isPressed && "opacity-70",
        className
      )}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onTouchCancel={handleEnd}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      {children}
    </div>
  );
}
