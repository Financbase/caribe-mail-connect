#!/usr/bin/env node

/**
 * TypeScript Error Fix Script
 * Systematically fixes TypeScript errors and warnings in the PRMCMS codebase
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

class TypeScriptFixer {
  constructor() {
    this.fixedFiles = [];
    this.errors = [];
    this.warnings = [];
  }

  // Fix 1: Replace 'any' types with proper types
  fixAnyTypes(filePath, content) {
    let fixed = content;
    let changes = 0;

    // Common any type replacements
    const anyReplacements = [
      // Event handlers
      { pattern: /: any\) => \{/g, replacement: ': unknown) => {' },
      { pattern: /: any\) =>/g, replacement: ': unknown) =>' },
      { pattern: /\(.*?: any\)/g, replacement: (match) => match.replace('any', 'unknown') },
      
      // Function parameters
      { pattern: /\bdata: any\b/g, replacement: 'data: Record<string, unknown>' },
      { pattern: /\berror: any\b/g, replacement: 'error: Error | unknown' },
      { pattern: /\bresponse: any\b/g, replacement: 'response: unknown' },
      { pattern: /\bresult: any\b/g, replacement: 'result: unknown' },
      { pattern: /\bvalue: any\b/g, replacement: 'value: unknown' },
      { pattern: /\bitem: any\b/g, replacement: 'item: unknown' },
      { pattern: /\bevent: any\b/g, replacement: 'event: Event' },
      { pattern: /\bparams: any\b/g, replacement: 'params: Record<string, unknown>' },
      { pattern: /\boptions: any\b/g, replacement: 'options: Record<string, unknown>' },
      { pattern: /\bconfig: any\b/g, replacement: 'config: Record<string, unknown>' },
      { pattern: /\bpayload: any\b/g, replacement: 'payload: Record<string, unknown>' },
      
      // Array types
      { pattern: /: any\[\]/g, replacement: ': unknown[]' },
      
      // Object types
      { pattern: /: any;/g, replacement: ': unknown;' },
      { pattern: /: any,/g, replacement: ': unknown,' },
      { pattern: /: any\)/g, replacement: ': unknown)' },
      { pattern: /: any$/gm, replacement: ': unknown' },
      
      // React specific
      { pattern: /React\.FC<any>/g, replacement: 'React.FC<Record<string, unknown>>' },
      { pattern: /ComponentProps<any>/g, replacement: 'ComponentProps<"div">' },
    ];

    anyReplacements.forEach(({ pattern, replacement }) => {
      const before = fixed;
      if (typeof replacement === 'function') {
        fixed = fixed.replace(pattern, replacement);
      } else {
        fixed = fixed.replace(pattern, replacement);
      }
      if (before !== fixed) changes++;
    });

    return { content: fixed, changes };
  }

  // Fix 2: Add missing useEffect dependencies
  fixUseEffectDependencies(filePath, content) {
    let fixed = content;
    let changes = 0;

    // Common patterns for useEffect dependency fixes
    const useEffectFixes = [
      // Add missing function dependencies
      {
        pattern: /useEffect\(\(\) => \{\s*(\w+)\(\);?\s*\}, \[\]\);/g,
        replacement: (match, funcName) => {
          return match.replace('[]', `[${funcName}]`);
        }
      },
      // Add missing multiple dependencies
      {
        pattern: /useEffect\(\(\) => \{\s*(\w+)\(\);\s*(\w+)\(\);\s*\}, \[\]\);/g,
        replacement: (match, func1, func2) => {
          return match.replace('[]', `[${func1}, ${func2}]`);
        }
      }
    ];

    useEffectFixes.forEach(({ pattern, replacement }) => {
      const before = fixed;
      fixed = fixed.replace(pattern, replacement);
      if (before !== fixed) changes++;
    });

    return { content: fixed, changes };
  }

  // Fix 3: Fix empty object type interfaces
  fixEmptyInterfaces(filePath, content) {
    let fixed = content;
    let changes = 0;

    // Replace empty interfaces with proper types
    const emptyInterfaceFixes = [
      {
        pattern: /interface (\w+) extends React\.(\w+)<(\w+)> \{\}/g,
        replacement: 'type $1 = React.$2<$3>'
      },
      {
        pattern: /interface (\w+) extends (\w+) \{\}/g,
        replacement: 'type $1 = $2'
      }
    ];

    emptyInterfaceFixes.forEach(({ pattern, replacement }) => {
      const before = fixed;
      fixed = fixed.replace(pattern, replacement);
      if (before !== fixed) changes++;
    });

    return { content: fixed, changes };
  }

  // Fix 4: Fix lexical declarations in case blocks
  fixCaseDeclarations(filePath, content) {
    let fixed = content;
    let changes = 0;

    // Wrap case block contents in braces
    const casePattern = /case\s+['"`]([^'"`]+)['"`]:\s*((?:const|let|var)\s+\w+[^;]*;)/g;
    
    fixed = fixed.replace(casePattern, (match, caseValue, declaration) => {
      changes++;
      return `case '${caseValue}': {\n        ${declaration}\n        break;\n      }`;
    });

    return { content: fixed, changes };
  }

  // Fix 5: Fix prefer-const issues
  fixPreferConst(filePath, content) {
    let fixed = content;
    let changes = 0;

    // Simple let to const replacements for variables that are never reassigned
    const letPattern = /let\s+(\w+)\s*=\s*([^;]+);/g;
    
    // This is a simplified fix - in practice, you'd need more sophisticated analysis
    // For now, we'll just fix obvious cases
    const obviousConstCases = [
      /let\s+(\w+)\s*=\s*require\(/g,
      /let\s+(\w+)\s*=\s*import\(/g,
      /let\s+(\w+)\s*=\s*\{[^}]*\};/g,
      /let\s+(\w+)\s*=\s*\[[^\]]*\];/g,
    ];

    obviousConstCases.forEach(pattern => {
      const before = fixed;
      fixed = fixed.replace(pattern, (match) => match.replace('let', 'const'));
      if (before !== fixed) changes++;
    });

    return { content: fixed, changes };
  }

  // Fix 6: Fix require() imports
  fixRequireImports(filePath, content) {
    let fixed = content;
    let changes = 0;

    // Convert require() to import statements where possible
    const requirePattern = /const\s+(\w+)\s*=\s*require\(['"`]([^'"`]+)['"`]\);?/g;
    
    fixed = fixed.replace(requirePattern, (match, varName, moduleName) => {
      changes++;
      return `import ${varName} from '${moduleName}';`;
    });

    return { content: fixed, changes };
  }

  // Process a single file
  async processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let fixed = content;
      let totalChanges = 0;

      // Apply all fixes
      const fixes = [
        this.fixAnyTypes,
        this.fixUseEffectDependencies,
        this.fixEmptyInterfaces,
        this.fixCaseDeclarations,
        this.fixPreferConst,
        this.fixRequireImports
      ];

      for (const fix of fixes) {
        const result = fix.call(this, filePath, fixed);
        fixed = result.content;
        totalChanges += result.changes;
      }

      // Write back if changes were made
      if (totalChanges > 0) {
        fs.writeFileSync(filePath, fixed, 'utf8');
        this.fixedFiles.push({
          path: filePath,
          changes: totalChanges
        });
        console.log(`✅ Fixed ${totalChanges} issues in ${path.relative(projectRoot, filePath)}`);
      }

      return totalChanges;
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
      this.errors.push({ file: filePath, error: error.message });
      return 0;
    }
  }

  // Get all TypeScript files
  getTypeScriptFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and other irrelevant directories
        if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(item)) {
          this.getTypeScriptFiles(fullPath, files);
        }
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  // Main execution
  async run() {
    console.log('🔧 Starting TypeScript Error Fix Process...');
    console.log('==========================================');
    
    const files = this.getTypeScriptFiles(projectRoot);
    console.log(`📁 Found ${files.length} TypeScript files to process`);
    
    let totalChanges = 0;
    let processedFiles = 0;
    
    for (const file of files) {
      const changes = await this.processFile(file);
      totalChanges += changes;
      processedFiles++;
      
      if (processedFiles % 10 === 0) {
        console.log(`📊 Progress: ${processedFiles}/${files.length} files processed`);
      }
    }
    
    // Summary
    console.log('\n📊 Fix Summary');
    console.log('===============');
    console.log(`📁 Files processed: ${processedFiles}`);
    console.log(`✅ Files fixed: ${this.fixedFiles.length}`);
    console.log(`🔧 Total changes: ${totalChanges}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    
    if (this.fixedFiles.length > 0) {
      console.log('\n📋 Fixed Files:');
      this.fixedFiles.forEach(({ path, changes }) => {
        console.log(`  - ${path.replace(projectRoot, '.')}: ${changes} changes`);
      });
    }
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(({ file, error }) => {
        console.log(`  - ${file}: ${error}`);
      });
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Run `npm run lint` to check remaining issues');
    console.log('2. Review and test the changes');
    console.log('3. Commit the fixes');
    
    return totalChanges > 0;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const fixer = new TypeScriptFixer();
  fixer.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Fix process failed:', error);
    process.exit(1);
  });
}

export default TypeScriptFixer;
