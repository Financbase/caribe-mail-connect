/**
 * Performance Testing Suite
 * Comprehensive performance tests for critical application paths
 */

import { test, expect, Page } from '@playwright/test';

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  pageLoad: 3000,        // 3 seconds
  firstContentfulPaint: 1500,  // 1.5 seconds
  largestContentfulPaint: 2500, // 2.5 seconds
  cumulativeLayoutShift: 0.1,   // CLS score
  firstInputDelay: 100,         // 100ms
  timeToInteractive: 3500,      // 3.5 seconds
  apiResponse: 1000,            // 1 second
  searchResponse: 500,          // 500ms
  formSubmission: 2000          // 2 seconds
};

// Helper functions
async function measurePageLoad(page: Page, url: string) {
  const startTime = Date.now();
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  const endTime = Date.now();
  return endTime - startTime;
}

async function measureApiResponse(page: Page, apiCall: () => Promise<void>) {
  const startTime = Date.now();
  await apiCall();
  const endTime = Date.now();
  return endTime - startTime;
}

async function getWebVitals(page: Page) {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      const vitals: any = {};
      
      // First Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            vitals.fcp = entry.startTime;
          }
        });
      }).observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.lcp = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        vitals.cls = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });

      // First Input Delay
      new PerformanceObserver((list) => {
        const firstEntry = list.getEntries()[0];
        vitals.fid = (firstEntry as any).processingStart - firstEntry.startTime;
      }).observe({ entryTypes: ['first-input'] });

      // Time to Interactive (approximation)
      setTimeout(() => {
        vitals.tti = performance.now();
        resolve(vitals);
      }, 100);
    });
  });
}

