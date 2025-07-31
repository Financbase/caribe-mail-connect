import { test, expect } from '@playwright/test';

test.describe('Basic Application Load', () => {
  test('Application loads and shows PRMCMS content', async ({ page }) => {
    // Navigate to the root using baseURL from config
    await page.goto('/');
    
    // Wait for the page to be ready (DOM content loaded)
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for React to load and render - look for actual content, not just CSS
    await page.waitForFunction(() => {
      const body = document.body;
      const text = body.textContent || '';
      return text.includes('PRMCMS') || text.includes('Puerto Rico') || text.includes('Personal');
    }, { timeout: 15000 });
    
    // Check if we can see PRMCMS content
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('PRMCMS');
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/basic-load.png' });
  });

  test('Auth page loads correctly', async ({ page }) => {
    // Navigate to auth page using baseURL from config
    await page.goto('/auth');
    
    // Wait for the page to be ready
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for React to load and render - look for actual content
    await page.waitForFunction(() => {
      const body = document.body;
      const text = body.textContent || '';
      return text.includes('PRMCMS') && (text.includes('Personal') || text.includes('Cliente'));
    }, { timeout: 15000 });
    
    // Check if we can see authentication content
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('PRMCMS');
    expect(bodyText).toContain('Personal');
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/auth-load.png' });
  });
}); 