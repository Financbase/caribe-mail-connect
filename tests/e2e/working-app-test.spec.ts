import { test, expect } from '@playwright/test';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

test('Working app test', async ({ page }) => {
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
    let filePath = join(distPath, cleanUrl === '' ? 'index.html' : cleanUrl);
    
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
    // Navigate to the app
    await page.goto(baseUrl);
    
    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for JavaScript to execute
    await page.waitForTimeout(5000);
    
    // Check if the app has loaded by looking for actual content
    const appLoaded = await page.evaluate(() => {
      // Check if the loading spinner is gone
      const loadingSpinner = document.querySelector('.app-loader');
      if (loadingSpinner) {
        return { loaded: false, reason: 'Loading spinner still present' };
      }
      
      // Check if there's any React-rendered content
      const root = document.getElementById('root');
      if (!root) {
        return { loaded: false, reason: 'No root element' };
      }
      
      // Check if there's content beyond just the loading spinner
      const children = Array.from(root.children);
      const hasContent = children.some(child => 
        child.tagName !== 'STYLE' && 
        child.className !== 'app-loader' &&
        child.textContent && 
        child.textContent.trim().length > 0
      );
      
      if (!hasContent) {
        return { loaded: false, reason: 'No content in root element' };
      }
      
      // Check for specific app content
      const bodyText = document.body.textContent || '';
      const hasAppContent = bodyText.includes('PRMCMS') || 
                           bodyText.includes('Puerto Rico') || 
                           bodyText.includes('Personal') ||
                           bodyText.includes('Cliente');
      
      if (!hasAppContent) {
        return { loaded: false, reason: 'No app-specific content found' };
      }
      
      return { loaded: true, content: bodyText.substring(0, 200) };
    });
    
    console.log('App loaded check:', appLoaded);
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/working-app-test.png' });
    
    // Basic assertions
    expect(appLoaded.loaded).toBe(true);
    
    // If the app loaded, check for specific elements
    if (appLoaded.loaded) {
      // Check for the main app content
      const bodyText = await page.textContent('body');
      expect(bodyText).toContain('PRMCMS');
      
      // Check that the loading spinner is gone
      const loadingSpinner = await page.$('.app-loader');
      expect(loadingSpinner).toBeNull();
      
      console.log('✅ App is working correctly!');
    }
    
  } finally {
    // Clean up server
    server.close();
  }
}); 