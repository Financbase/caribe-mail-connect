import React, { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MobileGestureNavigationProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  className?: string;
  minDistance?: number;
  threshold?: number;
  disabled?: boolean;
}

interface TouchData {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startTime: number;
}

/**
 * Mobile gesture navigation component for Puerto Rico mail carrier system
 * Optimized for one-handed operation and Caribbean user patterns
 */
export function MobileGestureNavigation({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className,
  minDistance = 50,
  threshold = 100,
  disabled = false,
}: MobileGestureNavigationProps) {
  const touchRef = useRef<HTMLDivElement>(null);
  const [touchData, setTouchData] = useState<TouchData | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || e.touches.length > 1) return;

    const touch = e.touches[0];
    setTouchData({
      startX: touch.clientX,
      startY: touch.clientY,
      endX: touch.clientX,
      endY: touch.clientY,
      startTime: Date.now(),
    });
  }, [disabled]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || !touchData || e.touches.length > 1) return;

    const touch = e.touches[0];
    setTouchData(prev => prev ? {
      ...prev,
      endX: touch.clientX,
      endY: touch.clientY,
    } : null);

    // Provide visual feedback for swipe
    const deltaX = Math.abs(touch.clientX - touchData.startX);
    const deltaY = Math.abs(touch.clientY - touchData.startY);
    
    if (deltaX > minDistance || deltaY > minDistance) {
      setIsNavigating(true);
    }
  }, [disabled, touchData, minDistance]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (disabled || !touchData) return;

    const deltaX = touchData.endX - touchData.startX;
    const deltaY = touchData.endY - touchData.startY;
    const deltaTime = Date.now() - touchData.startTime;
    
    // Calculate gesture velocity for responsiveness
    const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime;
    
    // Determine swipe direction and trigger callbacks
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    // Only trigger if gesture meets minimum requirements
    if (absDeltaX > threshold || absDeltaY > threshold) {
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    }

    setTouchData(null);
    setIsNavigating(false);
  }, [disabled, touchData, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  // Haptic feedback for supported devices
  const triggerHaptic = useCallback(() => {
    if ('vibrate' in navigator && window.DeviceMotionEvent) {
      navigator.vibrate(10); // Subtle feedback
    }
  }, []);

  useEffect(() => {
    if (isNavigating) {
      triggerHaptic();
    }
  }, [isNavigating, triggerHaptic]);

  return (
    <div
      ref={touchRef}
      className={cn(
        'relative overflow-hidden',
        'touch-pan-y', // Allow vertical scrolling
        isNavigating && 'select-none', // Prevent text selection during gesture
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: disabled ? 'auto' : 'pan-y', // Prevent default gestures
      }}
    >
      {children}
      
      {/* Visual feedback overlay */}
      {isNavigating && (
        <div 
          className="absolute inset-0 bg-primary/5 pointer-events-none transition-opacity duration-150"
          style={{ backgroundColor: 'rgba(11, 83, 148, 0.05)' }}
        />
      )}
    </div>
  );
}

// Hook for managing gesture navigation state
export function useMobileGestures() {
  const [gestureState, setGestureState] = useState({
    isEnabled: true,
    currentGesture: null as string | null,
    gestureHistory: [] as string[],
  });

  const enableGestures = useCallback(() => {
    setGestureState(prev => ({ ...prev, isEnabled: true }));
  }, []);

  const disableGestures = useCallback(() => {
    setGestureState(prev => ({ ...prev, isEnabled: false }));
  }, []);

  const recordGesture = useCallback((gesture: string) => {
    setGestureState(prev => ({
      ...prev,
      currentGesture: gesture,
      gestureHistory: [...prev.gestureHistory.slice(-9), gesture], // Keep last 10
    }));
  }, []);

  return {
    gestureState,
    enableGestures,
    disableGestures,
    recordGesture,
  };
}

// Gesture navigation patterns for PRMCMS
export const GesturePatterns = {
  // Package management gestures
  SWIPE_LEFT_NEXT_PACKAGE: 'nextPackage',
  SWIPE_RIGHT_PREV_PACKAGE: 'prevPackage',
  SWIPE_UP_PACKAGE_DETAILS: 'packageDetails',
  SWIPE_DOWN_CLOSE_DETAILS: 'closeDetails',
  
  // Customer management gestures
  SWIPE_LEFT_NEXT_CUSTOMER: 'nextCustomer',
  SWIPE_RIGHT_PREV_CUSTOMER: 'prevCustomer',
  
  // Navigation gestures
  SWIPE_RIGHT_BACK: 'goBack',
  SWIPE_UP_MENU: 'openMenu',
  SWIPE_DOWN_REFRESH: 'refresh',
} as const;

export default MobileGestureNavigation;
