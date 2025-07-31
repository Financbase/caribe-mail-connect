import { test, expect } from '@playwright/test';

test('Minimal React app test', async ({ page }) => {
  // Navigate to the page using baseURL from config
  await page.goto('/');
  
  // Wait for basic page load
  await page.waitForLoadState('domcontentloaded');
  
  // Check if the page title is correct
  const title = await page.title();
  console.log('Page title:', title);
  
  // Check if there's any content in the body
  const bodyText = await page.textContent('body');
  console.log('Body text (first 200 chars):', bodyText?.substring(0, 200));
  
  // Basic assertions
  expect(title).toContain('PRMCMS');
  expect(bodyText).toBeTruthy();
  
  // Take a screenshot
  await page.screenshot({ path: 'test-results/minimal-test.png' });
}); 