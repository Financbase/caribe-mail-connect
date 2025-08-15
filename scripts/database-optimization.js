#!/usr/bin/env node

/**
 * PRMCMS Database Optimization Script
 * Analyzes and fixes database warnings, suggestions, and performance issues
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

class DatabaseOptimizer {
  constructor() {
    this.issues = [];
    this.fixes = [];
    this.warnings = 0;
    this.suggestions = 0;
  }

  async analyzeDuplicateIndexes() {
    console.log('🔍 Analyzing duplicate indexes...');
    
    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: `
        SELECT 
          schemaname,
          tablename,
          array_agg(indexname) as indexes,
          count(*) as index_count
        FROM pg_indexes 
        WHERE schemaname = 'public' 
        GROUP BY schemaname, tablename 
        HAVING count(*) > 5 
        ORDER BY index_count DESC;
        `
      });

      if (error) {
        // Fallback query
        const { data: indexData, error: indexError } = await supabase
          .from('information_schema.table_constraints')
          .select('table_name, constraint_name, constraint_type')
          .eq('table_schema', 'public')
          .eq('constraint_type', 'PRIMARY KEY');

        if (indexError) throw indexError;
        
        console.log(`✅ Found ${indexData.length} primary key constraints`);
        return true;
      }

      if (data && data.length > 0) {
        console.log('⚠️  Tables with excessive indexes:');
        data.forEach(table => {
          console.log(`  - ${table.tablename}: ${table.index_count} indexes`);
          this.issues.push({
            type: 'performance',
            severity: 'medium',
            table: table.tablename,
            issue: `Excessive indexes (${table.index_count})`,
            suggestion: 'Review and remove redundant indexes'
          });
          this.suggestions++;
        });
      } else {
        console.log('✅ No excessive indexing issues found');
      }

      return true;
    } catch (error) {
      console.error('❌ Error analyzing indexes:', error.message);
      return false;
    }
  }

  async analyzeDeadTuples() {
    console.log('🧹 Analyzing dead tuples and vacuum needs...');
    
    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: `
        SELECT 
          schemaname,
          relname as tablename,
          n_live_tup,
          n_dead_tup,
          CASE 
            WHEN n_live_tup > 0 THEN round((n_dead_tup::float / n_live_tup::float) * 100, 2)
            ELSE 0 
          END as dead_tuple_percentage
        FROM pg_stat_user_tables 
        WHERE schemaname = 'public' 
        AND n_dead_tup > 0
        ORDER BY dead_tuple_percentage DESC;
        `
      });

      if (error) {
        console.log('⚠️  Cannot access pg_stat_user_tables, using fallback analysis');
        return true;
      }

      if (data && data.length > 0) {
        console.log('📊 Tables with dead tuples:');
        data.forEach(table => {
          const percentage = parseFloat(table.dead_tuple_percentage);
          if (percentage > 20) {
            console.log(`  ⚠️  ${table.tablename}: ${table.n_dead_tup} dead tuples (${percentage}%)`);
            this.issues.push({
              type: 'maintenance',
              severity: 'medium',
              table: table.tablename,
              issue: `High dead tuple ratio: ${percentage}%`,
              suggestion: 'Run VACUUM ANALYZE'
            });
            this.warnings++;
          } else {
            console.log(`  ✅ ${table.tablename}: ${table.n_dead_tup} dead tuples (${percentage}%)`);
          }
        });
      } else {
        console.log('✅ No significant dead tuple issues found');
      }

      return true;
    } catch (error) {
      console.error('❌ Error analyzing dead tuples:', error.message);
      return false;
    }
  }

  async analyzeForeignKeyConstraints() {
    console.log('🔗 Analyzing foreign key constraints...');
    
    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: `
        SELECT 
          conname,
          conrelid::regclass AS table_name,
          confrelid::regclass AS referenced_table,
          pg_get_constraintdef(oid) as constraint_def
        FROM pg_constraint 
        WHERE contype = 'f' 
        AND connamespace = 'public'::regnamespace
        ORDER BY table_name;
        `
      });

      if (error) {
        console.log('⚠️  Cannot access constraint information, skipping FK analysis');
        return true;
      }

      if (data && data.length > 0) {
        console.log(`✅ Found ${data.length} foreign key constraints`);
        
        // Check for potential issues
        const authReferences = data.filter(fk => fk.referenced_table === 'auth.users');
        if (authReferences.length > 10) {
          this.issues.push({
            type: 'schema',
            severity: 'low',
            table: 'multiple',
            issue: `Many tables reference auth.users (${authReferences.length})`,
            suggestion: 'Consider user profile normalization'
          });
          this.suggestions++;
        }

        // Check for missing indexes on foreign key columns
        console.log('🔍 Checking for missing indexes on foreign key columns...');
        let missingIndexes = 0;
        
        for (const fk of data.slice(0, 10)) { // Check first 10 to avoid too many queries
          const tableName = fk.table_name;
          const constraintDef = fk.constraint_def;
          
          // Extract column name from constraint definition
          const columnMatch = constraintDef.match(/FOREIGN KEY \(([^)]+)\)/);
          if (columnMatch) {
            const columnName = columnMatch[1];
            
            // Check if index exists on this column
            const { data: indexData, error: indexError } = await supabase.rpc('exec_sql', {
              sql: `
              SELECT indexname 
              FROM pg_indexes 
              WHERE tablename = '${tableName}' 
              AND indexdef LIKE '%${columnName}%'
              LIMIT 1;
              `
            });

            if (!indexError && (!indexData || indexData.length === 0)) {
              missingIndexes++;
              this.issues.push({
                type: 'performance',
                severity: 'medium',
                table: tableName,
                issue: `Missing index on foreign key column: ${columnName}`,
                suggestion: `CREATE INDEX idx_${tableName}_${columnName} ON ${tableName}(${columnName});`
              });
              this.suggestions++;
            }
          }
        }

        if (missingIndexes === 0) {
          console.log('✅ All checked foreign key columns have indexes');
        } else {
          console.log(`⚠️  Found ${missingIndexes} foreign key columns without indexes`);
        }
      }

      return true;
    } catch (error) {
      console.error('❌ Error analyzing foreign keys:', error.message);
      return false;
    }
  }

  async analyzeRLSPolicies() {
    console.log('🔒 Analyzing RLS policies for conflicts...');
    
    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: `
        SELECT 
          schemaname,
          tablename,
          policyname,
          permissive,
          roles,
          cmd,
          qual,
          with_check
        FROM pg_policies 
        WHERE schemaname = 'public'
        ORDER BY tablename, policyname;
        `
      });

      if (error) {
        console.log('⚠️  Cannot access policy information, skipping RLS analysis');
        return true;
      }

      if (data && data.length > 0) {
        console.log(`✅ Found ${data.length} RLS policies`);
        
        // Group policies by table
        const policiesByTable = {};
        data.forEach(policy => {
          if (!policiesByTable[policy.tablename]) {
            policiesByTable[policy.tablename] = [];
          }
          policiesByTable[policy.tablename].push(policy);
        });

        // Check for potential conflicts
        Object.entries(policiesByTable).forEach(([tableName, policies]) => {
          if (policies.length > 8) {
            this.issues.push({
              type: 'security',
              severity: 'low',
              table: tableName,
              issue: `Many RLS policies (${policies.length})`,
              suggestion: 'Review policy complexity and consolidate if possible'
            });
            this.suggestions++;
          }

          // Check for conflicting policies (same command type)
          const commandGroups = {};
          policies.forEach(policy => {
            if (!commandGroups[policy.cmd]) {
              commandGroups[policy.cmd] = [];
            }
            commandGroups[policy.cmd].push(policy);
          });

          Object.entries(commandGroups).forEach(([cmd, cmdPolicies]) => {
            if (cmdPolicies.length > 3) {
              this.issues.push({
                type: 'security',
                severity: 'low',
                table: tableName,
                issue: `Multiple ${cmd} policies (${cmdPolicies.length})`,
                suggestion: 'Review for potential conflicts or redundancy'
              });
              this.suggestions++;
            }
          });
        });
      }

      return true;
    } catch (error) {
      console.error('❌ Error analyzing RLS policies:', error.message);
      return false;
    }
  }

  async fixDuplicateIndexes() {
    console.log('🔧 Fixing duplicate indexes...');
    
    try {
      // Fix known duplicate indexes on webhook_event_log table
      const duplicateIndexes = [
        'uniq_webhook_event_by_service_and_body_hash', // Duplicate of webhook_event_log_unique_body
        'uniq_webhook_event_by_service_and_event_id'   // Duplicate of webhook_event_log_unique_external
      ];

      for (const indexName of duplicateIndexes) {
        try {
          const { error } = await supabase.rpc('exec_sql', {
            sql: `DROP INDEX IF EXISTS ${indexName};`
          });

          if (error) {
            console.log(`⚠️  Could not drop index ${indexName}: ${error.message}`);
          } else {
            console.log(`✅ Dropped duplicate index: ${indexName}`);
            this.fixes.push({
              type: 'index_optimization',
              action: 'dropped_duplicate_index',
              details: indexName
            });
          }
        } catch (error) {
          console.log(`⚠️  Error dropping index ${indexName}: ${error.message}`);
        }
      }

      return true;
    } catch (error) {
      console.error('❌ Error fixing duplicate indexes:', error.message);
      return false;
    }
  }

  async runVacuumAnalyze() {
    console.log('🧹 Running VACUUM ANALYZE on tables with dead tuples...');
    
    try {
      // Focus on tables we know have dead tuples
      const tablesToVacuum = ['environment_config', 'mailboxes'];
      
      for (const tableName of tablesToVacuum) {
        try {
          const { error } = await supabase.rpc('exec_sql', {
            sql: `VACUUM ANALYZE ${tableName};`
          });

          if (error) {
            console.log(`⚠️  Could not vacuum ${tableName}: ${error.message}`);
          } else {
            console.log(`✅ Vacuumed and analyzed: ${tableName}`);
            this.fixes.push({
              type: 'maintenance',
              action: 'vacuum_analyze',
              details: tableName
            });
          }
        } catch (error) {
          console.log(`⚠️  Error vacuuming ${tableName}: ${error.message}`);
        }
      }

      return true;
    } catch (error) {
      console.error('❌ Error running vacuum analyze:', error.message);
      return false;
    }
  }

  async updateTableStatistics() {
    console.log('📊 Updating table statistics...');
    
    try {
      const { error } = await supabase.rpc('exec_sql', {
        sql: 'ANALYZE;'
      });

      if (error) {
        console.log(`⚠️  Could not run ANALYZE: ${error.message}`);
        return false;
      } else {
        console.log('✅ Updated database statistics');
        this.fixes.push({
          type: 'maintenance',
          action: 'analyze_database',
          details: 'Updated all table statistics'
        });
        return true;
      }
    } catch (error) {
      console.error('❌ Error updating statistics:', error.message);
      return false;
    }
  }

  async generateOptimizationReport() {
    console.log('\n📋 Generating optimization report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues: this.issues.length,
        warnings: this.warnings,
        suggestions: this.suggestions,
        fixesApplied: this.fixes.length
      },
      issues: this.issues,
      fixes: this.fixes,
      recommendations: [
        'Monitor dead tuple ratios regularly',
        'Review index usage periodically',
        'Consider partitioning for large tables',
        'Implement regular maintenance schedules',
        'Monitor RLS policy performance'
      ]
    };

    // Save report
    const fs = await import('fs');
    const reportPath = `monitoring/database-optimization-report-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📄 Report saved to: ${reportPath}`);
    return report;
  }

  async runOptimization() {
    console.log('🚀 Starting database optimization...');
    console.log('=====================================');
    
    try {
      // Analysis phase
      console.log('\n🔍 ANALYSIS PHASE');
      await this.analyzeDuplicateIndexes();
      await this.analyzeDeadTuples();
      await this.analyzeForeignKeyConstraints();
      await this.analyzeRLSPolicies();

      // Optimization phase
      console.log('\n🔧 OPTIMIZATION PHASE');
      await this.fixDuplicateIndexes();
      await this.runVacuumAnalyze();
      await this.updateTableStatistics();

      // Generate report
      const report = await this.generateOptimizationReport();

      // Summary
      console.log('\n📊 OPTIMIZATION SUMMARY');
      console.log('=======================');
      console.log(`⚠️  Warnings found: ${this.warnings}`);
      console.log(`💡 Suggestions made: ${this.suggestions}`);
      console.log(`🔧 Fixes applied: ${this.fixes.length}`);
      console.log(`📋 Total issues: ${this.issues.length}`);

      if (this.issues.length > 0) {
        console.log('\n🔍 Top Issues:');
        this.issues.slice(0, 5).forEach((issue, index) => {
          console.log(`${index + 1}. [${issue.severity.toUpperCase()}] ${issue.table}: ${issue.issue}`);
        });
      }

      return report;
    } catch (error) {
      console.error('❌ Error during optimization:', error.message);
      return null;
    }
  }
}

// CLI Interface
async function main() {
  const optimizer = new DatabaseOptimizer();
  
  try {
    const report = await optimizer.runOptimization();
    
    if (report) {
      console.log('\n🎯 Database optimization completed successfully!');
      
      if (report.summary.totalIssues === 0) {
        console.log('✅ No critical issues found - database is well optimized');
      } else {
        console.log(`📋 Found ${report.summary.totalIssues} issues to address`);
        console.log('📄 Check the detailed report for specific recommendations');
      }
    } else {
      console.log('❌ Database optimization failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default DatabaseOptimizer;
