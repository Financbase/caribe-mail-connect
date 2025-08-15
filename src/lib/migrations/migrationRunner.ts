/**
 * Database Migration System
 * Reliable Backend - Database Migration System
 * 
 * Implement versioned database migrations with rollback capability
 */

import { supabase } from '@/integrations/supabase/client';

// =====================================================
// MIGRATION TYPES
// =====================================================

export interface Migration {
  id: string;
  version: string;
  name: string;
  description: string;
  up: string; // SQL for applying migration
  down: string; // SQL for rolling back migration
  checksum: string;
  created_at: string;
  applied_at?: string;
  rolled_back_at?: string;
  execution_time_ms?: number;
}

export interface MigrationResult {
  success: boolean;
  migration: Migration;
  error?: string;
  execution_time_ms: number;
}

export interface MigrationStatus {
  current_version: string;
  pending_migrations: Migration[];
  applied_migrations: Migration[];
  last_migration_date?: string;
  total_migrations: number;
  pending_count: number;
}

// =====================================================
// MIGRATION RUNNER CLASS
// =====================================================

export class MigrationRunner {
  private static instance: MigrationRunner;
  private migrations: Migration[] = [];
  private isInitialized = false;

  private constructor() {}

  static getInstance(): MigrationRunner {
    if (!MigrationRunner.instance) {
      MigrationRunner.instance = new MigrationRunner();
    }
    return MigrationRunner.instance;
  }

