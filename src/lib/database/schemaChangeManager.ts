/**
 * Schema Change Management
 * Reliable Backend - Schema Change Management
 * 
 * Establish process for controlled schema changes via migrations only
 */

import { supabase } from '@/integrations/supabase/client';
import { MigrationRunner } from '@/lib/migrations/migrationRunner';

// =====================================================
// SCHEMA CHANGE TYPES
// =====================================================

export interface SchemaChange {
  id: string;
  type: 'table' | 'column' | 'index' | 'constraint' | 'function' | 'trigger';
  action: 'create' | 'alter' | 'drop' | 'rename';
  target: string;
  description: string;
  migration_required: boolean;
  breaking_change: boolean;
  rollback_plan: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  created_by: string;
  created_at: string;
  approved_by?: string;
  approved_at?: string;
}

export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface SchemaChangeRequest {
  title: string;
  description: string;
  changes: SchemaChange[];
  justification: string;
  impact_assessment: string;
  rollback_strategy: string;
  testing_plan: string;
}

// =====================================================
// SCHEMA CHANGE MANAGER
// =====================================================

export class SchemaChangeManager {
  private static instance: SchemaChangeManager;
  private migrationRunner: MigrationRunner;

  private constructor() {
    this.migrationRunner = MigrationRunner.getInstance();
  }

  static getInstance(): SchemaChangeManager {
    if (!SchemaChangeManager.instance) {
      SchemaChangeManager.instance = new SchemaChangeManager();
    }
    return SchemaChangeManager.instance;
  }

