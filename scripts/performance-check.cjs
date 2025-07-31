#!/usr/bin/env node

/**
 * PRMCMS Performance Check Script
 * Monitors response times and performance metrics
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 PRMCMS Performance Check - Starting...\n');

// Performance thresholds
const THRESHOLDS = {
  excellent: 1000,    // < 1 second
  good: 3000,         // 1-3 seconds
  acceptable: 5000,   // 3-5 seconds
  poor: 5000          // > 5 seconds
};

// Test URLs
const TEST_URLS = [
  { name: 'Home Page', path: '/' },
  { name: 'Authentication', path: '/auth' },
  { name: 'Customer Dashboard', path: '/customer' },
  { name: 'Staff Dashboard', path: '/staff' },
  { name: 'Package Tracking', path: '/tracking' },
  { name: 'Inventory', path: '/inventory' },
  { name: 'Billing', path: '/billing' },
  { name: 'Analytics', path: '/analytics' },
  { name: 'API Health', path: '/api/health' }
];

// Performance results storage
const results = {
  timestamp: new Date().toISOString(),
  server: 'localhost:5173',
  tests: [],
  summary: {
    total: 0,
    excellent: 0,
    good: 0,
    acceptable: 0,
    poor: 0,
    failed: 0
  }
};

// Helper function to categorize performance
function categorizePerformance(responseTime) {
  if (responseTime < THRESHOLDS.excellent) return 'excellent';
  if (responseTime < THRESHOLDS.good) return 'good';
  if (responseTime < THRESHOLDS.acceptable) return 'acceptable';
  return 'poor';
}

// Helper function to get emoji for performance
function getPerformanceEmoji(category) {
  const emojis = {
    excellent: '🟢',
    good: '🟡',
    acceptable: '🟠',
    poor: '🔴',
    failed: '❌'
  };
  return emojis[category] || '❓';
}

// Test individual URL
function testURL(url) {
  const startTime = Date.now();
  
  try {
    const response = execSync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:5173${url.path}`, { 
      encoding: 'utf8',
      timeout: 10000 // 10 second timeout
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const httpCode = response.trim();
    
    if (httpCode === '200') {
      const category = categorizePerformance(responseTime);
      const emoji = getPerformanceEmoji(category);
      
      console.log(`${emoji} ${url.name}: ${responseTime}ms (${category})`);
      
      results.tests.push({
        name: url.name,
        path: url.path,
        responseTime,
        category,
        httpCode,
        status: 'success'
      });
      
      results.summary[category]++;
    } else {
      console.log(`❌ ${url.name}: HTTP ${httpCode} (failed)`);
      
      results.tests.push({
        name: url.name,
        path: url.path,
        responseTime: null,
        category: 'failed',
        httpCode,
        status: 'failed'
      });
      
      results.summary.failed++;
    }
    
  } catch (error) {
    console.log(`❌ ${url.name}: Connection failed`);
    
    results.tests.push({
      name: url.name,
      path: url.path,
      responseTime: null,
      category: 'failed',
      httpCode: null,
      status: 'failed',
      error: error.message
    });
    
    results.summary.failed++;
  }
  
  results.summary.total++;
}

// Run performance tests
console.log('📊 Testing Response Times...\n');

TEST_URLS.forEach(testURL);

// Calculate summary
console.log('\n📈 Performance Summary');
console.log('=====================');

const summary = results.summary;
console.log(`🟢 Excellent (<1s): ${summary.excellent}/${summary.total}`);
console.log(`🟡 Good (1-3s): ${summary.good}/${summary.total}`);
console.log(`🟠 Acceptable (3-5s): ${summary.acceptable}/${summary.total}`);
console.log(`🔴 Poor (>5s): ${summary.poor}/${summary.total}`);
console.log(`❌ Failed: ${summary.failed}/${summary.total}`);

// Calculate success rate
const successRate = ((summary.total - summary.failed) / summary.total * 100).toFixed(1);
console.log(`\n✅ Success Rate: ${successRate}%`);

// Performance grade
let grade = 'A';
if (successRate < 90) grade = 'B';
if (successRate < 80) grade = 'C';
if (successRate < 70) grade = 'D';
if (successRate < 60) grade = 'F';

console.log(`📊 Performance Grade: ${grade}`);

// Recommendations
console.log('\n💡 Recommendations:');
if (summary.poor > 0) {
  console.log('   🔴 Optimize slow pages (>5s response time)');
}
if (summary.failed > 0) {
  console.log('   ❌ Fix failed connections');
}
if (summary.excellent < summary.total * 0.8) {
  console.log('   🟡 Improve response times for better user experience');
}
if (summary.excellent >= summary.total * 0.8) {
  console.log('   🟢 Excellent performance! Keep it up!');
}

// Save results to file
const resultsFile = `./performance-results-${new Date().toISOString().split('T')[0]}.json`;
fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));

console.log(`\n📁 Results saved to: ${resultsFile}`);

// Network performance test
console.log('\n🌐 Network Performance Test...');
try {
  const networkStart = Date.now();
  execSync('curl -s -o /dev/null http://localhost:5173/', { encoding: 'utf8' });
  const networkEnd = Date.now();
  const networkTime = networkEnd - networkStart;
  
  console.log(`   Network Response: ${networkTime}ms`);
  
  if (networkTime < 100) {
    console.log('   🟢 Excellent network performance');
  } else if (networkTime < 500) {
    console.log('   🟡 Good network performance');
  } else if (networkTime < 1000) {
    console.log('   🟠 Acceptable network performance');
  } else {
    console.log('   🔴 Poor network performance');
  }
} catch (error) {
  console.log('   ❌ Network test failed');
}

// Memory usage check (if possible)
console.log('\n💾 Memory Usage Check...');
try {
  const memoryInfo = execSync('ps -o rss= -p $(lsof -ti:5173)', { encoding: 'utf8' });
  const memoryMB = Math.round(parseInt(memoryInfo.trim()) / 1024);
  console.log(`   Memory Usage: ${memoryMB}MB`);
  
  if (memoryMB < 100) {
    console.log('   🟢 Low memory usage');
  } else if (memoryMB < 200) {
    console.log('   🟡 Moderate memory usage');
  } else {
    console.log('   🟠 High memory usage - consider optimization');
  }
} catch (error) {
  console.log('   ⚠️  Could not check memory usage');
}

console.log('\n🎉 Performance check completed!');
console.log('\nNext steps:');
console.log('- Review slow pages and optimize');
console.log('- Fix any failed connections');
console.log('- Monitor performance over time');
console.log('- Set up automated performance monitoring'); 