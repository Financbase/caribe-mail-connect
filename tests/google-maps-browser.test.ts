import { test, expect } from '@playwright/test';

test.describe('Google Maps Integration - Browser Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');
    
    // Wait for the app to load
    await page.waitForSelector('[data-testid="sidebar"]', { timeout: 10000 });
  });

  test('should load Google Maps on last-mile page', async ({ page }) => {
    // Navigate to last-mile page
    await page.click('text=Last-Mile Delivery');
    
    // Wait for the page to load
    await page.waitForSelector('text=Last-Mile Delivery', { timeout: 10000 });
    
    // Check if Google Maps script is loaded
    const googleMapsLoaded = await page.evaluate(() => {
      return typeof window.google !== 'undefined' && 
             typeof window.google.maps !== 'undefined';
    });
    
    expect(googleMapsLoaded).toBe(true);
  });

  test('should display live tracking map', async ({ page }) => {
    // Navigate to last-mile page
    await page.click('text=Last-Mile Delivery');
    await page.waitForSelector('text=Last-Mile Delivery');
    
    // Click on tracking tab
    await page.click('text=Tracking');
    
    // Wait for the map to load
    await page.waitForSelector('text=Live Tracking', { timeout: 10000 });
    
    // Check if map container exists
    const mapContainer = await page.locator('.w-full.h-96');
    await expect(mapContainer).toBeVisible();
    
    // Check if vehicle markers are displayed
    await expect(page.locator('text=1 vehicles')).toBeVisible();
  });

  test('should display route optimization', async ({ page }) => {
    // Navigate to last-mile page
    await page.click('text=Last-Mile Delivery');
    await page.waitForSelector('text=Last-Mile Delivery');
    
    // Click on optimization tab
    await page.click('text=Optimization');
    
    // Wait for route optimizer to load
    await page.waitForSelector('text=Route Optimization', { timeout: 10000 });
    
    // Check if optimize button exists
    const optimizeButton = page.locator('button:has-text("Optimize Route")');
    await expect(optimizeButton).toBeVisible();
  });

  test('should handle Google Maps API errors gracefully', async ({ page }) => {
    // Mock Google Maps API failure
    await page.addInitScript(() => {
      // Override the Google Maps script loading
      const originalCreateElement = document.createElement;
      document.createElement = function(tagName: string) {
        if (tagName === 'script' && arguments[0]?.src?.includes('maps.googleapis.com')) {
          const script = originalCreateElement.call(document, tagName);
          script.onerror = () => {
            // Simulate API error
            console.error('Google Maps API failed to load');
          };
          return script;
        }
        return originalCreateElement.call(document, tagName);
      };
    });

    // Navigate to last-mile page
    await page.click('text=Last-Mile Delivery');
    await page.waitForSelector('text=Last-Mile Delivery');
    
    // Click on tracking tab
    await page.click('text=Tracking');
    
    // Should show error message
    await page.waitForSelector('text=Google Maps API key is not configured', { timeout: 5000 });
  });

  test('should support bilingual interface', async ({ page }) => {
    // Navigate to last-mile page
    await page.click('text=Last-Mile Delivery');
    await page.waitForSelector('text=Last-Mile Delivery');
    
    // Check default language (should be Spanish)
    await expect(page.locator('text=Panel de Control')).toBeVisible();
    
    // Switch to English
    await page.click('[data-testid="language-toggle"]');
    
    // Check English text
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should display vehicle information on map click', async ({ page }) => {
    // Navigate to last-mile page
    await page.click('text=Last-Mile Delivery');
    await page.waitForSelector('text=Last-Mile Delivery');
    
    // Click on tracking tab
    await page.click('text=Tracking');
    
    // Wait for map to load
    await page.waitForSelector('text=Live Tracking');
    
    // Click on a vehicle marker (if exists)
    const vehicleMarker = page.locator('[data-testid="vehicle-marker"]').first();
    if (await vehicleMarker.isVisible()) {
      await vehicleMarker.click();
      
      // Should show vehicle details
      await expect(page.locator('text=Carlos Rodríguez')).toBeVisible();
      await expect(page.locator('text=5 packages')).toBeVisible();
    }
  });
}); 