  /**
   * Submit schema change request
   */
  async submitChangeRequest(request: SchemaChangeRequest): Promise<string> {
    try {
      const requestId = `scr_${Date.now()}`;
      
      // Validate the proposed changes
      const validation = await this.validateSchemaChanges(request.changes);
      if (!validation.valid) {
        throw new Error(`Schema validation failed: ${validation.errors.join(', ')}`);
      }

      // Store the change request
      const { error } = await supabase
        .from('schema_change_requests')
        .insert({
          id: requestId,
          title: request.title,
          description: request.description,
          changes: request.changes,
          justification: request.justification,
          impact_assessment: request.impact_assessment,
          rollback_strategy: request.rollback_strategy,
          testing_plan: request.testing_plan,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      console.log(`Schema change request submitted: ${requestId}`);
      return requestId;
    } catch (error) {
      console.error('Error submitting schema change request:', error);
      throw error;
    }
  }

  /**
   * Validate schema changes
   */
  async validateSchemaChanges(changes: SchemaChange[]): Promise<SchemaValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    for (const change of changes) {
      // Check for breaking changes
      if (change.breaking_change) {
        warnings.push(`Breaking change detected: ${change.description}`);
      }

      // Validate change type and action combinations
      if (!this.isValidChangeTypeAction(change.type, change.action)) {
        errors.push(`Invalid combination: ${change.action} ${change.type} for ${change.target}`);
      }

      // Check for dangerous operations
      if (this.isDangerousOperation(change)) {
        warnings.push(`Dangerous operation: ${change.action} ${change.type} ${change.target}`);
      }

      // Validate naming conventions
      if (!this.validateNamingConvention(change)) {
        suggestions.push(`Consider following naming convention for ${change.target}`);
      }

      // Check for missing rollback plan
      if (!change.rollback_plan || change.rollback_plan.trim() === '') {
        errors.push(`Missing rollback plan for ${change.target}`);
      }
    }

    // Check for dependency conflicts
    const dependencyErrors = this.checkDependencyConflicts(changes);
    errors.push(...dependencyErrors);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Generate migration from schema changes
   */
  async generateMigrationFromChanges(
    changes: SchemaChange[],
    migrationName: string,
    description: string
  ): Promise<{ up: string; down: string }> {
    let upSQL = '-- Schema changes migration\n';
    let downSQL = '-- Rollback schema changes\n';

    for (const change of changes) {
      const { up, down } = this.generateSQLForChange(change);
      upSQL += `\n-- ${change.description}\n${up}\n`;
      downSQL = `\n-- Rollback: ${change.description}\n${down}\n` + downSQL;
    }

    return { up: upSQL, down: downSQL };
  }

  /**
   * Apply approved schema changes
   */
  async applySchemaChanges(requestId: string): Promise<boolean> {
    try {
      // Get the approved change request
      const { data: request, error } = await supabase
        .from('schema_change_requests')
        .select('*')
        .eq('id', requestId)
        .eq('status', 'approved')
        .single();

      if (error || !request) {
        throw new Error('Schema change request not found or not approved');
      }

      // Generate migration
      const { up, down } = await this.generateMigrationFromChanges(
        request.changes,
        `schema_change_${requestId}`,
        request.description
      );

      // Create and apply migration
      const migration = this.migrationRunner.createMigrationTemplate(
        `schema_change_${requestId}`,
        request.description
      );
      migration.up = up;
      migration.down = down;

      const result = await this.migrationRunner.migrate();
      
      if (result.length > 0 && result[0].success) {
        // Update request status
        await supabase
          .from('schema_change_requests')
          .update({
            status: 'applied',
            applied_at: new Date().toISOString()
          })
          .eq('id', requestId);

        console.log(`Schema changes applied successfully: ${requestId}`);
        return true;
      } else {
        throw new Error('Migration failed');
      }
    } catch (error) {
      console.error('Error applying schema changes:', error);
      return false;
    }
  }

  /**
   * Get current schema state
   */
  async getCurrentSchemaState(): Promise<any> {
    try {
      // Get table information
      const { data: tables, error: tablesError } = await supabase.rpc('get_table_info');
      if (tablesError) throw tablesError;

      // Get column information
      const { data: columns, error: columnsError } = await supabase.rpc('get_column_info');
      if (columnsError) throw columnsError;

      // Get index information
      const { data: indexes, error: indexesError } = await supabase.rpc('get_index_info');
      if (indexesError) throw indexesError;

      return {
        tables: tables || [],
        columns: columns || [],
        indexes: indexes || [],
        generated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting schema state:', error);
      return null;
    }
  }

  /**
   * Compare schema states
   */
  compareSchemaStates(oldState: any, newState: any): SchemaChange[] {
    const changes: SchemaChange[] = [];

    // Compare tables
    const oldTables = new Set(oldState.tables.map((t: any) => t.table_name));
    const newTables = new Set(newState.tables.map((t: any) => t.table_name));

    // New tables
    for (const table of newTables) {
      if (!oldTables.has(table)) {
        changes.push({
          id: `change_${Date.now()}_${Math.random()}`,
          type: 'table',
          action: 'create',
          target: table,
          description: `Create table ${table}`,
          migration_required: true,
          breaking_change: false,
          rollback_plan: `DROP TABLE ${table}`,
          approval_status: 'pending',
          created_by: 'system',
          created_at: new Date().toISOString()
        });
      }
    }

    // Dropped tables
    for (const table of oldTables) {
      if (!newTables.has(table)) {
        changes.push({
          id: `change_${Date.now()}_${Math.random()}`,
          type: 'table',
          action: 'drop',
          target: table,
          description: `Drop table ${table}`,
          migration_required: true,
          breaking_change: true,
          rollback_plan: `Restore table ${table} from backup`,
          approval_status: 'pending',
          created_by: 'system',
          created_at: new Date().toISOString()
        });
      }
    }

    return changes;
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  private isValidChangeTypeAction(type: string, action: string): boolean {
    const validCombinations: Record<string, string[]> = {
      table: ['create', 'alter', 'drop', 'rename'],
      column: ['create', 'alter', 'drop', 'rename'],
      index: ['create', 'drop'],
      constraint: ['create', 'drop'],
      function: ['create', 'alter', 'drop'],
      trigger: ['create', 'drop']
    };

    return validCombinations[type]?.includes(action) || false;
  }

  private isDangerousOperation(change: SchemaChange): boolean {
    const dangerousOperations = [
      { type: 'table', action: 'drop' },
      { type: 'column', action: 'drop' },
      { type: 'constraint', action: 'drop' }
    ];

    return dangerousOperations.some(
      op => op.type === change.type && op.action === change.action
    );
  }

  private validateNamingConvention(change: SchemaChange): boolean {
    // Basic naming convention validation
    const target = change.target.toLowerCase();
    
    // Check for reserved words
    const reservedWords = ['user', 'order', 'group', 'table', 'column', 'index'];
    if (reservedWords.includes(target)) {
      return false;
    }

    // Check naming pattern (snake_case)
    const snakeCasePattern = /^[a-z][a-z0-9_]*[a-z0-9]$/;
    return snakeCasePattern.test(target);
  }

  private checkDependencyConflicts(changes: SchemaChange[]): string[] {
    const errors: string[] = [];

    // Check for circular dependencies
    const dependencies = new Map<string, string[]>();
    
    for (const change of changes) {
      if (change.type === 'table' && change.action === 'create') {
        // Check if this table depends on other tables being created first
        // This is a simplified check - in practice, you'd parse the SQL
        dependencies.set(change.target, []);
      }
    }

    // Check for conflicting operations on the same target
    const targetOperations = new Map<string, SchemaChange[]>();
    
    for (const change of changes) {
      const key = `${change.type}:${change.target}`;
      if (!targetOperations.has(key)) {
        targetOperations.set(key, []);
      }
      targetOperations.get(key)!.push(change);
    }

    for (const [target, operations] of targetOperations) {
      if (operations.length > 1) {
        const actions = operations.map(op => op.action);
        if (actions.includes('drop') && actions.includes('create')) {
          errors.push(`Conflicting operations on ${target}: cannot drop and create in same migration`);
        }
      }
    }

    return errors;
  }

  private generateSQLForChange(change: SchemaChange): { up: string; down: string } {
    let up = '';
    let down = '';

    switch (`${change.type}:${change.action}`) {
      case 'table:create':
        up = `CREATE TABLE ${change.target} (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);`;
        down = `DROP TABLE IF EXISTS ${change.target};`;
        break;

      case 'table:drop':
        up = `DROP TABLE IF EXISTS ${change.target};`;
        down = `-- Cannot automatically restore dropped table ${change.target}`;
        break;

      case 'column:create':
        const [tableName, columnName] = change.target.split('.');
        up = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} TEXT;`;
        down = `ALTER TABLE ${tableName} DROP COLUMN IF EXISTS ${columnName};`;
        break;

      case 'index:create':
        up = `CREATE INDEX IF NOT EXISTS ${change.target} ON ${change.target.split('_')[0]} (${change.target.split('_').slice(1).join(', ')});`;
        down = `DROP INDEX IF EXISTS ${change.target};`;
        break;

      default:
        up = `-- TODO: Implement ${change.action} ${change.type} ${change.target}`;
        down = `-- TODO: Implement rollback for ${change.action} ${change.type} ${change.target}`;
    }

    return { up, down };
  }
}
