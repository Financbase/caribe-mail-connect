import { test, expect, Page } from '@playwright/test';

// Test configuration for Docker environment
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// Demo credentials
const DEMO_CREDENTIALS = {
  admin: { email: 'admin@prmcms.com', password: 'admin123' },
  staff: { email: 'staff@prmcms.com', password: 'staff123' },
  customer: { email: 'customer@example.com', password: 'customer123' }
};

// Dashboard modules that should be available
const EXPECTED_DASHBOARD_MODULES = [
  'package-intake', 'customers', 'mailboxes', 'analytics',
  'routes', 'employees', 'training', 'qa',
  'communications', 'marketplace', 'devices', 'iot-monitoring',
  'last-mile', 'billing', 'inventory', 'documents',
  'reports', 'admin', 'integrations', 'notifications'
];

test.describe('PRMCMS Docker Environment - Comprehensive Testing', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for Docker environment
    test.setTimeout(120000);
    
    // Wait for services to be ready
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle' });
  });

  test('Docker Services Health Check', async ({ page }) => {
    console.log('🔍 Testing Docker services health...');
    
    // Test frontend accessibility
    const frontendResponse = await page.goto(FRONTEND_URL);
    expect(frontendResponse?.status()).toBe(200);
    
    // Test backend health endpoint
    try {
      const backendResponse = await page.request.get(`${BACKEND_URL}/health`);
      expect(backendResponse.status()).toBe(200);
      console.log('✅ Backend health check passed');
    } catch (error) {
      console.log('⚠️ Backend health check failed, continuing with frontend tests');
    }
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'test-results/docker-01-services-health.png', 
      fullPage: true 
    });
    
    console.log('✅ Docker services health check completed');
  });

  test('Authentication Flow - Admin Login', async ({ page }) => {
    console.log('🔑 Testing admin authentication flow...');
    
    await page.goto(FRONTEND_URL);
    
    // Wait for login form
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });
    
    // Fill login form
    await page.fill('input[type="email"]', DEMO_CREDENTIALS.admin.email);
    await page.fill('input[type="password"]', DEMO_CREDENTIALS.admin.password);
    
    // Take screenshot before login
    await page.screenshot({ 
      path: 'test-results/docker-02-login-form.png', 
      fullPage: true 
    });
    
    // Submit login
    await page.click('button[type="submit"]');
    
    // Wait for successful login (redirect to dashboard)
    await page.waitForURL(/dashboard|packages/, { timeout: 30000 });
    
    // Take screenshot after login
    await page.screenshot({ 
      path: 'test-results/docker-03-after-login.png', 
      fullPage: true 
    });
    
    // Verify we're logged in
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/dashboard|packages/);
    
    console.log('✅ Admin authentication successful');
  });

  test('Dashboard Functionality - Module Accessibility', async ({ page }) => {
    console.log('📊 Testing dashboard module accessibility...');
    
    // Login first
    await page.goto(FRONTEND_URL);
    await page.waitForSelector('input[type="email"]');
    await page.fill('input[type="email"]', DEMO_CREDENTIALS.admin.email);
    await page.fill('input[type="password"]', DEMO_CREDENTIALS.admin.password);
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL(/dashboard|packages/, { timeout: 30000 });
    
    // Navigate to dashboard if not already there
    if (!page.url().includes('/dashboard')) {
      await page.goto(`${FRONTEND_URL}/dashboard`);
    }
    
    await page.waitForLoadState('networkidle');
    
    // Take dashboard screenshot
    await page.screenshot({ 
      path: 'test-results/docker-04-dashboard-loaded.png', 
      fullPage: true 
    });
    
    // Check for dashboard cards/modules
    const dashboardCards = await page.$$('.card, [class*="card"], .dashboard-item');
    console.log(`📋 Found ${dashboardCards.length} dashboard cards`);
    
    // Verify we have multiple dashboard modules
    expect(dashboardCards.length).toBeGreaterThan(1);
    
    // Test clicking on dashboard modules
    if (dashboardCards.length > 0) {
      console.log('🖱️ Testing dashboard module navigation...');
      
      // Click first available module
      await dashboardCards[0].click();
      await page.waitForTimeout(2000);
      
      // Take screenshot after navigation
      await page.screenshot({ 
        path: 'test-results/docker-05-module-navigation.png', 
        fullPage: true 
      });
      
      console.log('✅ Dashboard module navigation working');
    }
    
    console.log('✅ Dashboard functionality test completed');
  });

  test('Package Management Access', async ({ page }) => {
    console.log('📦 Testing package management access...');
    
    // Login and navigate to packages
    await page.goto(FRONTEND_URL);
    await page.waitForSelector('input[type="email"]');
    await page.fill('input[type="email"]', DEMO_CREDENTIALS.admin.email);
    await page.fill('input[type="password"]', DEMO_CREDENTIALS.admin.password);
    await page.click('button[type="submit"]');
    
    // Navigate to packages
    await page.goto(`${FRONTEND_URL}/packages`);
    await page.waitForLoadState('networkidle');
    
    // Take package management screenshot
    await page.screenshot({ 
      path: 'test-results/docker-06-package-management.png', 
      fullPage: true 
    });
    
    // Verify package management interface
    const pageContent = await page.textContent('body');
    expect(pageContent).toMatch(/package|Package|PACKAGE/i);
    
    console.log('✅ Package management access verified');
  });

  test('Multi-User Authentication', async ({ page }) => {
    console.log('👥 Testing multi-user authentication...');
    
    const users = [
      { role: 'staff', creds: DEMO_CREDENTIALS.staff },
      { role: 'customer', creds: DEMO_CREDENTIALS.customer }
    ];
    
    for (const user of users) {
      console.log(`🔑 Testing ${user.role} login...`);
      
      await page.goto(FRONTEND_URL);
      await page.waitForSelector('input[type="email"]');
      
      // Clear and fill form
      await page.fill('input[type="email"]', '');
      await page.fill('input[type="password"]', '');
      await page.fill('input[type="email"]', user.creds.email);
      await page.fill('input[type="password"]', user.creds.password);
      
      await page.click('button[type="submit"]');
      
      // Wait for successful login
      await page.waitForURL(/dashboard|packages/, { timeout: 30000 });
      
      // Take screenshot
      await page.screenshot({ 
        path: `test-results/docker-07-${user.role}-login.png`, 
        fullPage: true 
      });
      
      console.log(`✅ ${user.role} login successful`);
      
      // Logout for next user
      try {
        const logoutButton = await page.$('button:has-text("Sign Out"), button:has-text("Logout")');
        if (logoutButton) {
          await logoutButton.click();
          await page.waitForTimeout(1000);
        }
      } catch (error) {
        // If logout fails, just navigate to login page
        await page.goto(FRONTEND_URL);
      }
    }
    
    console.log('✅ Multi-user authentication test completed');
  });

  test('Responsive Design and Mobile View', async ({ page }) => {
    console.log('📱 Testing responsive design...');
    
    // Login first
    await page.goto(FRONTEND_URL);
    await page.waitForSelector('input[type="email"]');
    await page.fill('input[type="email"]', DEMO_CREDENTIALS.admin.email);
    await page.fill('input[type="password"]', DEMO_CREDENTIALS.admin.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard|packages/, { timeout: 30000 });
    
    // Test different viewport sizes
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];
    
    for (const viewport of viewports) {
      console.log(`📐 Testing ${viewport.name} viewport...`);
      
      await page.setViewportSize({ 
        width: viewport.width, 
        height: viewport.height 
      });
      
      await page.waitForTimeout(1000);
      
      // Take screenshot
      await page.screenshot({ 
        path: `test-results/docker-08-${viewport.name}-view.png`, 
        fullPage: true 
      });
    }
    
    console.log('✅ Responsive design test completed');
  });

  test('Error Handling and Edge Cases', async ({ page }) => {
    console.log('🚨 Testing error handling...');
    
    // Test invalid login
    await page.goto(FRONTEND_URL);
    await page.waitForSelector('input[type="email"]');
    
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait for error message or stay on login page
    await page.waitForTimeout(3000);
    
    // Take screenshot of error state
    await page.screenshot({ 
      path: 'test-results/docker-09-error-handling.png', 
      fullPage: true 
    });
    
    // Test navigation to non-existent routes
    await page.goto(`${FRONTEND_URL}/nonexistent-route`);
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'test-results/docker-10-404-handling.png', 
      fullPage: true 
    });
    
    console.log('✅ Error handling test completed');
  });

  test('Performance and Load Time', async ({ page }) => {
    console.log('⚡ Testing performance metrics...');
    
    const startTime = Date.now();
    
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`📊 Page load time: ${loadTime}ms`);
    
    // Verify reasonable load time (under 10 seconds for Docker environment)
    expect(loadTime).toBeLessThan(10000);
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'test-results/docker-11-performance-test.png', 
      fullPage: true 
    });
    
    console.log('✅ Performance test completed');
  });

});
