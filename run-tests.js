#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function findTestFiles(dir = 'src') {
  const testFiles = [];
  
  function scanDirectory(currentDir) {
    const items = readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.test.tsx') || item.endsWith('.test.ts')) {
        testFiles.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return testFiles;
}

function runTests(testFiles, options = {}) {
  const { watch = false, coverage = false, verbose = false } = options;
  
  log('🧪 Running Test Suite...', 'cyan');
  log(`Found ${testFiles.length} test files`, 'blue');
  
  try {
    const args = ['npx', 'jest'];
    
    if (watch) {
      args.push('--watch');
    }
    
    if (coverage) {
      args.push('--coverage');
    }
    
    if (verbose) {
      args.push('--verbose');
    }
    
    // Add all test files
    args.push(...testFiles);
    
    log(`Executing: ${args.join(' ')}`, 'yellow');
    
    const result = execSync(args.join(' '), { 
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
    log('✅ All tests completed successfully!', 'green');
    return true;
    
  } catch (error) {
    log('❌ Some tests failed!', 'red');
    return false;
  }
}

function runTestCategories() {
  log('📋 Test Categories:', 'bright');
  
  const categories = {
    'Components': 'src/components/__tests__',
    'Hooks': 'src/hooks/__tests__',
    'Pages': 'src/pages/__tests__',
    'Utils': 'src/utils/__tests__'
  };
  
  for (const [category, path] of Object.entries(categories)) {
    try {
      const testFiles = findTestFiles(path);
      log(`  ${category}: ${testFiles.length} test files`, 'blue');
    } catch (error) {
      log(`  ${category}: No test directory found`, 'yellow');
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'all':
      const allTestFiles = findTestFiles();
      runTests(allTestFiles, { coverage: true, verbose: true });
      break;
      
    case 'components':
      const componentTests = findTestFiles('src/components/__tests__');
      runTests(componentTests, { verbose: true });
      break;
      
    case 'hooks':
      const hookTests = findTestFiles('src/hooks/__tests__');
      runTests(hookTests, { verbose: true });
      break;
      
    case 'watch':
      const watchTestFiles = findTestFiles();
      runTests(watchTestFiles, { watch: true });
      break;
      
    case 'coverage':
      const coverageTestFiles = findTestFiles();
      runTests(coverageTestFiles, { coverage: true });
      break;
      
    case 'list':
      runTestCategories();
      break;
      
    default:
      log('Usage:', 'bright');
      log('  node run-tests.js <command>', 'cyan');
      log('', 'reset');
      log('Commands:', 'bright');
      log('  all       - Run all tests with coverage', 'green');
      log('  components - Run component tests only', 'green');
      log('  hooks     - Run hook tests only', 'green');
      log('  watch     - Run tests in watch mode', 'green');
      log('  coverage  - Run tests with coverage report', 'green');
      log('  list      - List all test categories', 'green');
      break;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
} 