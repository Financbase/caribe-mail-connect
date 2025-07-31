import { test, expect } from '@playwright/test';

test.describe('Google Maps Integration - Real Browser Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5176');
    
    // Wait for the app to load
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Check if we're on the login page
    const isLoginPage = await page.locator('text=Iniciar sesión').isVisible();
    
    if (isLoginPage) {
      console.log('On login page - logging in with admin account');
      
      // Use the admin test account
      await page.fill('input[type="email"]', 'admin@prmcms.com');
      await page.fill('input[type="password"]', 'admin123');
      
      // Click the login button
      await page.click('button:has-text("Iniciar sesión")');
      
      // Wait for authentication to complete and dashboard to load
      await page.waitForTimeout(3000);
      
      // Check if we're now on the dashboard
      const dashboardLoaded = await page.locator('text=Dashboard, text=Panel de Control').isVisible();
      if (dashboardLoaded) {
        console.log('Successfully logged in and dashboard loaded');
      } else {
        console.log('Dashboard not loaded, checking current page...');
        const currentText = await page.textContent('body');
        console.log('Current page content:', currentText?.substring(0, 300));
      }
    } else {
      console.log('Not on login page, checking current state...');
    }
  });

  test('should access authenticated dashboard', async ({ page }) => {
    // Wait for the dashboard to load
    await page.waitForTimeout(3000);
    
    // Check if we're now on the dashboard
    const dashboardText = await page.textContent('body');
    console.log('Dashboard content preview:', dashboardText?.substring(0, 500));
    
    // Look for dashboard elements
    const hasDashboard = dashboardText?.includes('Dashboard') || 
                        dashboardText?.includes('Panel de Control') ||
                        dashboardText?.includes('Last-Mile');
    
    expect(hasDashboard).toBeTruthy();
    console.log('Dashboard access confirmed');
  });

  test('should navigate to last-mile page', async ({ page }) => {
    // Wait for the dashboard to load
    await page.waitForTimeout(3000);
    
    // Look for the last-mile navigation link
    const lastMileLink = page.locator('text=Last-Mile Delivery').first();
    
    if (await lastMileLink.isVisible()) {
      console.log('Found Last-Mile Delivery link, clicking...');
      await lastMileLink.click();
      
      // Wait for navigation
      await page.waitForTimeout(2000);
      
      // Check if we're on the last-mile page
      const pageContent = await page.textContent('body');
      expect(pageContent).toContain('Last-Mile');
      
      console.log('Successfully navigated to last-mile page');
    } else {
      console.log('Last-Mile Delivery link not found');
      
      // List all visible text to help debug
      const allText = await page.locator('body').textContent();
      console.log('All visible text:', allText?.substring(0, 1000));
      
      // Fail the test if we can't find the link
      expect(false).toBe(true);
    }
  });

  test('should display Google Maps on last-mile page', async ({ page }) => {
    // Wait for the dashboard to load
    await page.waitForTimeout(3000);
    
    // Navigate to last-mile page
    const lastMileLink = page.locator('text=Last-Mile Delivery').first();
    
    if (await lastMileLink.isVisible()) {
      await lastMileLink.click();
      await page.waitForTimeout(2000);
      
      // Check if Google Maps is loaded
      const googleMapsLoaded = await page.evaluate(() => {
        return typeof window.google !== 'undefined' && 
               typeof window.google.maps !== 'undefined';
      });
      
      expect(googleMapsLoaded).toBe(true);
      console.log('Google Maps is loaded on last-mile page');
      
      // Look for map container
      const mapContainer = page.locator('.w-full.h-96, [data-testid="map-container"]');
      if (await mapContainer.isVisible()) {
        console.log('Map container is visible');
        expect(true).toBe(true);
      } else {
        console.log('Map container not found');
        // Take a screenshot for debugging
        await page.screenshot({ path: 'test-results/map-container-not-found.png' });
        expect(false).toBe(true);
      }
    } else {
      console.log('Last-Mile Delivery link not found');
      expect(false).toBe(true);
    }
  });

  test('should display live tracking tab', async ({ page }) => {
    // Wait for the dashboard to load
    await page.waitForTimeout(3000);
    
    // Navigate to last-mile page
    const lastMileLink = page.locator('text=Last-Mile Delivery').first();
    
    if (await lastMileLink.isVisible()) {
      await lastMileLink.click();
      await page.waitForTimeout(2000);
      
      // Look for tracking tab
      const trackingTab = page.locator('text=Tracking, text=Tracking').first();
      
      if (await trackingTab.isVisible()) {
        console.log('Found tracking tab, clicking...');
        await trackingTab.click();
        await page.waitForTimeout(1000);
        
        // Check for live tracking content
        const hasLiveTracking = await page.locator('text=Live Tracking, text=Seguimiento en Vivo').isVisible();
        expect(hasLiveTracking).toBe(true);
        console.log('Live tracking tab is working');
      } else {
        console.log('Tracking tab not found');
        // Take a screenshot for debugging
        await page.screenshot({ path: 'test-results/tracking-tab-not-found.png' });
        expect(false).toBe(true);
      }
    } else {
      console.log('Last-Mile Delivery link not found');
      expect(false).toBe(true);
    }
  });

  test('should display route optimization tab', async ({ page }) => {
    // Wait for the dashboard to load
    await page.waitForTimeout(3000);
    
    // Navigate to last-mile page
    const lastMileLink = page.locator('text=Last-Mile Delivery').first();
    
    if (await lastMileLink.isVisible()) {
      await lastMileLink.click();
      await page.waitForTimeout(2000);
      
      // Look for optimization tab
      const optimizationTab = page.locator('text=Optimization, text=Optimización').first();
      
      if (await optimizationTab.isVisible()) {
        console.log('Found optimization tab, clicking...');
        await optimizationTab.click();
        await page.waitForTimeout(1000);
        
        // Check for route optimization content
        const hasRouteOptimization = await page.locator('text=Route Optimization, text=Optimización de Rutas').isVisible();
        expect(hasRouteOptimization).toBe(true);
        console.log('Route optimization tab is working');
      } else {
        console.log('Optimization tab not found');
        // Take a screenshot for debugging
        await page.screenshot({ path: 'test-results/optimization-tab-not-found.png' });
        expect(false).toBe(true);
      }
    } else {
      console.log('Last-Mile Delivery link not found');
      expect(false).toBe(true);
    }
  });

  test('should display vehicle markers on map', async ({ page }) => {
    // Wait for the dashboard to load
    await page.waitForTimeout(3000);
    
    // Navigate to last-mile page
    const lastMileLink = page.locator('text=Last-Mile Delivery').first();
    
    if (await lastMileLink.isVisible()) {
      await lastMileLink.click();
      await page.waitForTimeout(2000);
      
      // Click on tracking tab
      const trackingTab = page.locator('text=Tracking, text=Tracking').first();
      if (await trackingTab.isVisible()) {
        await trackingTab.click();
        await page.waitForTimeout(2000);
        
        // Check if vehicle information is displayed
        const hasVehicleInfo = await page.locator('text=Carlos Rodríguez, text=María González').isVisible();
        expect(hasVehicleInfo).toBe(true);
        console.log('Vehicle information is displayed');
        
        // Check if vehicle count is shown
        const hasVehicleCount = await page.locator('text=vehicles, text=vehículos').isVisible();
        expect(hasVehicleCount).toBe(true);
        console.log('Vehicle count is displayed');
      } else {
        console.log('Tracking tab not found');
        expect(false).toBe(true);
      }
    } else {
      console.log('Last-Mile Delivery link not found');
      expect(false).toBe(true);
    }
  });
}); 