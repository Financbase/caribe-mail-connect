// Performance monitoring and optimization utilities
export interface PerformanceMetrics {
  loadTime: number;
  resourceCount: number;
  failedResources: number;
  bundleSize: number;
  memoryUsage: number;
}

export class PerformanceMonitor {
  private startTime: number;
  private metrics: PerformanceMetrics;

  constructor() {
    this.startTime = performance.now();
    this.metrics = {
      loadTime: 0,
      resourceCount: 0,
      failedResources: 0,
      bundleSize: 0,
      memoryUsage: 0
    };
  }

  startMonitoring() {
    this.startTime = performance.now();
    
    // Monitor resource loading
    this.monitorResourceLoading();
    
    // Monitor memory usage
    this.monitorMemoryUsage();
    
    // Monitor bundle size
    this.monitorBundleSize();
  }

  private monitorResourceLoading() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          this.metrics.resourceCount++;
          
          if (resourceEntry.transferSize === 0 && resourceEntry.duration > 1000) {
            this.metrics.failedResources++;
            console.warn(`Slow resource load: ${resourceEntry.name} took ${resourceEntry.duration}ms`);
          }
        }
      }
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }

  private monitorMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize;
      
      // Log memory warnings
      if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
        console.warn('High memory usage detected');
      }
    }
  }

  private monitorBundleSize() {
    // Estimate bundle size from loaded resources
    const resources = performance.getEntriesByType('resource');
    this.metrics.bundleSize = resources.reduce((total, resource) => {
      return total + (resource.transferSize || 0);
    }, 0);
  }

  getMetrics(): PerformanceMetrics {
    this.metrics.loadTime = performance.now() - this.startTime;
    return { ...this.metrics };
  }

  logMetrics() {
    const metrics = this.getMetrics();
    console.log('Performance Metrics:', metrics);
    
    // Send to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metrics', metrics);
    }
  }
}

// Resource preloading utilities
export function preloadCriticalResources() {
  const criticalResources = [
    '/src/components/ui/button.tsx',
    '/src/components/ui/input.tsx',
    '/src/components/ui/card.tsx'
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = 'script';
    document.head.appendChild(link);
  });
}

// Lazy loading optimization
export function createLazyLoader<T>(
  importFn: () => Promise<{ default: T }>,
  fallback?: T
): () => Promise<T> {
  let cached: T | null = null;
  let loading: Promise<T> | null = null;

  return async () => {
    if (cached) return cached;
    if (loading) return loading;

    loading = importFn()
      .then(module => {
        cached = module.default;
        return cached;
      })
      .catch(error => {
        console.error('Failed to load lazy component:', error);
        if (fallback) return fallback;
        throw error;
      });

    return loading;
  };
}

// Bundle analysis
export function analyzeBundle() {
  const resources = performance.getEntriesByType('resource');
  const analysis = {
    totalSize: 0,
    slowResources: [] as string[],
    failedResources: [] as string[],
    recommendations: [] as string[]
  };

  resources.forEach(resource => {
    const resourceEntry = resource as PerformanceResourceTiming;
    analysis.totalSize += resourceEntry.transferSize || 0;

    if (resourceEntry.duration > 2000) {
      analysis.slowResources.push(resourceEntry.name);
    }

    if (resourceEntry.transferSize === 0 && resourceEntry.duration > 1000) {
      analysis.failedResources.push(resourceEntry.name);
    }
  });

  // Generate recommendations
  if (analysis.totalSize > 1024 * 1024) {
    analysis.recommendations.push('Consider code splitting to reduce bundle size');
  }

  if (analysis.slowResources.length > 5) {
    analysis.recommendations.push('Optimize slow-loading resources');
  }

  if (analysis.failedResources.length > 0) {
    analysis.recommendations.push('Fix failed resource loads');
  }

  return analysis;
} 