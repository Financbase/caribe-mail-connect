import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for Docker environment...');
  
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
  const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
  
  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Checking service availability...');
    
    // Wait for frontend to be available
    let frontendReady = false;
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes with 10-second intervals
    
    while (!frontendReady && attempts < maxAttempts) {
      try {
        const response = await page.goto(FRONTEND_URL, { timeout: 10000 });
        if (response && response.status() === 200) {
          frontendReady = true;
          console.log('✅ Frontend service is ready');
        }
      } catch (error) {
        attempts++;
        console.log(`⏳ Waiting for frontend... (attempt ${attempts}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
    
    if (!frontendReady) {
      throw new Error('Frontend service not available after waiting');
    }
    
    // Check backend health (optional)
    try {
      const backendResponse = await page.request.get(`${BACKEND_URL}/health`);
      if (backendResponse.status() === 200) {
        console.log('✅ Backend service is ready');
      }
    } catch (error) {
      console.log('⚠️ Backend health check failed, continuing with frontend-only tests');
    }
    
    // Create test results directory
    await page.evaluate(() => {
      // This will be executed in the browser context
      console.log('Setting up test environment...');
    });
    
    console.log('✅ Global setup completed successfully');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
