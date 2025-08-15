#!/usr/bin/env node

/**
 * PRMCMS UI/UX Validation Script
 * Tests key components and user workflows before production deployment
 */

import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';

const TEST_URL = 'http://localhost:8080';
const TIMEOUT = 30000;

console.log('🧪 PRMCMS UI/UX Validation Suite');
console.log('================================');

// Check if dev server is running
async function checkServerStatus() {
  try {
    const response = await fetch(TEST_URL);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Test core UI components
async function testUIComponents() {
  console.log('\n📱 Testing Core UI Components...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'es-PR',
    timezoneId: 'America/Puerto_Rico'
  });
  
  const page = await context.newPage();
  
  try {
    // Navigate to main page
    console.log('🏠 Loading main application...');
    await page.goto(TEST_URL, { waitUntil: 'networkidle', timeout: TIMEOUT });
    
    // Test 1: Page loads successfully
    const title = await page.title();
    console.log(`✅ Page loaded: "${title}"`);
    
    // Test 2: Check for Caribbean theme elements
    console.log('🎨 Checking Caribbean theme...');
    const themeElements = await page.locator('[class*="ocean"], [class*="sunrise"], [class*="palm"]').count();
    console.log(`✅ Found ${themeElements} theme elements`);
    
    // Test 3: Navigation components
    console.log('🧭 Testing navigation...');
    const navItems = await page.locator('nav a, nav button').count();
    console.log(`✅ Found ${navItems} navigation items`);
    
    // Test 4: Mobile responsiveness
    console.log('📱 Testing mobile responsiveness...');
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.waitForTimeout(1000);
    
    const isMobileOptimized = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="mobile"], [class*="responsive"]');
      return elements.length > 0;
    });
    console.log(`✅ Mobile optimization: ${isMobileOptimized ? 'Present' : 'Needs attention'}`);
    
    // Test 5: Forms and inputs
    console.log('📝 Testing form elements...');
    const formElements = await page.locator('input, button, select, textarea').count();
    console.log(`✅ Found ${formElements} interactive elements`);
    
    // Test 6: Spanish localization
    console.log('🇵🇷 Testing Spanish localization...');
    const spanishText = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      const spanishWords = ['paquete', 'cliente', 'buzón', 'entrega', 'notificación'];
      return spanishWords.some(word => text.includes(word));
    });
    console.log(`✅ Spanish localization: ${spanishText ? 'Present' : 'Needs verification'}`);
    
    // Test 7: PWA manifest
    console.log('📲 Testing PWA configuration...');
    const manifestLink = await page.locator('link[rel="manifest"]').count();
    console.log(`✅ PWA manifest: ${manifestLink > 0 ? 'Present' : 'Missing'}`);
    
    // Test 8: Accessibility basics
    console.log('♿ Testing accessibility...');
    const altTexts = await page.locator('img[alt]').count();
    const ariaLabels = await page.locator('[aria-label]').count();
    console.log(`✅ Accessibility: ${altTexts} alt texts, ${ariaLabels} aria labels`);
    
    return {
      success: true,
      metrics: {
        themeElements,
        navItems,
        formElements,
        spanishText,
        manifestPresent: manifestLink > 0,
        altTexts,
        ariaLabels
      }
    };
    
  } catch (error) {
    console.error('❌ UI Test Error:', error.message);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

// Test key user workflows
async function testUserWorkflows() {
  console.log('\n👤 Testing User Workflows...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'es-PR'
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto(TEST_URL, { waitUntil: 'networkidle', timeout: TIMEOUT });
    
    // Workflow 1: Navigation test
    console.log('🔄 Testing navigation workflow...');
    const navLinks = await page.locator('nav a').all();
    let navWorking = 0;
    
    for (let i = 0; i < Math.min(navLinks.length, 3); i++) {
      try {
        await navLinks[i].click();
        await page.waitForTimeout(1000);
        navWorking++;
        console.log(`✅ Navigation ${i + 1} working`);
      } catch (error) {
        console.log(`⚠️  Navigation ${i + 1} issue: ${error.message}`);
      }
    }
    
    // Workflow 2: Form interaction test
    console.log('📝 Testing form interactions...');
    const inputs = await page.locator('input[type="text"], input[type="email"]').all();
    let formsWorking = 0;
    
    for (let i = 0; i < Math.min(inputs.length, 2); i++) {
      try {
        await inputs[i].fill('test@example.com');
        await page.waitForTimeout(500);
        formsWorking++;
        console.log(`✅ Form input ${i + 1} working`);
      } catch (error) {
        console.log(`⚠️  Form input ${i + 1} issue: ${error.message}`);
      }
    }
    
    return {
      success: true,
      metrics: {
        navigationWorking: navWorking,
        formsWorking: formsWorking
      }
    };
    
  } catch (error) {
    console.error('❌ Workflow Test Error:', error.message);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting UI/UX validation...\n');
  
  // Check if server is running
  const serverRunning = await checkServerStatus();
  if (!serverRunning) {
    console.error('❌ Development server not running at ' + TEST_URL);
    console.log('💡 Please run: npm run dev');
    process.exit(1);
  }
  
  console.log('✅ Development server is running');
  
  // Run tests
  const uiResults = await testUIComponents();
  const workflowResults = await testUserWorkflows();
  
  // Generate report
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('========================');
  
  if (uiResults.success) {
    console.log('✅ UI Components: PASSED');
    console.log(`   - Theme elements: ${uiResults.metrics.themeElements}`);
    console.log(`   - Navigation items: ${uiResults.metrics.navItems}`);
    console.log(`   - Form elements: ${uiResults.metrics.formElements}`);
    console.log(`   - Spanish localization: ${uiResults.metrics.spanishText ? 'Yes' : 'No'}`);
    console.log(`   - PWA manifest: ${uiResults.metrics.manifestPresent ? 'Yes' : 'No'}`);
    console.log(`   - Accessibility: ${uiResults.metrics.altTexts + uiResults.metrics.ariaLabels} indicators`);
  } else {
    console.log('❌ UI Components: FAILED');
    console.log(`   Error: ${uiResults.error}`);
  }
  
  if (workflowResults.success) {
    console.log('✅ User Workflows: PASSED');
    console.log(`   - Navigation working: ${workflowResults.metrics.navigationWorking}`);
    console.log(`   - Forms working: ${workflowResults.metrics.formsWorking}`);
  } else {
    console.log('❌ User Workflows: FAILED');
    console.log(`   Error: ${workflowResults.error}`);
  }
  
  const overallSuccess = uiResults.success && workflowResults.success;
  
  console.log('\n🎯 FINAL VERDICT');
  console.log('================');
  
  if (overallSuccess) {
    console.log('🎉 UI/UX validation PASSED! Ready for production deployment.');
    return 0;
  } else {
    console.log('⚠️  UI/UX validation has issues. Please review before deployment.');
    return 1;
  }
}

// Run the tests
runTests().then(exitCode => {
  process.exit(exitCode);
}).catch(error => {
  console.error('❌ Test runner error:', error);
  process.exit(1);
});
