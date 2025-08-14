#!/usr/bin/env node

/**
 * PRMCMS Environment Manager
 * Manages environment-specific configurations and data seeding for the consolidated Supabase project
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Configuration
const ENVIRONMENTS = {
  development: {
    name: 'development',
    description: 'Development environment with full debugging',
    config: {
      debug_mode: true,
      log_level: 'debug',
      rate_limiting: false,
      mock_external_apis: true,
      seed_test_data: true
    }
  },
  staging: {
    name: 'staging',
    description: 'Staging environment for testing',
    config: {
      debug_mode: false,
      log_level: 'info',
      rate_limiting: true,
      mock_external_apis: false,
      seed_test_data: true
    }
  },
  production: {
    name: 'production',
    description: 'Production environment',
    config: {
      debug_mode: false,
      log_level: 'warn',
      rate_limiting: true,
      mock_external_apis: false,
      seed_test_data: false
    }
  }
};

class EnvironmentManager {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
    }
    
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  async setupEnvironment(environmentName) {
    console.log(`🚀 Setting up ${environmentName} environment...`);
    
    const env = ENVIRONMENTS[environmentName];
    if (!env) {
      throw new Error(`Unknown environment: ${environmentName}`);
    }

    try {
      // 1. Configure environment settings
      await this.configureEnvironment(env);
      
      // 2. Set up RLS policies
      await this.setupRLSPolicies(environmentName);
      
      // 3. Seed data if needed
      if (env.config.seed_test_data) {
        await this.seedTestData(environmentName);
      }
      
      // 4. Configure monitoring
      await this.setupMonitoring(environmentName);
      
      console.log(`✅ ${environmentName} environment setup completed`);
      
    } catch (error) {
      console.error(`❌ Error setting up ${environmentName} environment:`, error);
      throw error;
    }
  }

  async configureEnvironment(env) {
    console.log(`📝 Configuring ${env.name} environment settings...`);
    
    // Update environment configuration table
    for (const [key, value] of Object.entries(env.config)) {
      const { error } = await this.supabase
        .from('environment_config')
        .upsert({
          environment: env.name,
          config_key: key,
          config_value: value.toString()
        });
      
      if (error) {
        console.error(`Error setting config ${key}:`, error);
      }
    }
  }

  async setupRLSPolicies(environmentName) {
    console.log(`🔒 Setting up RLS policies for ${environmentName}...`);
    
    const policies = {
      development: [
        // More permissive policies for development
        `CREATE POLICY IF NOT EXISTS "dev_full_access_packages" ON packages FOR ALL USING (true);`,
        `CREATE POLICY IF NOT EXISTS "dev_full_access_customers" ON customers FOR ALL USING (true);`,
      ],
      staging: [
        // Production-like policies but with some relaxed constraints
        `CREATE POLICY IF NOT EXISTS "staging_user_packages" ON packages FOR SELECT USING (auth.uid()::text = customer_id::text);`,
        `CREATE POLICY IF NOT EXISTS "staging_user_profile" ON customers FOR SELECT USING (auth.uid() = id);`,
      ],
      production: [
        // Strict production policies
        `CREATE POLICY IF NOT EXISTS "prod_user_packages" ON packages FOR SELECT USING (auth.uid()::text = customer_id::text);`,
        `CREATE POLICY IF NOT EXISTS "prod_user_profile" ON customers FOR SELECT USING (auth.uid() = id);`,
        `CREATE POLICY IF NOT EXISTS "prod_admin_full_access" ON packages FOR ALL USING (auth.jwt() ->> 'role' = 'admin');`,
      ]
    };

    const envPolicies = policies[environmentName] || policies.production;
    
    for (const policy of envPolicies) {
      try {
        const { error } = await this.supabase.rpc('exec_sql', { sql: policy });
        if (error) {
          console.error(`Error creating policy:`, error);
        }
      } catch (error) {
        console.error(`Error executing policy:`, error);
      }
    }
  }

  async seedTestData(environmentName) {
    console.log(`🌱 Seeding test data for ${environmentName}...`);
    
    const testData = {
      customers: [
        {
          id: '00000000-0000-0000-0000-000000000001',
          email: 'test.customer@example.com',
          first_name: 'Test',
          last_name: 'Customer',
          phone: '+1-787-555-0001',
          created_at: new Date().toISOString()
        },
        {
          id: '00000000-0000-0000-0000-000000000002',
          email: 'admin@prmcms.com',
          first_name: 'Admin',
          last_name: 'User',
          phone: '+1-787-555-0002',
          created_at: new Date().toISOString()
        }
      ],
      packages: [
        {
          tracking_number: 'TEST001',
          customer_id: '00000000-0000-0000-0000-000000000001',
          sender_name: 'Test Sender',
          recipient_name: 'Test Customer',
          status: 'delivered',
          package_type: 'envelope',
          weight: 0.5,
          created_at: new Date().toISOString()
        },
        {
          tracking_number: 'TEST002',
          customer_id: '00000000-0000-0000-0000-000000000001',
          sender_name: 'Amazon',
          recipient_name: 'Test Customer',
          status: 'in_transit',
          package_type: 'package',
          weight: 2.3,
          created_at: new Date().toISOString()
        }
      ],
      mailboxes: [
        {
          customer_id: '00000000-0000-0000-0000-000000000001',
          mailbox_number: 'MB001',
          type: 'standard',
          status: 'active',
          monthly_fee: 25.00,
          created_at: new Date().toISOString()
        }
      ]
    };

    // Only seed in development and staging
    if (environmentName === 'production') {
      console.log('⚠️  Skipping test data seeding in production');
      return;
    }

    for (const [table, data] of Object.entries(testData)) {
      try {
        const { error } = await this.supabase
          .from(table)
          .upsert(data, { onConflict: 'id' });
        
        if (error) {
          console.error(`Error seeding ${table}:`, error);
        } else {
          console.log(`✅ Seeded ${data.length} records in ${table}`);
        }
      } catch (error) {
        console.error(`Error seeding ${table}:`, error);
      }
    }
  }

  async setupMonitoring(environmentName) {
    console.log(`📊 Setting up monitoring for ${environmentName}...`);
    
    // Create monitoring configuration
    const monitoringConfig = {
      environment: environmentName,
      alerts_enabled: environmentName === 'production',
      log_retention_days: environmentName === 'production' ? 90 : 30,
      performance_monitoring: true,
      error_tracking: true
    };

    try {
      const { error } = await this.supabase
        .from('monitoring_config')
        .upsert(monitoringConfig, { onConflict: 'environment' });
      
      if (error) {
        console.error('Error setting up monitoring:', error);
      }
    } catch (error) {
      // Table might not exist yet, that's okay
      console.log('Monitoring table not found, skipping...');
    }
  }

  async switchEnvironment(environmentName) {
    console.log(`🔄 Switching to ${environmentName} environment...`);
    
    // Update current environment marker
    try {
      const { error } = await this.supabase
        .from('environment_config')
        .upsert({
          environment: 'system',
          config_key: 'current_environment',
          config_value: environmentName
        }, {
          onConflict: 'environment,config_key',
          ignoreDuplicates: false
        });
      
      if (error) {
        console.error('Error switching environment:', error);
      } else {
        console.log(`✅ Switched to ${environmentName} environment`);
      }
    } catch (error) {
      console.error('Error switching environment:', error);
    }
  }

  async getEnvironmentStatus() {
    console.log('📋 Environment Status Report');
    console.log('============================');
    
    try {
      // Get current environment
      const { data: currentEnv } = await this.supabase
        .from('environment_config')
        .select('config_value')
        .eq('environment', 'system')
        .eq('config_key', 'current_environment')
        .single();
      
      console.log(`Current Environment: ${currentEnv?.config_value || 'unknown'}`);
      
      // Get all environment configurations
      const { data: configs } = await this.supabase
        .from('environment_config')
        .select('*')
        .order('environment', { ascending: true });
      
      if (configs) {
        const envGroups = configs.reduce((acc, config) => {
          if (!acc[config.environment]) {
            acc[config.environment] = {};
          }
          acc[config.environment][config.config_key] = config.config_value;
          return acc;
        }, {});
        
        for (const [env, config] of Object.entries(envGroups)) {
          if (env !== 'system') {
            console.log(`\n${env.toUpperCase()}:`);
            for (const [key, value] of Object.entries(config)) {
              console.log(`  ${key}: ${value}`);
            }
          }
        }
      }
      
    } catch (error) {
      console.error('Error getting environment status:', error);
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const environment = args[1];

  const manager = new EnvironmentManager();

  try {
    switch (command) {
      case 'setup':
        if (!environment || !ENVIRONMENTS[environment]) {
          console.error('Usage: node environment-manager.js setup <development|staging|production>');
          process.exit(1);
        }
        await manager.setupEnvironment(environment);
        break;
        
      case 'switch':
        if (!environment || !ENVIRONMENTS[environment]) {
          console.error('Usage: node environment-manager.js switch <development|staging|production>');
          process.exit(1);
        }
        await manager.switchEnvironment(environment);
        break;
        
      case 'status':
        await manager.getEnvironmentStatus();
        break;
        
      default:
        console.log('PRMCMS Environment Manager');
        console.log('Usage:');
        console.log('  node environment-manager.js setup <environment>   - Setup environment');
        console.log('  node environment-manager.js switch <environment>  - Switch environment');
        console.log('  node environment-manager.js status                - Show status');
        console.log('');
        console.log('Environments: development, staging, production');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default EnvironmentManager;
