#!/usr/bin/env node

/**
 * PRMCMS Simple Performance Check
 * Quick performance validation without hanging
 */

console.log('🚀 PRMCMS Simple Performance Check\n');

// Simple performance test function
function testPerformance(url, name) {
  const start = Date.now();
  
  // Use a simple HTTP request
  const http = require('http');
  const urlObj = new URL(url);
  
  return new Promise((resolve) => {
    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'GET',
      timeout: 5000
    }, (res) => {
      const end = Date.now();
      const duration = end - start;
      
      console.log(`${res.statusCode === 200 ? '✅' : '❌'} ${name}: ${duration}ms (HTTP ${res.statusCode})`);
      resolve({
        name,
        url,
        statusCode: res.statusCode,
        duration,
        success: res.statusCode === 200
      });
    });
    
    req.on('error', (error) => {
      const end = Date.now();
      const duration = end - start;
      console.log(`❌ ${name}: Failed (${duration}ms) - ${error.message}`);
      resolve({
        name,
        url,
        statusCode: null,
        duration,
        success: false,
        error: error.message
      });
    });
    
    req.on('timeout', () => {
      console.log(`⏰ ${name}: Timeout (5s)`);
      resolve({
        name,
        url,
        statusCode: null,
        duration: 5000,
        success: false,
        error: 'Timeout'
      });
    });
    
    req.end();
  });
}

// Test URLs
const testUrls = [
  { url: 'http://localhost:5173/', name: 'Home Page' },
  { url: 'http://localhost:5173/auth', name: 'Authentication' },
  { url: 'http://localhost:5173/customer', name: 'Customer Dashboard' },
  { url: 'http://localhost:5173/staff', name: 'Staff Dashboard' },
  { url: 'http://localhost:5173/tracking', name: 'Package Tracking' },
  { url: 'http://localhost:5173/inventory', name: 'Inventory' },
  { url: 'http://localhost:5173/billing', name: 'Billing' },
  { url: 'http://localhost:5173/analytics', name: 'Analytics' }
];

// Run tests sequentially to avoid hanging
async function runTests() {
  console.log('📊 Testing Response Times...\n');
  
  const results = [];
  
  for (const test of testUrls) {
    const result = await testPerformance(test.url, test.name);
    results.push(result);
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Calculate summary
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  const successRate = ((successful / total) * 100).toFixed(1);
  
  const avgDuration = results
    .filter(r => r.success)
    .reduce((sum, r) => sum + r.duration, 0) / successful || 0;
  
  console.log('\n📈 Performance Summary');
  console.log('=====================');
  console.log(`✅ Successful: ${successful}/${total}`);
  console.log(`❌ Failed: ${total - successful}/${total}`);
  console.log(`🎯 Success Rate: ${successRate}%`);
  console.log(`⏱️  Average Response Time: ${avgDuration.toFixed(0)}ms`);
  
  // Performance grade
  let grade = 'A';
  if (successRate < 90) grade = 'B';
  if (successRate < 80) grade = 'C';
  if (successRate < 70) grade = 'D';
  if (successRate < 60) grade = 'F';
  
  console.log(`📊 Performance Grade: ${grade}`);
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  if (successRate < 100) {
    console.log('   ❌ Fix failed page loads');
  }
  if (avgDuration > 3000) {
    console.log('   🟡 Optimize slow response times');
  }
  if (successRate >= 95 && avgDuration < 1000) {
    console.log('   🟢 Excellent performance!');
  }
  
  console.log('\n🎉 Performance check completed!');
}

// Run the tests
runTests().catch(console.error); 