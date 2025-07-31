import { test, expect } from '@playwright/test';

test('final verification of shadcn/ui styling', async ({ page }) => {
  await page.goto('http://localhost:3000/#/style-test', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  
  // Take screenshot of style test page
  await page.screenshot({ 
    path: 'screenshots/style-test-page.png',
    fullPage: true 
  });
  
  // Go to main page
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ 
    path: 'screenshots/final-main-page.png',
    fullPage: true 
  });
  
  // Check for gradients
  const hasGradients = await page.evaluate(() => {
    const elements = document.querySelectorAll('[class*="bg-gradient"]');
    return elements.length > 0;
  });
  
  console.log('Has gradient elements:', hasGradients);
  
  // Check for shadcn Card components  
  const hasCards = await page.evaluate(() => {
    const cards = document.querySelectorAll('[class*="rounded"][class*="border"]');
    return cards.length > 0;
  });
  
  console.log('Has card elements:', hasCards);
  
  // Check Inter font
  const fontFamily = await page.evaluate(() => {
    return window.getComputedStyle(document.body).fontFamily;
  });
  
  console.log('Font family:', fontFamily);
  
  expect(fontFamily).toContain('Inter');
});