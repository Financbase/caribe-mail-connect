import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ResourceLoaderProps {
  children: React.ReactNode;
}

export function ResourceLoader({ children }: ResourceLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  const translations = {
    loading: isEnglish ? 'Loading resources...' : 'Cargando recursos...',
    preparing: isEnglish ? 'Preparing application...' : 'Preparando aplicación...',
    fonts: isEnglish ? 'Loading fonts...' : 'Cargando fuentes...',
    maps: isEnglish ? 'Loading maps...' : 'Cargando mapas...',
    components: isEnglish ? 'Loading components...' : 'Cargando componentes...',
    ready: isEnglish ? 'Ready!' : '¡Listo!',
  };

  useEffect(() => {
    const loadResources = async () => {
      try {
        // Load fonts
        setLoadingProgress(20);
        await loadFonts();
        
        // Load Google Maps
        setLoadingProgress(40);
        await loadGoogleMaps();
        
        // Load other critical resources
        setLoadingProgress(60);
        await loadCriticalResources();
        
        // Final preparation
        setLoadingProgress(80);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setLoadingProgress(100);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Resource loading error:', error);
        // Continue anyway to prevent blocking
        setIsLoading(false);
      }
    };

    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('Resource loading timeout, continuing anyway');
      setIsLoading(false);
    }, 5000);

    loadResources();

    return () => clearTimeout(timeout);
  }, []);

  const loadFonts = async () => {
    try {
      // Check if Inter font is already loaded
      if (document.fonts.check('12px Inter')) {
        return;
      }
      
      // Preload Inter font
      const font = new FontFace('Inter', 'url(https://fonts.gstatic.com/s/inter/v19/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2)');
      await font.load();
      document.fonts.add(font);
    } catch (error) {
      console.warn('Font loading failed, using fallback:', error);
    }
  };

  const loadGoogleMaps = async () => {
    // Google Maps is handled by GoogleMapsProvider
    return Promise.resolve();
  };

  const loadCriticalResources = async () => {
    // Load any other critical resources
    return Promise.resolve();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {translations.loading}
            </h2>
            <p className="text-gray-600">
              {loadingProgress < 30 && translations.fonts}
              {loadingProgress >= 30 && loadingProgress < 50 && translations.maps}
              {loadingProgress >= 50 && loadingProgress < 80 && translations.components}
              {loadingProgress >= 80 && translations.ready}
            </p>
          </div>
          
          <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-500">
            {loadingProgress}%
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 