# Authentication Test Suite Documentation

## Overview
The authentication test suite (`tests/auth.spec.ts`) provides comprehensive end-to-end testing for the authentication system in Caribbean Mail Connect. It tests various authentication scenarios across multiple browsers and device types.

## Test Coverage

### 1. User Login with Valid Credentials
Tests successful login scenarios for different user types:
- **Staff user login**: Verifies staff can login and access the dashboard
- **Admin user login**: Verifies admin users can login and see admin-specific features
- **Customer login**: Verifies customers can login to the customer portal

### 2. Login Failure with Invalid Credentials
Tests various failure scenarios:
- **Wrong password**: Ensures proper error handling for incorrect passwords
- **Non-existent email**: Validates error messages for unregistered emails
- **Empty fields validation**: Tests HTML5 form validation for required fields
- **Invalid email format**: Verifies email format validation

### 3. Session Persistence Across Page Reloads
Validates session management:
- **Page reload persistence**: Sessions survive browser refreshes
- **Customer session persistence**: Customer sessions persist properly
- **Route navigation**: Sessions remain active when navigating between routes
- **Multi-tab support**: Sessions work across multiple browser tabs

### 4. Logout Functionality
Tests logout behavior:
- **Staff logout**: Verifies complete logout for staff users
- **Customer logout**: Ensures customers can logout properly
- **Post-logout protection**: Confirms protected routes are inaccessible after logout
- **Storage cleanup**: Validates all auth data is cleared on logout

### 5. Protected Route Access Without Authentication
Ensures unauthorized access is prevented:
- **Dashboard protection**: Redirects to login when accessing dashboard
- **Route-specific protection**: Tests all protected routes (packages, customers, admin, etc.)
- **Consistent behavior**: Verifies all protected routes behave consistently
- **API protection**: Tests that API endpoints return 401/403 for unauthorized access

### 6. Authentication Edge Cases
Tests unusual scenarios:
- **Concurrent logins**: Multiple simultaneous login attempts
- **Expired sessions**: Graceful handling of session expiration
- **Network errors**: Proper error handling for network failures
- **Remember me**: Tests persistent login functionality (if implemented)

### 7. Advanced Features (Conditional)
- **Multi-factor Authentication**: Tests MFA flow (skipped if not implemented)
- **Password Reset**: Tests password reset navigation and validation

## Environment Variables
The test suite uses the following environment variables:
```bash
# Test user credentials (set in .env.test)
PLAYWRIGHT_STAFF_PASSWORD=<staff_password>
PLAYWRIGHT_ADMIN_PASSWORD=<admin_password>
PLAYWRIGHT_CUSTOMER_PASSWORD=<customer_password>
TEST_USER_PASSWORD=<fallback_password>

# Base URL for testing
BASE_URL=http://localhost:8080
```

## Running the Tests

### Run all authentication tests:
```bash
npx playwright test tests/auth.spec.ts
```

### Run specific test groups:
```bash
# Run only login tests
npx playwright test tests/auth.spec.ts -g "User Login"

# Run only logout tests
npx playwright test tests/auth.spec.ts -g "Logout"

# Run only session persistence tests
npx playwright test tests/auth.spec.ts -g "Session Persistence"
```

### Run tests in specific browsers:
```bash
# Chrome only
npx playwright test tests/auth.spec.ts --project=chromium

# Firefox only
npx playwright test tests/auth.spec.ts --project=firefox

# Mobile Chrome
npx playwright test tests/auth.spec.ts --project="Mobile Chrome"
```

### Run tests in headed mode (see browser):
```bash
npx playwright test tests/auth.spec.ts --headed
```

### Debug a specific test:
```bash
npx playwright test tests/auth.spec.ts --debug
```

## Test Data Requirements
Before running the tests, ensure you have:

1. **Test Users Created**: The following test users should exist in your authentication system:
   - `staff@test.com` - Staff user account
   - `admin@test.com` - Admin user account
   - `customer@test.com` - Customer account

2. **Environment Configuration**: Copy `.env.test.example` to `.env.test` and configure:
   ```bash
   cp .env.test.example .env.test
   ```

3. **Development Server**: The application should be running at the configured BASE_URL

## Test Structure

### Helper Functions
The test suite includes several helper functions for common operations:

- `expectLoginPage(page)`: Verifies the login page is displayed
- `expectDashboard(page)`: Verifies the dashboard is loaded
- `expectCustomerDashboard(page)`: Verifies the customer dashboard
- `loginAsStaff(page)`: Helper to login as staff (from auth-helpers.ts)
- `loginAsAdmin(page)`: Helper to login as admin (from auth-helpers.ts)
- `loginAsCustomer(page)`: Helper to login as customer (from auth-helpers.ts)

### Test Organization
Tests are organized using Playwright's `test.describe` blocks:
```
Authentication Test Suite
├── User Login with Valid Credentials
├── Login Failure with Invalid Credentials
├── Session Persistence Across Page Reloads
├── Logout Functionality
├── Protected Route Access Without Authentication
├── Authentication Edge Cases
└── Multi-factor Authentication (if implemented)

Password Reset Flow (separate suite)
```

## Browser Coverage
The test suite runs on multiple browsers and devices:
- **Desktop**: Chrome, Firefox, Safari (WebKit), Edge
- **Mobile**: Mobile Chrome, Mobile Safari
- **Tablet**: iPad

## Assertions and Expectations
The tests use various assertion patterns:
- URL validation: `await expect(page).toHaveURL(/pattern/)`
- Element visibility: `await expect(element).toBeVisible()`
- Text content: `await expect(element).toHaveText('text')`
- Storage validation: Direct evaluation of localStorage/sessionStorage

## CI/CD Integration
The tests are configured to work in CI environments:
- Automatic retries on failure (2 retries in CI)
- Headless mode by default in CI
- Screenshots on failure
- Video recording on failure (CI only)
- HTML and JUnit reports generation

## Troubleshooting

### Common Issues

1. **Tests fail with timeout errors**
   - Increase timeout in playwright.config.ts
   - Ensure the dev server is running
   - Check network connectivity

2. **Login credentials don't work**
   - Verify test users exist in the database
   - Check environment variables are set correctly
   - Ensure Supabase is configured properly

3. **Session tests fail**
   - Check Supabase auth configuration
   - Verify localStorage/sessionStorage permissions
   - Check for browser-specific storage issues

4. **Protected route tests fail**
   - Ensure AppRouter.tsx properly handles authentication
   - Verify AuthContext is wrapping the app
   - Check route protection logic

## Best Practices

1. **Clean State**: Each test starts with a clean state (cleared cookies/storage)
2. **Isolation**: Tests are independent and can run in any order
3. **Explicit Waits**: Uses proper wait conditions instead of arbitrary delays
4. **Error Handling**: Tests handle both success and failure scenarios
5. **Cross-browser**: Tests work across all major browsers
6. **Accessibility**: Tests use accessible selectors when possible

## Extending the Test Suite

To add new authentication tests:

1. Add test cases to the appropriate `test.describe` block
2. Use existing helper functions for common operations
3. Follow the naming convention: descriptive test names
4. Include both positive and negative test cases
5. Consider edge cases and error scenarios
6. Update this documentation

## Related Files
- `tests/auth.spec.ts` - Main authentication test suite
- `tests/utils/auth-helpers.ts` - Reusable authentication helpers
- `playwright.config.ts` - Playwright configuration
- `src/contexts/AuthContext.tsx` - Authentication context implementation
- `src/pages/AppRouter.tsx` - Route protection implementation
