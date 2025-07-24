import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Auth from './Auth';
import Dashboard from './Dashboard';
import PackageIntake from './PackageIntake';
import Customers from './Customers';
import Notifications from './Notifications';
import Mailboxes from './Mailboxes';
import Analytics from './Analytics';
import Routes from './Routes';
import DriverRoute from './DriverRoute';
import Act60Dashboard from './Act60Dashboard';
import LocationManagement from './LocationManagement';
import ProfileSettings from './profile/Settings';

// Main application component with navigation logic
const PRMCMS = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // PWA Service Worker Registration (basic setup)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

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

  // Main app is now authenticated, so we just handle internal navigation
  const renderPage = () => {
    switch (currentPage) {
      case 'intake':
        return <PackageIntake onNavigate={setCurrentPage} />;
      case 'customers':
        return <Customers onNavigate={setCurrentPage} />;
      case 'mailboxes':
        return <Mailboxes onNavigate={setCurrentPage} />;
      case 'analytics':
        return <Analytics onNavigate={setCurrentPage} />;
        case 'routes':
          return <Routes onNavigate={setCurrentPage} />;
        case 'driver-route':
          return <DriverRoute onNavigate={setCurrentPage} />;
        case 'act60-dashboard':
          return <Act60Dashboard onNavigate={setCurrentPage} />;
        case 'location-management':
          return <LocationManagement onNavigate={setCurrentPage} />;
      case 'notifications':
        return <Notifications onNavigate={setCurrentPage} />;
      case 'profile-settings':
        return <ProfileSettings onNavigate={setCurrentPage} />;
      case 'search':
        // Placeholder for search page
        return (
          <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Search Feature</h1>
              <p className="text-muted-foreground mb-6">Coming soon!</p>
              <button
                onClick={() => setCurrentPage('dashboard')}
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
                onClick={() => setCurrentPage('dashboard')}
                className="text-primary hover:underline"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return renderPage();
};

export default PRMCMS;
