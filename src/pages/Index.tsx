import { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseAvailable } from '@/integrations/supabase/client';
import AuthSelection from './auth/AuthSelection';
import StaffAuth from './auth/StaffAuth';
import CustomerAuth from './auth/CustomerAuth';
import RouteLoading from '@/components/common/RouteLoading';

// Lazy load components for better performance
const Dashboard = lazy(() => import('./Dashboard'));
const PackageIntake = lazy(() => import('./PackageIntake'));
const Customers = lazy(() => import('./Customers'));
const Notifications = lazy(() => import('./Notifications'));
const NotificationSettings = lazy(() => import('./NotificationSettings'));
const Mailboxes = lazy(() => import('./Mailboxes'));
const Analytics = lazy(() => import('./Analytics'));
const Routes = lazy(() => import('./Routes'));
const DriverRoute = lazy(() => import('./DriverRoute'));
const Act60Dashboard = lazy(() => import('./Act60Dashboard'));
const LocationManagement = lazy(() => import('./LocationManagement'));
const ProfileSettings = lazy(() => import('./profile/Settings'));
const Billing = lazy(() => import('./Billing'));
const Admin = lazy(() => import('./Admin'));
const Reports = lazy(() => import('./Reports'));
const CustomerPortal = lazy(() => import('./CustomerPortal'));
const Integrations = lazy(() => import('./Integrations'));
const Inventory = lazy(() => import('./Inventory'));
const Documents = lazy(() => import('./Documents'));
const VirtualMail = lazy(() => import('./VirtualMail'));
const Communications = lazy(() => import('./Communications'));
const Marketplace = lazy(() => import('./Marketplace'));
const Devices = lazy(() => import('./Devices'));
const MainLayout = lazy(() => import('@/components/layout/MainLayout').then(module => ({ default: module.MainLayout })));
const UserFeedbackWidget = lazy(() => import('@/components/qa/UserFeedbackSystem').then(module => ({ default: module.UserFeedbackWidget })));

// Main application component with navigation logic
const PRMCMS = () => {
  const { user, session, loading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('auth-selection');
  const [isInitialized, setIsInitialized] = useState(false);

  // PWA Service Worker Registration (basic setup)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  // Set appropriate initial page based on auth state with optimized timeout
  useEffect(() => {
    const initializeApp = () => {
      if (user) {
        // User is logged in, show main dashboard
        setCurrentPage('dashboard');
      } else if (!loading) {
        // User is not logged in and loading is complete, show auth selection
        setCurrentPage('auth-selection');
      }
      setIsInitialized(true);
    };

    // Add timeout to prevent infinite loading - reduced to 3 seconds
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout, proceeding anyway');
        setCurrentPage('auth-selection');
        setIsInitialized(true);
      }
    }, 3000); // Reduced to 3 seconds for faster loading

    // Initialize immediately if not loading
    if (!loading) {
      initializeApp();
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [user, loading]);

  const handleNavigation = useCallback((page: string) => {
    setCurrentPage(page);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    setCurrentPage('auth-selection');
  }, [logout]);

  const renderPage = () => {
    switch (currentPage) {
      case 'intake':
        return <PackageIntake onNavigate={handleNavigation} />;
      case 'customers':
        return <Customers onNavigate={handleNavigation} />;
      case 'mailboxes':
        return <Mailboxes onNavigate={handleNavigation} />;
      case 'notifications':
        return <Notifications onNavigate={handleNavigation} />;
      case 'notification-settings':
        return <NotificationSettings onNavigate={handleNavigation} />;
      case 'analytics':
        return <Analytics onNavigate={handleNavigation} />;
      case 'routes':
        return <Routes onNavigate={handleNavigation} />;
      case 'driver-route':
        return <DriverRoute onNavigate={handleNavigation} />;
      case 'act60':
        return <Act60Dashboard onNavigate={handleNavigation} />;
      case 'location-management':
        return <LocationManagement onNavigate={handleNavigation} />;
      case 'profile-settings':
        return <ProfileSettings onNavigate={handleNavigation} />;
      case 'billing':
        return <Billing onNavigate={handleNavigation} />;
      case 'admin':
        return <Admin onNavigate={handleNavigation} />;
      case 'reports':
        return <Reports onNavigate={handleNavigation} />;
      case 'customer-portal':
        return <CustomerPortal onNavigate={handleNavigation} />;
      case 'integrations':
        return <Integrations onNavigate={handleNavigation} />;
      case 'inventory':
        return <Inventory onNavigate={handleNavigation} />;
      case 'documents':
        return <Documents onNavigate={handleNavigation} />;
      case 'virtual-mail':
        return <VirtualMail onNavigate={handleNavigation} />;
      case 'communications':
        return <Communications onNavigate={handleNavigation} />;
      case 'marketplace':
        return <Marketplace onNavigate={handleNavigation} />;
      case 'devices':
        return <Devices onNavigate={handleNavigation} />;
      case 'dashboard':
      default:
        return <Dashboard onNavigate={handleNavigation} />;
    }
  };

  const renderAuthPage = () => {
    // Check URL hash for specific auth type
    const hash = window.location.hash;
    if (hash.includes('staff')) {
      return <StaffAuth onNavigate={handleNavigation} />;
    } else if (hash.includes('customer')) {
      return <CustomerAuth onNavigate={handleNavigation} />;
    }
    return <AuthSelection onNavigate={handleNavigation} />;
  };

  // Show loading until app is initialized
  if (!isInitialized) {
    return <RouteLoading />;
  }

  // Render authenticated user interface
  if (user) {
    return (
      <Suspense fallback={<RouteLoading />}>
        <MainLayout
          user={user}
          currentPage={currentPage}
          onNavigate={handleNavigation}
          onLogout={handleLogout}
        >
          {renderPage()}
          <UserFeedbackWidget />
        </MainLayout>
      </Suspense>
    );
  }

  // Render authentication interface
  return (
    <Suspense fallback={<RouteLoading />}>
      {renderAuthPage()}
    </Suspense>
  );
};

export default PRMCMS;
