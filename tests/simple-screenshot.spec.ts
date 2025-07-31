import { test } from '@playwright/test';

test('take screenshot of current state', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);
  
  // Take screenshot
  await page.screenshot({ 
    path: 'screenshots/final-fixed-state.png',
    fullPage: true 
  });
  
  console.log('Screenshot taken of current state');
});