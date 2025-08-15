# Playwright E2E Testing Guide

## Overview
This directory contains end-to-end (E2E) tests for the Caribbean Mail Connect application using Playwright. The configuration supports both local development and CI/CD environments with comprehensive browser coverage.

## Configuration Features

### Test Execution Modes
- **Headed Mode (Development)**: Tests run with visible browser windows (slowMo: 50ms for debugging)
- **Headless Mode (CI)**: Tests run without UI for faster execution in CI pipelines

### Browser Coverage
- **Desktop Browsers**: Chromium, Firefox, WebKit (Safari), Microsoft Edge
- **Mobile Browsers**: Mobile Chrome (Pixel 5), Mobile Safari (iPhone 12)
- **Tablet**: iPad (7th generation)

### Regional Settings
- **Locale**: es-PR (Spanish - Puerto Rico)
- **Timezone**: America/Puerto_Rico
- **Geolocation**: San Juan, PR (18.4655, -66.1057)

## Available Scripts

```bash
# Run all tests
npm run test:e2e

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests interactively
npm run test:e2e:debug

# Open Playwright UI mode
npm run test:e2e:ui

# Generate tests using Playwright codegen
npm run test:e2e:codegen

# View HTML test report
npm run test:e2e:report

# Run mobile-specific tests
npm run test:e2e:mobile

# Run desktop-specific tests
npm run test:e2e:desktop

# Run tests in CI mode
npm run test:e2e:ci
```

## Running Specific Browser Tests

```bash
# Run tests on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
npx playwright test --project="Microsoft Edge"
```

## Test Structure

```
tests/
├── README.md                 # This file
├── diagnostic.spec.ts        # Diagnostic tests
├── utils/                    # Test utilities and helpers
├── snapshots/               # Visual regression snapshots
└── auth/                    # Authentication setup (future)
    └── user.json           # Stored authentication state
```

## Environment Configuration

The tests use environment variables from `.env.test`:

```env
# Base URL for testing
BASE_URL=http://localhost:8080

# API URL (if different from base)
API_URL=http://localhost:8080/api

# Other test-specific variables
```

## Key Configuration Settings

### Timeouts
- **Test Timeout**: 60 seconds per test
- **Expect Timeout**: 10 seconds for assertions
- **Action Timeout**: 15 seconds for browser actions
- **Navigation Timeout**: 30 seconds for page navigation

### Test Artifacts
- **Screenshots**: Captured on failure (full page)
- **Videos**: Retained on failure (CI only)
- **Traces**: Captured on first retry (CI) or failure (local)
- **HTML Report**: Opens on failure (local) or saved (CI)

### CI/CD Settings
- **Retries**: 2 retries on failure in CI
- **Workers**: Single worker in CI, parallel locally
- **Fail Fast**: Maximum 10 failures in CI

## Writing Tests

### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Caribbean Mail/);
  });
});
```

### Mobile-Specific Tests
```typescript
test.describe('Mobile Features', () => {
  test.use({ 
    viewport: { width: 375, height: 667 },
    hasTouch: true,
    isMobile: true 
  });
  
  test('mobile navigation', async ({ page }) => {
    // Mobile-specific test logic
  });
});
```

### Authentication Tests (Future)
```typescript
// tests/auth.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
  await page.context().storageState({ path: 'tests/auth/user.json' });
});
```

## Best Practices

1. **Test Isolation**: Each test should be independent and not rely on other tests
2. **Explicit Waits**: Use Playwright's built-in waiting mechanisms instead of arbitrary delays
3. **Locator Strategies**: Prefer data-testid attributes for stable element selection
4. **Parallel Execution**: Tests run in parallel by default for faster feedback
5. **Mobile Testing**: Always test critical flows on mobile viewports
6. **Accessibility**: Include accessibility checks in your tests

## Debugging

### Visual Debugging
```bash
# Open Playwright Inspector
npx playwright test --debug

# Open Playwright UI Mode
npx playwright test --ui
```

### Trace Viewer
```bash
# View trace after test failure
npx playwright show-trace trace.zip
```

### Generate Tests
```bash
# Record actions and generate test code
npx playwright codegen http://localhost:8080
```

## Continuous Integration

The configuration automatically adjusts for CI environments:
- Runs in headless mode
- Single worker to avoid resource conflicts
- Generates JUnit XML reports
- Retries failed tests twice
- Captures videos and traces on failure

## Troubleshooting

### Common Issues

1. **Port Already in Use**: The dev server might already be running
   - Solution: Set `reuseExistingServer: true` or stop the existing server

2. **Browser Not Installed**: Playwright browsers need to be installed
   - Solution: Run `npx playwright install`

3. **Timeout Errors**: Tests may timeout on slower machines
   - Solution: Increase timeout values in configuration

4. **Flaky Tests**: Tests passing/failing inconsistently
   - Solution: Add proper waits, avoid hard-coded delays

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-test)
- [Debugging Guide](https://playwright.dev/docs/debug)
