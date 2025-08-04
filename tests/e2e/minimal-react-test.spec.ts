import { test, expect } from '@playwright/test';
import { createServer } from 'https';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

test('Minimal React test', async ({ page }) => {
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
    // Navigate to the app
    await page.goto(baseUrl);
    
    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for JavaScript to execute
    await page.waitForTimeout(3000);
    
    // Try to execute a simple React test in the browser
    const reactTestResult = await page.evaluate(() => {
      try {
        // Check if React is available
        if (typeof window.React === 'undefined') {
          return { success: false, error: 'React not available on window' };
        }
        
        // Check if ReactDOM is available
        if (typeof window.ReactDOM === 'undefined') {
          return { success: false, error: 'ReactDOM not available on window' };
        }
        
        // Try to create a simple React element
        const element = window.React.createElement('div', { 
          'data-testid': 'react-test' 
        }, 'Hello React');
        
        // Try to render it
        const container = document.createElement('div');
        const root = window.ReactDOM.createRoot(container);
        root.render(element);
        
        return { 
          success: true, 
          message: 'React is working',
          elementCreated: !!element,
          rootCreated: !!root
        };
      } catch (error) {
        return { 
          success: false, 
          error: error.message,
          stack: error.stack
        };
      }
    });
    
    console.log('React test result:', reactTestResult);
    
    // Check if the test element was rendered
    if (reactTestResult.success) {
      const testElement = await page.$('[data-testid="react-test"]');
      console.log('Test element found:', !!testElement);
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/minimal-react-test.png' });
    
    // Basic assertions
    expect(reactTestResult.success).toBe(true);
    
  } finally {
    // Clean up server
    server.close();
  }
}); 