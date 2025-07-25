import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
  
  // Custom Metrics
  jsHeapSize: number;
  jsHeapSizeLimit: number;
  navigationTiming: {
    domContentLoaded: number;
    loadComplete: number;
    networkLatency: number;
  };
  
  // API Performance
  apiResponseTimes: Array<{
    endpoint: string;
    responseTime: number;
    timestamp: number;
  }>;
  
  // Bundle Information
  bundleSize: number;
  initialLoadTime: number;
}

interface PerformanceBudget {
  maxBundleSize: number; // KB
  maxLCP: number; // ms
  maxFID: number; // ms
  maxCLS: number;
  maxAPIResponse: number; // ms
}

const PERFORMANCE_BUDGET: PerformanceBudget = {
  maxBundleSize: 1000, // 1MB
  maxLCP: 2500, // 2.5s
  maxFID: 100, // 100ms
  maxCLS: 0.1,
  maxAPIResponse: 500, // 500ms
};

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    jsHeapSize: 0,
    jsHeapSizeLimit: 0,
    navigationTiming: {
      domContentLoaded: 0,
      loadComplete: 0,
      networkLatency: 0,
    },
    apiResponseTimes: [],
    bundleSize: 0,
    initialLoadTime: 0,
  });

  const [performanceScore, setPerformanceScore] = useState<number>(100);
  const [budgetViolations, setBudgetViolations] = useState<string[]>([]);

  // Collect Core Web Vitals
  const collectWebVitals = useCallback(() => {
    if (typeof window === 'undefined') return;

    // LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      // FCP (First Contentful Paint)
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        setMetrics(prev => ({ ...prev, cls: clsValue }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    // Navigation Timing
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationTiming) {
      setMetrics(prev => ({
        ...prev,
        ttfb: navigationTiming.responseStart - navigationTiming.requestStart,
        navigationTiming: {
          domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.fetchStart,
          loadComplete: navigationTiming.loadEventEnd - navigationTiming.fetchStart,
          networkLatency: navigationTiming.responseEnd - navigationTiming.requestStart,
        },
        initialLoadTime: navigationTiming.loadEventEnd - navigationTiming.fetchStart,
      }));
    }

    // Memory Usage
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        jsHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
        jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024), // MB
      }));
    }
  }, []);

  // Track API Response Times
  const trackAPICall = useCallback((endpoint: string, responseTime: number) => {
    setMetrics(prev => ({
      ...prev,
      apiResponseTimes: [
        ...prev.apiResponseTimes.slice(-19), // Keep last 20 calls
        {
          endpoint,
          responseTime,
          timestamp: Date.now(),
        },
      ],
    }));
  }, []);

  // Calculate Performance Score
  const calculateScore = useCallback(() => {
    let score = 100;
    const violations: string[] = [];

    // LCP Score (0-40 points)
    if (metrics.lcp) {
      if (metrics.lcp > PERFORMANCE_BUDGET.maxLCP * 2) {
        score -= 40;
        violations.push(`LCP too slow: ${Math.round(metrics.lcp)}ms > ${PERFORMANCE_BUDGET.maxLCP}ms`);
      } else if (metrics.lcp > PERFORMANCE_BUDGET.maxLCP) {
        score -= 20;
        violations.push(`LCP needs improvement: ${Math.round(metrics.lcp)}ms`);
      }
    }

    // FID Score (0-30 points)
    if (metrics.fid) {
      if (metrics.fid > PERFORMANCE_BUDGET.maxFID * 2) {
        score -= 30;
        violations.push(`FID too slow: ${Math.round(metrics.fid)}ms > ${PERFORMANCE_BUDGET.maxFID}ms`);
      } else if (metrics.fid > PERFORMANCE_BUDGET.maxFID) {
        score -= 15;
        violations.push(`FID needs improvement: ${Math.round(metrics.fid)}ms`);
      }
    }

    // CLS Score (0-20 points)
    if (metrics.cls) {
      if (metrics.cls > PERFORMANCE_BUDGET.maxCLS * 2) {
        score -= 20;
        violations.push(`CLS too high: ${metrics.cls.toFixed(3)} > ${PERFORMANCE_BUDGET.maxCLS}`);
      } else if (metrics.cls > PERFORMANCE_BUDGET.maxCLS) {
        score -= 10;
        violations.push(`CLS needs improvement: ${metrics.cls.toFixed(3)}`);
      }
    }

    // Memory Usage (0-10 points)
    if (metrics.jsHeapSize > 50) { // 50MB
      score -= 10;
      violations.push(`High memory usage: ${metrics.jsHeapSize}MB`);
    } else if (metrics.jsHeapSize > 30) { // 30MB
      score -= 5;
      violations.push(`Moderate memory usage: ${metrics.jsHeapSize}MB`);
    }

    setPerformanceScore(Math.max(0, score));
    setBudgetViolations(violations);
  }, [metrics]);

  // Optimize Images
  const optimizeImage = useCallback((src: string, options: { width?: number; height?: number; quality?: number } = {}) => {
    const { width, height, quality = 80 } = options;
    
    // In a real implementation, this would use a service like Cloudinary or ImageKit
    let optimizedSrc = src;
    
    if (width || height) {
      const params = new URLSearchParams();
      if (width) params.append('w', width.toString());
      if (height) params.append('h', height.toString());
      params.append('q', quality.toString());
      
      // Mock optimization - in production, use actual image service
      optimizedSrc = `${src}?${params.toString()}`;
    }
    
    return optimizedSrc;
  }, []);

  // Debounced function factory
  const debounce = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): T => {
    let timeout: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    }) as T;
  }, []);

  // Throttled function factory
  const throttle = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): T => {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  }, []);

  // Batch API calls
  const batchAPICall = useCallback(async (calls: Array<() => Promise<any>>, batchSize: number = 5) => {
    const batches: Array<Array<() => Promise<any>>> = [];
    
    for (let i = 0; i < calls.length; i += batchSize) {
      batches.push(calls.slice(i, i + batchSize));
    }
    
    const results: any[] = [];
    for (const batch of batches) {
      const batchResults = await Promise.all(batch.map(call => call()));
      results.push(...batchResults);
    }
    
    return results;
  }, []);

  useEffect(() => {
    collectWebVitals();
    
    // Set up continuous monitoring
    const interval = setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          jsHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [collectWebVitals]);

  useEffect(() => {
    calculateScore();
  }, [calculateScore]);

  return {
    metrics,
    performanceScore,
    budgetViolations,
    budget: PERFORMANCE_BUDGET,
    trackAPICall,
    optimizeImage,
    debounce,
    throttle,
    batchAPICall,
  };
}