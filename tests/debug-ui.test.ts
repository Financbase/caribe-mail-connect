import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('Debug: Check what the application is actually showing', async ({ page }) => {
  // Navigate to the application
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Take a screenshot
  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });

  // Get page title
  const title = await page.title();
  console.log('Page title:', title);

  // Get all text content
  const bodyText = await page.textContent('body');
  console.log('Page contains text:', bodyText?.substring(0, 500) + '...');

  // Get all visible elements
  const allElements = await page.locator('*').all();
  console.log('Number of elements found:', allElements.length);

  // Look for specific elements
  const inputs = await page.locator('input').all();
  console.log('Number of inputs found:', inputs.length);

  const buttons = await page.locator('button').all();
  console.log('Number of buttons found:', buttons.length);

  const links = await page.locator('a').all();
  console.log('Number of links found:', links.length);

  // Check for common text patterns
  const hasLogin = await page.locator('text=/login|entrar|sign in/i').count();
  console.log('Login elements found:', hasLogin);

  const hasAuth = await page.locator('text=/auth|authentication/i').count();
  console.log('Auth elements found:', hasAuth);

  const hasDashboard = await page.locator('text=/dashboard|panel/i').count();
  console.log('Dashboard elements found:', hasDashboard);

  const hasDemo = await page.locator('text=/demo|mode/i').count();
  console.log('Demo mode elements found:', hasDemo);

  // Check for specific classes or IDs that might indicate the app state
  const demoWarning = page.locator('[class*="amber"], [class*="warning"]');
  const demoWarningVisible = await demoWarning.count();
  console.log('Demo warning elements found:', demoWarningVisible);

  // Get HTML of the body to understand structure
  const bodyHTML = await page.locator('body').innerHTML();
  console.log('Body HTML length:', bodyHTML.length);
  
  // Save HTML to file for analysis
  require('fs').writeFileSync('debug-page.html', bodyHTML);
  
  expect(title).toBeDefined();
});