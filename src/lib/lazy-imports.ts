import { lazy } from 'react';

// Core pages - loaded immediately
export { default as Dashboard } from '@/pages/Dashboard';

// Feature pages - lazy loaded for better performance
export const VirtualMail = lazy(() => import('@/pages/VirtualMail').then(m => ({ default: m.VirtualMail })));
export const Documents = lazy(() => import('@/pages/Documents'));
export const PackageIntake = lazy(() => import('@/pages/PackageIntake'));
export const Customers = lazy(() => import('@/pages/Customers'));
export const Reports = lazy(() => import('@/pages/Reports'));
export const Settings = lazy(() => import('@/pages/profile/Settings'));

// Preload critical components on idle
export function preloadCriticalComponents() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Preload components likely to be used soon
      VirtualMail();
      Documents();
    });
  }
}

// Preload components based on route
export function preloadRouteComponents(route: string) {
  switch (route) {
    case '/virtual-mail':
      VirtualMail();
      break;
    case '/documents':
      Documents();
      break;
    case '/packages':
      PackageIntake();
      break;
    case '/customers':
      Customers();
      break;
  }
}
