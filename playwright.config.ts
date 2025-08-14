import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

/**
 * Playwright configuration for Caribbean Mail Connect
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory where all test files are located
  testDir: './tests',
  
  // Test file patterns
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  
  // Maximum time one test can run
  timeout: 60 * 1000, // 60 seconds
  
  // Maximum time to wait for expect assertions
  expect: {
    timeout: 10 * 1000, // 10 seconds
  },
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry failed tests
  retries: process.env.CI ? 2 : 0,
  
  // Number of worker processes for parallel execution
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: process.env.CI
    ? [
        ['list'],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
      ]
    : [
        ['list'],
        ['html', { outputFolder: 'playwright-report', open: 'on-failure' }],
      ],
  
  // Global test settings
  use: {
    // Base URL for all tests
    baseURL: process.env.BASE_URL || 'http://localhost:8080',
    
    // Capture screenshot on failure
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true,
    },
    
    // Capture video on failure
    video: process.env.CI ? 'retain-on-failure' : 'off',
    
    // Capture trace on failure
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    
    // Action timeout
    actionTimeout: 15 * 1000, // 15 seconds
    
    // Navigation timeout
    navigationTimeout: 30 * 1000, // 30 seconds
    
    // Default viewport size
    viewport: { width: 1280, height: 720 },
    
    // Ignore HTTPS errors (useful for local development)
    ignoreHTTPSErrors: true,
    
    // Accept downloads
    acceptDownloads: true,
    
    // Context options
    contextOptions: {
      // Locale for testing
      locale: 'es-PR',
      
      // Timezone
      timezoneId: 'America/Puerto_Rico',
      
      // Permissions
      permissions: ['geolocation', 'notifications', 'camera'],
      
      // Geolocation (San Juan, Puerto Rico)
      geolocation: { latitude: 18.4655, longitude: -66.1057 },
    },
    
    // Storage state for authenticated tests
    // Uncomment and configure when authentication is set up
    // storageState: 'tests/auth/user.json',
  },
  
  // Configure projects for major browsers
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Run in headed mode during development
        headless: process.env.CI ? true : false,
        // Slow down actions during development for debugging
        launchOptions: {
          slowMo: process.env.CI ? 0 : 50,
        },
      },
    },
    
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        headless: process.env.CI ? true : false,
      },
    },
    
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        headless: process.env.CI ? true : false,
      },
    },
    
    // Mobile browsers - Important for Caribbean Mail Connect
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        // Mobile-specific settings
        hasTouch: true,
        isMobile: true,
      },
    },
    
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        hasTouch: true,
        isMobile: true,
      },
    },
    
    // Tablet view
    {
      name: 'iPad',
      use: {
        ...devices['iPad (gen 7)'],
        hasTouch: true,
        isMobile: true,
      },
    },
    
    // Edge browser (common in business environments)
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        headless: process.env.CI ? true : false,
      },
    },
    
    // Authentication setup project (optional)
    // Uncomment when you need to set up authentication state
    /*
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        // Use a separate storage state for setup
        storageState: undefined,
      },
    },
    */
    
    // API testing project (optional)
    /*
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        // No browser needed for API tests
        browserName: undefined,
        // API-specific base URL
        baseURL: process.env.API_URL || 'http://localhost:8080/api',
      },
    },
    */
  ],
  
  // Output folder for test artifacts
  outputDir: 'test-results',
  
  // Web server configuration for local development
  webServer: process.env.CI
    ? undefined
    : {
        command: 'npm run dev',
        port: 8080,
        timeout: 120 * 1000, // 2 minutes to start
        reuseExistingServer: !process.env.CI,
        stdout: 'pipe',
        stderr: 'pipe',
        env: {
          NODE_ENV: 'test',
        },
      },
  
  // Global setup and teardown (optional)
  // Uncomment when needed
  // globalSetup: './tests/global-setup.ts',
  // globalTeardown: './tests/global-teardown.ts',
  
  // Folder for test artifacts
  snapshotDir: './tests/snapshots',
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{-projectName}{-snapshotSuffix}{ext}',
  
  // Update snapshots with --update-snapshots flag
  updateSnapshots: process.env.UPDATE_SNAPSHOTS === 'true' ? 'all' : 'missing',
  
  // Preserve output for debugging
  preserveOutput: process.env.CI ? 'failures-only' : 'always',
  
  // Quiet mode - less verbose output in CI
  quiet: !!process.env.CI,
  
  // Maximum number of test failures
  maxFailures: process.env.CI ? 10 : undefined,
});
