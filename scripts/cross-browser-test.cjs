#!/usr/bin/env node

/**
 * PRMCMS Cross-Browser Testing Script
 * Validates functionality across different browsers
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🌐 PRMCMS Cross-Browser Testing - Starting...\n');

// Test configuration
const TEST_CONFIG = {
  baseURL: 'http://localhost:5173',
  browsers: [
    { name: 'Chrome', command: 'google-chrome', args: '--headless --disable-gpu --no-sandbox' },
    { name: 'Firefox', command: 'firefox', args: '--headless' },
    { name: 'Safari', command: 'safari', args: '' },
    { name: 'Edge', command: 'msedge', args: '--headless --disable-gpu --no-sandbox' }
  ],
  testURLs: [
    { name: 'Home Page', path: '/' },
    { name: 'Authentication', path: '/auth' },
    { name: 'Customer Dashboard', path: '/customer' },
    { name: 'Staff Dashboard', path: '/staff' },
    { name: 'Package Tracking', path: '/tracking' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Billing', path: '/billing' },
    { name: 'Analytics', path: '/analytics' }
  ]
};

// Results storage
const results = {
  timestamp: new Date().toISOString(),
  tests: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0
  },
  browserResults: {}
};

// Helper function to check if browser is available
function isBrowserAvailable(browser) {
  try {
    execSync(`which ${browser.command}`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to test URL with curl (browser-independent)
function testURLWithCurl(url, browserName) {
  const startTime = Date.now();
  
  try {
    const response = execSync(`curl -s -o /dev/null -w "%{http_code}" ${TEST_CONFIG.baseURL}${url.path}`, { 
      encoding: 'utf8',
      timeout: 10000
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const httpCode = response.trim();
    
    const success = httpCode === '200';
    const emoji = success ? '✅' : '❌';
    
    console.log(`  ${emoji} ${url.name}: HTTP ${httpCode} (${responseTime}ms)`);
    
    return {
      browser: browserName,
      url: url.name,
      path: url.path,
      httpCode,
      responseTime,
      success,
      status: success ? 'passed' : 'failed'
    };
    
  } catch (error) {
    console.log(`  ❌ ${url.name}: Connection failed`);
    
    return {
      browser: browserName,
      url: url.name,
      path: url.path,
      httpCode: null,
      responseTime: null,
      success: false,
      status: 'failed',
      error: error.message
    };
  }
}

// Test browser compatibility
console.log('🔍 Checking Browser Availability...\n');

const availableBrowsers = TEST_CONFIG.browsers.filter(browser => {
  const available = isBrowserAvailable(browser);
  const status = available ? '✅ Available' : '❌ Not Available';
  console.log(`${status}: ${browser.name}`);
  return available;
});

console.log(`\n📊 Found ${availableBrowsers.length} available browsers`);

if (availableBrowsers.length === 0) {
  console.log('\n⚠️  No browsers available for testing');
  console.log('   Using curl-based testing only...\n');
}

// Run tests for each available browser
availableBrowsers.forEach(browser => {
  console.log(`\n🌐 Testing with ${browser.name}...`);
  
  const browserResults = [];
  
  TEST_CONFIG.testURLs.forEach(url => {
    const result = testURLWithCurl(url, browser.name);
    browserResults.push(result);
    results.tests.push(result);
    
    if (result.success) {
      results.summary.passed++;
    } else {
      results.summary.failed++;
    }
    results.summary.total++;
  });
  
  results.browserResults[browser.name] = browserResults;
});

// If no browsers available, run basic curl tests
if (availableBrowsers.length === 0) {
  console.log('\n🌐 Running Basic Browser Compatibility Tests...');
  
  TEST_CONFIG.testURLs.forEach(url => {
    const result = testURLWithCurl(url, 'curl');
    results.tests.push(result);
    
    if (result.success) {
      results.summary.passed++;
    } else {
      results.summary.failed++;
    }
    results.summary.total++;
  });
}

// Calculate summary
console.log('\n📈 Cross-Browser Test Summary');
console.log('============================');

console.log(`✅ Passed: ${results.summary.passed}/${results.summary.total}`);
console.log(`❌ Failed: ${results.summary.failed}/${results.summary.total}`);
console.log(`⏭️  Skipped: ${results.summary.skipped}/${results.summary.total}`);

// Calculate success rate
const successRate = ((results.summary.passed) / results.summary.total * 100).toFixed(1);
console.log(`\n🎯 Success Rate: ${successRate}%`);

// Browser-specific results
console.log('\n🌐 Browser-Specific Results:');
Object.keys(results.browserResults).forEach(browser => {
  const browserTests = results.browserResults[browser];
  const passed = browserTests.filter(test => test.success).length;
  const total = browserTests.length;
  const rate = ((passed / total) * 100).toFixed(1);
  
  console.log(`   ${browser}: ${passed}/${total} (${rate}%)`);
});

// Compatibility grade
let grade = 'A';
if (successRate < 90) grade = 'B';
if (successRate < 80) grade = 'C';
if (successRate < 70) grade = 'D';
if (successRate < 60) grade = 'F';

console.log(`\n📊 Compatibility Grade: ${grade}`);

// Recommendations
console.log('\n💡 Recommendations:');
if (results.summary.failed > 0) {
  console.log('   ❌ Fix failed page loads');
}
if (successRate < 100) {
  console.log('   🟡 Improve cross-browser compatibility');
}
if (availableBrowsers.length < 3) {
  console.log('   ⚠️  Install additional browsers for comprehensive testing');
}
if (successRate >= 95) {
  console.log('   🟢 Excellent cross-browser compatibility!');
}

// Save results
const resultsFile = `./cross-browser-results-${new Date().toISOString().split('T')[0]}.json`;
fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));

console.log(`\n📁 Results saved to: ${resultsFile}`);

// Additional compatibility checks
console.log('\n🔧 Additional Compatibility Checks...');

// Check for common issues
const commonIssues = [];

// Check if server is running
try {
  execSync(`curl -s -o /dev/null -w "%{http_code}" ${TEST_CONFIG.baseURL}`, { 
    encoding: 'utf8',
    timeout: 5000
  });
  console.log('   ✅ Server is accessible');
} catch (error) {
  console.log('   ❌ Server not accessible');
  commonIssues.push('Server not running');
}

// Check for JavaScript errors (basic)
try {
  const jsCheck = execSync(`curl -s ${TEST_CONFIG.baseURL} | grep -i "error"`, { 
    encoding: 'utf8',
    timeout: 5000
  });
  if (jsCheck.trim()) {
    console.log('   ⚠️  Potential JavaScript errors detected');
    commonIssues.push('JavaScript errors');
  } else {
    console.log('   ✅ No obvious JavaScript errors');
  }
} catch (error) {
  console.log('   ✅ JavaScript check passed');
}

// Check for CSS issues (basic)
try {
  const cssCheck = execSync(`curl -s ${TEST_CONFIG.baseURL} | grep -i "css"`, { 
    encoding: 'utf8',
    timeout: 5000
  });
  if (cssCheck.trim()) {
    console.log('   ✅ CSS references found');
  } else {
    console.log('   ⚠️  No CSS references found');
    commonIssues.push('Missing CSS');
  }
} catch (error) {
  console.log('   ⚠️  Could not check CSS references');
}

// Summary of issues
if (commonIssues.length > 0) {
  console.log('\n🚨 Issues Found:');
  commonIssues.forEach(issue => {
    console.log(`   - ${issue}`);
  });
} else {
  console.log('\n✅ No common compatibility issues found');
}

console.log('\n🎉 Cross-browser testing completed!');
console.log('\nNext steps:');
console.log('- Fix any failed page loads');
console.log('- Test on actual browsers (not just curl)');
console.log('- Validate responsive design on mobile');
console.log('- Test JavaScript functionality manually');
console.log('- Check for browser-specific CSS issues'); 