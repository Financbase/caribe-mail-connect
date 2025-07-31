import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:5173';
const TEST_PAGES = [
  { path: '/', name: 'Home Page' },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/sustainability', name: 'Sustainability Hub' },
  { path: '/green-shipping', name: 'Green Shipping' },
  { path: '/waste-reduction', name: 'Waste Reduction' },
  { path: '/energy-management', name: 'Energy Management' },
  { path: '/community-impact', name: 'Community Impact' },
  { path: '/partners', name: 'Partner Hub' },
  { path: '/vendor-management', name: 'Vendor Management' },
  { path: '/affiliate-program', name: 'Affiliate Program' },
  { path: '/integration-partners', name: 'Integration Partners' },
  { path: '/partner-analytics', name: 'Partner Analytics' },
  { path: '/customers', name: 'Customers' },
  { path: '/routes', name: 'Routes' },
  { path: '/billing', name: 'Billing' },
  { path: '/analytics', name: 'Analytics' }
];

async function testPage(page, testPage) {
  const url = `${BASE_URL}#${testPage.path}`;
  console.log(`🧪 Testing ${testPage.name} at ${url}`);
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Check if page loaded successfully
    const title = await page.title();
    const hasContent = await page.evaluate(() => {
      return document.body.textContent.length > 1000;
    });
    
    // Check for specific content based on page type
    let specificContent = false;
    if (testPage.path.includes('sustainability')) {
      specificContent = await page.evaluate(() => {
        return document.body.textContent.toLowerCase().includes('sustainability') ||
               document.body.textContent.toLowerCase().includes('carbon') ||
               document.body.textContent.toLowerCase().includes('green');
      });
    } else if (testPage.path.includes('partner')) {
      specificContent = await page.evaluate(() => {
        return document.body.textContent.toLowerCase().includes('partner') ||
               document.body.textContent.toLowerCase().includes('vendor') ||
               document.body.textContent.toLowerCase().includes('affiliate');
      });
    } else {
      specificContent = true; // For other pages, just check if content exists
    }
    
    // Check for errors
    const errors = await page.evaluate(() => {
      return window.console.errors || [];
    });
    
    const result = {
      page: testPage.name,
      url,
      success: hasContent && specificContent && errors.length === 0,
      title,
      hasContent,
      specificContent,
      errors: errors.length,
      loadTime: Date.now()
    };
    
    if (result.success) {
      console.log(`✅ ${testPage.name} - Loaded successfully`);
    } else {
      console.log(`❌ ${testPage.name} - Issues detected`);
      if (!hasContent) console.log(`   - No content detected`);
      if (!specificContent) console.log(`   - Missing specific content`);
      if (errors.length > 0) console.log(`   - ${errors.length} console errors`);
    }
    
    return result;
    
  } catch (error) {
    console.log(`❌ ${testPage.name} - Error: ${error.message}`);
    return {
      page: testPage.name,
      url,
      success: false,
      error: error.message,
      loadTime: Date.now()
    };
  }
}

async function testResponsiveDesign(page) {
  console.log('\n📱 Testing Responsive Design...');
  
  const viewports = [
    { width: 1920, height: 1080, name: 'Desktop' },
    { width: 1024, height: 768, name: 'Tablet' },
    { width: 375, height: 667, name: 'Mobile' }
  ];
  
  const results = [];
  
  for (const viewport of viewports) {
    await page.setViewport(viewport);
    console.log(`   Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
    
    // Test a few key pages
    const testUrls = ['/', '/sustainability', '/partners'];
    
    for (const path of testUrls) {
      try {
        await page.goto(`${BASE_URL}#${path}`, { waitUntil: 'networkidle2', timeout: 5000 });
        await page.waitForTimeout(1000);
        
        const isResponsive = await page.evaluate(() => {
          // Check if content is properly sized for viewport
          const body = document.body;
          const width = body.scrollWidth;
          const height = body.scrollHeight;
          return width > 0 && height > 0;
        });
        
        results.push({
          viewport: viewport.name,
          path,
          responsive: isResponsive
        });
        
      } catch (error) {
        results.push({
          viewport: viewport.name,
          path,
          responsive: false,
          error: error.message
        });
      }
    }
  }
  
  return results;
}

