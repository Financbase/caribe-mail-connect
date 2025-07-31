#!/usr/bin/env node

/**
 * PRMCMS Lighthouse Performance Testing
 * Comprehensive performance benchmarking
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Lighthouse configuration
const lighthouseConfig = {
  port: 5173,
  output: 'html',
  outputPath: './lighthouse-reports',
  chromeFlags: '--headless --no-sandbox --disable-gpu',
  onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  formFactor: 'desktop',
  // Fix the screen emulation conflict
  screenEmulation: {
    mobile: false,
    width: 1350,
    height: 940,
    deviceScaleFactor: 1,
    disabled: false
  }
};

// Performance thresholds
const thresholds = {
  performance: 90,
  accessibility: 95,
  'best-practices': 90,
  seo: 90,
  'first-contentful-paint': 2000,
  'largest-contentful-paint': 4000,
  'cumulative-layout-shift': 0.1,
  'first-input-delay': 100
};

// URLs to test
const testUrls = [
  {
    name: 'Home Page',
    url: 'http://localhost:5173/',
    description: 'Main application entry point'
  },
  {
    name: 'Authentication',
    url: 'http://localhost:5173/auth',
    description: 'Login and authentication pages'
  },
  {
    name: 'Customer Dashboard',
    url: 'http://localhost:5173/customer',
    description: 'Customer portal and dashboard'
  },
  {
    name: 'Staff Dashboard',
    url: 'http://localhost:5173/staff',
    description: 'Staff management interface'
  },
  {
    name: 'Package Management',
    url: 'http://localhost:5173/packages',
    description: 'Package tracking and management'
  },
  {
    name: 'Billing System',
    url: 'http://localhost:5173/billing',
    description: 'Billing and invoicing interface'
  },
  {
    name: 'Analytics Dashboard',
    url: 'http://localhost:5173/analytics',
    description: 'Performance analytics and reporting'
  }
];

// Ensure reports directory exists
function ensureReportsDirectory() {
  const reportsDir = path.join(__dirname, '..', 'lighthouse-reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  return reportsDir;
}

// Run Lighthouse audit
function runLighthouseAudit(url, name) {
  console.log(`🔍 Running Lighthouse audit for: ${name}`);
  console.log(`   URL: ${url}`);
  
  const reportsDir = ensureReportsDirectory();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputFile = path.join(reportsDir, `${name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.html`);
  
  try {
    const command = `npx lighthouse ${url} \
      --output=${lighthouseConfig.output} \
      --output-path=${outputFile} \
      --chrome-flags="${lighthouseConfig.chromeFlags}" \
      --only-categories=${lighthouseConfig.onlyCategories.join(',')} \
      --port=${lighthouseConfig.port}`;
    
    execSync(command, { stdio: 'pipe' });
    
    console.log(`✅ Lighthouse audit completed: ${outputFile}`);
    return outputFile;
  } catch (error) {
    console.error(`❌ Lighthouse audit failed for ${name}:`, error.message);
    return null;
  }
}

// Parse Lighthouse results
function parseLighthouseResults(htmlFile) {
  try {
    const content = fs.readFileSync(htmlFile, 'utf8');
    
    // Extract scores from HTML (simplified parsing)
    const performanceMatch = content.match(/"performance":\s*(\d+)/);
    const accessibilityMatch = content.match(/"accessibility":\s*(\d+)/);
    const bestPracticesMatch = content.match(/"best-practices":\s*(\d+)/);
    const seoMatch = content.match(/"seo":\s*(\d+)/);
    
    // Extract Core Web Vitals
    const fcpMatch = content.match(/"first-contentful-paint":\s*(\d+)/);
    const lcpMatch = content.match(/"largest-contentful-paint":\s*(\d+)/);
    const clsMatch = content.match(/"cumulative-layout-shift":\s*([\d.]+)/);
    const fidMatch = content.match(/"first-input-delay":\s*(\d+)/);
    
    return {
      performance: performanceMatch ? parseInt(performanceMatch[1]) : 0,
      accessibility: accessibilityMatch ? parseInt(accessibilityMatch[1]) : 0,
      'best-practices': bestPracticesMatch ? parseInt(bestPracticesMatch[1]) : 0,
      seo: seoMatch ? parseInt(seoMatch[1]) : 0,
      'first-contentful-paint': fcpMatch ? parseInt(fcpMatch[1]) : 0,
      'largest-contentful-paint': lcpMatch ? parseInt(lcpMatch[1]) : 0,
      'cumulative-layout-shift': clsMatch ? parseFloat(clsMatch[1]) : 0,
      'first-input-delay': fidMatch ? parseInt(fidMatch[1]) : 0
    };
  } catch (error) {
    console.error(`❌ Failed to parse Lighthouse results: ${error.message}`);
    return null;
  }
}

// Generate performance report
function generatePerformanceReport(results) {
  console.log('\n📊 PRMCMS Performance Report');
  console.log('=============================\n');
  
  let totalScore = 0;
  let passedTests = 0;
  let totalTests = 0;
  
  results.forEach(result => {
    if (!result.scores) return;
    
    console.log(`🌐 ${result.name}`);
    console.log(`   URL: ${result.url}`);
    console.log(`   Performance: ${result.scores.performance}/100 ${result.scores.performance >= thresholds.performance ? '✅' : '❌'}`);
    console.log(`   Accessibility: ${result.scores.accessibility}/100 ${result.scores.accessibility >= thresholds.accessibility ? '✅' : '❌'}`);
    console.log(`   Best Practices: ${result.scores['best-practices']}/100 ${result.scores['best-practices'] >= thresholds['best-practices'] ? '✅' : '❌'}`);
    console.log(`   SEO: ${result.scores.seo}/100 ${result.scores.seo >= thresholds.seo ? '✅' : '❌'}`);
    
    // Core Web Vitals
    console.log(`   First Contentful Paint: ${result.scores['first-contentful-paint']}ms ${result.scores['first-contentful-paint'] <= thresholds['first-contentful-paint'] ? '✅' : '❌'}`);
    console.log(`   Largest Contentful Paint: ${result.scores['largest-contentful-paint']}ms ${result.scores['largest-contentful-paint'] <= thresholds['largest-contentful-paint'] ? '✅' : '❌'}`);
    console.log(`   Cumulative Layout Shift: ${result.scores['cumulative-layout-shift']} ${result.scores['cumulative-layout-shift'] <= thresholds['cumulative-layout-shift'] ? '✅' : '❌'}`);
    console.log(`   First Input Delay: ${result.scores['first-input-delay']}ms ${result.scores['first-input-delay'] <= thresholds['first-input-delay'] ? '✅' : '❌'}`);
    
    console.log('');
    
    // Calculate averages
    const avgScore = (result.scores.performance + result.scores.accessibility + result.scores['best-practices'] + result.scores.seo) / 4;
    totalScore += avgScore;
    totalTests += 4;
    
    // Count passed tests
    if (result.scores.performance >= thresholds.performance) passedTests++;
    if (result.scores.accessibility >= thresholds.accessibility) passedTests++;
    if (result.scores['best-practices'] >= thresholds['best-practices']) passedTests++;
    if (result.scores.seo >= thresholds.seo) passedTests++;
  });
  
  const overallScore = totalScore / results.length;
  const passRate = (passedTests / totalTests) * 100;
  
  console.log('📈 Overall Performance Summary');
  console.log('==============================');
  console.log(`Average Score: ${overallScore.toFixed(1)}/100`);
  console.log(`Pass Rate: ${passRate.toFixed(1)}%`);
  console.log(`Tests Passed: ${passedTests}/${totalTests}`);
  
  if (overallScore >= 90) {
    console.log('🎉 Excellent performance! Application is production-ready.');
  } else if (overallScore >= 80) {
    console.log('👍 Good performance with room for improvement.');
  } else if (overallScore >= 70) {
    console.log('⚠️  Performance needs optimization before production.');
  } else {
    console.log('❌ Critical performance issues need immediate attention.');
  }
  
  console.log('\n📋 Recommendations:');
  if (overallScore < 90) {
    console.log('- Optimize bundle size and code splitting');
    console.log('- Implement lazy loading for non-critical components');
    console.log('- Optimize images and assets');
    console.log('- Improve Core Web Vitals scores');
    console.log('- Consider implementing service workers for caching');
  }
  
  return {
    overallScore,
    passRate,
    passedTests,
    totalTests,
    results
  };
}

// Run comprehensive performance testing
async function runPerformanceTesting() {
  console.log('🚀 Starting PRMCMS Performance Testing');
  console.log('=====================================\n');
  
  // Check if development server is running
  try {
    execSync('curl -I http://localhost:5173', { stdio: 'pipe' });
    console.log('✅ Development server is running on port 5173');
  } catch (error) {
    console.error('❌ Development server is not running. Please start it with: npm run dev');
    process.exit(1);
  }
  
  const results = [];
  
  for (const testUrl of testUrls) {
    console.log(`\n🔍 Testing: ${testUrl.name}`);
    console.log(`   Description: ${testUrl.description}`);
    
    const htmlFile = runLighthouseAudit(testUrl.url, testUrl.name);
    
    if (htmlFile) {
      const scores = parseLighthouseResults(htmlFile);
      results.push({
        name: testUrl.name,
        url: testUrl.url,
        description: testUrl.description,
        htmlFile,
        scores
      });
    }
    
    // Wait between tests to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Generate final report
  const report = generatePerformanceReport(results);
  
  // Save report to file
  const reportsDir = ensureReportsDirectory();
  const reportFile = path.join(reportsDir, `performance-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportFile}`);
  
  return report;
}

// Export for use in other scripts
module.exports = {
  runPerformanceTesting,
  generatePerformanceReport,
  thresholds,
  testUrls
};

// Run if called directly
if (require.main === module) {
  runPerformanceTesting().catch(console.error);
} 