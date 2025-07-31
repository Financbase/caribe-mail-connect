#!/usr/bin/env node

/**
 * Comprehensive Test Runner for PRMCMS
 * Runs all tests and provides detailed reporting
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TestRunner {
  constructor() {
    this.results = {
      unit: { status: 'pending', output: '', duration: 0, passed: 0, failed: 0 },
      integration: { status: 'pending', output: '', duration: 0, passed: 0, failed: 0 },
      e2e: { status: 'pending', output: '', duration: 0, passed: 0, failed: 0 },
      accessibility: { status: 'pending', output: '', duration: 0, passed: 0, failed: 0 }
    };
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: 'pipe',
        shell: true,
        ...options
      });

      let output = '';
      let errorOutput = '';

      child.stdout.on('data', (data) => {
        output += data.toString();
        process.stdout.write(data);
      });

      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
        process.stderr.write(data);
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ output, errorOutput, code });
        } else {
          reject({ output, errorOutput, code });
        }
      });

      child.on('error', (error) => {
        reject({ output, errorOutput, error: error.message });
      });
    });
  }

  async runUnitTests() {
    this.log('Running unit tests...');
    const startTime = Date.now();
    
    try {
      const result = await this.runCommand('npm', ['run', 'test:unit'], {
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=8192' }
      });
      
      const duration = Date.now() - startTime;
      this.results.unit = {
        status: 'passed',
        output: result.output,
        duration,
        passed: this.extractTestCount(result.output, 'passed'),
        failed: this.extractTestCount(result.output, 'failed')
      };
      
      this.log(`Unit tests completed in ${duration}ms`, 'success');
    } catch (error) {
      const duration = Date.now() - startTime;
      this.results.unit = {
        status: 'failed',
        output: error.output || error.errorOutput || error.message,
        duration,
        passed: this.extractTestCount(error.output || '', 'passed'),
        failed: this.extractTestCount(error.output || '', 'failed')
      };
      
      this.log(`Unit tests failed: ${error.message}`, 'error');
    }
  }

  async runIntegrationTests() {
    this.log('Running integration tests...');
    const startTime = Date.now();
    
    try {
      const result = await this.runCommand('npm', ['run', 'test:integration'], {
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=8192' }
      });
      
      const duration = Date.now() - startTime;
      this.results.integration = {
        status: 'passed',
        output: result.output,
        duration,
        passed: this.extractTestCount(result.output, 'passed'),
        failed: this.extractTestCount(result.output, 'failed')
      };
      
      this.log(`Integration tests completed in ${duration}ms`, 'success');
    } catch (error) {
      const duration = Date.now() - startTime;
      this.results.integration = {
        status: 'failed',
        output: error.output || error.errorOutput || error.message,
        duration,
        passed: this.extractTestCount(error.output || '', 'passed'),
        failed: this.extractTestCount(error.output || '', 'failed')
      };
      
      this.log(`Integration tests failed: ${error.message}`, 'error');
    }
  }

  async runE2ETests() {
    this.log('Running E2E tests...');
    const startTime = Date.now();
    
    try {
      const result = await this.runCommand('npm', ['run', 'test:e2e'], {
        cwd: path.join(__dirname, '..')
      });
      
      const duration = Date.now() - startTime;
      this.results.e2e = {
        status: 'passed',
        output: result.output,
        duration,
        passed: this.extractTestCount(result.output, 'passed'),
        failed: this.extractTestCount(result.output, 'failed')
      };
      
      this.log(`E2E tests completed in ${duration}ms`, 'success');
    } catch (error) {
      const duration = Date.now() - startTime;
      this.results.e2e = {
        status: 'failed',
        output: error.output || error.errorOutput || error.message,
        duration,
        passed: this.extractTestCount(error.output || '', 'passed'),
        failed: this.extractTestCount(error.output || '', 'failed')
      };
      
      this.log(`E2E tests failed: ${error.message}`, 'error');
    }
  }

  extractTestCount(output, type) {
    const regex = new RegExp(`(\\d+)\\s+${type}`, 'i');
    const match = output.match(regex);
    return match ? parseInt(match[1]) : 0;
  }

  generateReport() {
    const totalDuration = Date.now() - this.startTime;
    const totalPassed = Object.values(this.results).reduce((sum, result) => sum + result.passed, 0);
    const totalFailed = Object.values(this.results).reduce((sum, result) => sum + result.failed, 0);
    const totalTests = totalPassed + totalFailed;
    const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;

    const report = `
# PRMCMS Test Results Report

**Generated:** ${new Date().toISOString()}
**Total Duration:** ${totalDuration}ms
**Total Tests:** ${totalTests}
**Passed:** ${totalPassed}
**Failed:** ${totalFailed}
**Success Rate:** ${successRate}%

## Test Results Summary

${Object.entries(this.results).map(([type, result]) => `
### ${type.charAt(0).toUpperCase() + type.slice(1)} Tests
- **Status:** ${result.status === 'passed' ? '✅ PASSED' : result.status === 'failed' ? '❌ FAILED' : '⏳ PENDING'}
- **Duration:** ${result.duration}ms
- **Passed:** ${result.passed}
- **Failed:** ${result.failed}
- **Success Rate:** ${result.passed + result.failed > 0 ? ((result.passed / (result.passed + result.failed)) * 100).toFixed(1) : 0}%
`).join('')}

## Issues Found

${this.identifyIssues()}

## Recommendations

${this.generateRecommendations()}

## Next Steps

1. **Immediate Actions:**
   - Fix failing tests identified above
   - Address memory issues if any
   - Resolve import/export conflicts

2. **Short-term Actions:**
   - Improve test coverage
   - Add missing test cases
   - Optimize test performance

3. **Long-term Actions:**
   - Implement CI/CD pipeline
   - Add performance testing
   - Set up test monitoring
`;

    return report;
  }

  identifyIssues() {
    const issues = [];
    
    Object.entries(this.results).forEach(([type, result]) => {
      if (result.status === 'failed') {
        issues.push(`- **${type} tests failed:** ${result.failed} tests failed`);
        
        // Extract specific error patterns
        if (result.output.includes('Cannot find module')) {
          issues.push(`  - Missing module imports in ${type} tests`);
        }
        if (result.output.includes('SyntaxError')) {
          issues.push(`  - Syntax errors in ${type} test files`);
        }
        if (result.output.includes('TypeError')) {
          issues.push(`  - Type errors in ${type} tests`);
        }
        if (result.output.includes('Cannot read property')) {
          issues.push(`  - Property access errors in ${type} tests`);
        }
      }
    });
    
    return issues.length > 0 ? issues.join('\n') : '- No critical issues found';
  }

  generateRecommendations() {
    const recommendations = [];
    
    Object.entries(this.results).forEach(([type, result]) => {
      if (result.failed > 0) {
        recommendations.push(`- Fix ${result.failed} failing ${type} tests`);
      }
      if (result.passed + result.failed < 10) {
        recommendations.push(`- Add more ${type} tests to improve coverage`);
      }
    });
    
    if (recommendations.length === 0) {
      recommendations.push('- All tests are passing! Consider adding more test coverage');
    }
    
    return recommendations.join('\n');
  }

  async run() {
    this.log('Starting comprehensive test suite...');
    
    try {
      await this.runUnitTests();
      await this.runIntegrationTests();
      await this.runE2ETests();
      
      const report = this.generateReport();
      
      // Save report to file
      const reportPath = path.join(__dirname, '..', 'test-results', `test-report-${Date.now()}.md`);
      fs.mkdirSync(path.dirname(reportPath), { recursive: true });
      fs.writeFileSync(reportPath, report);
      
      this.log(`Test report saved to: ${reportPath}`);
      this.log('Comprehensive test suite completed!');
      
      console.log('\n' + report);
      
    } catch (error) {
      this.log(`Test runner failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Run the test runner
const runner = new TestRunner();
runner.run().catch(console.error); 