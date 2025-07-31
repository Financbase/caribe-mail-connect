import { test, expect } from '@playwright/test';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

test('Network debug test', async ({ page }) => {
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
      console.log(`404: ${filePath}`);
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
    // Capture network requests
    const requests: string[] = [];
    const responses: string[] = [];
    
    page.on('request', request => {
      requests.push(`${request.method()} ${request.url()}`);
    });
    
    page.on('response', response => {
      responses.push(`${response.status()} ${response.url()}`);
    });

    // Navigate to the app
    await page.goto(baseUrl);
    
    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Wait a bit more for JavaScript to execute
    await page.waitForTimeout(5000);
    
    console.log('=== NETWORK DEBUG INFO ===');
    console.log('Requests made:');
    requests.forEach(req => console.log(`  ${req}`));
    console.log('Responses received:');
    responses.forEach(resp => console.log(`  ${resp}`));
    
    // Check if React script was loaded
    const reactScriptLoaded = requests.some(req => req.includes('index-DjcFFuvD.js'));
    console.log('React script loaded:', reactScriptLoaded);
    
    // Check for any 404s
    const has404s = responses.some(resp => resp.startsWith('404'));
    console.log('Has 404 errors:', has404s);
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/network-debug.png' });
    
  } finally {
    // Clean up server
    server.close();
  }
}); 