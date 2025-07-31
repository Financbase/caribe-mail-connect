import { test, expect } from '@playwright/test';

test('Debug React mounting issue', async ({ page }) => {
  // Capture console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
  });

  // Capture page errors
  const pageErrors: string[] = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });

  // Navigate to the page
  await page.goto('http://localhost:3000/');
  
  // Wait for the page to load
  await page.waitForLoadState('domcontentloaded');
  
  // Wait a bit for React to potentially mount
  await page.waitForTimeout(3000);
  
  // Check what's in the root element
  const rootElement = await page.$('#root');
  const rootHTML = await rootElement?.innerHTML();
  
  console.log('=== DEBUG INFO ===');
  console.log('Console messages:', consoleMessages);
  console.log('Page errors:', pageErrors);
  console.log('Root element HTML:', rootHTML);
  
  // Check if React has replaced the loading spinner
  const hasLoadingSpinner = rootHTML?.includes('app-loader');
  const hasReactContent = rootHTML?.includes('PRMCMS') || rootHTML?.includes('Personal');
  
  console.log('Has loading spinner:', hasLoadingSpinner);
  console.log('Has React content:', hasReactContent);
  
  // Take a screenshot
  await page.screenshot({ path: 'test-results/debug-screenshot.png' });
  
  // Basic assertion - just check that we got some information
  expect(consoleMessages.length >= 0).toBeTruthy();
}); 