import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';

test('HTML file structure test', async ({ page }) => {
  // Read the HTML file directly
  const htmlPath = join(process.cwd(), 'index.html');
  const htmlContent = readFileSync(htmlPath, 'utf-8');
  
  // Set the HTML content directly
  await page.setContent(htmlContent);
  
  // Check if the page title is correct
  const title = await page.title();
  console.log('Page title:', title);
  
  // Check if there's a root element
  const rootElement = await page.$('#root');
  expect(rootElement).toBeTruthy();
  
  // Check if the loading spinner is present
  const loadingSpinner = await page.$('.app-loader');
  expect(loadingSpinner).toBeTruthy();
  
  // Check if the title contains PRMCMS
  expect(title).toContain('PRMCMS');
  
  // Take a screenshot
  await page.screenshot({ path: 'test-results/html-test.png' });
  
  console.log('✅ HTML structure test passed');
}); 