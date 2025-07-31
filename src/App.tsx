import React, { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { EmergencyProvider } from './contexts/EmergencyContext';
import AppRouter from './pages/AppRouter';
import { ErrorBoundary } from './utils/errorMonitoring';
import { ErrorMonitor } from './utils/errorMonitoring';
import { PerformanceMonitor, preloadCriticalResources } from './utils/performance';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize error monitoring
    ErrorMonitor.getInstance().initialize();
    
    // Initialize performance monitoring
    const performanceMonitor = new PerformanceMonitor();
    performanceMonitor.startMonitoring();
    
    // Preload critical resources
    preloadCriticalResources();
    
    // Log performance metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        performanceMonitor.logMetrics();
      }, 1000);
    });
    
    // Cleanup on unmount
    return () => {
      // Any cleanup needed
    };
  }, []);

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <EmergencyProvider>
            <AppRouter />
          </EmergencyProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
