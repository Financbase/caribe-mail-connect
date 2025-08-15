import React, { createContext, useContext, useRef, useEffect, useCallback } from 'react';

interface FocusManagerContextType {
  trapFocus: (element: HTMLElement) => () => void;
  restoreFocus: (element?: HTMLElement | null) => void;
  moveFocusToFirst: (container: HTMLElement) => boolean;
  moveFocusToLast: (container: HTMLElement) => boolean;
  moveFocusToNext: (current: HTMLElement) => boolean;
  moveFocusToPrevious: (current: HTMLElement) => boolean;
  announceFocusChange: (element: HTMLElement) => void;
  setFocusVisible: (visible: boolean) => void;
  getFocusableElements: (container: HTMLElement) => HTMLElement[];
}

const FocusManagerContext = createContext<FocusManagerContextType | null>(null);

/**
 * Enhanced Focus Management for Caribbean Mail System
 * Provides comprehensive keyboard navigation and accessibility features
 */
export function FocusManagerProvider({ children }: { children: React.ReactNode }) {
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const focusHistory = useRef<HTMLElement[]>([]);
  const isUserInteraction = useRef(false);

  // Track focus changes
  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (target && target !== lastFocusedElement.current) {
        focusHistory.current.push(target);
        // Keep history limited to last 10 elements
        if (focusHistory.current.length > 10) {
          focusHistory.current.shift();
        }
        lastFocusedElement.current = target;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      isUserInteraction.current = true;
      
      // Global keyboard shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '/':
            // Focus search
            event.preventDefault();
            focusSearchInput();
            break;
          case 'k':
            // Quick actions
            event.preventDefault();
            focusQuickActions();
            break;
        }
      }
      
      // Escape to close modals/dropdowns
      if (event.key === 'Escape') {
        handleEscapeKey();
      }
    };

    const handleMouseDown = () => {
      isUserInteraction.current = false;
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Get all focusable elements within a container
  const getFocusableElements = useCallback((container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([aria-disabled="true"])',
      '[role="tab"]:not([aria-disabled="true"])',
      '[role="menuitem"]:not([aria-disabled="true"])',
      '[role="option"]:not([aria-disabled="true"])',
      '[contenteditable="true"]'
    ].join(', ');

    const elements = Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
    
    return elements.filter(element => {
      // Check if element is visible and not disabled
      const style = window.getComputedStyle(element);
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        !element.hasAttribute('disabled') &&
        element.getAttribute('aria-disabled') !== 'true' &&
        element.tabIndex >= 0
      );
    });
  }, []);

  // Focus trap for modals and overlays
  const trapFocus = useCallback((element: HTMLElement) => {
    const focusableElements = getFocusableElements(element);
    
    if (focusableElements.length === 0) return () => {};

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Store the element that was focused before the trap
    const previouslyFocused = document.activeElement as HTMLElement;

    // Focus the first element
    firstElement.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // Shift + Tab: move to previous element
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: move to next element
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    // Return cleanup function
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [getFocusableElements]);

  // Restore focus to previous element or specified element
  const restoreFocus = useCallback((element?: HTMLElement | null) => {
    if (element && document.contains(element)) {
      element.focus();
    } else if (lastFocusedElement.current && document.contains(lastFocusedElement.current)) {
      lastFocusedElement.current.focus();
    } else if (focusHistory.current.length > 0) {
      // Try to restore from history
      for (let i = focusHistory.current.length - 1; i >= 0; i--) {
        const historicalElement = focusHistory.current[i];
        if (document.contains(historicalElement)) {
          historicalElement.focus();
          break;
        }
      }
    }
  }, []);

  // Move focus to first focusable element
  const moveFocusToFirst = useCallback((container: HTMLElement): boolean => {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
      return true;
    }
    return false;
  }, [getFocusableElements]);

  // Move focus to last focusable element
  const moveFocusToLast = useCallback((container: HTMLElement): boolean => {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
      return true;
    }
    return false;
  }, [getFocusableElements]);

  // Move focus to next focusable element
  const moveFocusToNext = useCallback((current: HTMLElement): boolean => {
    const container = current.closest('[role="application"], [role="main"], body') as HTMLElement;
    if (!container) return false;

    const focusableElements = getFocusableElements(container);
    const currentIndex = focusableElements.indexOf(current);
    
    if (currentIndex >= 0 && currentIndex < focusableElements.length - 1) {
      focusableElements[currentIndex + 1].focus();
      return true;
    } else if (currentIndex === focusableElements.length - 1) {
      // Wrap to first element
      focusableElements[0].focus();
      return true;
    }
    
    return false;
  }, [getFocusableElements]);

  // Move focus to previous focusable element
  const moveFocusToPrevious = useCallback((current: HTMLElement): boolean => {
    const container = current.closest('[role="application"], [role="main"], body') as HTMLElement;
    if (!container) return false;

    const focusableElements = getFocusableElements(container);
    const currentIndex = focusableElements.indexOf(current);
    
    if (currentIndex > 0) {
      focusableElements[currentIndex - 1].focus();
      return true;
    } else if (currentIndex === 0) {
      // Wrap to last element
      focusableElements[focusableElements.length - 1].focus();
      return true;
    }
    
    return false;
  }, [getFocusableElements]);

  // Announce focus changes to screen readers
  const announceFocusChange = useCallback((element: HTMLElement) => {
    const label = element.getAttribute('aria-label') || 
                  element.getAttribute('aria-labelledby') ||
                  element.textContent ||
                  element.getAttribute('title') ||
                  '';
    
    if (label && isUserInteraction.current) {
      // Create a temporary announcement
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = `Focused: ${label.trim()}`;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, []);

  // Set focus visible state
  const setFocusVisible = useCallback((visible: boolean) => {
    if (visible) {
      document.body.classList.add('focus-visible');
    } else {
      document.body.classList.remove('focus-visible');
    }
  }, []);

  // Helper functions for common focus targets
  const focusSearchInput = () => {
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"], input[placeholder*="buscar"]') as HTMLElement;
    if (searchInput) {
      searchInput.focus();
    }
  };

  const focusQuickActions = () => {
    const quickActions = document.querySelector('.quick-actions, .fab, [data-testid="quick-actions"]') as HTMLElement;
    if (quickActions) {
      quickActions.focus();
    }
  };

  const handleEscapeKey = () => {
    // Close any open modals, dropdowns, or overlays
    const modal = document.querySelector('[role="dialog"][aria-modal="true"]') as HTMLElement;
    const dropdown = document.querySelector('[aria-expanded="true"]') as HTMLElement;
    
    if (modal) {
      // Find and trigger close button
      const closeButton = modal.querySelector('[aria-label*="close"], [aria-label*="cerrar"], .modal-close') as HTMLElement;
      if (closeButton) {
        closeButton.click();
      }
    } else if (dropdown) {
      // Close dropdown
      dropdown.setAttribute('aria-expanded', 'false');
      dropdown.focus();
    }
  };

  const value: FocusManagerContextType = {
    trapFocus,
    restoreFocus,
    moveFocusToFirst,
    moveFocusToLast,
    moveFocusToNext,
    moveFocusToPrevious,
    announceFocusChange,
    setFocusVisible,
    getFocusableElements
  };

  return (
    <FocusManagerContext.Provider value={value}>
      {children}
    </FocusManagerContext.Provider>
  );
}

export function useFocusManager() {
  const context = useContext(FocusManagerContext);
  if (!context) {
    throw new Error('useFocusManager must be used within a FocusManagerProvider');
  }
  return context;
}

/**
 * Hook for managing focus within a specific component
 */
export function useComponentFocus(ref: React.RefObject<HTMLElement>) {
  const { getFocusableElements, trapFocus } = useFocusManager();

  const focusFirst = useCallback(() => {
    if (ref.current) {
      const focusableElements = getFocusableElements(ref.current);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
        return true;
      }
    }
    return false;
  }, [ref, getFocusableElements]);

  const focusLast = useCallback(() => {
    if (ref.current) {
      const focusableElements = getFocusableElements(ref.current);
      if (focusableElements.length > 0) {
        focusableElements[focusableElements.length - 1].focus();
        return true;
      }
    }
    return false;
  }, [ref, getFocusableElements]);

  const containsFocus = useCallback(() => {
    if (ref.current) {
      return ref.current.contains(document.activeElement);
    }
    return false;
  }, [ref]);

  const trapFocusWithin = useCallback(() => {
    if (ref.current) {
      return trapFocus(ref.current);
    }
    return () => {};
  }, [ref, trapFocus]);

  return {
    focusFirst,
    focusLast,
    containsFocus,
    trapFocusWithin
  };
}

