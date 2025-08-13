/**
 * Migration tests verifying schema changes and RLS policies for Caribe Mail Connect within PRMCE.
 * Updated: 2025-03-04
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const migrationsDir = join(process.cwd(), 'supabase', 'migrations');

describe('Supabase migrations RLS', () => {
  const migrationFiles = readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
  migrationFiles.forEach(file => {
    const sql = readFileSync(join(migrationsDir, file), 'utf8');
    const tables = Array.from(sql.matchAll(/CREATE TABLE\s+public\.(\w+)/gi)).map(m => m[1]);

    if (tables.length === 0) return;

    describe(file, () => {
      tables.forEach(table => {
        it(`enables RLS and policies for ${table}`, () => {
          const rlsRegex = new RegExp(`ALTER TABLE\\s+(?:public\\.)?${table}\\s+ENABLE ROW LEVEL SECURITY`, 'i');
          expect(sql).toMatch(rlsRegex);
          const policyRegex = new RegExp(`CREATE POLICY[\\s\\S]+ON\\s+(?:public\\.)?${table}`, 'i');
          expect(sql).toMatch(policyRegex);
        });
      });
    });
  });
});
