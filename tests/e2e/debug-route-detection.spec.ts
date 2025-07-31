import { test, expect } from '@playwright/test';

test.describe('Debug Route Detection', () => {
  test('Check route detection for reset password', async ({ page }) => {
    // Navigate to the reset password page
    await page.goto('/auth/reset-password');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for the route to be processed
    await page.waitForTimeout(3000);
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/debug-route-detection.png' });
    
    // Log the current URL
    console.log('Current URL:', page.url());
    
    // Check console logs for route detection
    const logs = await page.evaluate(() => {
      return new Promise((resolve) => {
        const originalLog = console.log;
        const logs: string[] = [];
        
        console.log = (...args) => {
          logs.push(args.join(' '));
          originalLog.apply(console, args);
        };
        
        // Wait a bit for any route processing
        setTimeout(() => {
          console.log = originalLog;
          resolve(logs);
        }, 2000);
      });
    });
    
    console.log('Console logs:', logs);
    
    // Check if we're on the right page
    const title = await page.locator('h1, h2, h3').first().textContent();
    console.log('Page title:', title);
    
    // Check for reset password specific content
    const resetContent = await page.locator('text=reset,password,email').count();
    console.log('Reset password content count:', resetContent);
    
    // Check if we're getting a 404
    const is404 = await page.locator('text=404').count() > 0;
    console.log('Is 404 page:', is404);
  });
}); 