test.describe('Performance Tests', () => {
  test('Dashboard page load performance', async ({ page }) => {
    // Measure page load time
    const loadTime = await measurePageLoad(page, '/dashboard');
    expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoad);

    // Get Web Vitals
    const vitals = await getWebVitals(page);
    
    // Validate Web Vitals
    expect(vitals.fcp).toBeLessThan(PERFORMANCE_THRESHOLDS.firstContentfulPaint);
    expect(vitals.lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.largestContentfulPaint);
    expect(vitals.cls).toBeLessThan(PERFORMANCE_THRESHOLDS.cumulativeLayoutShift);
    
    if (vitals.fid) {
      expect(vitals.fid).toBeLessThan(PERFORMANCE_THRESHOLDS.firstInputDelay);
    }
    
    if (vitals.tti) {
      expect(vitals.tti).toBeLessThan(PERFORMANCE_THRESHOLDS.timeToInteractive);
    }
  });

  test('Documents page load performance', async ({ page }) => {
    const loadTime = await measurePageLoad(page, '/documents');
    expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoad);

    // Test large document list performance
    await page.evaluate(() => {
      // Simulate loading 100 documents
      const container = document.querySelector('[data-testid="documents-list"]');
      if (container) {
        for (let i = 0; i < 100; i++) {
          const item = document.createElement('div');
          item.textContent = `Document ${i}`;
          item.setAttribute('data-testid', 'document-item');
          container.appendChild(item);
        }
      }
    });

    // Measure scroll performance
    const scrollStart = Date.now();
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(100);
    const scrollEnd = Date.now();
    
    expect(scrollEnd - scrollStart).toBeLessThan(200); // Smooth scrolling
  });

  test('Search performance', async ({ page }) => {
    await page.goto('/documents');
    
    // Measure search response time
    const searchTime = await measureApiResponse(page, async () => {
      await page.fill('[data-testid="search-input"]', 'test query');
      await page.keyboard.press('Enter');
      await page.waitForSelector('[data-testid="search-results"]');
    });
    
    expect(searchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.searchResponse);
  });

  test('Form submission performance', async ({ page }) => {
    await page.goto('/documents');
    await page.click('[data-testid="new-document-button"]');
    
    // Measure form submission time
    const submissionTime = await measureApiResponse(page, async () => {
      await page.fill('[data-testid="document-title-input"]', 'Performance Test Document');
      await page.fill('[data-testid="document-content-editor"]', 'Test content for performance');
      await page.click('[data-testid="save-document-button"]');
      await page.waitForSelector('[data-testid="success-message"]');
    });
    
    expect(submissionTime).toBeLessThan(PERFORMANCE_THRESHOLDS.formSubmission);
  });

  test('API response performance', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Measure API calls
    const apiTimes: number[] = [];
    
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        const timing = response.timing();
        if (timing) {
          apiTimes.push(timing.responseEnd - timing.requestStart);
        }
      }
    });
    
    // Trigger API calls
    await page.click('[data-testid="refresh-data-button"]');
    await page.waitForTimeout(2000);
    
    // Validate API response times
    apiTimes.forEach(time => {
      expect(time).toBeLessThan(PERFORMANCE_THRESHOLDS.apiResponse);
    });
  });

  test('Memory usage performance', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    // Perform memory-intensive operations
    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="documents-nav-link"]');
      await page.waitForLoadState('networkidle');
      await page.click('[data-testid="campaigns-nav-link"]');
      await page.waitForLoadState('networkidle');
    }
    
    // Get final memory usage
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    // Memory should not increase dramatically
    const memoryIncrease = finalMemory - initialMemory;
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB threshold
  });

  test('Bundle size performance', async ({ page }) => {
    await page.goto('/');
    
    // Measure resource sizes
    const resources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries.map(entry => ({
        name: entry.name,
        size: entry.transferSize,
        type: entry.initiatorType
      }));
    });
    
    // Check JavaScript bundle sizes
    const jsResources = resources.filter(r => r.name.includes('.js'));
    const totalJsSize = jsResources.reduce((sum, r) => sum + r.size, 0);
    
    // Main bundle should be under 1MB
    expect(totalJsSize).toBeLessThan(1024 * 1024);
    
    // Check CSS bundle sizes
    const cssResources = resources.filter(r => r.name.includes('.css'));
    const totalCssSize = cssResources.reduce((sum, r) => sum + r.size, 0);
    
    // CSS should be under 200KB
    expect(totalCssSize).toBeLessThan(200 * 1024);
  });

  test('Image loading performance', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Measure image load times
    const imageLoadTimes: number[] = [];
    
    page.on('response', response => {
      if (response.url().match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        const timing = response.timing();
        if (timing) {
          imageLoadTimes.push(timing.responseEnd - timing.requestStart);
        }
      }
    });
    
    // Trigger image loads
    await page.evaluate(() => {
      // Scroll to trigger lazy loading
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    await page.waitForTimeout(2000);
    
    // Validate image load times
    imageLoadTimes.forEach(time => {
      expect(time).toBeLessThan(2000); // 2 seconds per image
    });
  });

  test('Concurrent user simulation', async ({ browser }) => {
    // Simulate multiple concurrent users
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext(),
      browser.newContext(),
      browser.newContext()
    ]);
    
    const pages = await Promise.all(contexts.map(context => context.newPage()));
    
    // Measure concurrent load times
    const startTime = Date.now();
    
    await Promise.all(pages.map(async (page, index) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Perform different actions per user
      switch (index % 3) {
        case 0:
          await page.click('[data-testid="documents-nav-link"]');
          break;
        case 1:
          await page.click('[data-testid="campaigns-nav-link"]');
          break;
        case 2:
          await page.click('[data-testid="analytics-nav-link"]');
          break;
      }
      
      await page.waitForLoadState('networkidle');
    }));
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    // Should handle 5 concurrent users within reasonable time
    expect(totalTime).toBeLessThan(10000); // 10 seconds
    
    // Cleanup
    await Promise.all(contexts.map(context => context.close()));
  });

  test('Network throttling performance', async ({ page }) => {
    // Simulate slow 3G connection
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 100); // Add 100ms delay
    });
    
    const loadTime = await measurePageLoad(page, '/dashboard');
    
    // Should still load within reasonable time on slow connection
    expect(loadTime).toBeLessThan(8000); // 8 seconds on slow connection
  });

  test('Offline performance', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Go offline
    await page.context().setOffline(true);
    
    // Test offline functionality
    await page.click('[data-testid="documents-nav-link"]');
    
    // Should show offline message
    await expect(page.locator('[data-testid="offline-message"]')).toBeVisible();
    
    // Go back online
    await page.context().setOffline(false);
    
    // Should recover gracefully
    await page.click('[data-testid="retry-button"]');
    await expect(page.locator('[data-testid="documents-list"]')).toBeVisible();
  });
});
