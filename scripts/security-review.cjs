#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if chalk is installed, install it if not
try {
  require('chalk');
} catch (e) {
  console.log('Installing chalk...');
  execSync('npm install chalk --no-save', { stdio: 'inherit' });
}

const chalk = require('chalk');
const red = chalk.red;
const green = chalk.green;
const yellow = chalk.yellow;
const blue = chalk.blue;
const bold = chalk.bold;

console.log(bold.blue('\n🔒 Running Security Review\n'));

// Check for common security issues
const checks = [
  {
    name: 'Environment Files',
    description: 'Check for .env files in version control',
    check: () => {
      try {
        const result = execSync('git ls-files | grep "\\.env" || true', { encoding: 'utf-8' });
        return result.trim() === '' 
          ? { status: 'pass', message: 'No .env files found in version control' }
          : { 
              status: 'fail', 
              message: 'Found .env files in version control',
              details: result.trim().split('\n').filter(Boolean)
            };
      } catch (error) {
        return { status: 'error', message: 'Error checking for .env files', error };
      }
    }
  },
  {
    name: 'Dependencies',
    description: 'Check for known vulnerabilities',
    check: async () => {
      try {
        console.log(yellow('Running npm audit...'));
        const result = execSync('npm audit --json', { encoding: 'utf-8' });
        const audit = JSON.parse(result);
        
        if (audit.vulnerabilities) {
          const { critical, high, moderate, low } = audit.vulnerabilities;
          const total = critical + high + moderate + low;
          
          if (total > 0) {
            return {
              status: 'fail',
              message: `Found ${total} vulnerabilities (${critical} critical, ${high} high, ${moderate} moderate, ${low} low)`,
              details: `Run 'npm audit' for details`
            };
          }
        }
        
        return { status: 'pass', message: 'No known vulnerabilities found' };
      } catch (error) {
        return { status: 'error', message: 'Error running npm audit', error };
      }
    }
  },
  {
    name: 'Outdated Dependencies',
    description: 'Check for outdated packages',
    check: () => {
      try {
        console.log(yellow('Checking for outdated dependencies...'));
        const result = execSync('npm outdated --json', { encoding: 'utf-8' });
        const outdated = JSON.parse(result || '{}');
        const count = Object.keys(outdated).length;
        
        if (count > 0) {
          return {
            status: 'warn',
            message: `Found ${count} outdated dependencies`,
            details: `Run 'npm outdated' for details`
          };
        }
        
        return { status: 'pass', message: 'All dependencies are up to date' };
      } catch (error) {
        // npm outdated exits with code 1 when there are outdated packages
        if (error.status === 1) {
          const result = error.stdout || '{}';
          const outdated = JSON.parse(result);
          const count = Object.keys(outdated).length;
          
          return {
            status: 'warn',
            message: `Found ${count} outdated dependencies`,
            details: `Run 'npm outdated' for details`
          };
        }
        
        return { status: 'error', message: 'Error checking for outdated dependencies', error };
      }
    }
  },
  {
    name: 'Hardcoded Secrets',
    description: 'Check for hardcoded API keys and secrets',
    check: () => {
      try {
        const patterns = [
          'password',
          'secret',
          'key',
          'token',
          'api[_-]?key',
          'auth[_-]?token',
          'access[_-]?token',
          'private[_-]?key',
          'client[_-]?secret',
          'api[_-]?secret',
          'encryption[_-]?key',
          'jwt[_-]?secret',
          'webhook[_-]?secret'
        ];
        
        // Build grep command with proper escaping for shell
        const includes = ['*.js', '*.ts', '*.jsx', '*.tsx', '*.json', '*.env']
          .map(ext => `--include="${ext}"`).join(' ');
        const excludes = ['node_modules', '.git', '.next', 'dist', 'build']
          .map(dir => `--exclude-dir=${dir}`).join(' ');
        const pattern = `(${patterns.join('|')})[=:][\"\\']?[\\w-]{10,}[\"\\']?`;
        
        const cmd = `grep -rE "${pattern}" ${includes} ${excludes} . 2>/dev/null || true`;
        
        const result = execSync(cmd, { 
          encoding: 'utf-8',
          shell: '/bin/bash'
        });
        const matches = result.trim().split('\n').filter(Boolean);
        
        if (matches.length > 0) {
          return {
            status: 'fail',
            message: `Found ${matches.length} potential hardcoded secrets`,
            details: matches.map(m => m.trim())
          };
        }
        
        return { status: 'pass', message: 'No hardcoded secrets found' };
      } catch (error) {
        return { status: 'error', message: 'Error checking for hardcoded secrets', error };
      }
    }
  }
];

// Run all checks
async function runChecks() {
  const results = [];
  
  for (const check of checks) {
    process.stdout.write(blue(`• ${check.name}... `));
    
    try {
      const result = await check.check();
      results.push({ ...check, ...result });
      
      if (result.status === 'pass') {
        console.log(green('✓'));
      } else if (result.status === 'warn') {
        console.log(yellow('⚠'));
      } else {
        console.log(red('✗'));
      }
    } catch (error) {
      console.log(red('✗'));
      results.push({ 
        ...check, 
        status: 'error', 
        message: 'Error running check',
        error: error.message 
      });
    }
  }
  
  // Print summary
  console.log('\n' + bold('Security Review Summary:') + '\n');
  
  let hasFailures = false;
  
  for (const result of results) {
    let status;
    
    switch (result.status) {
      case 'pass':
        status = green('✓ PASS');
        break;
      case 'warn':
        status = yellow('⚠ WARN');
        hasFailures = true;
        break;
      case 'fail':
        status = red('✗ FAIL');
        hasFailures = true;
        break;
      default:
        status = red('✗ ERROR');
        hasFailures = true;
    }
    
    console.log(`${status} ${result.name}: ${result.message}`);
    
    if (result.details) {
      if (Array.isArray(result.details)) {
        console.log('  ' + result.details.join('\n  '));
      } else {
        console.log('  ' + result.details);
      }
    }
    
    if (result.error) {
      console.log(red('  Error: ' + result.error));
    }
    
    console.log();
  }
  
  if (hasFailures) {
    console.log(red('\n❌ Security review completed with warnings or failures. Please address the issues above.\n'));
    process.exit(1);
  } else {
    console.log(green('\n✅ Security review completed successfully!\n'));
  }
}

// Make the script executable
if (process.platform !== 'win32') {
  fs.chmodSync(__filename, '755');
}

// Run the checks
runChecks().catch(error => {
  console.error(red('\nError running security review:'), error);
  process.exit(1);
});