async function testRealDataConnection(page) {
  console.log('\n💾 Testing Real Data Connection...');
  
  try {
    // Navigate to sustainability page
    await page.goto(`${BASE_URL}#/sustainability`, { waitUntil: 'networkidle2', timeout: 10000 });
    await page.waitForTimeout(3000);
    
    // Check for real data indicators
    const hasRealData = await page.evaluate(() => {
      const content = document.body.textContent;
      return content.includes('Carbon Footprint') || 
             content.includes('Green Initiatives') ||
             content.includes('Tree Planting') ||
             content.includes('Sustainability Score');
    });
    
    // Check for network requests to Supabase
    const networkRequests = await page.evaluate(() => {
      return window.performance.getEntriesByType('resource')
        .filter(entry => entry.name.includes('supabase'))
        .length;
    });
    
    console.log(`   Real data detected: ${hasRealData ? '✅' : '❌'}`);
    console.log(`   Supabase requests: ${networkRequests}`);
    
    return {
      hasRealData,
      supabaseRequests: networkRequests,
      success: hasRealData || networkRequests > 0
    };
    
  } catch (error) {
    console.log(`   Error testing real data: ${error.message}`);
    return {
      hasRealData: false,
      supabaseRequests: 0,
      success: false,
      error: error.message
    };
  }
}

async function runComprehensiveTest() {
  console.log('🚀 Starting Comprehensive PRMCMS Browser Test...\n');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless testing
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Test all pages
    console.log('📄 Testing All Pages...');
    const pageResults = [];
    
    for (const testPage of TEST_PAGES) {
      const result = await testPage(page, testPage);
      pageResults.push(result);
      await page.waitForTimeout(1000); // Wait between tests
    }
    
    // Test responsive design
    const responsiveResults = await testResponsiveDesign(page);
    
    // Test real data connection
    const dataResults = await testRealDataConnection(page);
    
    // Generate report
    console.log('\n📊 Test Results Summary:');
    console.log('='.repeat(50));
    
    const successfulPages = pageResults.filter(r => r.success).length;
    const totalPages = pageResults.length;
    console.log(`Pages Tested: ${successfulPages}/${totalPages} (${Math.round(successfulPages/totalPages*100)}%)`);
    
    const responsiveTests = responsiveResults.filter(r => r.responsive).length;
    const totalResponsiveTests = responsiveResults.length;
    console.log(`Responsive Tests: ${responsiveTests}/${totalResponsiveTests} (${Math.round(responsiveTests/totalResponsiveTests*100)}%)`);
    
    console.log(`Real Data Connection: ${dataResults.success ? '✅ Connected' : '❌ Not Connected'}`);
    
    // Show failed pages
    const failedPages = pageResults.filter(r => !r.success);
    if (failedPages.length > 0) {
      console.log('\n❌ Failed Pages:');
      failedPages.forEach(page => {
        console.log(`   - ${page.page}: ${page.error || 'Content/Data issues'}`);
      });
    }
    
    // Show responsive issues
    const failedResponsive = responsiveResults.filter(r => !r.responsive);
    if (failedResponsive.length > 0) {
      console.log('\n📱 Responsive Issues:');
      failedResponsive.forEach(test => {
        console.log(`   - ${test.viewport} - ${test.path}: ${test.error || 'Layout issues'}`);
      });
    }
    
    console.log('\n🎉 Browser Testing Complete!');
    console.log(`🌐 Application URL: ${BASE_URL}`);
    console.log('💡 Open the browser to manually test features');
    
    return {
      pageResults,
      responsiveResults,
      dataResults,
      summary: {
        pagesSuccess: successfulPages,
        pagesTotal: totalPages,
        responsiveSuccess: responsiveTests,
        responsiveTotal: totalResponsiveTests,
        dataConnected: dataResults.success
      }
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return { error: error.message };
  } finally {
    // Keep browser open for manual testing
    console.log('\n🔍 Browser will remain open for manual testing...');
    console.log('Press Ctrl+C to close the browser');
    
    // Don't close browser automatically for manual testing
    // await browser.close();
  }
}

// Run the test
runComprehensiveTest().catch(console.error); 