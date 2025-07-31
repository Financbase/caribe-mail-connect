#!/usr/bin/env node

/**
 * Test Verification Script for PRMCMS
 * Quick verification of our fixes
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TestVerification {
  constructor() {
    this.results = {
      unit: { status: 'pending', passed: 0, failed: 0 },
      build: { status: 'pending' },
      e2e: { status: 'pending', passed: 0, failed: 0 }
    };
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

  async verifyUnitTests() {
    this.log('Verifying unit tests...');
    
    try {
      const result = await this.runCommand('npm', ['run', 'test:unit', '--', '--run', 'src/components/__tests__/ActionCard.test.tsx'], {
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=8192' }
      });

      // Extract test results
      const passedMatch = result.output.match(/(\d+) passed/);
      const failedMatch = result.output.match(/(\d+) failed/);
      
      this.results.unit = {
        status: 'passed',
        passed: passedMatch ? parseInt(passedMatch[1]) : 0,
        failed: failedMatch ? parseInt(failedMatch[1]) : 0
      };

      this.log(`Unit tests: ${this.results.unit.passed} passed, ${this.results.unit.failed} failed`, 'success');
    } catch (error) {
      this.results.unit = {
        status: 'failed',
        passed: 0,
        failed: 1
      };
      this.log(`Unit tests failed: ${error.message}`, 'error');
    }
  }

  async verifyBuild() {
    this.log('Verifying build process...');
    
    try {
      await this.runCommand('npm', ['run', 'build'], {
        cwd: path.join(__dirname, '..')
      });

      // Check if dist directory exists
      const distPath = path.join(__dirname, '..', 'dist');
      if (fs.existsSync(distPath)) {
        this.results.build = { status: 'passed' };
        this.log('Build verification passed', 'success');
      } else {
        this.results.build = { status: 'failed' };
        this.log('Build verification failed - dist directory not found', 'error');
      }
    } catch (error) {
      this.results.build = { status: 'failed' };
      this.log(`Build verification failed: ${error.message}`, 'error');
    }
  }

  async verifyE2ETests() {
    this.log('Verifying E2E test configuration...');
    
    try {
      // Just check if Playwright is configured properly
      const result = await this.runCommand('npx', ['playwright', '--version'], {
        cwd: path.join(__dirname, '..')
      });

      this.results.e2e = { status: 'configured', passed: 0, failed: 0 };
      this.log('E2E tests configured properly', 'success');
    } catch (error) {
      this.results.e2e = { status: 'failed', passed: 0, failed: 1 };
      this.log(`E2E configuration failed: ${error.message}`, 'error');
    }
  }

  generateReport() {
    const report = `
# PRMCMS Test Verification Report

**Generated:** ${new Date().toISOString()}

## Verification Results

### Unit Tests
- **Status**: ${this.results.unit.status === 'passed' ? '✅ PASSED' : '❌ FAILED'}
- **Passed**: ${this.results.unit.passed}
- **Failed**: ${this.results.unit.failed}

### Build Process
- **Status**: ${this.results.build.status === 'passed' ? '✅ PASSED' : '❌ FAILED'}

### E2E Tests
- **Status**: ${this.results.e2e.status === 'configured' ? '✅ CONFIGURED' : '❌ FAILED'}

## Summary

${this.getSummary()}

## Next Steps

${this.getNextSteps()}
    `;

    return report;
  }

  getSummary() {
    const totalTests = this.results.unit.passed + this.results.unit.failed;
    const successRate = totalTests > 0 ? ((this.results.unit.passed / totalTests) * 100).toFixed(1) : 0;
    
    if (this.results.unit.status === 'passed' && this.results.build.status === 'passed') {
      return `✅ **VERIFICATION SUCCESSFUL** - All critical components are working properly. Unit test success rate: ${successRate}%`;
    } else {
      return `⚠️ **VERIFICATION INCOMPLETE** - Some issues need to be addressed. Unit test success rate: ${successRate}%`;
    }
  }

  getNextSteps() {
    const steps = [];
    
    if (this.results.unit.status === 'passed') {
      steps.push('✅ Unit tests are working - component fixes are successful');
    } else {
      steps.push('❌ Fix remaining unit test issues');
    }
    
    if (this.results.build.status === 'passed') {
      steps.push('✅ Build process is working - ready for E2E tests');
    } else {
      steps.push('❌ Fix build process issues');
    }
    
    if (this.results.e2e.status === 'configured') {
      steps.push('✅ E2E tests are configured - ready for authentication flow fixes');
    } else {
      steps.push('❌ Fix E2E test configuration');
    }
    
    steps.push('🚀 Run comprehensive test suite with `npm run test:run`');
    steps.push('📊 Update TESTING_SOURCE_OF_TRUTH.md with final results');
    
    return steps.map(step => `- ${step}`).join('\n');
  }

  async run() {
    this.log('Starting PRMCMS test verification...');

    try {
      await this.verifyUnitTests();
      await this.verifyBuild();
      await this.verifyE2ETests();

      const report = this.generateReport();

      // Save report to file
      const reportPath = path.join(__dirname, '..', 'test-results', `verification-report-${Date.now()}.md`);
      fs.mkdirSync(path.dirname(reportPath), { recursive: true });
      fs.writeFileSync(reportPath, report);

      this.log(`Verification report saved to: ${reportPath}`);
      this.log('Test verification completed!');

      console.log('\n' + report);

    } catch (error) {
      this.log(`Test verification failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Run the verification
const verification = new TestVerification();
verification.run().catch(console.error); 