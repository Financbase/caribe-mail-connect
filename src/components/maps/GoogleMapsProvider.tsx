import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface GoogleMapsContextType {
  isLoaded: boolean;
  isError: boolean;
  error: string | null;
  google: typeof google | null;
  isConfigured: boolean;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  isError: false,
  error: null,
  google: null,
  isConfigured: false,
});

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    // Check if API key is properly configured
    const isConfigured = apiKey && apiKey !== 'your_google_maps_api_key_here';
    
    if (!isConfigured) {
      console.warn('Google Maps API key not configured. Maps will be disabled.');
      console.warn('Please set VITE_GOOGLE_MAPS_API_KEY in your .env file');
      setIsError(true);
      setError('Google Maps API key is not configured. Please check your environment variables.');
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
      setIsError(false);
      setError(null);
    };

    script.onerror = () => {
      setIsError(true);
      setError('Failed to load Google Maps API. Please check your internet connection and API key.');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts before loading
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const value: GoogleMapsContextType = {
    isLoaded,
    isError,
    error,
    google: isLoaded ? window.google : null,
    isConfigured: !isError && (import.meta.env.VITE_GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here'),
  };

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
} 