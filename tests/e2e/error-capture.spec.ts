import { test, expect } from '@playwright/test';
import { createServer } from 'https';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

test('Error capture test', async ({ page }) => {
  // Check if dist directory exists
  const distPath = join(process.cwd(), 'dist');
  if (!existsSync(distPath)) {
    throw new Error('dist directory not found. Run "npm run build" first.');
  }

  // Create a simple static file server
  const server = createServer((req, res) => {
    // Handle absolute paths by removing the leading slash
    const url = req.url || '/';
    const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
    const filePath = join(distPath, cleanUrl === '' ? 'index.html' : cleanUrl);
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(distPath)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    try {
      const content = readFileSync(filePath);
      const ext = filePath.split('.').pop();
      
      // Set appropriate content type
      const contentType = {
        'html': 'text/html',
        'js': 'application/javascript',
        'css': 'text/css',
        'json': 'application/json',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'svg': 'image/svg+xml'
      }[ext] || 'text/plain';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch (error) {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  // Start server on a random port
  const port = 0; // Let OS assign port
  server.listen(port);
  
  // Get the actual port assigned
  const actualPort = (server.address() as any).port;
  const baseUrl = `http://localhost:${actualPort}`;

  try {
    // Set up error listeners before navigation
    const consoleMessages: string[] = [];
    const pageErrors: string[] = [];
    const networkErrors: string[] = [];

    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });

    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });

    page.on('requestfailed', request => {
      networkErrors.push(`Failed: ${request.url()} - ${request.failure()?.errorText || 'Unknown error'}`);
    });

    // Navigate to the app
    await page.goto(baseUrl);
    
    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for JavaScript to execute
    await page.waitForTimeout(5000);
    
    // Capture any errors that occurred
    const errorReport = await page.evaluate(() => {
      return {
        hasLoadingSpinner: !!document.querySelector('.app-loader'),
        rootChildren: document.getElementById('root')?.children.length || 0,
        bodyText: document.body.textContent?.substring(0, 500) || '',
        title: document.title,
        scripts: Array.from(document.scripts).map(s => s.src || 'inline'),
        styles: Array.from(document.styleSheets).map(s => s.href || 'inline')
      };
    });
    
    console.log('=== ERROR REPORT ===');
    console.log('Console messages:', consoleMessages);
    console.log('Page errors:', pageErrors);
    console.log('Network errors:', networkErrors);
    console.log('Page state:', errorReport);
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/error-capture.png' });
    
    // Log all errors for debugging
    if (pageErrors.length > 0) {
      console.log('❌ JavaScript errors found:');
      pageErrors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (networkErrors.length > 0) {
      console.log('❌ Network errors found:');
      networkErrors.forEach(error => console.log(`  - ${error}`));
    }
    
    // Basic assertions - we expect no errors
    expect(pageErrors.length).toBe(0);
    expect(networkErrors.length).toBe(0);
    
  } finally {
    // Clean up server
    server.close();
  }
}); 