import { test, expect } from '@playwright/test';

test.describe('Simple Application Load', () => {
  test('Application loads without networkidle wait', async ({ page }) => {
    // Navigate to the root
    await page.goto('/');
    
    // Wait just for DOM content to load
    await page.waitForLoadState('domcontentloaded');
    
    // Check if we can see any content
    const bodyText = await page.locator('body').textContent();
    console.log('Body text:', bodyText?.substring(0, 200));
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/simple-load.png' });
    
    // Just check if the page has some content
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('Auth page loads without networkidle wait', async ({ page }) => {
    // Navigate to auth page
    await page.goto('/auth');
    
    // Wait just for DOM content to load
    await page.waitForLoadState('domcontentloaded');
    
    // Check if we can see any content
    const bodyText = await page.locator('body').textContent();
    console.log('Auth body text:', bodyText?.substring(0, 200));
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/simple-auth-load.png' });
    
    // Just check if the page has some content
    await expect(page.locator('body')).not.toBeEmpty();
  });
}); 