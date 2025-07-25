import { useState, useEffect } from 'react';
import { usePerformance } from '@/hooks/usePerformance';

interface APIInterceptorConfig {
  trackPerformance: boolean;
  enableCaching: boolean;
  cacheTTL: number;
  retryAttempts: number;
}

// API Performance Interceptor
export class APIPerformanceInterceptor {
  private config: APIInterceptorConfig;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private trackAPICall?: (endpoint: string, responseTime: number) => void;

  constructor(config: APIInterceptorConfig, trackAPICall?: (endpoint: string, responseTime: number) => void) {
    this.config = config;
    this.trackAPICall = trackAPICall;
  }

  // Intercept fetch requests
  intercept() {
    const originalFetch = window.fetch;
    
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const startTime = performance.now();
      const url = typeof input === 'string' ? input : input.toString();
      
      // Check cache first
      if (this.config.enableCaching && init?.method === 'GET') {
        const cached = this.getCachedResponse(url);
        if (cached) {
          return new Response(JSON.stringify(cached.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      try {
        let response = await originalFetch(input, init);
        const responseTime = performance.now() - startTime;

        // Track performance
        if (this.config.trackPerformance && this.trackAPICall) {
          this.trackAPICall(url, responseTime);
        }

        // Cache successful GET responses
        if (this.config.enableCaching && response.ok && init?.method === 'GET') {
          const clonedResponse = response.clone();
          const data = await clonedResponse.json();
          this.cacheResponse(url, data, this.config.cacheTTL);
        }

        return response;
      } catch (error) {
        const responseTime = performance.now() - startTime;
        
        // Track failed requests
        if (this.config.trackPerformance && this.trackAPICall) {
          this.trackAPICall(url, responseTime);
        }
        
        throw error;
      }
    };
  }

  private getCachedResponse(url: string) {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached;
    }
    this.cache.delete(url);
    return null;
  }

  private cacheResponse(url: string, data: any, ttl: number) {
    this.cache.set(url, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  clearCache() {
    this.cache.clear();
  }
}

// Image Optimization Utilities
export const ImageOptimizer = {
  // Lazy load images
  lazyLoadImages: () => {
    if ('IntersectionObserver' in window) {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src!;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    }
  },

  // Convert to WebP if supported
  optimizeFormat: (src: string): string => {
    const supportsWebP = () => {
      const canvas = document.createElement('canvas');
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    if (supportsWebP() && !src.includes('.webp')) {
      return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    return src;
  },

  // Generate responsive image URLs
  responsive: (src: string, sizes: number[]): string[] => {
    return sizes.map(size => `${src}?w=${size}&q=80`);
  }
};

// Bundle Analysis Hook
export function useBundleAnalysis() {
  const [bundleInfo, setBundleInfo] = useState({
    totalSize: 0,
    jsSize: 0,
    cssSize: 0,
    chunks: [],
    recommendations: []
  });

  useEffect(() => {
    // Analyze current bundle (mock implementation)
    const analyzeBundle = () => {
      // In a real implementation, this would analyze the actual bundle
      const mockBundleInfo = {
        totalSize: 850, // KB
        jsSize: 650,
        cssSize: 100,
        chunks: [
          { name: 'main', size: 300 },
          { name: 'vendor', size: 350 },
          { name: 'runtime', size: 50 }
        ],
        recommendations: [
          'Consider code splitting for large vendor libraries',
          'Enable tree shaking for unused imports',
          'Use dynamic imports for route-based code splitting'
        ]
      };
      setBundleInfo(mockBundleInfo);
    };

    analyzeBundle();
  }, []);

  return bundleInfo;
}

// Performance Budget Monitor
export function usePerformanceBudget() {
  const { metrics } = usePerformance();
  const [budgetStatus, setBudgetStatus] = useState({
    isWithinBudget: true,
    violations: [],
    score: 100
  });

  const BUDGETS = {
    LCP: 2500, // ms
    FID: 100,  // ms
    CLS: 0.1,  // score
    bundleSize: 1000, // KB
    apiResponse: 500 // ms
  };

  useEffect(() => {
    const violations = [];
    let score = 100;

    // Check LCP
    if (metrics.lcp && metrics.lcp > BUDGETS.LCP) {
      violations.push(`LCP exceeds budget: ${Math.round(metrics.lcp)}ms > ${BUDGETS.LCP}ms`);
      score -= 20;
    }

    // Check FID
    if (metrics.fid && metrics.fid > BUDGETS.FID) {
      violations.push(`FID exceeds budget: ${Math.round(metrics.fid)}ms > ${BUDGETS.FID}ms`);
      score -= 20;
    }

    // Check CLS
    if (metrics.cls && metrics.cls > BUDGETS.CLS) {
      violations.push(`CLS exceeds budget: ${metrics.cls.toFixed(3)} > ${BUDGETS.CLS}`);
      score -= 20;
    }

    setBudgetStatus({
      isWithinBudget: violations.length === 0,
      violations,
      score: Math.max(0, score)
    });
  }, [metrics]);

  return { budgetStatus, budgets: BUDGETS };
}

// Service Worker Cache Manager
export class CacheManager {
  private cacheName = 'prmcms-v1';

  async cacheAssets(urls: string[]) {
    if ('caches' in window) {
      const cache = await caches.open(this.cacheName);
      await cache.addAll(urls);
    }
  }

  async getCachedResponse(request: Request): Promise<Response | undefined> {
    if ('caches' in window) {
      const cache = await caches.open(this.cacheName);
      return await cache.match(request);
    }
  }

  async updateCache(request: Request, response: Response) {
    if ('caches' in window) {
      const cache = await caches.open(this.cacheName);
      await cache.put(request, response.clone());
    }
  }

  async clearCache() {
    if ('caches' in window) {
      await caches.delete(this.cacheName);
    }
  }
}