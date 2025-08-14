# Testing Strategy for PRMCMS

## Overview
This document outlines the testing strategy for the Puerto Rico Mail Carrier Management System (PRMCMS).

## Testing Framework
- **Test Runner**: Vitest v3.2.4
- **Testing Library**: React Testing Library
- **User Interaction**: @testing-library/user-event
- **Assertion Library**: Vitest's built-in expect + jest-dom matchers
- **E2E Testing**: Playwright (separate configuration)

## Test Structure

### Unit Tests
Located in component directories as `__tests__` folders or `.test.tsx` files.

```
src/
├── components/
│   ├── ui/
│   │   ├── __tests__/
│   │   │   └── button.test.tsx
│   │   └── button.tsx
│   └── features/
│       ├── packages/
│       │   ├── __tests__/
│       │   │   └── PackageList.test.tsx
│       │   └── PackageList.tsx
```

### Integration Tests
Located in `src/test/integration/`

### E2E Tests
Located in `tests/` directory (Playwright)

## Running Tests

```bash
# Run all tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Categories

### 1. Component Tests
- UI components (buttons, forms, modals)
- Business logic components
- Custom hooks

### 2. Integration Tests
- API integration
- Database operations
- Authentication flows

### 3. E2E Tests
- Critical user journeys
- Business workflows
- Mobile responsiveness

## Testing Priorities

### High Priority (Must Test)
1. **Authentication & Authorization**
   - Login/logout flows
   - Role-based access control
   - Session management

2. **Package Management**
   - Package intake/scanning
   - Package search
   - Package delivery confirmation
   - Barcode scanning

3. **Customer Management**
   - Customer registration
   - Customer search
   - Customer notifications

4. **Billing & Payments**
   - Invoice generation
   - Payment processing
   - Tax calculations

5. **Compliance**
   - CMRA compliance checks
   - Data validation
   - Audit trail

### Medium Priority
1. **Reporting**
   - Report generation
   - Data exports
   - Analytics

2. **Route Management**
   - Route optimization
   - Driver assignment

3. **Notifications**
   - Email notifications
   - SMS notifications
   - In-app notifications

### Low Priority
1. **UI/UX Polish**
   - Animations
   - Tooltips
   - Theme switching

## Test Data Management

### Mock Data
- Use factory functions for creating test data
- Located in `src/test/mocks/`

### Test Database
- Use in-memory database for integration tests
- Reset between test runs

## Coverage Goals
- **Overall**: 80%
- **Critical Features**: 95%
- **UI Components**: 70%
- **Utilities**: 90%

## Best Practices

### Do's
- Write descriptive test names
- Test user behavior, not implementation
- Use data-testid sparingly
- Mock external dependencies
- Test edge cases and error states
- Keep tests independent
- Use beforeEach/afterEach for setup/cleanup

### Don'ts
- Don't test implementation details
- Don't test third-party libraries
- Don't use snapshots for frequently changing UI
- Don't make tests dependent on each other
- Don't test styles directly

## Example Test Structure

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Reset mocks, clear localStorage, etc.
  });

  // Group related tests
  describe('Feature/Behavior', () => {
    it('should do something specific', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<Component />);
      
      // Act
      await user.click(screen.getByRole('button'));
      
      // Assert
      expect(screen.getByText('Expected')).toBeInTheDocument();
    });
  });
});
```

## Continuous Integration

### Pre-commit
- Run linting
- Run affected tests

### Pre-push
- Run all unit tests
- Check coverage thresholds

### CI Pipeline
- Run all tests
- Generate coverage reports
- Run E2E tests on staging

## Monitoring & Reporting
- Coverage reports in HTML format
- Test results in CI/CD pipeline
- Performance metrics for slow tests
- Flaky test detection

## Next Steps
1. Add tests for all critical features
2. Set up CI/CD integration
3. Implement visual regression testing
4. Add performance testing
5. Create test data factories
6. Document component testing patterns
