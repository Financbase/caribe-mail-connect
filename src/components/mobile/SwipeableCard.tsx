import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/useMobile';

interface SwipeAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: 'primary' | 'destructive' | 'secondary';
  action: () => void;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  className?: string;
  disabled?: boolean;
}

export function SwipeableCard({ 
  children, 
  leftActions = [], 
  rightActions = [],
  className,
  disabled = false
}: SwipeableCardProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const { hapticFeedback, isTouchDevice } = useMobile();

  const maxSwipe = 120; // Maximum swipe distance
  const threshold = 60; // Threshold to show actions

  // Reset card position
  const resetPosition = () => {
    setTranslateX(0);
    setIsDragging(false);
  };

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || !isTouchDevice) return;
    
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || disabled) return;

    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;
    
    // Limit swipe distance
    const constrainedDelta = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
    setTranslateX(constrainedDelta);

    // Haptic feedback at threshold
    if (Math.abs(constrainedDelta) >= threshold && Math.abs(translateX) < threshold) {
      hapticFeedback.light();
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (!isDragging || disabled) return;

    // If swiped far enough, keep actions visible
    if (Math.abs(translateX) >= threshold) {
      setTranslateX(translateX > 0 ? maxSwipe : -maxSwipe);
      hapticFeedback.medium();
    } else {
      resetPosition();
    }
    
    setIsDragging(false);
  };

  // Close swipe when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        resetPosition();
      }
    };

    if (translateX !== 0) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [translateX]);

  const getActionColor = (color: SwipeAction['color']) => {
    switch (color) {
      case 'destructive':
        return 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/90';
      default:
        return 'bg-primary text-primary-foreground hover:bg-primary/90';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg" ref={cardRef}>
      {/* Left actions */}
      {leftActions.length > 0 && (
        <div className="absolute left-0 top-0 bottom-0 flex items-center z-10">
          {leftActions.map((action, index) => (
            <Button
              key={action.id}
              variant="ghost"
              size="sm"
              className={cn(
                "h-full rounded-none px-4 transition-all duration-200",
                getActionColor(action.color),
                translateX > threshold ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              )}
              onClick={() => {
                action.action();
                resetPosition();
                hapticFeedback.success();
              }}
              style={{
                transform: `translateX(${Math.max(0, translateX - 60)}px)`,
              }}
            >
              <div className="flex flex-col items-center">
                {action.icon}
                <span className="text-xs mt-1">{action.label}</span>
              </div>
            </Button>
          ))}
        </div>
      )}

      {/* Right actions */}
      {rightActions.length > 0 && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center z-10">
          {rightActions.map((action, index) => (
            <Button
              key={action.id}
              variant="ghost"
              size="sm"
              className={cn(
                "h-full rounded-none px-4 transition-all duration-200",
                getActionColor(action.color),
                translateX < -threshold ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              )}
              onClick={() => {
                action.action();
                resetPosition();
                hapticFeedback.success();
              }}
              style={{
                transform: `translateX(${Math.min(0, translateX + 60)}px)`,
              }}
            >
              <div className="flex flex-col items-center">
                {action.icon}
                <span className="text-xs mt-1">{action.label}</span>
              </div>
            </Button>
          ))}
        </div>
      )}

      {/* Main card content */}
      <Card
        className={cn(
          "transition-transform duration-200 ease-out touch-pan-y",
          isDragging ? "duration-0" : "",
          className
        )}
        style={{
          transform: `translateX(${translateX}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </Card>
    </div>
  );
}
