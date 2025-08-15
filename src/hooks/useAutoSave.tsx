import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash-es';

interface AutoSaveOptions {
  key: string;
  debounceMs?: number;
  onSave?: (data: any) => Promise<void>;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
  enabled?: boolean;
  clearOnSubmit?: boolean;
}

interface AutoSaveState {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  error: Error | null;
}

/**
 * Hook for automatic form saving with offline support
 * Optimized for Puerto Rico's intermittent connectivity
 */
export function useAutoSave<T extends Record<string, any>>(
  data: T,
  options: AutoSaveOptions
) {
  const {
    key,
    debounceMs = 2000,
    onSave,
    onError,
    onSuccess,
    enabled = true,
    clearOnSubmit = true,
  } = options;

  const [state, setState] = useState<AutoSaveState>({
    isSaving: false,
    lastSaved: null,
    hasUnsavedChanges: false,
    error: null,
  });

  const previousDataRef = useRef<T>();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Create debounced save function
  const debouncedSave = useCallback(
    debounce(async (dataToSave: T) => {
      if (!enabled || !onSave) return;

      setState(prev => ({ ...prev, isSaving: true, error: null }));

      try {
        await onSave(dataToSave);
        setState(prev => ({
          ...prev,
          isSaving: false,
          lastSaved: new Date(),
          hasUnsavedChanges: false,
          error: null,
        }));
        onSuccess?.();
      } catch (error) {
        const saveError = error instanceof Error ? error : new Error('Save failed');
        setState(prev => ({
          ...prev,
          isSaving: false,
          error: saveError,
        }));
        onError?.(saveError);
      }
    }, debounceMs),
    [enabled, onSave, onSuccess, onError, debounceMs]
  );

  // Save to localStorage as backup
  const saveToLocalStorage = useCallback((dataToSave: T) => {
    try {
      const storageKey = `autosave_${key}`;
      const saveData = {
        data: dataToSave,
        timestamp: new Date().toISOString(),
        version: '1.0',
      };
      localStorage.setItem(storageKey, JSON.stringify(saveData));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }, [key]);

  // Load from localStorage
  const loadFromLocalStorage = useCallback((): T | null => {
    try {
      const storageKey = `autosave_${key}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { data, timestamp } = JSON.parse(saved);
        // Only return data if it's recent (less than 24 hours old)
        const saveTime = new Date(timestamp);
        const hoursSinceLastSave = (Date.now() - saveTime.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastSave < 24) {
          return data;
        }
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
    }
    return null;
  }, [key]);

  // Clear localStorage
  const clearLocalStorage = useCallback(() => {
    try {
      const storageKey = `autosave_${key}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }, [key]);

  // Monitor data changes
  useEffect(() => {
    if (!enabled) return;

    const currentData = JSON.stringify(data);
    const previousData = JSON.stringify(previousDataRef.current);

    if (previousDataRef.current && currentData !== previousData) {
      setState(prev => ({ ...prev, hasUnsavedChanges: true }));
      
      // Save to localStorage immediately for offline backup
      saveToLocalStorage(data);
      
      // Trigger debounced remote save
      debouncedSave(data);
    }

    previousDataRef.current = data;
  }, [data, enabled, debouncedSave, saveToLocalStorage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  // Manual save function
  const saveNow = useCallback(async () => {
    if (!enabled || !onSave) return;

    debouncedSave.cancel(); // Cancel any pending debounced save
    
    setState(prev => ({ ...prev, isSaving: true, error: null }));

    try {
      await onSave(data);
      setState(prev => ({
        ...prev,
        isSaving: false,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
        error: null,
      }));
      onSuccess?.();
    } catch (error) {
      const saveError = error instanceof Error ? error : new Error('Save failed');
      setState(prev => ({
        ...prev,
        isSaving: false,
        error: saveError,
      }));
      onError?.(saveError);
      throw saveError;
    }
  }, [enabled, onSave, data, onSuccess, onError, debouncedSave]);

  // Submit function that clears autosave
  const submitForm = useCallback(async () => {
    await saveNow();
    if (clearOnSubmit) {
      clearLocalStorage();
    }
  }, [saveNow, clearOnSubmit, clearLocalStorage]);

  return {
    ...state,
    saveNow,
    submitForm,
    loadFromLocalStorage,
    clearLocalStorage,
  };
}

// Component for auto-save status indicator
export function AutoSaveIndicator({ 
  state, 
  className 
}: { 
  state: AutoSaveState; 
  className?: string;
}) {
  const getStatusText = () => {
    if (state.isSaving) return 'Guardando...';
    if (state.error) return 'Error al guardar';
    if (state.hasUnsavedChanges) return 'Cambios sin guardar';
    if (state.lastSaved) return `Guardado ${formatRelativeTime(state.lastSaved)}`;
    return 'Sin cambios';
  };

  const getStatusColor = () => {
    if (state.isSaving) return 'text-blue-600';
    if (state.error) return 'text-red-600';
    if (state.hasUnsavedChanges) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${getStatusColor()} ${className}`}>
      {state.isSaving && (
        <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
      )}
      <span>{getStatusText()}</span>
    </div>
  );
}

// Helper function for relative time formatting
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 1) return 'hace un momento';
  if (diffMinutes < 60) return `hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
}

// Hook for detecting unsaved changes and warning before page unload
export function useUnsavedChangesWarning(hasUnsavedChanges: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = 'Tienes cambios sin guardar. ¿Seguro que quieres salir?';
        return event.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);
}

export default useAutoSave;
