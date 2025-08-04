import { test, expect } from '@playwright/test';
import { createServer } from 'https';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

test('Diagnostic built app test', async ({ page }) => {
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
    // Capture console messages and errors
    const consoleMessages: string[] = [];
    const pageErrors: string[] = [];
    
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });

    // Navigate to the app
    await page.goto(baseUrl);
    
    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Wait a bit more for JavaScript to execute
    await page.waitForTimeout(5000);
    
    // Check what's actually on the page
    const title = await page.title();
    const bodyText = await page.textContent('body');
    const rootElement = await page.$('#root');
    const rootHTML = await rootElement?.innerHTML();
    
    console.log('=== DIAGNOSTIC INFO ===');
    console.log('Page title:', title);
    console.log('Body text (first 500 chars):', bodyText?.substring(0, 500));
    console.log('Root element exists:', !!rootElement);
    console.log('Root HTML (first 500 chars):', rootHTML?.substring(0, 500));
    console.log('Console messages:', consoleMessages);
    console.log('Page errors:', pageErrors);
    
    // Check for loading spinner
    const hasLoadingSpinner = await page.$('.app-loader');
    console.log('Loading spinner present:', !!hasLoadingSpinner);
    
    // Check for any script tags
    const scripts = await page.$$('script');
    console.log('Number of script tags:', scripts.length);
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/diagnostic-built.png' });
    
    // Basic assertions that should always pass
    expect(title).toBeTruthy();
    expect(bodyText).toBeTruthy();
    
  } finally {
    // Clean up server
    server.close();
  }
}); 