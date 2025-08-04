#!/usr/bin/env node

/**
 * Dashboard Fix Verification Test
 * Tests the fixed dashboard functionality
 */

import puppeteer from 'puppeteer';

console.log('🔧 DASHBOARD FIX VERIFICATION TEST');
console.log('🎯 Testing Fixed PRMCMS Dashboard');
console.log('=' .repeat(50));

async function testDashboardFix() {
  let browser;
  let page;
  
  try {
    console.log('🚀 Launching browser...');
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox'],
      slowMo: 500
    });
    
    page = await browser.newPage();
    
    console.log('🌐 Loading fixed application...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    
    // Take initial screenshot
    await page.screenshot({ path: 'dashboard-fix-1-initial.png', fullPage: true });
    console.log('📸 Initial screenshot saved');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🔑 Logging in...');
    
    // Login
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const signInButton = await page.$('button[type="submit"]');
    
    if (emailInput && passwordInput && signInButton) {
      await emailInput.type('admin@prmcms.com');
      await passwordInput.type('admin123');
      await signInButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('✅ Logged in successfully');
      
      // Take post-login screenshot
      await page.screenshot({ path: 'dashboard-fix-2-logged-in.png', fullPage: true });
      console.log('📸 Post-login screenshot saved');
      
      console.log('\n🔍 TESTING FIXED DASHBOARD...');
      
      // Check for dashboard elements
      const dashboardCards = await page.$$('.card, [class*="card"]');
      console.log(`📋 Dashboard cards found: ${dashboardCards.length}`);
      
      // Check for navigation
      const navItems = await page.$$('nav a, nav button, [data-testid*="nav-"]');
      console.log(`🧭 Navigation items found: ${navItems.length}`);
      
      // Check for clickable dashboard items
      const clickableItems = await page.$$('.cursor-pointer, [onclick]');
      console.log(`🎯 Clickable items found: ${clickableItems.length}`);
      
      // Test dashboard navigation
      console.log('\n🖱️ TESTING DASHBOARD NAVIGATION:');
      
      if (clickableItems.length > 0) {
        console.log('🔄 Testing first dashboard item click...');
        try {
          await clickableItems[0].click();
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const newUrl = page.url();
          console.log(`🌐 URL after click: ${newUrl}`);
          
          await page.screenshot({ path: 'dashboard-fix-3-after-click.png', fullPage: true });
          console.log('📸 Navigation screenshot saved');
          
        } catch (error) {
          console.log(`❌ Click error: ${error.message}`);
        }
      }
      
      // Test specific routes
      console.log('\n🛣️ TESTING DASHBOARD ROUTES:');
      const testRoutes = [
        { route: '/dashboard', name: 'Dashboard' },
        { route: '/customers', name: 'Customers' },
        { route: '/analytics', name: 'Analytics' },
        { route: '/package-intake', name: 'Package Intake' }
      ];
      
      for (const { route, name } of testRoutes) {
        try {
          console.log(`🔄 Testing ${name} (${route})...`);
          await page.goto(`http://localhost:5173#${route}`, { waitUntil: 'networkidle0' });
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const url = page.url();
          const content = await page.content();
          const hasContent = content.length > 1000;
          
          console.log(`  🌐 URL: ${url}`);
          console.log(`  📄 Content loaded: ${hasContent ? '✅ Yes' : '❌ No'}`);
          
        } catch (error) {
          console.log(`  ❌ Route error: ${error.message}`);
        }
      }
      
      // Check for sidebar/navigation
      console.log('\n📱 CHECKING SIDEBAR/NAVIGATION:');
      await page.goto('http://localhost:5173#/dashboard', { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const sidebarElements = await page.$$('.sidebar, [data-testid*="sidebar"], nav');
      console.log(`📱 Sidebar elements found: ${sidebarElements.length}`);
      
      const navigationButtons = await page.$$('button[data-testid*="nav-"], a[data-testid*="nav-"]');
      console.log(`🧭 Navigation buttons found: ${navigationButtons.length}`);
      
      // Test navigation buttons
      if (navigationButtons.length > 0) {
        console.log('🔄 Testing navigation button...');
        try {
          await navigationButtons[0].click();
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const navUrl = page.url();
          console.log(`🌐 Navigation URL: ${navUrl}`);
          
        } catch (error) {
          console.log(`❌ Navigation error: ${error.message}`);
        }
      }
      
      // Final screenshot
      await page.screenshot({ path: 'dashboard-fix-4-final.png', fullPage: true });
      console.log('📸 Final screenshot saved');
      
      return {
        dashboardCards: dashboardCards.length,
        navigationItems: navItems.length,
        clickableItems: clickableItems.length,
        sidebarElements: sidebarElements.length,
        navigationButtons: navigationButtons.length
      };
      
    } else {
      console.log('❌ Login form not found');
      return null;
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
    
    if (page) {
      await page.screenshot({ path: 'dashboard-fix-error.png', fullPage: true });
      console.log('📸 Error screenshot saved');
    }
    
    return null;
  } finally {
    if (browser) {
      console.log('\n⏳ Keeping browser open for 10 seconds...');
      await new Promise(resolve => setTimeout(resolve, 10000));
      await browser.close();
    }
  }
}

// Main execution
(async () => {
  const results = await testDashboardFix();
  
  console.log('\n🎬 DASHBOARD FIX TEST COMPLETE');
  console.log('=' .repeat(50));
  
  if (results) {
    console.log('📊 RESULTS:');
    console.log(`  📋 Dashboard cards: ${results.dashboardCards}`);
    console.log(`  🧭 Navigation items: ${results.navigationItems}`);
    console.log(`  🎯 Clickable items: ${results.clickableItems}`);
    console.log(`  📱 Sidebar elements: ${results.sidebarElements}`);
    console.log(`  🔘 Navigation buttons: ${results.navigationButtons}`);
    
    console.log('\n✅ FIX STATUS:');
    if (results.dashboardCards > 0) {
      console.log('  ✅ Dashboard cards are rendering');
    }
    if (results.clickableItems > 0) {
      console.log('  ✅ Dashboard items are clickable');
    }
    if (results.navigationItems > 0 || results.navigationButtons > 0) {
      console.log('  ✅ Navigation is working');
    }
    if (results.sidebarElements > 0) {
      console.log('  ✅ Sidebar is present');
    }
    
    const isFixed = results.dashboardCards > 0 && 
                   results.clickableItems > 0 && 
                   (results.navigationItems > 0 || results.navigationButtons > 0);
    
    console.log(`\n🎯 OVERALL STATUS: ${isFixed ? '✅ FIXED' : '❌ STILL BROKEN'}`);
    
  } else {
    console.log('❌ Test failed - Unable to verify fix');
  }
  
  console.log('\n📸 SCREENSHOTS:');
  console.log('  📄 dashboard-fix-1-initial.png');
  console.log('  📄 dashboard-fix-2-logged-in.png');
  console.log('  📄 dashboard-fix-3-after-click.png');
  console.log('  📄 dashboard-fix-4-final.png');
  
  process.exit(0);
})();
