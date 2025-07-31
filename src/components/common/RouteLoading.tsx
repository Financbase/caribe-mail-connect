import { Loader2, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RouteLoading() {
  const { language } = useLanguage();
  const [showTimeout, setShowTimeout] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Show timeout message after 10 seconds
    const timeout = setTimeout(() => {
      setShowTimeout(true);
    }, 10000);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 500);

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setShowTimeout(false);
    setLoadingProgress(0);
    
    // Force page reload after 3 retries
    if (retryCount >= 2) {
      window.location.reload();
    }
  };

  const getLoadingText = () => {
    if (language === 'es') {
      return {
        loading: 'Cargando PRMCMS...',
        subtitle: 'Por favor espere mientras preparamos su panel de control',
        timeout: 'La carga está tomando más tiempo del esperado',
        timeoutSubtitle: 'Esto puede deberse a una conexión lenta o alta carga del servidor.',
        tryAgain: 'Intentar de nuevo',
        reloadPage: 'Recargar página',
        offline: 'Sin conexión a internet',
        online: 'Conexión restaurada'
      };
    }
    return {
      loading: 'Loading PRMCMS...',
      subtitle: 'Please wait while we prepare your dashboard',
      timeout: 'Loading is taking longer than expected',
      timeoutSubtitle: 'This might be due to a slow connection or high server load.',
      tryAgain: 'Try Again',
      reloadPage: 'Reload Page',
      offline: 'No internet connection',
      online: 'Connection restored'
    };
  };

  const text = getLoadingText();

  // Calculate progress width as a CSS custom property
  const progressWidth = Math.min(loadingProgress, 90);

  if (showTimeout) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 p-6 bg-background border rounded-lg shadow-sm max-w-md w-full">
          <AlertCircle className="h-12 w-12 text-orange-500" />
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">{text.timeout}</h3>
            <p className="text-muted-foreground mb-4">
              {text.timeoutSubtitle}
            </p>
            {!isOnline && (
              <div className="flex items-center gap-2 justify-center mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">{text.offline}</span>
              </div>
            )}
            <button
              onClick={handleRetry}
              disabled={!isOnline}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              aria-label={retryCount >= 2 ? text.reloadPage : text.tryAgain}
            >
              <RefreshCw className="h-4 w-4" />
              {retryCount >= 2 ? text.reloadPage : text.tryAgain}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
        </div>
        
        <div className="text-center">
          <p className="text-muted-foreground font-medium text-lg">{text.loading}</p>
          <p className="text-sm text-muted-foreground mt-1">{text.subtitle}</p>
        </div>

        {/* Connection status */}
        {!isOnline && (
          <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <WifiOff className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-700">{text.offline}</span>
          </div>
        )}

        {/* Progress indicator */}
        <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out progress-bar"
            style={{ '--progress-width': `${progressWidth}%` } as React.CSSProperties}
          ></div>
        </div>
        
        {/* Progress percentage */}
        <p className="text-xs text-muted-foreground">
          {Math.round(loadingProgress)}%
        </p>
      </div>
    </div>
  );
}
