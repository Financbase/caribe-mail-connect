/**
 * Migration Dashboard Component
 * Reliable Backend - Database Migration System
 * 
 * Admin interface for managing database migrations
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database,
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  FileText,
  Shield,
  Activity,
  ArrowUp,
  ArrowDown,
  GitBranch
} from 'lucide-react';
import { MigrationRunner } from '@/lib/migrations/migrationRunner';
import type { Migration, MigrationStatus, MigrationResult } from '@/lib/migrations/migrationRunner';

// =====================================================
// MIGRATION DASHBOARD COMPONENT
// =====================================================

export function MigrationDashboard() {
  const [migrationRunner] = useState(() => MigrationRunner.getInstance());
  const [status, setStatus] = useState<MigrationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [migrationResults, setMigrationResults] = useState<MigrationResult[]>([]);

  // =====================================================
  // DATA LOADING
  // =====================================================

  const loadMigrationStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const migrationStatus = await migrationRunner.getStatus();
      setStatus(migrationStatus);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load migration status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMigrationStatus();
  }, []);

  // =====================================================
  // EVENT HANDLERS
  // =====================================================

  const handleRunMigrations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const results = await migrationRunner.migrate();
      setMigrationResults(results);
      await loadMigrationStatus(); // Refresh status
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to run migrations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRollback = async (version: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await migrationRunner.rollback(version);
      setMigrationResults([result]);
      await loadMigrationStatus(); // Refresh status
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to rollback migration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateMigrations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const validation = await migrationRunner.validateMigrations();
      if (!validation.valid) {
        setError(`Migration validation failed: ${validation.errors.join(', ')}`);
      } else {
        setError(null);
        // Show success message
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to validate migrations');
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================================
  // RENDER HELPERS
  // =====================================================

  const renderMigrationCard = (migration: Migration, type: 'pending' | 'applied') => (
    <Card key={migration.version} className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">{migration.name}</h4>
              <Badge variant={type === 'applied' ? 'default' : 'secondary'}>
                {migration.version}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{migration.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Created: {new Date(migration.created_at).toLocaleDateString()}</span>
              {migration.applied_at && (
                <span>Applied: {new Date(migration.applied_at).toLocaleDateString()}</span>
              )}
              {migration.execution_time_ms && (
                <span>Execution: {migration.execution_time_ms}ms</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {type === 'applied' ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRollback(migration.version)}
                  disabled={isLoading}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Rollback
                </Button>
              </>
            ) : (
              <Clock className="h-5 w-5 text-yellow-500" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderMigrationResult = (result: MigrationResult) => (
    <Card key={result.migration.version} className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {result.success ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
            <div>
              <h4 className="font-medium">{result.migration.name}</h4>
              <p className="text-sm text-muted-foreground">{result.migration.version}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant={result.success ? 'default' : 'destructive'}>
              {result.success ? 'Success' : 'Failed'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {result.execution_time_ms}ms
            </p>
          </div>
        </div>
        {result.error && (
          <Alert variant="destructive" className="mt-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{result.error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  // =====================================================
  // MAIN RENDER
  // =====================================================

  if (isLoading && !status) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Database Migrations</h1>
          <p className="text-muted-foreground">
            Manage database schema changes with versioned migrations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={loadMigrationStatus}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleValidateMigrations}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <Shield className="h-4 w-4 mr-2" />
            Validate
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Status Overview */}
      {status && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Version</p>
                  <p className="text-2xl font-bold">{status.current_version}</p>
                </div>
                <GitBranch className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Migrations</p>
                  <p className="text-2xl font-bold">{status.total_migrations}</p>
                </div>
                <Database className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{status.pending_count}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Applied</p>
                  <p className="text-2xl font-bold">{status.applied_migrations.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Migration Progress */}
      {status && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Migration Progress
            </CardTitle>
            <CardDescription>
              {status.applied_migrations.length} of {status.total_migrations} migrations applied
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress 
              value={(status.applied_migrations.length / status.total_migrations) * 100} 
              className="h-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Applied: {status.applied_migrations.length}</span>
              <span>Pending: {status.pending_count}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending Migrations</TabsTrigger>
          <TabsTrigger value="applied">Applied Migrations</TabsTrigger>
          <TabsTrigger value="results">Recent Results</TabsTrigger>
        </TabsList>

        {/* Pending Migrations Tab */}
        <TabsContent value="pending" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Pending Migrations</h2>
            {status && status.pending_count > 0 && (
              <Button onClick={handleRunMigrations} disabled={isLoading}>
                <Play className="h-4 w-4 mr-2" />
                Run {status.pending_count} Migration{status.pending_count !== 1 ? 's' : ''}
              </Button>
            )}
          </div>

          {status?.pending_migrations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">All migrations applied</h3>
                <p className="text-muted-foreground">
                  Your database is up to date with the latest schema changes.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {status?.pending_migrations.map(migration => 
                renderMigrationCard(migration, 'pending')
              )}
            </div>
          )}
        </TabsContent>

        {/* Applied Migrations Tab */}
        <TabsContent value="applied" className="space-y-6">
          <h2 className="text-2xl font-bold">Applied Migrations</h2>

          {status?.applied_migrations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No migrations applied</h3>
                <p className="text-muted-foreground">
                  No database migrations have been applied yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {status?.applied_migrations.map(migration => 
                renderMigrationCard(migration, 'applied')
              )}
            </div>
          )}
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          <h2 className="text-2xl font-bold">Recent Results</h2>

          {migrationResults.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No recent results</h3>
                <p className="text-muted-foreground">
                  Migration results will appear here after running migrations.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {migrationResults.map(renderMigrationResult)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
