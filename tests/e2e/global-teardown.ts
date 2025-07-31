import { chromium, FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown for PRMCMS E2E tests...');
  
  // Launch browser for cleanup tasks
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the application for cleanup
    await page.goto(config.projects[0].use.baseURL!);
    
    // Clear any stored data
    await page.evaluate(() => {
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear IndexedDB
      indexedDB.databases().then(databases => {
        databases.forEach(db => {
          indexedDB.deleteDatabase(db.name);
        });
      });
      
      // Clear service worker cache
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            caches.delete(cacheName);
          });
        });
      }
    });
    
    console.log('✅ Storage cleared');
    
    // Log test completion
    console.log('✅ Global teardown completed successfully');
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
  } finally {
    await browser.close();
  }
}

export default globalTeardown; 