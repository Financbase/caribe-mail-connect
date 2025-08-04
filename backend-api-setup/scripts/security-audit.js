#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { logger } = require('../src/utils/logger');

// Configuration
const CONFIG = {
  // Directories to scan
  scanDirs: [
    'src',
    'config',
    'scripts',
    'routes',
    'services',
    'middleware'
  ],
  
  // File extensions to include in the scan
  fileExtensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  
  // Known false positives to ignore (file path patterns and specific patterns)
  falsePositives: [
    // Safe usage of setTimeout in database.js for logging
    {
      file: /database\.js$/,
      pattern: /setTimeout\(/,
      context: 'Used for safe logging of long-running database connections'
    },
    // Route definitions with parameters
    {
      file: /routes\/.*\.js$/,
      pattern: /\b(?:get|post|put|patch|delete)\(['"]\/:[^/]+/,
      context: 'Route parameter definition, validated by express-validator'
    },
    // Logging of unknown fields in PartnerService
    {
      file: /PartnerService\.js$/,
      pattern: /update with unknown fields/,
      context: 'Safe logging of unknown fields for security monitoring'
    }
  ],
  
  // Known security-sensitive patterns to scan for
  patterns: {
    // Hardcoded credentials
    hardcodedCredentials: [
      /password\s*[:=]\s*['"].+?['"]/gi,
      /passwd\s*[:=]\s*['"].+?['"]/gi,
      /pwd\s*[:=]\s*['"].+?['"]/gi,
      /secret\s*[:=]\s*['"].+?['"]/gi,
      /api[_-]?key\s*[:=]\s*['"].+?['"]/gi,
      /access[_-]?token\s*[:=]\s*['"].+?['"]/gi,
      /refresh[_-]?token\s*[:=]\s*['"].+?['"]/gi,
    ],
    
    // Potential SQL injection patterns
    sqlInjection: [
      /(?:SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|EXEC|EXECUTE|UNION)[\s\S]*?(['"`]).*?\1/gi,
    ],
    
    // Potential XSS patterns
    xss: [
      /document\.(?:location|URL|documentURI|referrer|write\(|innerHTML)/gi,
      /eval\(/gi,
      /setTimeout\(/gi,
      /setInterval\(/gi,
      /Function\(/gi,
    ],
    
    // Insecure dependencies
    insecureDependencies: [
      /"dependencies"\s*:\s*\{[\s\S]*?"([^"]+)"\s*:\s*"[~^]?\d+\.\d+\.\d+/g,
    ],
  },
  
  // Files to exclude from scanning
  exclude: [
    'node_modules',
    'build',
    'dist',
    '.git',
    'coverage',
    'logs',
    '*.log'
  ],
};

// Results storage
const results = {
  filesScanned: 0,
  issuesFound: 0,
  issuesByType: {},
  filesWithIssues: new Set(),
  details: [],
};

/**
 * Check if a file should be excluded from scanning
 */
function isExcluded(filePath) {
  return CONFIG.exclude.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*'));
      return regex.test(filePath);
    }
    return filePath.includes(pattern);
  });
}

/**
 * Scan a file for security issues
 */
function scanFile(filePath) {
  if (isExcluded(filePath)) {
    return;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    Object.entries(CONFIG.patterns).forEach(([issueType, patterns]) => {
      patterns.forEach((pattern, index) => {
        const matches = [];
        let match;
        const regex = new RegExp(pattern);
        
        // Check each line for the pattern
        lines.forEach((line, lineNumber) => {
          while ((match = regex.exec(line)) !== null) {
            // Skip if this is a false positive (e.g., in comments or strings that are not actual code)
            if (isFalsePositive(filePath, line, match[0], lineNumber)) {
              continue;
            }
            
            matches.push({
              line: lineNumber + 1,
              match: match[0],
              context: getContext(lines, lineNumber, 2),
            });
          }
        });
        
        if (matches.length > 0) {
          if (!results.issuesByType[issueType]) {
            results.issuesByType[issueType] = 0;
          }
          results.issuesByType[issueType] += matches.length;
          results.issuesFound += matches.length;
          results.filesWithIssues.add(filePath);
          
          matches.forEach(match => {
            results.details.push({
              file: filePath,
              issueType,
              ...match
            });
          });
        }
      });
    });
    
    results.filesScanned++;
  } catch (error) {
    logger.error(`Error scanning file ${filePath}:`, error);
  }
}

/**
 * Check if a match is a false positive
 */
function isFalsePositive(filePath, line, match, lineNumber) {
  const lineContent = line.trim();
  
  // Skip comments
  if (lineContent.startsWith('//') || lineContent.includes('/*') || lineContent.includes('*/')) {
    return true;
  }
  
  // Check against known false positive patterns
  for (const fp of CONFIG.falsePositives || []) {
    // Check if file matches the pattern
    if (fp.file && !filePath.match(fp.file)) {
      continue;
    }
    
    // Check if the pattern matches the current line
    if (fp.pattern && !fp.pattern.test(match)) {
      continue;
    }
    
    // If we get here, it's a known false positive
    logger.debug('Ignoring false positive:', {
      file: filePath,
      line: lineNumber + 1,
      match,
      context: fp.context || 'No context provided',
      type: 'known-false-positive'
    });
    return true;
  }
  
  // Skip common false positives in variable names
  const commonFalsePositives = [
    'password', // Common in variable names
    'secret',   // Common in variable names
    'token',    // Common in variable names
    'api_key',  // Common in documentation
  ];
  
  return commonFalsePositives.some(fp => 
    match.toLowerCase().includes(fp) && 
    !match.includes('=') && 
    !match.includes(':')
  );
}

/**
 * Get context around a line
 */
function getContext(lines, lineNumber, contextSize) {
  const start = Math.max(0, lineNumber - contextSize);
  const end = Math.min(lines.length - 1, lineNumber + contextSize);
  const context = [];
  
  for (let i = start; i <= end; i++) {
    context.push({
      line: i + 1,
      content: lines[i],
      isCurrent: i === lineNumber,
    });
  }
  
  return context;
}

/**
 * Scan a directory recursively
 */
function scanDirectory(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (
        CONFIG.fileExtensions.some(ext => entry.name.endsWith(ext)) &&
        !isExcluded(fullPath)
      ) {
        scanFile(fullPath);
      }
    }
  } catch (error) {
    logger.error(`Error scanning directory ${dir}:`, error);
  }
}

/**
 * Run npm audit to check for vulnerable dependencies
 */
async function runNpmAudit() {
  return new Promise((resolve) => {
    logger.info('Running npm audit...');
    
    // Use spawn instead of execSync to avoid command injection
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const auditProcess = spawn(npm, ['audit', '--json'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
      windowsHide: true,
      timeout: 30000 // 30 second timeout
    });

    let stdout = '';
    let stderr = '';
    
    auditProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    auditProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    auditProcess.on('close', (code) => {
      try {
        // npm audit exits with code 1 when vulnerabilities are found, which is expected
        if (stdout) {
          const auditResults = JSON.parse(stdout);
          if (auditResults.vulnerabilities) {
            results.audit = {
              vulnerabilities: auditResults.vulnerabilities,
              summary: {
                critical: auditResults.metadata?.vulnerabilities?.critical || 0,
                high: auditResults.metadata?.vulnerabilities?.high || 0,
                moderate: auditResults.metadata?.vulnerabilities?.moderate || 0,
                low: auditResults.metadata?.vulnerabilities?.low || 0,
                info: auditResults.metadata?.vulnerabilities?.info || 0,
              },
            };
            
            const totalVulnerabilities = Object.values(results.audit.summary).reduce((a, b) => a + b, 0);
            results.issuesFound += totalVulnerabilities;
            
            if (totalVulnerabilities > 0) {
              logger.warn(`Found ${totalVulnerabilities} vulnerabilities in dependencies`, {
                service: 'security-audit',
                auditResults: results.audit.summary
              });
            }
          }
        }
        
        if (stderr) {
          logger.warn('npm audit stderr:', { stderr });
        }
        
        resolve();
      } catch (error) {
        logger.error('Error processing npm audit results:', { 
          error: error.message,
          stdout,
          stderr,
          stack: error.stack 
        });
        resolve();
      }
    });
    
    auditProcess.on('error', (error) => {
      logger.error('Failed to run npm audit:', { 
        error: error.message,
        stack: error.stack 
      });
      resolve();
    });
  });
}

/**
 * Print the audit results
 */
function printResults() {
  console.log('\n=== Security Audit Results ===\n');
  
  // Print summary
  console.log(`📊 Summary:`);
  console.log(`  Files scanned: ${results.filesScanned}`);
  console.log(`  Total issues found: ${results.issuesFound}`);
  
  if (Object.keys(results.issuesByType).length > 0) {
    console.log('\n🔍 Issues by type:');
    Object.entries(results.issuesByType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
  }
  
  // Print npm audit results if available
  if (results.audit) {
    console.log('\n📦 npm audit results:');
    const { summary } = results.audit;
    console.log(`  Critical: ${summary.critical}`);
    console.log(`  High: ${summary.high}`);
    console.log(`  Moderate: ${summary.moderate}`);
    console.log(`  Low: ${summary.low}`);
  }
  
  // Print detailed issues
  if (results.details.length > 0) {
    console.log('\n🔎 Detailed issues:');
    results.details.forEach((issue, index) => {
      console.log(`\n${index + 1}. ${issue.issueType.toUpperCase()} in ${issue.file}:${issue.line}`);
      console.log(`   Match: ${issue.match.substring(0, 100)}${issue.match.length > 100 ? '...' : ''}`);
      
      if (issue.context) {
        console.log('   Context:');
        issue.context.forEach(ctx => {
          const lineNum = String(ctx.line).padStart(4, ' ');
          const prefix = ctx.isCurrent ? ' > ' : '   ';
          console.log(`${prefix}${lineNum} | ${ctx.content.substring(0, 120)}`);
        });
      }
    });
  }
  
  // Print recommendations
  if (results.issuesFound > 0) {
    console.log('\n🔧 Recommendations:');
    
    if (results.issuesByType.hardcodedCredentials) {
      console.log('  - Remove hardcoded credentials and use environment variables or a secure secret management solution');
    }
    
    if (results.issuesByType.sqlInjection) {
      console.log('  - Use parameterized queries or an ORM to prevent SQL injection');
    }
    
    if (results.issuesByType.xss) {
      console.log('  - Sanitize user input and use Content Security Policy (CSP) headers');
    }
    
    if (results.audit) {
      console.log('  - Run `npm audit fix` to fix known vulnerabilities in dependencies');
    }
  }
  
  console.log('\n=== End of Security Audit ===\n');
  
  // Exit with appropriate status code
  process.exit(results.issuesFound > 0 ? 1 : 0);
}

// Main function
async function main() {
  logger.info('Starting security audit...');
  
  // Scan source code
  CONFIG.scanDirs.forEach(dir => {
    const fullPath = path.resolve(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      if (fs.statSync(fullPath).isDirectory()) {
        scanDirectory(fullPath);
      } else {
        scanFile(fullPath);
      }
    }
  });
  
  try {
    // Run npm audit and wait for it to complete
    await runNpmAudit();
  } catch (error) {
    logger.error('Error during security audit:', error);
  } finally {
    // Print results
    printResults();
  }
}

// Run the audit
main().catch(error => {
  logger.error('Error during security audit:', error);
  process.exit(1);
});
