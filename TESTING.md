# PRMCMS Testing Guide

This document provides comprehensive guidance for testing the PRMCMS application, covering unit tests, E2E tests, accessibility testing, and performance monitoring.

## 🧪 Testing Overview

PRMCMS implements a comprehensive testing strategy with multiple layers:

- **Unit Tests**: Jest + React Testing Library for component and hook testing
- **E2E Tests**: Playwright for end-to-end user journey testing
- **Accessibility Tests**: axe-core integration for WCAG compliance
- **Performance Tests**: Lighthouse and custom performance monitoring
- **Cross-browser Tests**: Automated testing across multiple browsers

## 🚀 Quick Start

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run test:e2e:install
```

### Running Tests

```bash
# Run all tests
npm run test:all

# Run unit tests only
npm run test:unit

# Run E2E tests only
npm run test:e2e

# Run accessibility tests
npm run test:accessibility

# Run authentication tests
npm run test:auth
```

## 📋 Unit Testing

### Test Structure

```text
src/
├── __tests__/
│   ├── auth.test.tsx          # Authentication tests
│   ├── accessibility.test.tsx # Accessibility tests
│   └── components/            # Component-specific tests
├── components/
│   └── __tests__/
│       └── ComponentName.test.tsx
└── hooks/
    └── __tests__/
        └── useHookName.test.ts
```

### Writing Unit Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Auth } from '../pages/Auth';

describe('Authentication Component', () => {
  it('should render login form', () => {
    render(<Auth />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should validate form fields', async () => {
    render(<Auth />);
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });
});
```

### Test Coverage

```bash
# Generate coverage report
npm run test:unit:coverage

# Coverage targets:
# - Statements: 80%
# - Branches: 80%
# - Functions: 80%
# - Lines: 80%
```

## 🌐 E2E Testing

### Test Structure Continued

```text
tests/
├── e2e/
│   ├── global-setup.ts           # Global test setup
│   ├── global-teardown.ts        # Global test cleanup
│   ├── critical-user-journeys.spec.ts  # Main E2E tests
│   └── fixtures/                 # Test data and utilities
└── screenshots/                  # Test screenshots
```

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run specific test file
npx playwright test critical-user-journeys.spec.ts

# Run in debug mode
npm run test:e2e:debug
```

### Writing E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /login/i }).click();
    
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });
});
```

### Browser Support

E2E tests run on:

- ✅ Chrome (Chromium)
- ✅ Firefox
- ✅ Safari (WebKit)
- ✅ Mobile Chrome
- ✅ Mobile Safari

## ♿ Accessibility Testing

### Automated Accessibility Tests

```bash
# Run accessibility tests
npm run test:accessibility

# Run with axe-core
npx jest --testPathPattern=accessibility
```

### Manual Accessibility Checklist

- [ ] **Keyboard Navigation**: All interactive elements accessible via keyboard
- [ ] **Screen Reader Support**: Proper ARIA labels and roles
- [ ] **Color Contrast**: WCAG AA compliant color ratios
- [ ] **Focus Management**: Clear focus indicators and logical tab order
- [ ] **Alternative Text**: Images have descriptive alt text
- [ ] **Form Labels**: All form inputs have associated labels
- [ ] **Error Messages**: Clear, descriptive error messages
- [ ] **Language Attributes**: Proper lang attributes for internationalization

### Accessibility Test Example

```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Auth } from '../pages/Auth';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<Auth />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## ⚡ Performance Testing

### Lighthouse Performance Tests

```bash
# Run Lighthouse tests
npm run test:lighthouse

# Performance targets:
# - Performance: 90+
# - Accessibility: 95+
# - Best Practices: 90+
# - SEO: 90+
```

### Custom Performance Tests

```bash
# Run performance checks
npm run test:performance

# Bundle analysis
npm run analyze
```

### Performance Metrics

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.8s

## 🔧 Test Configuration

### Jest Configuration

```javascript
// jest.config.mjs
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Playwright Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html'], ['json'], ['junit']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
});
```

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:unit:coverage
      - run: npm run test:e2e:install
      - run: npm run test:e2e
      - run: npm run test:accessibility
      
      - uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

## 📊 Test Reports

### Coverage Reports

```bash
# Generate coverage report
npm run test:unit:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

### E2E Test Reports

```bash
# Generate HTML report
npm run test:e2e

# View report
npm run test:e2e:report
```

### Performance Reports

```bash
# Generate Lighthouse report
npm run test:lighthouse

# View reports in lighthouse-reports/
```

## 🐛 Debugging Tests

### Unit Test Debugging

```bash
# Run tests in watch mode
npm run test:unit:watch

# Run specific test file
npm test -- auth.test.tsx

# Run with verbose output
npm test -- --verbose
```

### E2E Test Debugging

```bash
# Run in debug mode
npm run test:e2e:debug

# Run with headed browser
npm run test:e2e:headed

# Run specific test
npx playwright test --grep "login"
```

### Common Issues

1. **Tests failing due to timing**: Increase timeouts or add proper waits
2. **Mock issues**: Ensure mocks are properly configured
3. **Environment variables**: Check that test environment is properly set up
4. **Browser compatibility**: Test on multiple browsers

## 📚 Best Practices

### Unit Testing

- ✅ Test component behavior, not implementation
- ✅ Use meaningful test descriptions
- ✅ Mock external dependencies
- ✅ Test error states and edge cases
- ✅ Keep tests focused and isolated

### E2E Testing

- ✅ Test user journeys, not technical implementation
- ✅ Use data attributes for reliable selectors
- ✅ Test across multiple browsers
- ✅ Include accessibility checks
- ✅ Test responsive design

### Accessibility Testing

- ✅ Test with screen readers
- ✅ Verify keyboard navigation
- ✅ Check color contrast
- ✅ Validate ARIA attributes
- ✅ Test with different zoom levels

### Performance Testing

- ✅ Set realistic performance budgets
- ✅ Monitor bundle sizes
- ✅ Test on slow networks
- ✅ Measure Core Web Vitals
- ✅ Optimize based on metrics

## 🔄 Continuous Improvement

### Regular Tasks

- [ ] **Weekly**: Review test coverage and add missing tests
- [ ] **Monthly**: Update dependencies and test configurations
- [ ] **Quarterly**: Review and update performance budgets
- [ ] **Annually**: Comprehensive accessibility audit

### Metrics to Track

- Test coverage percentage
- Test execution time
- E2E test reliability
- Performance scores
- Accessibility compliance
- Bug detection rate

## 📞 Support

For testing-related issues:

1. Check the troubleshooting section above
2. Review test logs and error messages
3. Consult the testing documentation
4. Create an issue with detailed reproduction steps

---

**Remember**: Good testing is an investment in code quality and user experience. Regular testing helps catch issues early and ensures the application remains reliable and accessible.
