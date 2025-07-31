#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Common type replacements
const typeReplacements = [
  // Select onChange handlers
  { 
    pattern: /onValueChange=\{\(value: any\)/g, 
    replacement: 'onValueChange={(value: string)' 
  },
  // Error handlers
  {
    pattern: /} catch \(error: any\) \{/g,
    replacement: '} catch (error) {'
  },
  // Map functions
  {
    pattern: /\.map\(\(([\w]+): any(,|\))/g,
    replacement: '.map(($1$2'
  },
  // Common Recharts tooltip formatter
  {
    pattern: /formatter=\{\(value: any, name: any\)/g,
    replacement: 'formatter={(value: number | string, name: string)'
  },
  // Common event type  
  {
    pattern: /\(e: any\)/g,
    replacement: '(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.FormEvent)'
  }
];

// Find all TypeScript files
const files = glob.sync('src/**/*.{ts,tsx}', {
  ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
});

console.log(`Found ${files.length} TypeScript files to process`);

let totalReplacements = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let fileReplacements = 0;
  
  typeReplacements.forEach(({ pattern, replacement }) => {
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, replacement);
      fileReplacements += matches.length;
    }
  });
  
  if (fileReplacements > 0) {
    fs.writeFileSync(file, content);
    console.log(`✓ Fixed ${fileReplacements} type issues in ${file}`);
    totalReplacements += fileReplacements;
  }
});

console.log(`\nTotal replacements made: ${totalReplacements}`);