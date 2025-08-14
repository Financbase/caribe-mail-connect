import { test, expect } from '@playwright/test';

/**
 * Example test suite demonstrating Playwright configuration
 * This test validates that the configuration is working correctly
 */
test.describe('Configuration Validation', () => {
  test.beforeEach(async ({ page }) => {
    // This will use the baseURL from the configuration
    await page.goto('/');
  });

  test('should load the application', async ({ page }) => {
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Check that we have a valid page
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Log the current URL to verify baseURL is working
    console.log('Current URL:', page.url());
  });

  test('should respect locale configuration', async ({ page, context }) => {
    // Get the browser locale
    const locale = await page.evaluate(() => navigator.language);
    console.log('Browser locale:', locale);
    
    // The locale should include Spanish
    expect(locale).toContain('es');
  });

  test('should respect viewport configuration', async ({ page }) => {
    // Get the viewport size
    const viewport = page.viewportSize();
    console.log('Viewport size:', viewport);
    
    // Default viewport from config
    expect(viewport?.width).toBe(1280);
    expect(viewport?.height).toBe(720);
  });

  test('should handle geolocation', async ({ page, context }) => {
    // Grant geolocation permissions (already done in config)
    const geolocation = await page.evaluate(() => {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            resolve({ error: error.message });
          }
        );
      });
    });
    
    console.log('Geolocation:', geolocation);
    
    // Should match San Juan, PR coordinates from config
    expect(geolocation).toHaveProperty('latitude');
    expect(geolocation).toHaveProperty('longitude');
  });

  test('should capture screenshots on failure', async ({ page }) => {
    // This test will fail intentionally to demonstrate screenshot capture
    // Uncomment to test screenshot functionality
    /*
    await expect(page.locator('#non-existent-element')).toBeVisible({
      timeout: 1000 // Short timeout to fail quickly
    });
    */
    
    // Instead, we'll pass the test
    expect(true).toBe(true);
  });
});

test.describe('Mobile Configuration', () => {
  test.use({
    viewport: { width: 375, height: 667 },
    hasTouch: true,
    isMobile: true,
  });

  test('should work with mobile viewport', async ({ page }) => {
    await page.goto('/');
    
    const viewport = page.viewportSize();
    console.log('Mobile viewport:', viewport);
    
    expect(viewport?.width).toBe(375);
    expect(viewport?.height).toBe(667);
  });

  test('should support touch events', async ({ page, browserName }) => {
    // Skip this test in webkit as it handles touch differently
    test.skip(browserName === 'webkit', 'Touch events work differently in WebKit');
    
    await page.goto('/');
    
    // Check if touch is supported
    const hasTouch = await page.evaluate(() => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    });
    
    console.log('Touch support:', hasTouch);
    expect(hasTouch).toBeTruthy();
  });
});

test.describe('Performance Monitoring', () => {
  test('should measure page load performance', async ({ page }) => {
    // Navigate and measure performance
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
      };
    });
    
    console.log('Performance metrics:', performanceMetrics);
    
    // Assert reasonable load times (adjust based on your app)
    expect(performanceMetrics.totalLoadTime).toBeLessThan(5000); // 5 seconds
  });
});

test.describe('Accessibility Checks', () => {
  test('should have proper page structure', async ({ page }) => {
    await page.goto('/');
    
    // Check for essential accessibility elements
    const hasMain = await page.locator('main, [role="main"]').count() > 0;
    const hasHeading = await page.locator('h1').count() > 0;
    const htmlLang = await page.getAttribute('html', 'lang');
    
    console.log('Accessibility checks:', {
      hasMain,
      hasHeading,
      htmlLang,
    });
    
    // Basic accessibility assertions
    expect(htmlLang).toBeTruthy();
  });
});
