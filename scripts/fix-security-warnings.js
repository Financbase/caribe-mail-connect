#!/usr/bin/env node

/**
 * Database Security Warning Fix Script
 * Resolves 26 security warnings in PRMCMS Supabase database
 * - 24 Function Search Path Mutable warnings
 * - 1 Extension in Public warning
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

class SecurityWarningFixer {
  constructor() {
    this.fixedFunctions = [];
    this.errors = [];
    this.securityImprovements = [];
  }

  // List of functions that need search_path fixes
  getFunctionsToFix() {
    return [
      'get_current_environment',
      'is_admin_user', 
      'is_staff_user',
      'is_development_env',
      'assign_user_tier',
      'initialize_loyalty_data',
      'get_user_tier',
      'set_timestamp',
      'test_input_validation',
      'increment_loyalty_points',
      'decrement_loyalty_points',
      'validate_email',
      'generate_invoice_number',
      'validate_phone',
      'validate_name',
      'validate_user_input',
      'check_security_health',
      'update_updated_at_column',
      'update_notification_analytics',
      'generate_po_number',
      'generate_adjustment_number',
      'update_document_search_vector',
      'update_folder_path',
      'get_system_status',
      'generate_mail_piece_number'
    ];
  }

  // Fix 1: Add search_path to functions
  async fixFunctionSearchPaths() {
    console.log('🔒 Fixing function search path vulnerabilities...');
    
    const functionsToFix = this.getFunctionsToFix();
    let fixedCount = 0;

    for (const functionName of functionsToFix) {
      try {
        console.log(`  - Securing function: ${functionName}`);
        
        // Get current function definition
        const { data: functionDef, error: getError } = await supabase.rpc('exec_sql', {
          sql: `
            SELECT pg_get_functiondef(oid) as definition
            FROM pg_proc 
            WHERE proname = '${functionName}' 
              AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
            LIMIT 1;
          `
        });

        if (getError) {
          console.error(`    ❌ Error getting ${functionName}:`, getError.message);
          this.errors.push({ function: functionName, error: getError.message });
          continue;
        }

        if (!functionDef || functionDef.length === 0) {
          console.log(`    ⚠️ Function ${functionName} not found, skipping`);
          continue;
        }

        // Extract function definition and add search_path
        let definition = functionDef[0].definition;
        
        // Check if search_path is already set
        if (definition.includes('SET search_path')) {
          console.log(`    ✅ ${functionName} already has search_path set`);
          continue;
        }

        // Add search_path before the function body
        // Look for the AS $$ or AS ' pattern and insert SET search_path before it
        const searchPathSetting = "SET search_path = 'public', 'pg_catalog'";
        
        if (definition.includes('AS $$')) {
          definition = definition.replace(
            /AS \$\$/,
            `AS $$\n${searchPathSetting};\n`
          );
        } else if (definition.includes("AS '")) {
          definition = definition.replace(
            /AS '/,
            `AS '\n${searchPathSetting};\n`
          );
        } else {
          // Try to find the function body start
          const bodyStart = definition.indexOf('BEGIN');
          if (bodyStart !== -1) {
            definition = definition.substring(0, bodyStart) + 
                        `${searchPathSetting};\nBEGIN` + 
                        definition.substring(bodyStart + 5);
          }
        }

        // Replace the function with the secured version
        const { error: replaceError } = await supabase.rpc('exec_sql', {
          sql: `DROP FUNCTION IF EXISTS ${functionName} CASCADE; ${definition}`
        });

        if (replaceError) {
          console.error(`    ❌ Error securing ${functionName}:`, replaceError.message);
          this.errors.push({ function: functionName, error: replaceError.message });
        } else {
          console.log(`    ✅ Secured ${functionName}`);
          fixedCount++;
          this.fixedFunctions.push(functionName);
          this.securityImprovements.push({
            type: 'search_path_fix',
            function: functionName,
            description: 'Added explicit search_path to prevent injection attacks'
          });
        }

      } catch (err) {
        console.error(`    ❌ Exception securing ${functionName}:`, err.message);
        this.errors.push({ function: functionName, error: err.message });
      }
    }

    return fixedCount;
  }

  // Fix 2: Move pg_trgm extension from public schema
  async fixExtensionPlacement() {
    console.log('🔧 Fixing extension placement security...');
    
    try {
      // Check if pg_trgm is in public schema
      const { data: extensionCheck, error: checkError } = await supabase.rpc('exec_sql', {
        sql: `
          SELECT extname, nspname as schema_name
          FROM pg_extension e
          JOIN pg_namespace n ON e.extnamespace = n.oid
          WHERE extname = 'pg_trgm';
        `
      });

      if (checkError) {
        console.error('❌ Error checking extension:', checkError.message);
        this.errors.push({ operation: 'extension_check', error: checkError.message });
        return false;
      }

      if (!extensionCheck || extensionCheck.length === 0) {
        console.log('  ✅ pg_trgm extension not found or already secure');
        return true;
      }

      const currentSchema = extensionCheck[0].schema_name;
      
      if (currentSchema !== 'public') {
        console.log(`  ✅ pg_trgm extension already in secure schema: ${currentSchema}`);
        return true;
      }

      console.log('  - Moving pg_trgm extension from public to extensions schema...');

      // Create extensions schema if it doesn't exist
      const { error: createSchemaError } = await supabase.rpc('exec_sql', {
        sql: 'CREATE SCHEMA IF NOT EXISTS extensions;'
      });

      if (createSchemaError) {
        console.error('    ❌ Error creating extensions schema:', createSchemaError.message);
        this.errors.push({ operation: 'create_schema', error: createSchemaError.message });
        return false;
      }

      // Move extension to extensions schema
      const { error: moveError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER EXTENSION pg_trgm SET SCHEMA extensions;'
      });

      if (moveError) {
        console.error('    ❌ Error moving extension:', moveError.message);
        this.errors.push({ operation: 'move_extension', error: moveError.message });
        return false;
      }

      console.log('  ✅ Moved pg_trgm extension to extensions schema');
      this.securityImprovements.push({
        type: 'extension_isolation',
        extension: 'pg_trgm',
        description: 'Moved extension from public schema to extensions schema for better security'
      });

      return true;

    } catch (err) {
      console.error('❌ Exception fixing extension placement:', err.message);
      this.errors.push({ operation: 'extension_fix', error: err.message });
      return false;
    }
  }

  // Verify security fixes
  async verifySecurityFixes() {
    console.log('🔍 Verifying security fixes...');
    
    try {
      // Check functions with search_path
      const { data: functionCheck, error: funcError } = await supabase.rpc('exec_sql', {
        sql: `
          SELECT 
            proname as function_name,
            CASE 
              WHEN prosrc LIKE '%SET search_path%' OR proconfig::text LIKE '%search_path%' 
              THEN 'SECURE' 
              ELSE 'VULNERABLE' 
            END as security_status
          FROM pg_proc 
          WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
            AND proname = ANY($1);
        `,
        params: [this.getFunctionsToFix()]
      });

      if (funcError) {
        console.error('❌ Error verifying functions:', funcError.message);
        return false;
      }

      const vulnerableFunctions = functionCheck?.filter(f => f.security_status === 'VULNERABLE') || [];
      
      console.log(`  ✅ Functions checked: ${functionCheck?.length || 0}`);
      console.log(`  ✅ Secure functions: ${(functionCheck?.length || 0) - vulnerableFunctions.length}`);
      console.log(`  ⚠️ Still vulnerable: ${vulnerableFunctions.length}`);

      // Check extension placement
      const { data: extCheck, error: extError } = await supabase.rpc('exec_sql', {
        sql: `
          SELECT extname, nspname as schema_name
          FROM pg_extension e
          JOIN pg_namespace n ON e.extnamespace = n.oid
          WHERE extname = 'pg_trgm';
        `
      });

      if (extError) {
        console.error('❌ Error verifying extension:', extError.message);
        return false;
      }

      const extensionSecure = !extCheck || extCheck.length === 0 || extCheck[0].schema_name !== 'public';
      console.log(`  ✅ Extension security: ${extensionSecure ? 'SECURE' : 'VULNERABLE'}`);

      return vulnerableFunctions.length === 0 && extensionSecure;

    } catch (err) {
      console.error('❌ Exception verifying fixes:', err.message);
      return false;
    }
  }

  // Generate security report
  generateSecurityReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total_functions_fixed: this.fixedFunctions.length,
        total_security_improvements: this.securityImprovements.length,
        total_errors: this.errors.length
      },
      security_improvements: this.securityImprovements,
      fixed_functions: this.fixedFunctions,
      errors_encountered: this.errors,
      security_recommendations: [
        'Regularly audit function definitions for search_path settings',
        'Keep extensions in dedicated schemas, not public',
        'Implement function security reviews in development process',
        'Monitor for new functions without explicit search_path',
        'Consider using SECURITY DEFINER functions with caution'
      ]
    };

    // Save report
    const reportPath = path.join(__dirname, '..', 'security-fixes-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    return report;
  }

  // Main execution
  async run() {
    console.log('🔒 Starting Database Security Warning Resolution...');
    console.log('==================================================');
    
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

      // Execute security fixes
      const functionsFixes = await this.fixFunctionSearchPaths();
      const extensionFix = await this.fixExtensionPlacement();
      const verificationPassed = await this.verifySecurityFixes();

      // Generate report
      const report = this.generateSecurityReport();
      
      console.log('\n🔒 Security Fix Summary');
      console.log('=======================');
      console.log(`✅ Functions secured: ${functionsFixes}`);
      console.log(`✅ Extensions secured: ${extensionFix ? 1 : 0}`);
      console.log(`✅ Total improvements: ${report.summary.total_security_improvements}`);
      console.log(`❌ Errors: ${report.summary.total_errors}`);
      console.log(`🔍 Verification: ${verificationPassed ? 'PASSED' : 'FAILED'}`);
      console.log('');
      
      if (this.securityImprovements.length > 0) {
        console.log('🛡️ Security Improvements Applied:');
        this.securityImprovements.forEach((improvement, index) => {
          console.log(`  ${index + 1}. ${improvement.type}: ${improvement.description}`);
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

      console.log('🎯 Security Status:');
      console.log(`- Search Path Injection Protection: ${functionsFixes > 0 ? 'ENABLED' : 'NEEDS ATTENTION'}`);
      console.log(`- Extension Isolation: ${extensionFix ? 'ENABLED' : 'NEEDS ATTENTION'}`);
      console.log(`- Overall Security Posture: ${verificationPassed ? 'IMPROVED' : 'NEEDS REVIEW'}`);
      
      return this.errors.length === 0 && verificationPassed;
      
    } catch (error) {
      console.error('❌ Security fix process failed:', error);
      return false;
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const fixer = new SecurityWarningFixer();
  fixer.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Security fix process failed:', error);
    process.exit(1);
  });
}

export default SecurityWarningFixer;
