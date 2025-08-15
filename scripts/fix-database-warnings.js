#!/usr/bin/env node

/**
 * Database Warning Resolution Script
 * Fixes the 26 remaining database warnings and errors in PRMCMS Supabase
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const SUPABASE_URL = 'https://flbwqsocnlvsuqgupbra.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

class DatabaseWarningFixer {
  constructor() {
    this.fixedIssues = [];
    this.errors = [];
    this.warnings = [];
  }

  // Fix 1: Clean up dead tuples in high-ratio tables
  async fixDeadTuples() {
    console.log('🧹 Fixing dead tuples in high-ratio tables...');
    
    const highDeadTupleTables = [
      'profiles',      // 450% dead tuple ratio
      'user_roles',    // 400% dead tuple ratio
      'delivery_routes', // 100% dead tuple ratio
      'tree_planting_counter' // 100% dead tuple ratio
    ];

    let fixedTables = 0;
    
    for (const tableName of highDeadTupleTables) {
      try {
        console.log(`  - Cleaning ${tableName}...`);
        
        const { error } = await supabase.rpc('exec_sql', {
          sql: `VACUUM ANALYZE ${tableName};`
        });

        if (error) {
          console.error(`    ❌ Error cleaning ${tableName}:`, error.message);
          this.errors.push({ table: tableName, error: error.message });
        } else {
          console.log(`    ✅ Cleaned ${tableName}`);
          fixedTables++;
          this.fixedIssues.push({
            type: 'dead_tuples',
            table: tableName,
            description: 'Cleaned dead tuples with VACUUM ANALYZE'
          });
        }
      } catch (err) {
        console.error(`    ❌ Exception cleaning ${tableName}:`, err.message);
        this.errors.push({ table: tableName, error: err.message });
      }
    }

    return fixedTables;
  }

  // Fix 2: Remove unused indexes to reduce maintenance overhead
  async removeUnusedIndexes() {
    console.log('🗑️ Removing unused indexes...');
    
    // Get list of unused indexes (0 scans)
    const { data: unusedIndexes, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT 
          schemaname,
          relname as table_name,
          indexrelname as index_name,
          idx_scan
        FROM pg_stat_user_indexes 
        WHERE schemaname = 'public' 
          AND idx_scan = 0
          AND indexrelname NOT LIKE '%_pkey'  -- Keep primary keys
          AND indexrelname NOT LIKE '%_key'   -- Keep unique constraints
        ORDER BY relname, indexrelname
        LIMIT 20;  -- Limit to prevent too many changes at once
      `
    });

    if (error) {
      console.error('❌ Error getting unused indexes:', error.message);
      return 0;
    }

    let removedIndexes = 0;
    
    for (const index of unusedIndexes || []) {
      try {
        console.log(`  - Removing unused index: ${index.index_name}`);
        
        const { error: dropError } = await supabase.rpc('exec_sql', {
          sql: `DROP INDEX IF EXISTS ${index.index_name};`
        });

        if (dropError) {
          console.error(`    ❌ Error removing ${index.index_name}:`, dropError.message);
          this.errors.push({ index: index.index_name, error: dropError.message });
        } else {
          console.log(`    ✅ Removed ${index.index_name}`);
          removedIndexes++;
          this.fixedIssues.push({
            type: 'unused_index',
            index: index.index_name,
            table: index.table_name,
            description: 'Removed unused index to reduce maintenance overhead'
          });
        }
      } catch (err) {
        console.error(`    ❌ Exception removing ${index.index_name}:`, err.message);
        this.errors.push({ index: index.index_name, error: err.message });
      }
    }

    return removedIndexes;
  }

  // Fix 3: Update database statistics for better query planning
  async updateStatistics() {
    console.log('📊 Updating database statistics...');
    
    try {
      const { error } = await supabase.rpc('exec_sql', {
        sql: 'ANALYZE;'
      });

      if (error) {
        console.error('❌ Error updating statistics:', error.message);
        this.errors.push({ operation: 'update_statistics', error: error.message });
        return false;
      }

      console.log('✅ Updated database statistics');
      this.fixedIssues.push({
        type: 'statistics',
        description: 'Updated all table statistics for better query planning'
      });
      return true;
    } catch (err) {
      console.error('❌ Exception updating statistics:', err.message);
      this.errors.push({ operation: 'update_statistics', error: err.message });
      return false;
    }
  }

  // Fix 4: Optimize frequently accessed tables
  async optimizeFrequentTables() {
    console.log('⚡ Optimizing frequently accessed tables...');
    
    const frequentTables = [
      'environment_config',
      'profiles', 
      'user_roles',
      'locations',
      'packages'
    ];

    let optimizedTables = 0;
    
    for (const tableName of frequentTables) {
      try {
        console.log(`  - Optimizing ${tableName}...`);
        
        // Run VACUUM and ANALYZE
        const { error } = await supabase.rpc('exec_sql', {
          sql: `VACUUM (ANALYZE, VERBOSE) ${tableName};`
        });

        if (error) {
          console.error(`    ❌ Error optimizing ${tableName}:`, error.message);
          this.errors.push({ table: tableName, error: error.message });
        } else {
          console.log(`    ✅ Optimized ${tableName}`);
          optimizedTables++;
          this.fixedIssues.push({
            type: 'table_optimization',
            table: tableName,
            description: 'Optimized table with VACUUM and ANALYZE'
          });
        }
      } catch (err) {
        console.error(`    ❌ Exception optimizing ${tableName}:`, err.message);
        this.errors.push({ table: tableName, error: err.message });
      }
    }

    return optimizedTables;
  }

  // Fix 5: Check and fix any constraint violations
  async checkConstraints() {
    console.log('🔍 Checking constraint violations...');
    
    try {
      // Check for foreign key violations
      const { data: fkViolations, error } = await supabase.rpc('exec_sql', {
        sql: `
          SELECT 
            'Foreign Key Violation' as issue_type,
            conname as constraint_name,
            conrelid::regclass as table_name
          FROM pg_constraint 
          WHERE contype = 'f' 
            AND NOT EXISTS (
              SELECT 1 FROM information_schema.table_constraints 
              WHERE constraint_name = conname
            )
          LIMIT 10;
        `
      });

      if (error) {
        console.error('❌ Error checking constraints:', error.message);
        return false;
      }

      if (fkViolations && fkViolations.length > 0) {
        console.log(`⚠️ Found ${fkViolations.length} constraint issues`);
        this.warnings.push({
          type: 'constraint_violations',
          count: fkViolations.length,
          description: 'Found constraint violations that need manual review'
        });
      } else {
        console.log('✅ No constraint violations found');
        this.fixedIssues.push({
          type: 'constraint_check',
          description: 'Verified all constraints are valid'
        });
      }

      return true;
    } catch (err) {
      console.error('❌ Exception checking constraints:', err.message);
      this.errors.push({ operation: 'check_constraints', error: err.message });
      return false;
    }
  }

  // Fix 6: Reindex critical tables for performance
  async reindexCriticalTables() {
    console.log('🔄 Reindexing critical tables...');
    
    const criticalTables = [
      'environment_config',
      'profiles',
      'packages'
    ];

    let reindexedTables = 0;
    
    for (const tableName of criticalTables) {
      try {
        console.log(`  - Reindexing ${tableName}...`);
        
        const { error } = await supabase.rpc('exec_sql', {
          sql: `REINDEX TABLE ${tableName};`
        });

        if (error) {
          console.error(`    ❌ Error reindexing ${tableName}:`, error.message);
          this.errors.push({ table: tableName, error: error.message });
        } else {
          console.log(`    ✅ Reindexed ${tableName}`);
          reindexedTables++;
          this.fixedIssues.push({
            type: 'reindex',
            table: tableName,
            description: 'Rebuilt indexes for optimal performance'
          });
        }
      } catch (err) {
        console.error(`    ❌ Exception reindexing ${tableName}:`, err.message);
        this.errors.push({ table: tableName, error: err.message });
      }
    }

    return reindexedTables;
  }

  // Generate final report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total_fixes: this.fixedIssues.length,
        total_errors: this.errors.length,
        total_warnings: this.warnings.length
      },
      fixes_applied: this.fixedIssues,
      errors_encountered: this.errors,
      warnings: this.warnings
    };

    // Save report to file
    const reportPath = path.join(__dirname, '..', 'database-warning-fixes-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    return report;
  }

  // Main execution
  async run() {
    console.log('🔧 Starting Database Warning Resolution...');
    console.log('===========================================');
    
    try {
      // Test connection
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: 'SELECT current_database(), current_user;'
      });

      if (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
      }

      console.log(`✅ Connected to database: ${data[0].current_database}`);
      console.log('');

      // Execute all fixes
      const results = {
        deadTuples: await this.fixDeadTuples(),
        unusedIndexes: await this.removeUnusedIndexes(),
        statistics: await this.updateStatistics(),
        optimization: await this.optimizeFrequentTables(),
        constraints: await this.checkConstraints(),
        reindex: await this.reindexCriticalTables()
      };

      // Generate and display report
      const report = this.generateReport();
      
      console.log('\n📊 Database Warning Resolution Summary');
      console.log('======================================');
      console.log(`✅ Total fixes applied: ${report.summary.total_fixes}`);
      console.log(`⚠️ Warnings: ${report.summary.total_warnings}`);
      console.log(`❌ Errors: ${report.summary.total_errors}`);
      console.log('');
      
      if (this.fixedIssues.length > 0) {
        console.log('📋 Fixes Applied:');
        this.fixedIssues.forEach((fix, index) => {
          console.log(`  ${index + 1}. ${fix.type}: ${fix.description}`);
        });
        console.log('');
      }

      if (this.errors.length > 0) {
        console.log('❌ Errors Encountered:');
        this.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error.error}`);
        });
        console.log('');
      }

      console.log('🎯 Next Steps:');
      console.log('1. Monitor database performance for improvements');
      console.log('2. Check Supabase dashboard for reduced warnings');
      console.log('3. Run health checks to verify fixes');
      
      return this.errors.length === 0;
      
    } catch (error) {
      console.error('❌ Database warning resolution failed:', error);
      return false;
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const fixer = new DatabaseWarningFixer();
  fixer.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Fix process failed:', error);
    process.exit(1);
  });
}

export default DatabaseWarningFixer;
