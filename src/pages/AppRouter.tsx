import { useState, useEffect, Suspense, lazy } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Auth from './Auth';
import ResetPassword from './auth/ResetPassword';
import UpdatePassword from './auth/UpdatePassword';
import PRMCMS from './Index';

export default function AppRouter() {
  const { isAuthenticated, loading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState('/');

  // Simple hash-based routing to avoid BrowserRouter conflicts
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash.replace('#', '') || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Set initial route

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Route logic
  if (!isAuthenticated) {
    if (currentRoute === '/auth/reset-password') {
      return <ResetPassword />;
    }
    if (currentRoute === '/auth/update-password') {
      return <UpdatePassword />;
    }
    return <Auth />;
  }

  // Authenticated user routes
  if (currentRoute === '/auth/update-password') {
    return <UpdatePassword />;
  }
  if (currentRoute === '/search/advanced') {
    const AdvancedSearch = lazy(() => import('./AdvancedSearch'));
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <AdvancedSearch />
      </Suspense>
    );
  }
  if (currentRoute === '/reports') {
    const Reports = lazy(() => import('./Reports'));
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Reports />
      </Suspense>
    );
  }
  if (currentRoute === '/qa') {
    const QA = lazy(() => import('./QA'));
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <QA />
      </Suspense>
    );
  }
  if (currentRoute === '/security') {
    const Security = lazy(() => import('./Security'));
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Security />
      </Suspense>
    );
  }

  return <PRMCMS />;
}