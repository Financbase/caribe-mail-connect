import * as React from 'react';
import { lazy, ComponentType, LazyExoticComponent } from 'react';

// This utility helps with route preloading
const routePreloads = new Map<string, Promise<ComponentType>>();

// Map of route names to their actual file paths
const routePathMap: Record<string, string> = {
  'intelligence': 'intelligence/index',
  // Add other route mappings as needed
};

// Create a simple fallback component without JSX
const createFallbackComponent = (route: string, error: Error): ComponentType => {
  return () => {
    return React.createElement('div', {
      className: 'min-h-screen flex items-center justify-center bg-gray-50'
    }, [
      React.createElement('div', {
        key: 'content',
        className: 'text-center'
      }, [
        React.createElement('div', {
          key: 'icon',
          className: 'mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100'
        }, '⚠️'),
        React.createElement('h2', {
          key: 'title',
          className: 'text-lg font-semibold text-gray-900 mb-2'
        }, 'Error Loading Page'),
        React.createElement('p', {
          key: 'message',
          className: 'text-gray-600'
        }, `Failed to load: ${route}`),
        React.createElement('p', {
          key: 'error',
          className: 'text-sm text-gray-500 mt-2'
        }, error.message)
      ])
    ]);
  };
};

export function preloadRoute(route: string): Promise<{ default: ComponentType }> {
  // If we've already started loading this route, return the existing promise
  const existingPreload = routePreloads.get(route);
  if (existingPreload) {
    return existingPreload.then(component => ({ default: component }));
  }

  let resolve: (value: ComponentType) => void;
  const promise = new Promise<ComponentType>((res) => {
    resolve = res as (value: ComponentType) => void;
  });

  // Store the promise immediately
  routePreloads.set(route, promise);

  // Get the correct file path for the route
  const filePath = routePathMap[route] || route;
  const importPath = `../pages/${filePath}.tsx`;
  /* @vite-ignore */
  import(importPath)
    .then((module) => {
      const component = module.default;
      if (component) {
        resolve(component);
      } else {
        throw new Error(`No default export found for route: ${route}`);
      }
    })
    .catch((error) => {
      console.error(`Failed to load route: ${route}`, error);
      // Return a proper React component instead of a plain object
      const FallbackComponent = createFallbackComponent(route, error);
      resolve(FallbackComponent);
    });

  return promise.then(component => ({ default: component }));
}

export function preloadOnHover(route: string) {
  return () => preloadRoute(route);
}

export function lazyWithPreload(route: string): LazyExoticComponent<ComponentType> {
  const LazyComponent = lazy(() => preloadRoute(route));
  
  // Add preload method to the lazy component
  (LazyComponent as any).preload = () => preloadRoute(route);
  
  return LazyComponent;
}

export type LazyComponentType = LazyExoticComponent<ComponentType> & {
  preload?: () => Promise<{ default: ComponentType }>;
};
