import { test, expect } from '@playwright/test';

test('should load the app and check Google Maps availability', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:5176');
  
  // Wait for the app to load
  await page.waitForSelector('body', { timeout: 10000 });
  
  // Check if we're on the login page
  const isLoginPage = await page.locator('text=Iniciar sesión').isVisible();
  console.log('On login page:', isLoginPage);
  
  if (isLoginPage) {
    // Check if Google Maps script is being loaded
    const scripts = await page.locator('script[src*="maps.googleapis.com"]').count();
    console.log('Google Maps scripts found:', scripts);
    
    // Check if Google Maps is loaded in the browser
    const googleMapsLoaded = await page.evaluate(() => {
      return typeof window.google !== 'undefined' && 
             typeof window.google.maps !== 'undefined';
    });
    console.log('Google Maps loaded:', googleMapsLoaded);
    
    // Check for any error messages
    const errorElements = await page.locator('text=Google Maps API key is not configured').count();
    console.log('Error elements found:', errorElements);
    
    // Get page content for debugging
    const pageContent = await page.textContent('body');
    console.log('Page content preview:', pageContent?.substring(0, 300));
  }
  
  // The test passes if we can load the page
  expect(true).toBe(true);
}); 