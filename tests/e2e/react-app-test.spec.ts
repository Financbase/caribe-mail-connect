import { test, expect } from '@playwright/test';

test('React app loads from built files', async ({ page }) => {
  // Navigate to the app using baseURL from config
  await page.goto('/');
  
  // Wait for the page to load
  await page.waitForLoadState('domcontentloaded');
  
  // Wait for React to load and render - look for actual content
  await page.waitForFunction(() => {
    const body = document.body;
    const text = body.textContent || '';
    return text.includes('PRMCMS') || text.includes('Puerto Rico') || text.includes('Personal');
  }, { timeout: 15000 });
  
  // Check if we can see PRMCMS content
  const bodyText = await page.textContent('body');
  console.log('Body text (first 500 chars):', bodyText?.substring(0, 500));
  
  // Basic assertions
  expect(bodyText).toContain('PRMCMS');
  
  // Check if React has replaced the loading spinner
  const hasLoadingSpinner = await page.$('.app-loader');
  console.log('Loading spinner still present:', !!hasLoadingSpinner);
  
  // Take a screenshot
  await page.screenshot({ path: 'test-results/react-app-test.png' });
  
  console.log('✅ React app test passed');
}); 