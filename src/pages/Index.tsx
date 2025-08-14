import { useState, useEffect, Suspense, lazy } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
const AuthSelection = lazy(() => import('./auth/AuthSelection'));
const StaffAuth = lazy(() => import('./auth/StaffAuth'));
const CustomerAuth = lazy(() => import('./auth/CustomerAuth'));
const Dashboard = lazy(() => import('./Dashboard'));
const PackageIntake = lazy(() => import('./PackageIntake'));
const Customers = lazy(() => import('./Customers'));
const Notifications = lazy(() => import('./Notifications'));
const NotificationSettingsLazy = lazy(() => import('./NotificationSettings').then(m => ({ default: m.NotificationSettings })));
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
const VirtualMailComponent = lazy(() => import('./VirtualMail').then(m => ({ default: m.VirtualMail })));
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { UserFeedbackWidget } from '@/components/qa/UserFeedbackSystem';

// Main application component with navigation logic
const PRMCMS = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('auth-selection');

  // PWA Service Worker Registration (basic setup)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  // Auth state management
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Set appropriate initial page based on auth state
        if (session?.user) {
          setCurrentPage('dashboard');
        } else {
          setCurrentPage('auth-selection');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Set appropriate initial page based on auth state
      if (session?.user) {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('auth-selection');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavigation = (page: string) => {
    // Use hash-based navigation for consistency with AppRouter
    window.location.hash = `#/${page}`;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.hash = '#/';
  };

  // Show loading while checking authentication
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

  // Show auth pages if not authenticated
  if (!user) {
    switch (currentPage) {
      case 'staff-auth':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <StaffAuth onNavigate={handleNavigation} />
          </Suspense>
        );
      case 'customer-auth':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <CustomerAuth onNavigate={handleNavigation} />
          </Suspense>
        );
      case 'customer-portal':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <CustomerPortal onNavigate={handleNavigation} />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <AuthSelection onNavigate={handleNavigation} />
          </Suspense>
        );
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'intake':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <PackageIntake onNavigate={handleNavigation} />
          </Suspense>
        );
      case 'customers':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <Customers onNavigate={handleNavigation} />
          </Suspense>
        );
      case 'mailboxes':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <Mailboxes onNavigate={handleNavigation} />
          </Suspense>
        );
      case 'analytics':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <Analytics onNavigate={handleNavigation} />
          </Suspense>
        );
      case 'routes':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <Routes onNavigate={handleNavigation} />
          </Suspense>
        );
      case 'driver-route':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <DriverRoute onNavigate={handleNavigation} />
          </Suspense>
        );
      case 'act60-dashboard':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <Act60Dashboard onNavigate={handleNavigation} />
          </Suspense>
        );
      case 'location-management':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <LocationManagement onNavigate={handleNavigation} />
          </Suspense>
        );
      case 'notifications':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <Notifications onNavigate={handleNavigation} />
          </Suspense>
        );
      case 'notification-settings':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <NotificationSettingsLazy />
          </Suspense>
        );
      case 'billing':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <Billing onNavigate={handleNavigation} />
          </Suspense>
        );
      case 'reports':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <Reports onNavigate={handleNavigation} />
          </Suspense>
        );
      case 'admin':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <Admin onNavigate={handleNavigation} />
          </Suspense>
        );
      case 'integrations':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <Integrations onNavigate={handleNavigation} />
          </Suspense>
        );
      case 'inventory':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <Inventory onNavigate={handleNavigation} />
          </Suspense>
        );
      case 'documents':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <Documents onNavigate={handleNavigation} />
          </Suspense>
        );
      case 'virtual-mail':
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <VirtualMailComponent />
          </Suspense>
        );
      case 'qa':
        // QA page handled by AppRouter
        return null;
      case 'profile-settings':
        return <ProfileSettings onNavigate={handleNavigation} />;
      case 'customer-portal':
        return <CustomerPortal onNavigate={handleNavigation} />;
      case 'search':
        // Placeholder for search page
        return (
          <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Search Feature</h1>
              <p className="text-muted-foreground mb-6">Coming soon!</p>
              <button
                onClick={() => handleNavigation('dashboard')}
                className="text-primary hover:underline"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      case 'deliver':
        // Placeholder for delivery page
        return (
          <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Package Delivery</h1>
              <p className="text-muted-foreground mb-6">Coming soon!</p>
              <button
                onClick={() => handleNavigation('dashboard')}
                className="text-primary hover:underline"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      default:
        return (
          <Suspense fallback={<div className="p-4">Cargando…</div>}>
            <Dashboard onNavigate={handleNavigation} />
          </Suspense>
        );
    }
  };

  return (
    <MobileLayout currentPage={currentPage} onNavigate={handleNavigation}>
      {renderPage()}
      {user && <UserFeedbackWidget />}
    </MobileLayout>
  );
};

export default PRMCMS;
