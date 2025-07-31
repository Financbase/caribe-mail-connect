import { test, expect } from '@playwright/test';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test('Built React app test', async ({ page }) => {
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
    
    // Wait for React to load and render - look for actual content
    await page.waitForFunction(() => {
      const body = document.body;
      const text = body.textContent || '';
      return text.includes('PRMCMS') || text.includes('Puerto Rico') || text.includes('Personal');
    }, { timeout: 15000 });
    
    // Check if we can see PRMCMS content
    const bodyText = await page.textContent('body');
    console.log('Body text (first 500 chars):', bodyText?.substring(0, 500));
    
    // Basic assertions
    expect(bodyText).toContain('PRMCMS');
    
    // Check if React has replaced the loading spinner
    const hasLoadingSpinner = await page.$('.app-loader');
    console.log('Loading spinner still present:', !!hasLoadingSpinner);
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/built-app-test.png' });
    
    console.log('✅ Built React app test passed');
  } finally {
    // Clean up server
    server.close();
  }
}); 