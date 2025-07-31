import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  
  console.log('🚀 Starting global setup for PRMCMS E2E tests...');
  
  // Launch browser for setup tasks
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the application
    await page.goto(baseURL!);
    
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
    
    // Check if the app is running
    const title = await page.title();
    console.log(`✅ Application loaded: ${title}`);
    
    // Verify basic functionality - wait for any content to load
    await page.waitForSelector('body', { timeout: 15000 });
    
    // Check for any heading or main content
    try {
      const heading = await page.textContent('h1', { timeout: 5000 });
      if (heading) {
        console.log(`✅ Main heading found: ${heading}`);
      }
    } catch (error) {
      console.log(`⚠️ No h1 heading found, checking body content`);
    }
    
    try {
      const bodyText = await page.textContent('body', { timeout: 5000 });
      if (bodyText && bodyText.includes('PRMCMS')) {
        console.log(`✅ PRMCMS content found in body`);
      } else if (bodyText) {
        console.log(`✅ Page content loaded: ${bodyText.substring(0, 100)}...`);
      } else {
        console.log(`⚠️ No body content found`);
      }
    } catch (error) {
      console.log(`⚠️ Could not read body content`);
    }
    
    // Check for language toggle
    const languageButton = await page.$('button[aria-label*="Switch"]');
    if (languageButton) {
      console.log('✅ Language toggle found');
    }
    
    // Check for login form
    const loginForm = await page.$('form');
    if (loginForm) {
      console.log('✅ Login form found');
    }
    
    console.log('✅ Global setup completed successfully');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup; 