/**
 * Hook for roving tabindex (for lists, menus, etc.)
 */
export function useRovingTabindex(items: React.RefObject<HTMLElement>[], orientation: 'horizontal' | 'vertical' = 'vertical') {
  const [focusedIndex, setFocusedIndex] = React.useState(0);

  const handleKeyDown = useCallback((event: KeyboardEvent, index: number) => {
    let nextIndex = index;

    switch (event.key) {
      case 'ArrowDown':
        if (orientation === 'vertical') {
          event.preventDefault();
          nextIndex = index === items.length - 1 ? 0 : index + 1;
        }
        break;
      case 'ArrowUp':
        if (orientation === 'vertical') {
          event.preventDefault();
          nextIndex = index === 0 ? items.length - 1 : index - 1;
        }
        break;
      case 'ArrowRight':
        if (orientation === 'horizontal') {
          event.preventDefault();
          nextIndex = index === items.length - 1 ? 0 : index + 1;
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal') {
          event.preventDefault();
          nextIndex = index === 0 ? items.length - 1 : index - 1;
        }
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = items.length - 1;
        break;
    }

    if (nextIndex !== index) {
      setFocusedIndex(nextIndex);
      items[nextIndex]?.current?.focus();
    }
  }, [items, orientation]);

  const getTabIndex = useCallback((index: number) => {
    return index === focusedIndex ? 0 : -1;
  }, [focusedIndex]);

  const setFocus = useCallback((index: number) => {
    if (index >= 0 && index < items.length) {
      setFocusedIndex(index);
      items[index]?.current?.focus();
    }
  }, [items]);

  return {
    handleKeyDown,
    getTabIndex,
    setFocus,
    focusedIndex
  };
}

/**
 * Caribbean-specific keyboard shortcuts
 */
export function useCaribbeanKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not in form inputs
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return;
      }

      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'n':
            // New package
            event.preventDefault();
            // Trigger new package action
            break;
          case 'f':
            // Focus search
            event.preventDefault();
            const searchInput = document.querySelector('input[type="search"]') as HTMLElement;
            searchInput?.focus();
            break;
          case 's':
            // Scan package
            event.preventDefault();
            // Trigger barcode scanner
            break;
          case 'd':
            // Dashboard
            event.preventDefault();
            // Navigate to dashboard
            break;
        }
      }

      // Quick action keys (without modifiers)
      switch (event.key) {
        case '1':
        case '2':
        case '3':
        case '4':
          if (!event.ctrlKey && !event.metaKey && !event.altKey) {
            const quickAction = document.querySelector(`[data-quick-action="${event.key}"]`) as HTMLElement;
            if (quickAction && quickAction !== event.target) {
              event.preventDefault();
              quickAction.click();
            }
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}

export default FocusManagerProvider;
