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
  if (currentRoute === '/performance') {
    const PerformancePage = lazy(() => import('./Performance'));
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <PerformancePage />
      </Suspense>
    );
  }
  if (currentRoute === '/analytics') {
    const Analytics = lazy(() => import('./Analytics'));
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Analytics onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/customers') {
    const Customers = lazy(() => import('./Customers'));
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Customers onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/mailboxes') {
    const Mailboxes = lazy(() => import('./Mailboxes'));
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Mailboxes onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/integrations') {
    const Integrations = lazy(() => import('./Integrations'));
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Integrations />
      </Suspense>
    );
  }
  if (currentRoute === '/billing') {
    const Billing = lazy(() => import('./Billing'));
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Billing onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/admin') {
    const Admin = lazy(() => import('./Admin'));
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Admin onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/inventory') {
    const Inventory = lazy(() => import('./Inventory'));
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Inventory onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/documents') {
    const Documents = lazy(() => import('./Documents'));
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Documents onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/virtual-mail') {
    const VirtualMailComponent = lazy(() => import('./VirtualMail').then(module => ({ default: module.VirtualMail })));
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <VirtualMailComponent />
      </Suspense>
    );
  }
  if (currentRoute === '/notifications') {
    const Notifications = lazy(() => import('./Notifications'));
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Notifications onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/routes') {
    const Routes = lazy(() => import('./Routes'));
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Routes onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/intake') {
    const PackageIntake = lazy(() => import('./PackageIntake'));
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <PackageIntake onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/act60-dashboard') {
    const Act60Dashboard = lazy(() => import('./Act60Dashboard'));
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Act60Dashboard onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/driver-route') {
    const DriverRoute = lazy(() => import('./DriverRoute'));
    return (
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <DriverRoute onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }

  return <PRMCMS />;
}