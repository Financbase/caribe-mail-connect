import { useState, useEffect, Suspense, ComponentType } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import RouteLoading from '@/components/common/RouteLoading';
import RouteErrorBoundary from '@/components/common/RouteErrorBoundary';
import { lazyWithPreload, type LazyComponentType } from '@/utils/routeUtils';
import { Franchise } from './Franchise';
import { Facility } from './Facility';
import Auth from './Auth';
import AuthSelection from './auth/AuthSelection';
import ResetPassword from './auth/ResetPassword';
import UpdatePassword from './auth/UpdatePassword';
import Security from './Security';
import PRMCMS from './Index';
import PackageDetails from './PackageDetails';
import StyleTest from './StyleTest';
import NotFound from './NotFound';
import Emergency from './Emergency';
import Dashboard from './Dashboard';

// Define the props type for PackageDetails
interface PackageDetailsProps {
  packageId: string;
  onNavigate: (page: string) => void;
}

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/package-intake',
  '/virtual-mail',
  '/billing',
  '/analytics',
  '/customers',
  '/mailboxes',
  '/routes',
  '/employees',
  '/inventory',
  '/documents',
  '/reports',
  '/admin',
  '/integrations',
  '/devices',
  '/iot-monitoring',
  '/training',
  '/qa',
  '/profile-settings',
  '/customer-portal',
  '/communications',
  '/marketplace',
  '/last-mile',
  '/act60',
  '/location-management',
  '/notifications',
  '/notification-settings',
  '/security',
  '/compliance',
  '/franchise',
  '/facility',
  '/intelligence',
  '/emergency',
  '/partners',
  '/vendor-management',
  '/affiliate-program',
  '/integration-partners',
  '/partner-analytics',
  '/sustainability',
  '/green-shipping',
  '/waste-reduction',
  '/energy-management',
  '/community-impact'
];

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth',
  '/auth/staff',
  '/auth/customer',
  '/auth/reset-password',
  '/auth/update-password',
  '/style-test'
];

// Import partner management pages
import Partners from './Partners';
import VendorManagement from './VendorManagement';
import AffiliateProgram from './AffiliateProgram';
import IntegrationPartners from './IntegrationPartners';
import PartnerAnalytics from './PartnerAnalytics';
import Sustainability from './Sustainability';
import GreenShipping from './GreenShipping';
import WasteReduction from './WasteReduction';
import EnergyManagement from './EnergyManagement';
import CommunityImpact from './CommunityImpact';

// Simplified route configuration - only include routes that are known to work
const routeConfig: Record<string, (() => JSX.Element) | LazyComponentType> = {
  '/dashboard': Dashboard,
  '/style-test': StyleTest,
  '/franchise': Franchise,
  '/facility': Facility,
  '/security': Security,
  '/intelligence': lazyWithPreload('intelligence'),
  '/emergency': Emergency,
  '/partners': Partners,
  '/vendor-management': VendorManagement,
  '/affiliate-program': AffiliateProgram,
  '/integration-partners': IntegrationPartners,
  '/partner-analytics': PartnerAnalytics,
  '/sustainability': Sustainability,
  '/green-shipping': GreenShipping,
  '/waste-reduction': WasteReduction,
  '/energy-management': EnergyManagement,
  '/community-impact': CommunityImpact,
};

export default function AppRouter() {
  const { user, loading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState('/');

  // Handle both hash-based and regular routing
  useEffect(() => {
    const handleRouteChange = () => {
      // Check if we're using hash routing or regular routing
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      
      if (hash) {
        // Hash-based routing
        setCurrentRoute(hash.replace('#', '') || '/');
      } else {
        // Regular routing (for tests)
        setCurrentRoute(pathname || '/');
      }
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    handleRouteChange(); // Set initial route

    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  if (loading) {
    return <RouteLoading />;
  }

  const isAuthenticated = !!user;
  const isProtectedRoute = protectedRoutes.some(route => currentRoute.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => currentRoute.startsWith(route));

  // Redirect unauthenticated users to auth page for protected routes
  if (!isAuthenticated && isProtectedRoute) {
    // Redirect to auth page
    const hash = window.location.hash;
    const pathname = window.location.pathname;
    
    if (hash && hash !== '#/auth') {
      window.location.hash = '#/auth';
    } else if (!hash && pathname !== '/auth') {
      window.location.pathname = '/auth';
    }
    
    return (
      <Suspense fallback={<RouteLoading />}>
        <RouteErrorBoundary>
          <AuthSelection />
        </RouteErrorBoundary>
      </Suspense>
    );
  }

  // Handle auth routes
  console.log('Current route:', currentRoute);
  console.log('Route starts with /auth:', currentRoute.startsWith('/auth/'));
  console.log('Route equals /auth:', currentRoute === '/auth');
  if (currentRoute === '/auth' || currentRoute.startsWith('/auth/')) {
    return (
      <Suspense fallback={<RouteLoading />}>
        <RouteErrorBoundary>
          {currentRoute === '/auth/reset-password' ? (
            <ResetPassword />
          ) : currentRoute === '/auth/update-password' ? (
            <UpdatePassword />
          ) : currentRoute === '/auth/staff' ? (
            <Auth type="staff" />
          ) : currentRoute === '/auth/customer' ? (
            <Auth type="customer" />
          ) : currentRoute === '/auth' ? (
            <AuthSelection />
          ) : (
            <AuthSelection />
          )}
        </RouteErrorBoundary>
      </Suspense>
    );
  }

  // Handle authenticated user routes
  if (currentRoute === '/auth/update-password') {
    return (
      <Suspense fallback={<RouteLoading />}>
        <RouteErrorBoundary>
          <UpdatePassword />
        </RouteErrorBoundary>
      </Suspense>
    );
  }

  // Check if the current route matches any configured route
  if (currentRoute in routeConfig) {
    const RouteComponent = routeConfig[currentRoute];
    return (
      <Suspense fallback={<RouteLoading />}>
        <RouteErrorBoundary>
          <RouteComponent />
        </RouteErrorBoundary>
      </Suspense>
    );
  }

  // Handle dynamic routes
  if (currentRoute.startsWith('/packages/')) {
    const packageId = currentRoute.replace('/packages/', '');
    return (
      <Suspense fallback={<RouteLoading />}>
        <RouteErrorBoundary>
          <PackageDetails 
            packageId={packageId} 
            onNavigate={(page: string) => {
              // Handle navigation if needed
              console.log('Navigating to:', page);
            }} 
          />
        </RouteErrorBoundary>
      </Suspense>
    );
  }

  // Handle 404 for unknown routes
  if (!isPublicRoute && !isProtectedRoute && !currentRoute.startsWith('/packages/')) {
    return (
      <Suspense fallback={<RouteLoading />}>
        <RouteErrorBoundary>
          <NotFound />
        </RouteErrorBoundary>
      </Suspense>
    );
  }

  // Default route - always return PRMCMS for now
  return (
    <Suspense fallback={<RouteLoading />}>
      <RouteErrorBoundary>
        <PRMCMS />
      </RouteErrorBoundary>
    </Suspense>
  );
}