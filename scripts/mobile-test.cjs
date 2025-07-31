#!/usr/bin/env node

/**
 * PRMCMS Mobile Testing Script
 * Validates responsive design and mobile functionality
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('📱 PRMCMS Mobile Testing - Starting...\n');

// Mobile test configuration
const MOBILE_CONFIG = {
  baseURL: 'http://localhost:5173',
  devices: [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12 Pro', width: 390, height: 844 },
    { name: 'iPhone 12 Pro Max', width: 428, height: 926 },
    { name: 'Samsung Galaxy S20', width: 360, height: 800 },
    { name: 'Samsung Galaxy S21', width: 384, height: 854 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'iPad Pro', width: 1024, height: 1366 }
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
    responsive: 0,
    notResponsive: 0
  },
  deviceResults: {}
};

// Helper function to test URL with mobile user agent
function testURLWithMobileAgent(url, device) {
  const startTime = Date.now();
  
  try {
    const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1';
    
    const response = execSync(`curl -s -o /dev/null -w "%{http_code}" -H "User-Agent: ${userAgent}" ${MOBILE_CONFIG.baseURL}${url.path}`, { 
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
      device: device.name,
      url: url.name,
      path: url.path,
      httpCode,
      responseTime,
      success,
      status: success ? 'passed' : 'failed',
      viewport: `${device.width}x${device.height}`
    };
    
  } catch (error) {
    console.log(`  ❌ ${url.name}: Connection failed`);
    
    return {
      device: device.name,
      url: url.name,
      path: url.path,
      httpCode: null,
      responseTime: null,
      success: false,
      status: 'failed',
      error: error.message,
      viewport: `${device.width}x${device.height}`
    };
  }
}

// Test responsive design (basic check)
function testResponsiveDesign(url) {
  try {
    // Test with mobile user agent
    const mobileResponse = execSync(`curl -s -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15" ${MOBILE_CONFIG.baseURL}${url.path}`, { 
      encoding: 'utf8',
      timeout: 10000
    });
    
    // Test with desktop user agent
    const desktopResponse = execSync(`curl -s -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" ${MOBILE_CONFIG.baseURL}${url.path}`, { 
      encoding: 'utf8',
      timeout: 10000
    });
    
    // Check for responsive indicators
    const responsiveIndicators = [
      'viewport',
      'media',
      'responsive',
      'mobile',
      'max-width',
      'min-width'
    ];
    
    const hasResponsiveFeatures = responsiveIndicators.some(indicator => 
      mobileResponse.toLowerCase().includes(indicator) || 
      desktopResponse.toLowerCase().includes(indicator)
    );
    
    return {
      url: url.name,
      responsive: hasResponsiveFeatures,
      status: hasResponsiveFeatures ? 'responsive' : 'not-responsive'
    };
    
  } catch (error) {
    return {
      url: url.name,
      responsive: false,
      status: 'failed',
      error: error.message
    };
  }
}

// Run mobile tests
console.log('📱 Testing Mobile Compatibility...\n');

// Test each device
MOBILE_CONFIG.devices.forEach(device => {
  console.log(`📱 Testing on ${device.name} (${device.width}x${device.height})...`);
  
  const deviceResults = [];
  
  MOBILE_CONFIG.testURLs.forEach(url => {
    const result = testURLWithMobileAgent(url, device);
    deviceResults.push(result);
    results.tests.push(result);
    
    if (result.success) {
      results.summary.passed++;
    } else {
      results.summary.failed++;
    }
    results.summary.total++;
  });
  
  results.deviceResults[device.name] = deviceResults;
});

// Test responsive design
console.log('\n📐 Testing Responsive Design...\n');

const responsiveResults = [];
MOBILE_CONFIG.testURLs.forEach(url => {
  const result = testResponsiveDesign(url);
  responsiveResults.push(result);
  
  if (result.responsive) {
    results.summary.responsive++;
  } else {
    results.summary.notResponsive++;
  }
});

// Calculate summary
console.log('\n📈 Mobile Test Summary');
console.log('=====================');

console.log(`✅ Passed: ${results.summary.passed}/${results.summary.total}`);
console.log(`❌ Failed: ${results.summary.failed}/${results.summary.total}`);
console.log(`📐 Responsive: ${results.summary.responsive}/${MOBILE_CONFIG.testURLs.length}`);
console.log(`📱 Not Responsive: ${results.summary.notResponsive}/${MOBILE_CONFIG.testURLs.length}`);

// Calculate success rate
const successRate = ((results.summary.passed) / results.summary.total * 100).toFixed(1);
const responsiveRate = ((results.summary.responsive) / MOBILE_CONFIG.testURLs.length * 100).toFixed(1);

console.log(`\n🎯 Success Rate: ${successRate}%`);
console.log(`📐 Responsive Rate: ${responsiveRate}%`);

// Mobile grade
let grade = 'A';
if (successRate < 90) grade = 'B';
if (successRate < 80) grade = 'C';
if (successRate < 70) grade = 'D';
if (successRate < 60) grade = 'F';

console.log(`📊 Mobile Grade: ${grade}`);

// Device-specific results
console.log('\n📱 Device-Specific Results:');
Object.keys(results.deviceResults).forEach(device => {
  const deviceTests = results.deviceResults[device];
  const passed = deviceTests.filter(test => test.success).length;
  const total = deviceTests.length;
  const rate = ((passed / total) * 100).toFixed(1);
  
  console.log(`   ${device}: ${passed}/${total} (${rate}%)`);
});

// Responsive design results
console.log('\n📐 Responsive Design Results:');
responsiveResults.forEach(result => {
  const emoji = result.responsive ? '✅' : '❌';
  console.log(`   ${emoji} ${result.url}: ${result.status}`);
});

// Recommendations
console.log('\n💡 Mobile Testing Recommendations:');
if (results.summary.failed > 0) {
  console.log('   ❌ Fix failed mobile page loads');
}
if (results.summary.notResponsive > 0) {
  console.log('   📱 Improve responsive design');
}
if (successRate < 100) {
  console.log('   🟡 Optimize mobile performance');
}
if (responsiveRate < 100) {
  console.log('   📐 Add responsive design features');
}
if (successRate >= 95 && responsiveRate >= 95) {
  console.log('   🟢 Excellent mobile compatibility!');
}

// Save results
const resultsFile = `./mobile-test-results-${new Date().toISOString().split('T')[0]}.json`;
fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));

console.log(`\n📁 Results saved to: ${resultsFile}`);

// Additional mobile checks
console.log('\n🔧 Additional Mobile Checks...');

// Check for PWA features
console.log('\n📱 PWA Features Check:');
try {
  const pwaCheck = execSync(`curl -s ${MOBILE_CONFIG.baseURL}`, { 
    encoding: 'utf8',
    timeout: 5000
  });
  
  const pwaFeatures = [
    { name: 'Service Worker', pattern: 'service-worker', found: pwaCheck.includes('service-worker') },
    { name: 'Manifest', pattern: 'manifest.json', found: pwaCheck.includes('manifest.json') },
    { name: 'Viewport Meta', pattern: 'viewport', found: pwaCheck.includes('viewport') },
    { name: 'Touch Icons', pattern: 'apple-touch-icon', found: pwaCheck.includes('apple-touch-icon') }
  ];
  
  pwaFeatures.forEach(feature => {
    const emoji = feature.found ? '✅' : '❌';
    console.log(`   ${emoji} ${feature.name}`);
  });
  
  const pwaScore = pwaFeatures.filter(f => f.found).length;
  console.log(`   📊 PWA Score: ${pwaScore}/${pwaFeatures.length}`);
  
} catch (error) {
  console.log('   ❌ Could not check PWA features');
}

// Check for mobile-specific optimizations
console.log('\n⚡ Mobile Performance Check:');
try {
  const performanceCheck = execSync(`curl -s ${MOBILE_CONFIG.baseURL}`, { 
    encoding: 'utf8',
    timeout: 5000
  });
  
  const mobileOptimizations = [
    { name: 'Compressed Images', pattern: 'webp', found: performanceCheck.includes('webp') },
    { name: 'Lazy Loading', pattern: 'loading="lazy"', found: performanceCheck.includes('loading="lazy"') },
    { name: 'Minified CSS', pattern: '.min.css', found: performanceCheck.includes('.min.css') },
    { name: 'Minified JS', pattern: '.min.js', found: performanceCheck.includes('.min.js') }
  ];
  
  mobileOptimizations.forEach(opt => {
    const emoji = opt.found ? '✅' : '❌';
    console.log(`   ${emoji} ${opt.name}`);
  });
  
  const optScore = mobileOptimizations.filter(o => o.found).length;
  console.log(`   📊 Optimization Score: ${optScore}/${mobileOptimizations.length}`);
  
} catch (error) {
  console.log('   ❌ Could not check mobile optimizations');
}

// Touch-friendly check
console.log('\n👆 Touch-Friendly Check:');
try {
  const touchCheck = execSync(`curl -s ${MOBILE_CONFIG.baseURL}`, { 
    encoding: 'utf8',
    timeout: 5000
  });
  
  const touchFeatures = [
    { name: 'Touch Events', pattern: 'touchstart', found: touchCheck.includes('touchstart') },
    { name: 'Touch CSS', pattern: 'touch-action', found: touchCheck.includes('touch-action') },
    { name: 'Large Touch Targets', pattern: 'min-height: 44px', found: touchCheck.includes('min-height: 44px') }
  ];
  
  touchFeatures.forEach(feature => {
    const emoji = feature.found ? '✅' : '❌';
    console.log(`   ${emoji} ${feature.name}`);
  });
  
  const touchScore = touchFeatures.filter(f => f.found).length;
  console.log(`   📊 Touch Score: ${touchScore}/${touchFeatures.length}`);
  
} catch (error) {
  console.log('   ❌ Could not check touch features');
}

console.log('\n🎉 Mobile testing completed!');
console.log('\nNext steps:');
console.log('- Test on actual mobile devices');
console.log('- Validate touch interactions');
console.log('- Test PWA installation');
console.log('- Check offline functionality');
console.log('- Optimize for slow networks');
console.log('- Test on different screen sizes'); 