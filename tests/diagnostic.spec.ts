import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Comprehensive Application Diagnostics', () => {
  test('Complete page analysis with HTML structure output', async ({ page }) => {
    console.log('🔍 Starting comprehensive diagnostic test...');
    
    // Navigate to the main page
    console.log('📍 Navigating to main page...');
try {
      await page.goto('/');
    } catch (error) {
      console.error('❌ Navigation failed:', error);
      throw error;
    }
    
    // Wait for the page to fully load
    console.log('⏳ Waiting for page to fully load...');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    // Wait an additional moment for any dynamic content
    await page.waitForTimeout(2000);
    
    // Capture basic page information
    const title = await page.title();
    const url = page.url();
    console.log(`📄 Page Title: "${title}"`);
    console.log(`🔗 Current URL: ${url}`);
    
    // Capture and log all visible text content
    console.log('\n📝 === VISIBLE TEXT CONTENT ===');
    const bodyText = await page.textContent('body');
    if (bodyText) {
      console.log('Full page text content:');
      console.log('--- START TEXT CONTENT ---');
      console.log(bodyText);
      console.log('--- END TEXT CONTENT ---');
      console.log(`Total character count: ${bodyText.length}`);
    } else {
      console.log('⚠️  No visible text content found');
    }
    
    // Get all text by elements for more structured output
    console.log('\n🏷️  === TEXT BY ELEMENT TYPE ===');
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', elements => 
      elements.map(el => ({ tag: el.tagName, text: el.textContent?.trim() }))
    );
    console.log('Headings:', headings);
    
    const links = await page.$$eval('a', elements => 
      elements.map(el => ({ text: el.textContent?.trim(), href: el.getAttribute('href') }))
    );
    console.log('Links:', links);
    
    const buttons = await page.$$eval('button', elements => 
      elements.map(el => ({ text: el.textContent?.trim(), type: el.getAttribute('type') }))
    );
    console.log('Buttons:', buttons);
    
    // Output the complete HTML structure
    console.log('\n🏗️  === COMPLETE HTML STRUCTURE ===');
    const htmlContent = await page.content();
    console.log('--- START HTML STRUCTURE ---');
    console.log(htmlContent);
    console.log('--- END HTML STRUCTURE ---');
    
    // Save HTML structure to file for easier analysis
    const outputDir = 'test-results';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const htmlFilePath = path.join(outputDir, 'diagnostic-html-structure.html');
    fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
    console.log(`💾 HTML structure saved to: ${htmlFilePath}`);
    
    // Analyze page structure
    console.log('\n🔍 === PAGE STRUCTURE ANALYSIS ===');
    const elementCounts = await page.evaluate(() => {
      const tags = {};
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const tagName = el.tagName.toLowerCase();
        tags[tagName] = (tags[tagName] || 0) + 1;
      });
      return tags;
    });
    console.log('Element counts by tag:', elementCounts);
    
    // Check for common React/framework indicators
    console.log('\n⚛️  === FRAMEWORK DETECTION ===');
    const reactRoot = await page.$('#root');
    const reactAppDiv = await page.$('#app');
    const reactIndicators = await page.evaluate(() => {
      return {
        hasReactDevTools: !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__,
        hasReactRoot: !!document.getElementById('root'),
        hasAppDiv: !!document.getElementById('app'),
        hasDataReactRoot: !!document.querySelector('[data-reactroot]'),
        scriptsWithReact: Array.from(document.scripts).some(script => 
          script.src.includes('react') || script.textContent?.includes('React')
        )
      };
    });
    console.log('React indicators:', reactIndicators);
    console.log('React root element found:', !!reactRoot);
    console.log('App div element found:', !!reactAppDiv);
    
    // Check for loading states
    console.log('\n⏲️  === LOADING STATES ===');
    const loadingElements = await page.$$eval('[class*="load"], [class*="spinner"], [id*="load"]', 
      elements => elements.map(el => ({ tag: el.tagName, className: el.className, id: el.id }))
    );
    console.log('Loading-related elements:', loadingElements);
    
    // Capture console errors and warnings
    console.log('\n🚨 === CONSOLE MESSAGES ===');
    const consoleMessages: { type: string; text: string }[] = [];
page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`🚨 JavaScript error: ${msg.text()}`);
      }
      consoleMessages.push({ type: msg.type(), text: msg.text() });
    });
    
    // Wait a bit more to catch any console messages
    await page.waitForTimeout(1000);
    consoleMessages.forEach(msg => {
      console.log(`${msg.type.toUpperCase()}: ${msg.text}`);
    });
    
    // Take a comprehensive screenshot
    console.log('\n📸 Taking screenshot for visual reference...');
    await page.screenshot({ 
      path: path.join(outputDir, 'diagnostic-comprehensive.png'),
      fullPage: true 
    });
    console.log(`📷 Screenshot saved to: ${path.join(outputDir, 'diagnostic-comprehensive.png')}`);
    
    // Basic assertions to ensure test passes if page loads
    expect(title).toBeTruthy();
    expect(htmlContent).toBeTruthy();
    expect(htmlContent.length).toBeGreaterThan(0);
    
    console.log('\n✅ Diagnostic test completed successfully!');
  });
  
  test('Network and performance analysis', async ({ page }) => {
    console.log('🌐 Starting network and performance analysis...');
    
    // Track network requests
    const requests: string[] = [];
    const responses: { url: string; status: number; statusText: string }[] = [];
    
    page.on('request', request => {
      requests.push(request.url());
    });
    
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    });
    
    // Navigate and analyze
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    console.log('\n📡 === NETWORK ANALYSIS ===');
    console.log(`Total requests: ${requests.length}`);
    console.log('All requests:', requests);
    console.log('\nResponses with status:');
    responses.forEach(response => {
      console.log(`${response.status} ${response.statusText}: ${response.url}`);
    });
    
    // Check for failed requests
    const failedRequests = responses.filter(r => r.status >= 400);
    if (failedRequests.length > 0) {
      console.log('\n❌ Failed requests:');
      failedRequests.forEach(req => {
        console.log(`${req.status} ${req.statusText}: ${req.url}`);
      });
    } else {
      console.log('\n✅ All network requests successful');
    }
    
    // Performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        serverResponse: navigation.responseEnd - navigation.requestStart
      };
    });
    
    console.log('\n⚡ === PERFORMANCE METRICS ===');
    console.log('Performance timings (ms):', performanceMetrics);
    
    expect(responses.length).toBeGreaterThan(0);
  });
});
