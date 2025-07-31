import { test, expect } from '@playwright/test';

test.describe('Debug Route Detection', () => {
  test('Check route detection for /auth/staff', async ({ page }) => {
    await page.goto('/auth/staff');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait a bit for the route to be processed
    await page.waitForTimeout(2000);
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/debug-route-staff.png' });
    
    // Log the current URL
    console.log('Current URL:', page.url());
    
    // Log the page content
    const bodyText = await page.locator('body').textContent();
    console.log('Body text:', bodyText?.substring(0, 300));
    
    // Check if any h1 exists
    const h1Count = await page.locator('h1').count();
    console.log('Number of h1 elements:', h1Count);
    
    if (h1Count > 0) {
      const h1Text = await page.locator('h1').first().textContent();
      console.log('First h1 text:', h1Text);
    }
    
    // Check console logs for route detection
    const logs = await page.evaluate(() => {
      return window.console.logs || [];
    });
    console.log('Console logs:', logs);
  });
}); 