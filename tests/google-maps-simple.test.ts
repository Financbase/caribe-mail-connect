import { test, expect } from '@playwright/test';

test.describe('Google Maps Integration - Simple Browser Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');
    
    // Wait for the app to load - look for any element that indicates the app loaded
    await page.waitForSelector('body', { timeout: 10000 });
  });

  test('should load the application', async ({ page }) => {
    // Check if the page title is set
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Check if the page loaded without errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Wait a bit for any errors to appear
    await page.waitForTimeout(2000);
    
    // Log any console errors for debugging
    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors);
    }
  });

  test('should navigate to last-mile page', async ({ page }) => {
    // Wait for the page to be interactive
    await page.waitForTimeout(2000);
    
    // Try to find and click the last-mile navigation
    const lastMileLink = page.locator('text=Last-Mile Delivery').first();
    
    if (await lastMileLink.isVisible()) {
      await lastMileLink.click();
      
      // Wait for navigation
      await page.waitForTimeout(2000);
      
      // Check if we're on the last-mile page
      const pageContent = await page.textContent('body');
      expect(pageContent).toContain('Last-Mile');
    } else {
      // If the link isn't visible, check if we're already on the page
      const pageContent = await page.textContent('body');
      if (pageContent?.includes('Last-Mile')) {
        console.log('Already on last-mile page');
      } else {
        console.log('Last-Mile link not found, current page content:', pageContent?.substring(0, 200));
      }
    }
  });

  test('should check for Google Maps API key configuration', async ({ page }) => {
    // Check if the environment variable is accessible
    const hasApiKey = await page.evaluate(() => {
      // Try to access the environment variable
      return typeof window !== 'undefined' && 
             typeof (window as any).__VITE_GOOGLE_MAPS_API_KEY !== 'undefined';
    });
    
    console.log('Has API key in window object:', hasApiKey);
    
    // Check if Google Maps script is being loaded
    const scripts = await page.locator('script[src*="maps.googleapis.com"]').count();
    console.log('Google Maps scripts found:', scripts);
  });

  test('should check for Google Maps provider component', async ({ page }) => {
    // Wait for the page to load
    await page.waitForTimeout(3000);
    
    // Check if Google Maps provider is initialized
    const googleMapsLoaded = await page.evaluate(() => {
      return typeof window.google !== 'undefined' && 
             typeof window.google.maps !== 'undefined';
    });
    
    console.log('Google Maps loaded:', googleMapsLoaded);
    
    if (!googleMapsLoaded) {
      console.log('Google Maps not loaded - checking for error messages');
      
      // Look for error messages
      const errorElements = await page.locator('text=Google Maps API key is not configured').count();
      console.log('Error elements found:', errorElements);
    }
  });

  test('should check app structure and navigation', async ({ page }) => {
    // Wait for the page to load
    await page.waitForTimeout(2000);
    
    // Get all text content to understand the app structure
    const bodyText = await page.textContent('body');
    console.log('Page content preview:', bodyText?.substring(0, 500));
    
    // Look for common navigation elements
    const navElements = await page.locator('nav, [role="navigation"], .sidebar, .menu').count();
    console.log('Navigation elements found:', navElements);
    
    // Look for any buttons or links
    const buttons = await page.locator('button, a').count();
    console.log('Buttons/links found:', buttons);
  });
}); 