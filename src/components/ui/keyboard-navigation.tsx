import { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface FocusableElement extends HTMLElement {
  focus(): void;
  tabIndex?: number;
}

interface KeyboardNavigationProps {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
  onEscape?: () => void;
  trapFocus?: boolean;
  autoFocus?: boolean;
}

export function KeyboardNavigation({ 
  children, 
  className,
  'aria-label': ariaLabel,
  onEscape,
  trapFocus = false,
  autoFocus = false
}: KeyboardNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<FocusableElement | null>(null);
  const lastFocusableRef = useRef<FocusableElement | null>(null);

  const getFocusableElements = useCallback((): FocusableElement[] => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])',
      '[role="menuitem"]:not([disabled])',
      '[role="option"]:not([disabled])'
    ].join(', ');

    return Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as FocusableElement[];
  }, []);

  const updateFocusableRefs = useCallback(() => {
    const focusableElements = getFocusableElements();
    firstFocusableRef.current = focusableElements[0] || null;
    lastFocusableRef.current = focusableElements[focusableElements.length - 1] || null;
  }, [getFocusableElements]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        if (onEscape) {
          e.preventDefault();
          onEscape();
        }
        break;
      
      case 'Tab':
        if (trapFocus && firstFocusableRef.current && lastFocusableRef.current) {
          if (e.shiftKey) {
            // Shift + Tab - going backwards
            if (document.activeElement === firstFocusableRef.current) {
              e.preventDefault();
              lastFocusableRef.current.focus();
            }
          } else {
            // Tab - going forwards
            if (document.activeElement === lastFocusableRef.current) {
              e.preventDefault();
              firstFocusableRef.current.focus();
            }
          }
        }
        break;
    }
  }, [onEscape, trapFocus]);

  useEffect(() => {
    updateFocusableRefs();
    
    if (autoFocus && firstFocusableRef.current) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);
    }
  }, [autoFocus, updateFocusableRefs]);

  useEffect(() => {
    if (trapFocus || onEscape) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, trapFocus, onEscape]);

  // Update focusable refs when children change
  useEffect(() => {
    const observer = new MutationObserver(updateFocusableRefs);
    
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled', 'tabindex', 'aria-hidden']
      });
    }

    return () => observer.disconnect();
  }, [updateFocusableRefs]);

  return (
    <div
      ref={containerRef}
      className={cn(className)}
      role="region"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}

// Skip links component for main content navigation
export function SkipLinks() {
  const skipLinkClass = cn(
    "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4",
    "bg-primary text-primary-foreground px-4 py-2 rounded-md z-50",
    "transition-all duration-200"
  );

  return (
    <div className="skip-links">
      <a href="#main-content" className={skipLinkClass}>
        Skip to main content
      </a>
      <a href="#main-navigation" className={skipLinkClass}>
        Skip to navigation
      </a>
      <a href="#search" className={skipLinkClass}>
        Skip to search
      </a>
    </div>
  );
}

// Hook for managing focus within lists
export function useListNavigation<T>(
  items: T[],
  onSelect: (item: T, index: number) => void,
  options: {
    loop?: boolean;
    vertical?: boolean;
    horizontal?: boolean;
  } = {}
) {
  const { loop = true, vertical = true, horizontal = false } = options;
  const activeIndexRef = useRef<number>(-1);
  const listRef = useRef<HTMLElement>(null);

  const setActiveIndex = useCallback((index: number) => {
    if (items.length === 0) return;
    
    let newIndex = index;
    if (loop) {
      newIndex = ((index % items.length) + items.length) % items.length;
    } else {
      newIndex = Math.max(0, Math.min(index, items.length - 1));
    }
    
    activeIndexRef.current = newIndex;
    
    // Focus the element at the new index
    if (listRef.current) {
      const focusableElements = listRef.current.querySelectorAll(
        '[role="option"], [role="menuitem"], button, a'
      );
      const targetElement = focusableElements[newIndex] as HTMLElement;
      if (targetElement) {
        targetElement.focus();
      }
    }
  }, [items.length, loop]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const currentIndex = activeIndexRef.current;
    
    switch (e.key) {
      case 'ArrowDown':
        if (vertical) {
          e.preventDefault();
          setActiveIndex(currentIndex + 1);
        }
        break;
      
      case 'ArrowUp':
        if (vertical) {
          e.preventDefault();
          setActiveIndex(currentIndex - 1);
        }
        break;
      
      case 'ArrowLeft':
        if (horizontal) {
          e.preventDefault();
          setActiveIndex(currentIndex - 1);
        }
        break;
      
      case 'ArrowRight':
        if (horizontal) {
          e.preventDefault();
          setActiveIndex(currentIndex + 1);
        }
        break;
      
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      
      case 'End':
        e.preventDefault();
        setActiveIndex(items.length - 1);
        break;
      
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (currentIndex >= 0 && currentIndex < items.length) {
          onSelect(items[currentIndex], currentIndex);
        }
        break;
    }
  }, [items, onSelect, setActiveIndex, vertical, horizontal]);

  return {
    listRef,
    activeIndex: activeIndexRef.current,
    setActiveIndex,
    handleKeyDown
  };
}

// Focus management utilities
export const focusUtils = {
  // Set focus with optional delay
  setFocus: (element: HTMLElement | null, delay = 0) => {
    if (!element) return;
    
    if (delay > 0) {
      setTimeout(() => element.focus(), delay);
    } else {
      element.focus();
    }
  },

  // Find the first focusable element in a container
  findFirstFocusable: (container: HTMLElement): HTMLElement | null => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    return container.querySelector(focusableSelectors) as HTMLElement | null;
  },

  // Save and restore focus
  createFocusManager: () => {
    let previousFocus: HTMLElement | null = null;

    return {
      save: () => {
        previousFocus = document.activeElement as HTMLElement;
      },
      restore: () => {
        if (previousFocus && typeof previousFocus.focus === 'function') {
          previousFocus.focus();
        }
      }
    };
  }
};
