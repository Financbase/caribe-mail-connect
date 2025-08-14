#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Performance budgets from our configuration
const budgets = {
  "index.js": 500, // KB
  "vendor.js": 300, // KB  
  "index.css": 100, // KB
  "total": 1000 // KB total
};

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(2);
}

function getDistSize() {
  const distDir = path.join(__dirname, '../dist/assets');
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ Build artifacts not found. Run "npm run build" first.');
    return;
  }

  const files = fs.readdirSync(distDir);
  let totalSize = 0;
  const filesSizes = [];

  files.forEach(file => {
    const filePath = path.join(distDir, file);
    const stats = fs.statSync(filePath);
    const sizeKB = stats.size / 1024;
    totalSize += sizeKB;
    
    filesSizes.push({ 
      name: file, 
      size: sizeKB,
      type: getFileType(file)
    });
  });

  return { files: filesSizes, total: totalSize };
}

function getFileType(filename) {
  if (filename.includes('index') && filename.endsWith('.js')) return 'index.js';
  if (filename.includes('vendor') && filename.endsWith('.js')) return 'vendor.js';
  if (filename.includes('index') && filename.endsWith('.css')) return 'index.css';
  if (filename.endsWith('.js')) return 'other.js';
  if (filename.endsWith('.css')) return 'other.css';
  return 'other';
}

function checkBudgets() {
  console.log('📦 Bundle Size Analysis\n');
  
  const result = getDistSize();
  if (!result) return;

  const { files, total } = result;
  
  // Group by type and find largest files of each type
  const typeGroups = {};
  files.forEach(file => {
    if (!typeGroups[file.type]) typeGroups[file.type] = [];
    typeGroups[file.type].push(file);
  });

  let hasViolations = false;

  // Check main bundles
  Object.keys(budgets).forEach(budgetKey => {
    if (budgetKey === 'total') return;
    
    const relevantFiles = typeGroups[budgetKey] || [];
    const largestFile = relevantFiles.sort((a, b) => b.size - a.size)[0];
    
    if (largestFile) {
      const budget = budgets[budgetKey];
      const isOver = largestFile.size > budget;
      const status = isOver ? '❌' : '✅';
      const percentage = ((largestFile.size / budget) * 100).toFixed(1);
      
      console.log(`${status} ${budgetKey}: ${formatBytes(largestFile.size * 1024)}KB / ${budget}KB (${percentage}%)`);
      console.log(`   File: ${largestFile.name}`);
      
      if (isOver) hasViolations = true;
    }
  });

  // Check total size
  const totalBudget = budgets.total;
  const isTotalOver = total > totalBudget;
  const totalStatus = isTotalOver ? '❌' : '✅';
  const totalPercentage = ((total / totalBudget) * 100).toFixed(1);
  
  console.log(`\n${totalStatus} Total Bundle: ${formatBytes(total * 1024)}KB / ${totalBudget}KB (${totalPercentage}%)`);
  
  if (isTotalOver) hasViolations = true;

  // Show largest files
  console.log('\n📊 Largest Files:');
  files
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
    .forEach(file => {
      console.log(`   ${formatBytes(file.size * 1024)}KB - ${file.name}`);
    });

  // Recommendations
  if (hasViolations) {
    console.log('\n💡 Optimization Suggestions:');
    console.log('   • Use dynamic imports for non-critical components');
    console.log('   • Tree-shake unused dependencies');
    console.log('   • Consider using lighter alternative libraries');
    console.log('   • Split large chunks into smaller pieces');
  }

  console.log('\n🔍 For detailed analysis, run: npm run analyze');
  
  return !hasViolations;
}

// Run the check
const passed = checkBudgets();
process.exit(passed ? 0 : 1);
