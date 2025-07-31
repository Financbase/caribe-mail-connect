# PRMCMS Test Suite

This directory contains a comprehensive test suite for the Puerto Rico Mail Carrier Management System (PRMCMS) built with Python and Playwright.

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Node.js and npm (for running the PRMCMS application)
- Git

### Installation

1. **Install Python dependencies:**

   ```bash
   python3 setup_tests.py
   ```

2. **Start the PRMCMS application:**

   ```bash
   cd ../../
   npm run dev
   ```

3. **Run the test suite:**

   ```bash
   python3 test_runner.py
   ```

## 📁 File Structure

```text
testsprite_tests/
├── base_test.py              # Base test class with common functionality
├── test_runner.py            # Main test runner for all tests
├── setup_tests.py            # Setup script for dependencies
├── requirements.txt          # Python dependencies
├── setup.py                  # Python package setup
├── test_config.ini          # Test configuration
├── README.md                # This file
└── TC*.py                   # Individual test case files
```

## 🧪 Test Files

The test suite includes comprehensive test cases for:

- **Authentication Tests** (`TC001_*`, `TC002_*`)
  - Multi-factor authentication success/failure
  - Role-based access control
  - User login/logout flows

- **Package Management Tests** (`TC003_*`, `TC004_*`)
  - Package intake with barcode scanning
  - Offline package processing
  - OCR fallback functionality

- **Customer Management Tests** (`TC005_*`, `TC006_*`)
  - Customer notifications
  - Virtual mailbox access
  - Package release verification

- **Compliance Tests** (`TC007_*`, `TC008_*`)
  - CMRA compliance reporting
  - Audit logging
  - Data privacy controls

- **Performance Tests** (`TC014_*`)
  - Concurrent user load testing
  - Response time validation
  - System stability under load

## 🛠️ Usage

### Running Individual Tests

```bash
# Run a specific test
python3 TC001_Multi_factor_Authentication_Success.py

# Run with verbose output
python3 -u TC001_Multi_factor_Authentication_Success.py
```

### Running All Tests

```bash
# Run all tests with the test runner
python3 test_runner.py

# Run with specific options
python3 test_runner.py --verbose --parallel
```

### Test Configuration

Edit `test_config.ini` to customize test settings:

```ini
BASE_URL=http://localhost:5173
TIMEOUT=10000
HEADLESS=true
BROWSER=chromium
```

## 🔧 Development

### Adding New Tests

1. **Create a new test file** following the naming convention `TC###_Description.py`
2. **Extend the BaseTest class:**

```python
#!/usr/bin/env python3
"""
Your Test Description
"""

import asyncio
from base_test import BaseTest

class YourTestClass(BaseTest):
    async def run_test(self):
        """Your test implementation"""
        try:
            await self.setup()
            await self.navigate_to_app()
            
            # Your test steps here
            await self.safe_click('button:has-text("Your Button")')
            await self.safe_fill('input[name="field"]', 'test value')
            
            # Assertions
            await self.assert_content_contains("Expected text")
            
            print("✅ Test completed successfully")
            
        except Exception as e:
            print(f"❌ Test failed: {e}")
            raise
        finally:
            await self.cleanup()

async def run_test():
    test = YourTestClass()
    await test.run_test()

if __name__ == "__main__":
    asyncio.run(run_test())
```

### BaseTest Methods

The `BaseTest` class provides these helpful methods:

- `setup()` - Initialize browser and page
- `cleanup()` - Clean up resources
- `navigate_to_app()` - Navigate to the application
- `safe_click(selector)` - Click an element with error handling
- `safe_fill(selector, value)` - Fill an input field safely
- `wait_for_element(selector)` - Wait for an element to appear
- `assert_page_title(title)` - Assert page title
- `assert_content_contains(text)` - Assert page contains text

## 🐛 Troubleshooting

### Common Issues

1. **Import Error: No module named 'playwright'**

   ```bash
   python3 setup_tests.py
   ```

2. **Browser not found**

   ```bash
   python3 -m playwright install chromium
   ```

3. **Application not accessible**
   - Ensure PRMCMS is running on `http://localhost:5173`
   - Check firewall settings
   - Verify the application is fully loaded

4. **Test timeouts**
   - Increase timeout in `test_config.ini`
   - Check network connectivity
   - Verify application performance

### Debug Mode

Run tests with debug logging:

```bash
python3 -u test_runner.py --debug
```

### Headless Mode

Tests run in headless mode by default. To see the browser:

```bash
# Edit test_config.ini
HEADLESS=false
```

## 📊 Test Results

The test runner provides detailed results including:

- Test execution time
- Success/failure status
- Error messages and stack traces
- Summary statistics

Example output:

```text
Found 51 test files

Running TC001_Multi_factor_Authentication_Success.py...
✅ TC001_Multi_factor_Authentication_Success.py - PASSED (3.45s)

==================================================
TEST SUMMARY
==================================================
Total Tests: 51
Passed: 48
Failed: 3
Success Rate: 94.1%
```

## 🤝 Contributing

1. Follow the existing test naming convention
2. Use the `BaseTest` class for consistency
3. Include proper error handling
4. Add descriptive comments
5. Test your changes before committing

## 📝 License

This test suite is part of the PRMCMS project and follows the same license terms.

## 🆘 Support

For issues with the test suite:

1. Check the troubleshooting section
2. Review the test logs
3. Verify your environment setup
4. Contact the development team

---

**Note:** This test suite is designed to work with the PRMCMS application running on `http://localhost:5173`. Make sure the application is running before executing tests.