  /**
   * Initialize migration system
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Ensure migration tracking table exists
      await this.createMigrationTable();
      
      // Load all migrations
      await this.loadMigrations();
      
      this.isInitialized = true;
      console.log('Migration system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize migration system:', error);
      throw error;
    }
  }

  /**
   * Create migration tracking table if it doesn't exist
   */
  private async createMigrationTable(): Promise<void> {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        version VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        checksum VARCHAR(255) NOT NULL,
        up_sql TEXT NOT NULL,
        down_sql TEXT NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE,
        rolled_back_at TIMESTAMP WITH TIME ZONE,
        execution_time_ms INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_schema_migrations_version ON schema_migrations(version);
      CREATE INDEX IF NOT EXISTS idx_schema_migrations_applied_at ON schema_migrations(applied_at);
    `;

    const { error } = await supabase.rpc('execute_sql', { sql: createTableSQL });
    if (error) {
      throw new Error(`Failed to create migration table: ${error.message}`);
    }
  }

  /**
   * Load all migrations from the migrations directory
   */
  private async loadMigrations(): Promise<void> {
    // In a real implementation, this would load from files
    // For now, we'll define some example migrations
    this.migrations = [
      {
        id: 'migration_001',
        version: '001_initial_schema',
        name: 'Initial Schema',
        description: 'Create initial database schema',
        up: `
          CREATE TABLE IF NOT EXISTS customers (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(50),
            address TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
        down: `DROP TABLE IF EXISTS customers;`,
        checksum: this.generateChecksum('001_initial_schema'),
        created_at: new Date().toISOString()
      },
      {
        id: 'migration_002',
        version: '002_add_packages_table',
        name: 'Add Packages Table',
        description: 'Create packages table for package management',
        up: `
          CREATE TABLE IF NOT EXISTS packages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
            tracking_number VARCHAR(255) UNIQUE NOT NULL,
            description TEXT,
            weight DECIMAL(10,2),
            value DECIMAL(10,2),
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          CREATE INDEX IF NOT EXISTS idx_packages_customer_id ON packages(customer_id);
          CREATE INDEX IF NOT EXISTS idx_packages_tracking_number ON packages(tracking_number);
          CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);
        `,
        down: `DROP TABLE IF EXISTS packages;`,
        checksum: this.generateChecksum('002_add_packages_table'),
        created_at: new Date().toISOString()
      },
      {
        id: 'migration_003',
        version: '003_add_subscriptions',
        name: 'Add Subscriptions',
        description: 'Add subscription management for SaaS model',
        up: `
          CREATE TABLE IF NOT EXISTS subscriptions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
            plan_id VARCHAR(255) NOT NULL,
            status VARCHAR(50) DEFAULT 'active',
            current_period_start TIMESTAMP WITH TIME ZONE,
            current_period_end TIMESTAMP WITH TIME ZONE,
            stripe_subscription_id VARCHAR(255) UNIQUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON subscriptions(customer_id);
          CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
          CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
        `,
        down: `DROP TABLE IF EXISTS subscriptions;`,
        checksum: this.generateChecksum('003_add_subscriptions'),
        created_at: new Date().toISOString()
      }
    ];
  }

  /**
   * Get current migration status
   */
  async getStatus(): Promise<MigrationStatus> {
    await this.initialize();

    const { data: appliedMigrations, error } = await supabase
      .from('schema_migrations')
      .select('*')
      .not('applied_at', 'is', null)
      .order('version', { ascending: true });

    if (error) {
      throw new Error(`Failed to get migration status: ${error.message}`);
    }

    const appliedVersions = new Set((appliedMigrations || []).map(m => m.version));
    const pendingMigrations = this.migrations.filter(m => !appliedVersions.has(m.version));

    const lastApplied = appliedMigrations && appliedMigrations.length > 0 
      ? appliedMigrations[appliedMigrations.length - 1]
      : null;

    return {
      current_version: lastApplied?.version || 'none',
      pending_migrations: pendingMigrations,
      applied_migrations: appliedMigrations || [],
      last_migration_date: lastApplied?.applied_at,
      total_migrations: this.migrations.length,
      pending_count: pendingMigrations.length
    };
  }

  /**
   * Run pending migrations
   */
  async migrate(): Promise<MigrationResult[]> {
    await this.initialize();

    const status = await this.getStatus();
    const results: MigrationResult[] = [];

    for (const migration of status.pending_migrations) {
      const result = await this.applyMigration(migration);
      results.push(result);

      if (!result.success) {
        console.error(`Migration ${migration.version} failed:`, result.error);
        break; // Stop on first failure
      }
    }

    return results;
  }

  /**
   * Apply a single migration
   */
  private async applyMigration(migration: Migration): Promise<MigrationResult> {
    const startTime = Date.now();

    try {
      console.log(`Applying migration: ${migration.version} - ${migration.name}`);

      // Start transaction
      const { error: beginError } = await supabase.rpc('begin_transaction');
      if (beginError) throw beginError;

      try {
        // Execute migration SQL
        const { error: sqlError } = await supabase.rpc('execute_sql', { 
          sql: migration.up 
        });
        if (sqlError) throw sqlError;

        // Record migration as applied
        const executionTime = Date.now() - startTime;
        const { error: recordError } = await supabase
          .from('schema_migrations')
          .upsert({
            version: migration.version,
            name: migration.name,
            description: migration.description,
            checksum: migration.checksum,
            up_sql: migration.up,
            down_sql: migration.down,
            applied_at: new Date().toISOString(),
            execution_time_ms: executionTime
          });

        if (recordError) throw recordError;

        // Commit transaction
        const { error: commitError } = await supabase.rpc('commit_transaction');
        if (commitError) throw commitError;

        console.log(`Migration ${migration.version} applied successfully in ${executionTime}ms`);

        return {
          success: true,
          migration,
          execution_time_ms: executionTime
        };

      } catch (error) {
        // Rollback transaction
        await supabase.rpc('rollback_transaction');
        throw error;
      }

    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error(`Migration ${migration.version} failed:`, error);

      return {
        success: false,
        migration,
        error: error instanceof Error ? error.message : 'Unknown error',
        execution_time_ms: executionTime
      };
    }
  }

  /**
   * Rollback a migration
   */
  async rollback(version: string): Promise<MigrationResult> {
    await this.initialize();

    const migration = this.migrations.find(m => m.version === version);
    if (!migration) {
      throw new Error(`Migration ${version} not found`);
    }

    const startTime = Date.now();

    try {
      console.log(`Rolling back migration: ${migration.version} - ${migration.name}`);

      // Start transaction
      const { error: beginError } = await supabase.rpc('begin_transaction');
      if (beginError) throw beginError;

      try {
        // Execute rollback SQL
        const { error: sqlError } = await supabase.rpc('execute_sql', { 
          sql: migration.down 
        });
        if (sqlError) throw sqlError;

        // Update migration record
        const executionTime = Date.now() - startTime;
        const { error: updateError } = await supabase
          .from('schema_migrations')
          .update({
            applied_at: null,
            rolled_back_at: new Date().toISOString(),
            execution_time_ms: executionTime
          })
          .eq('version', version);

        if (updateError) throw updateError;

        // Commit transaction
        const { error: commitError } = await supabase.rpc('commit_transaction');
        if (commitError) throw commitError;

        console.log(`Migration ${migration.version} rolled back successfully in ${executionTime}ms`);

        return {
          success: true,
          migration,
          execution_time_ms: executionTime
        };

      } catch (error) {
        // Rollback transaction
        await supabase.rpc('rollback_transaction');
        throw error;
      }

    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error(`Rollback of ${migration.version} failed:`, error);

      return {
        success: false,
        migration,
        error: error instanceof Error ? error.message : 'Unknown error',
        execution_time_ms: executionTime
      };
    }
  }

  /**
   * Validate migration integrity
   */
  async validateMigrations(): Promise<{ valid: boolean; errors: string[] }> {
    await this.initialize();

    const errors: string[] = [];

    // Check for duplicate versions
    const versions = this.migrations.map(m => m.version);
    const duplicates = versions.filter((v, i) => versions.indexOf(v) !== i);
    if (duplicates.length > 0) {
      errors.push(`Duplicate migration versions: ${duplicates.join(', ')}`);
    }

    // Check for missing down migrations
    const missingDown = this.migrations.filter(m => !m.down || m.down.trim() === '');
    if (missingDown.length > 0) {
      errors.push(`Migrations missing down SQL: ${missingDown.map(m => m.version).join(', ')}`);
    }

    // Validate checksums
    for (const migration of this.migrations) {
      const expectedChecksum = this.generateChecksum(migration.version);
      if (migration.checksum !== expectedChecksum) {
        errors.push(`Invalid checksum for migration ${migration.version}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate checksum for migration
   */
  private generateChecksum(version: string): string {
    // Simple checksum implementation
    let hash = 0;
    for (let i = 0; i < version.length; i++) {
      const char = version.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Create a new migration template
   */
  createMigrationTemplate(name: string, description: string): Migration {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    const version = `${timestamp}_${name.toLowerCase().replace(/\s+/g, '_')}`;

    return {
      id: `migration_${timestamp}`,
      version,
      name,
      description,
      up: '-- Add your migration SQL here\n',
      down: '-- Add your rollback SQL here\n',
      checksum: this.generateChecksum(version),
      created_at: new Date().toISOString()
    };
  }
}
