#!/usr/bin/env node

/**
 * Test Runner for PRMCMS
 * Runs tests in smaller batches to avoid memory issues
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
      unit: { status: 'pending', output: '', duration: 0 },
      integration: { status: 'pending', output: '', duration: 0 },
      e2e: { status: 'pending', output: '', duration: 0 },
      accessibility: { status: 'pending', output: '', duration: 0 }
    };
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runCommand(command, description, testType) {
    return new Promise((resolve, reject) => {
      this.log(`Starting: ${description}`, 'info');
      const startTime = Date.now();
      
      const child = spawn('sh', ['-c', command], {
        stdio: 'pipe',
        env: { 
          ...process.env, 
          NODE_OPTIONS: '--max-old-space-size=8192',
          CI: 'true'
        }
      });

      let output = '';
      let errorOutput = '';

      child.stdout.on('data', (data) => {
        const chunk = data.toString();
        output += chunk;
        process.stdout.write(chunk);
      });

      child.stderr.on('data', (data) => {
        const chunk = data.toString();
        errorOutput += chunk;
        process.stderr.write(chunk);
      });

      child.on('close', (code) => {
        const duration = Date.now() - startTime;
        const success = code === 0;
        
        if (testType) {
          this.results[testType] = {
            status: success ? 'passed' : 'failed',
            output: output + errorOutput,
            duration,
            exitCode: code
          };
        }

        if (success) {
          this.log(`✅ Completed: ${description} (${duration}ms)`, 'success');
          resolve({ success: true, output, duration });
        } else {
          this.log(`❌ Failed: ${description} (${duration}ms) - Exit code: ${code}`, 'error');
          resolve({ success: false, output: output + errorOutput, duration, exitCode: code });
        }
      });

      child.on('error', (error) => {
        this.log(`❌ Error running ${description}: ${error.message}`, 'error');
        reject(error);
      });
    });
  }

  async runUnitTests() {
    this.log('🧪 Running Unit Tests...', 'info');
    
    // Run unit tests in smaller batches
    const testBatches = [
      'src/components/__tests__/',
      'src/hooks/__tests__/',
      'src/__tests__/'
    ];

    let allPassed = true;
    
    for (const batch of testBatches) {
      const result = await this.runCommand(
        `npm run test:unit -- ${batch}`,
        `Unit tests: ${batch}`,
        'unit'
      );
      
      if (!result.success) {
        allPassed = false;
      }
    }

    return { success: allPassed };
  }

  async runIntegrationTests() {
    this.log('🔗 Running Integration Tests...', 'info');
    
    const result = await this.runCommand(
      'npm run test:unit -- tests/',
      'Integration tests',
      'integration'
    );

    return result;
  }

  async runE2ETests() {
    this.log('🌐 Running End-to-End Tests...', 'info');
    
    const result = await this.runCommand(
      'npm run test:e2e',
      'End-to-End tests',
      'e2e'
    );

    return result;
  }

  async runAccessibilityTests() {
    this.log('♿ Running Accessibility Tests...', 'info');
    
    const result = await this.runCommand(
      'npm run test:accessibility',
      'Accessibility tests',
      'accessibility'
    );

    return result;
  }

  async generateReport() {
    this.log('📊 Generating test report...', 'info');
    
    const totalDuration = Date.now() - this.startTime;
    const report = {
      timestamp: new Date().toISOString(),
      environment: 'Local',
      totalDuration,
      results: this.results,
      summary: {
        total: Object.keys(this.results).length,
        passed: Object.values(this.results).filter(r => r.status === 'passed').length,
        failed: Object.values(this.results).filter(r => r.status === 'failed').length,
        pending: Object.values(this.results).filter(r => r.status === 'pending').length
      }
    };

    // Write detailed report
    const reportPath = path.join(__dirname, '../test-results/test-report.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate summary
    this.log('📋 Test Summary:', 'info');
    this.log(`Total Duration: ${totalDuration}ms`, 'info');
    this.log(`Tests Passed: ${report.summary.passed}/${report.summary.total}`, 'success');
    this.log(`Tests Failed: ${report.summary.failed}/${report.summary.total}`, report.summary.failed > 0 ? 'error' : 'info');
    
    Object.entries(this.results).forEach(([test, result]) => {
      const status = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⏳';
      this.log(`${status} ${test}: ${result.status} (${result.duration}ms)`, result.status === 'failed' ? 'error' : 'info');
    });

    return report;
  }

  async run() {
    try {
      this.log('🎯 Starting PRMCMS Test Suite', 'info');
      
      // Run test suites
      const unitResult = await this.runUnitTests();
      const integrationResult = await this.runIntegrationTests();
      const e2eResult = await this.runE2ETests();
      const accessibilityResult = await this.runAccessibilityTests();
      
      // Generate report
      const report = await this.generateReport();
      
      const allPassed = Object.values(this.results).every(r => r.status === 'passed');
      
      if (allPassed) {
        this.log('🎉 All tests passed! PRMCMS is ready for production.', 'success');
        process.exit(0);
      } else {
        this.log('❌ Some tests failed. Check the report for details.', 'error');
        process.exit(1);
      }
      
    } catch (error) {
      this.log(`💥 Test runner failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Run the test suite
const runner = new TestRunner();
runner.run();

export default TestRunner; 