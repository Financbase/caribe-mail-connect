/**
 * Multi-Tenant Dashboard Component
 * Story 1: Clear Product Shape - Multi-Tenant Architecture
 * 
 * Dashboard for managing multi-tenant configuration, monitoring resource usage,
 * and ensuring tenant isolation and compliance
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield,
  Users,
  Database,
  BarChart3,
  Settings,
  AlertTriangle,
  CheckCircle,
  Lock,
  Globe,
  Server,
  Activity,
  TrendingUp,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { MultiTenantService } from '@/services/multiTenant';
import type { TenantConfiguration, TenantUsage } from '@/services/multiTenant';

// =====================================================
// MULTI-TENANT DASHBOARD COMPONENT
// =====================================================

export function MultiTenantDashboard() {
  const { subscription } = useSubscription();
  
  const [tenantConfig, setTenantConfig] = useState<TenantConfiguration | null>(null);
  const [tenantAnalytics, setTenantAnalytics] = useState<any>(null);
  const [resourceCheck, setResourceCheck] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =====================================================
  // DATA LOADING
  // =====================================================

  const loadTenantData = async () => {
    if (!subscription?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const [config, analytics, usage] = await Promise.all([
        MultiTenantService.getTenantConfiguration(subscription.id),
        MultiTenantService.getTenantAnalytics(subscription.id),
        MultiTenantService.checkResourceUsage(subscription.id)
      ]);

      setTenantConfig(config);
      setTenantAnalytics(analytics);
      setResourceCheck(usage);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load tenant data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTenantData();
  }, [subscription?.id]);

  // =====================================================
  // RENDER HELPERS
  // =====================================================

  const renderResourceUsageCard = (
    title: string,
    current: number,
    limit: number,
    unit: string,
    icon: React.ReactNode
  ) => {
    const percentage = limit > 0 ? (current / limit) * 100 : 0;
    const isNearLimit = percentage > 80;
    const isOverLimit = percentage > 100;

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {icon}
              <span className="font-medium">{title}</span>
            </div>
            <Badge variant={isOverLimit ? 'destructive' : isNearLimit ? 'secondary' : 'default'}>
              {current.toLocaleString()} / {limit.toLocaleString()} {unit}
            </Badge>
          </div>
          <Progress 
            value={Math.min(percentage, 100)} 
            className={`h-2 ${isOverLimit ? 'bg-red-100' : isNearLimit ? 'bg-yellow-100' : 'bg-green-100'}`}
          />
          <p className="text-sm text-muted-foreground mt-2">
            {percentage.toFixed(1)}% utilized
          </p>
        </CardContent>
      </Card>
    );
  };

  const renderSecurityScore = (score: number) => {
    const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-green-600';
      if (score >= 60) return 'text-yellow-600';
      return 'text-red-600';
    };

    const getScoreLabel = (score: number) => {
      if (score >= 80) return 'Excellent';
      if (score >= 60) return 'Good';
      if (score >= 40) return 'Fair';
      return 'Poor';
    };

    return (
      <div className="flex items-center gap-2">
        <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
          {score}/100
        </div>
        <div>
          <p className="font-medium">{getScoreLabel(score)}</p>
          <p className="text-sm text-muted-foreground">Security Score</p>
        </div>
      </div>
    );
  };

  // =====================================================
  // MAIN RENDER
  // =====================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!tenantConfig) {
    return (
      <Alert>
        <AlertDescription>
          Tenant configuration not found. Please contact support.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Multi-Tenant Management</h1>
          <p className="text-muted-foreground">
            Tenant isolation, resource monitoring, and compliance management
          </p>
        </div>
        <Button
          onClick={loadTenantData}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Resource Violations Alert */}
      {resourceCheck && !resourceCheck.within_limits && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Resource Limits Exceeded:</strong>
            <ul className="mt-2 list-disc list-inside">
              {resourceCheck.violations.map((violation: string, index: number) => (
                <li key={index}>{violation}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resource Usage</TabsTrigger>
          <TabsTrigger value="security">Security & Compliance</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Tenant Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Tenant ID</span>
                </div>
                <p className="text-2xl font-bold">{tenantConfig.tenant_id}</p>
                <p className="text-sm text-muted-foreground">
                  Isolation: {tenantConfig.isolation_strategy.replace('_', ' ')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Data Residency</span>
                </div>
                <p className="text-2xl font-bold">{tenantConfig.data_residency.toUpperCase()}</p>
                <p className="text-sm text-muted-foreground">
                  {tenantConfig.compliance_requirements.length} compliance requirements
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Security</span>
                </div>
                {tenantAnalytics && renderSecurityScore(tenantAnalytics.security_score)}
              </CardContent>
            </Card>
          </div>

          {/* Resource Usage Overview */}
          {resourceCheck && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Resource Usage Overview
                </CardTitle>
                <CardDescription>
                  Current resource utilization against plan limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {renderResourceUsageCard(
                    'Users',
                    resourceCheck.usage.users_count,
                    resourceCheck.limits.max_users,
                    'users',
                    <Users className="h-4 w-4" />
                  )}
                  {renderResourceUsageCard(
                    'Customers',
                    resourceCheck.usage.customers_count,
                    resourceCheck.limits.max_customers,
                    'customers',
                    <Users className="h-4 w-4" />
                  )}
                  {renderResourceUsageCard(
                    'Storage',
                    resourceCheck.usage.storage_used_mb,
                    resourceCheck.limits.max_storage_mb,
                    'MB',
                    <Database className="h-4 w-4" />
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          {resourceCheck && (
            <>
              {/* Detailed Resource Usage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderResourceUsageCard(
                  'Users',
                  resourceCheck.usage.users_count,
                  resourceCheck.limits.max_users,
                  'users',
                  <Users className="h-4 w-4" />
                )}
                {renderResourceUsageCard(
                  'Customers',
                  resourceCheck.usage.customers_count,
                  resourceCheck.limits.max_customers,
                  'customers',
                  <Users className="h-4 w-4" />
                )}
                {renderResourceUsageCard(
                  'Packages',
                  resourceCheck.usage.packages_count,
                  resourceCheck.limits.max_packages,
                  'packages',
                  <Database className="h-4 w-4" />
                )}
                {renderResourceUsageCard(
                  'Storage',
                  resourceCheck.usage.storage_used_mb,
                  resourceCheck.limits.max_storage_mb,
                  'MB',
                  <Server className="h-4 w-4" />
                )}
                {renderResourceUsageCard(
                  'API Requests',
                  resourceCheck.usage.api_requests_count,
                  resourceCheck.limits.max_api_requests_per_hour,
                  'req/hr',
                  <Zap className="h-4 w-4" />
                )}
                {renderResourceUsageCard(
                  'Communications',
                  resourceCheck.usage.communications_sent,
                  resourceCheck.limits.max_communications_per_month,
                  'msgs/mo',
                  <Activity className="h-4 w-4" />
                )}
              </div>

              {/* Usage Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Usage Trends
                  </CardTitle>
                  <CardDescription>
                    Resource usage patterns and projections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Usage trend analysis would be displayed here with charts and projections.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Security & Compliance Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Two-Factor Authentication</span>
                  <Badge variant={tenantConfig.security_settings.enforce_2fa ? 'default' : 'secondary'}>
                    {tenantConfig.security_settings.enforce_2fa ? 'Enforced' : 'Optional'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Audit Logging</span>
                  <Badge variant={tenantConfig.security_settings.audit_logging_enabled ? 'default' : 'secondary'}>
                    {tenantConfig.security_settings.audit_logging_enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Data Encryption</span>
                  <Badge variant={tenantConfig.security_settings.data_encryption_at_rest ? 'default' : 'secondary'}>
                    {tenantConfig.security_settings.data_encryption_at_rest ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Session Timeout</span>
                  <Badge variant="outline">
                    {tenantConfig.security_settings.session_timeout_minutes} minutes
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tenantConfig.compliance_requirements.map((requirement) => (
                  <div key={requirement} className="flex items-center justify-between">
                    <span className="capitalize">{requirement.replace('_', ' ')}</span>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Compliant
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Tenant Configuration
              </CardTitle>
              <CardDescription>
                Advanced tenant settings and isolation configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Isolation Strategy</label>
                  <Badge variant="outline">{tenantConfig.isolation_strategy}</Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Data Residency</label>
                  <Badge variant="outline">{tenantConfig.data_residency}</Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Created</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(tenantConfig.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Updated</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(tenantConfig.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
