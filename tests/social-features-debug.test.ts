import { test, expect } from '@playwright/test';

// Debug test to understand what's happening with the social page
test.describe('Social Media Features - Debug Test', () => {
  test('should debug social page navigation', async ({ page }) => {
    // Navigate to main page first
    await page.goto('http://localhost:3000/');
    
    // Wait a moment and take a screenshot
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'debug-main-page.png' });
    
    // Check what's on the main page
    const pageContent = await page.content();
    console.log('Main page title:', await page.title());
    console.log('Main page URL:', page.url());
    
    // Try to navigate to social page
    await page.goto('http://localhost:3000/#/social');
    
    // Wait and take another screenshot
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'debug-social-page.png' });
    
    // Check what's on the social page
    console.log('Social page title:', await page.title());
    console.log('Social page URL:', page.url());
    
    // Look for any text on the page
    const allText = await page.evaluate(() => document.body.innerText);
    console.log('Page text (first 500 chars):', allText.substring(0, 500));
    
    // Check if there are any error messages
    const errorElements = await page.locator('text=error,Error,ERROR').count();
    console.log('Error elements found:', errorElements);
    
    // Check if there's a login form
    const loginForm = await page.locator('input[type="email"], input[type="password"]').count();
    console.log('Login form elements found:', loginForm);
    
    // Check if there are any buttons
    const buttons = await page.locator('button').count();
    console.log('Buttons found:', buttons);
    
    // List all buttons
    const buttonTexts = await page.locator('button').allTextContents();
    console.log('Button texts:', buttonTexts);
  });
}); 