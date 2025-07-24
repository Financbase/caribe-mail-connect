import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import AuthSelection from './auth/AuthSelection';
import StaffAuth from './auth/StaffAuth';
import CustomerAuth from './auth/CustomerAuth';
import Dashboard from './Dashboard';
import PackageIntake from './PackageIntake';
import Customers from './Customers';
import Notifications from './Notifications';
import { NotificationSettings } from './NotificationSettings';
import Mailboxes from './Mailboxes';
import Analytics from './Analytics';
import Routes from './Routes';
import DriverRoute from './DriverRoute';
import Act60Dashboard from './Act60Dashboard';
import LocationManagement from './LocationManagement';
import ProfileSettings from './profile/Settings';
import Billing from './Billing';
import Admin from './Admin';
import Reports from './Reports';
import CustomerPortal from './CustomerPortal';
import { MobileLayout } from '@/components/mobile/MobileLayout';

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
    setCurrentPage(page);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentPage('auth-selection');
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
        return <StaffAuth onNavigate={handleNavigation} />;
      case 'customer-auth':
        return <CustomerAuth onNavigate={handleNavigation} />;
      case 'customer-portal':
        return <CustomerPortal onNavigate={handleNavigation} />;
      default:
        return <AuthSelection onNavigate={handleNavigation} />;
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'intake':
        return <PackageIntake onNavigate={handleNavigation} />;
      case 'customers':
        return <Customers onNavigate={handleNavigation} />;
      case 'mailboxes':
        return <Mailboxes onNavigate={handleNavigation} />;
      case 'analytics':
        return <Analytics onNavigate={handleNavigation} />;
      case 'routes':
        return <Routes onNavigate={handleNavigation} />;
      case 'driver-route':
        return <DriverRoute onNavigate={handleNavigation} />;
      case 'act60-dashboard':
        return <Act60Dashboard onNavigate={handleNavigation} />;
      case 'location-management':
        return <LocationManagement onNavigate={handleNavigation} />;
      case 'notifications':
        return <Notifications onNavigate={handleNavigation} />;
      case 'notification-settings':
        return <NotificationSettings />;
      case 'billing':
        return <Billing onNavigate={handleNavigation} />;
      case 'reports':
        return <Reports onNavigate={handleNavigation} />;
      case 'admin':
        return <Admin onNavigate={handleNavigation} />;
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
        return <Dashboard onNavigate={handleNavigation} />;
    }
  };

  return (
    <MobileLayout currentPage={currentPage} onNavigate={handleNavigation}>
      {renderPage()}
    </MobileLayout>
  );
};

export default PRMCMS;
