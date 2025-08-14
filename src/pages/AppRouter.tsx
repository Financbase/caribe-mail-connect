import { useState, useEffect, Suspense, lazy } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RouteSkeleton } from '@/components/loading/route-skeleton';
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
    return <RouteSkeleton />
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
      <Suspense fallback={<RouteSkeleton />}>
        <AdvancedSearch />
      </Suspense>
    );
  }
  if (currentRoute === '/reports') {
    const Reports = lazy(() => import('./Reports'));
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <Reports />
      </Suspense>
    );
  }
  if (currentRoute === '/qa') {
    const QA = lazy(() => import('./QA'));
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <QA />
      </Suspense>
    );
  }
  if (currentRoute === '/security') {
    const Security = lazy(() => import('./Security'));
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <Security />
      </Suspense>
    );
  }
  if (currentRoute === '/performance') {
    const PerformancePage = lazy(() => import('./Performance'));
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <PerformancePage />
      </Suspense>
    );
  }
  if (currentRoute === '/analytics') {
    const Analytics = lazy(() => import('./Analytics'));
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <Analytics onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/customers') {
    const Customers = lazy(() => import('./Customers'));
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <Customers onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/mailboxes') {
    const Mailboxes = lazy(() => import('./Mailboxes'));
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <Mailboxes onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/integrations') {
    const Integrations = lazy(() => import('./Integrations'));
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <Integrations />
      </Suspense>
    );
  }
  if (currentRoute === '/billing') {
    const Billing = lazy(() => import('./Billing'));
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <Billing onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/admin') {
    const Admin = lazy(() => import('./Admin'));
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <Admin onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/inventory') {
    const Inventory = lazy(() => import('./Inventory'));
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <Inventory onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/documents') {
    const Documents = lazy(() => import('./Documents'));
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <Documents onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/virtual-mail') {
    const VirtualMailComponent = lazy(() => import('./VirtualMail').then(module => ({ default: module.VirtualMail })));
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <VirtualMailComponent />
      </Suspense>
    );
  }
  if (currentRoute === '/notifications') {
    const Notifications = lazy(() => import('./Notifications'));
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <Notifications onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/routes') {
    const Routes = lazy(() => import('./Routes'));
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <Routes onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/intake') {
    const PackageIntake = lazy(() => import('./PackageIntake'));
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <PackageIntake onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/act60-dashboard') {
    const Act60Dashboard = lazy(() => import('./Act60Dashboard'));
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <Act60Dashboard onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }
  if (currentRoute === '/driver-route') {
    const DriverRoute = lazy(() => import('./DriverRoute'));
    return (
      <Suspense fallback={<RouteSkeleton />}>
        <DriverRoute onNavigate={(page: string) => window.location.hash = `#/${page}`} />
      </Suspense>
    );
  }

  return <PRMCMS />;
}