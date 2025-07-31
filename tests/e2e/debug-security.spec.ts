import { test, expect } from '@playwright/test';

test.describe('Debug Security Page', () => {
  test('Check Security page content', async ({ page }) => {
    await page.goto('/security');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait a bit for the page to load
    await page.waitForTimeout(2000);
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/debug-security.png' });
    
    // Log the current URL
    console.log('Current URL:', page.url());
    
    // Log the page content
    const bodyText = await page.locator('body').textContent();
    console.log('Body text:', bodyText?.substring(0, 500));
    
    // Check if any h1 exists
    const h1Count = await page.locator('h1').count();
    console.log('Number of h1 elements:', h1Count);
    
    if (h1Count > 0) {
      const h1Text = await page.locator('h1').first().textContent();
      console.log('First h1 text:', h1Text);
    }
    
    // Check for security-related text
    const securityText = await page.locator('text=Seguridad|Security').count();
    console.log('Security text count:', securityText);
    
    // Check for 2FA text
    const twoFactorText = await page.locator('text=Autenticación de Dos Factores|Two-Factor Authentication').count();
    console.log('Two-Factor text count:', twoFactorText);
    
    // List all text content
    const allText = await page.locator('*').allTextContents();
    console.log('All text content:', allText.slice(0, 10));
  });
}); 