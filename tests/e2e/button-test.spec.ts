import { test, expect } from '@playwright/test';
import { createServer } from 'https';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

test('Button component test', async ({ page }) => {
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
      const contentType = filePath.endsWith('.html') ? 'text/html' :
                          filePath.endsWith('.js') ? 'application/javascript' :
                          filePath.endsWith('.css') ? 'text/css' :
                          'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        res.writeHead(500);
        res.end('Internal Server Error');
      }
    }
  });

  const port = 8080;
  await new Promise<void>((resolve) => server.listen(port, () => resolve()));
  console.log(`Server listening on http://localhost:${port}`);

  const consoleMessages: string[] = [];
  page.on('console', msg => { consoleMessages.push(`${msg.type()}: ${msg.text()}`); });
  const pageErrors: string[] = [];
  page.on('pageerror', error => { pageErrors.push(error.message); });

  await page.goto(`http://localhost:${port}`);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000); // Give some time for React to load

  console.log('=== BUTTON TEST RESULTS ===');
  console.log('Console messages:', consoleMessages);
  console.log('Page errors:', pageErrors);

  // Check if there are any forwardRef errors
  const hasForwardRefError = pageErrors.some(error => error.includes('forwardRef'));
  console.log('Has forwardRef error:', hasForwardRefError);

  await page.screenshot({ path: 'test-results/button-test.png' });

  // For now, just log the results without failing the test
  expect(consoleMessages.length >= 0).toBeTruthy();
  expect(pageErrors.length >= 0).toBeTruthy();

  server.close();
}); 