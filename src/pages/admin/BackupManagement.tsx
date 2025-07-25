import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useBackupManagement } from '@/hooks/useBackupManagement';
import { BackupConfigurationDialog } from '@/components/admin/BackupConfigurationDialog';
import { RestorePointManager } from '@/components/admin/RestorePointManager';
import { DisasterRecoveryPlan } from '@/components/admin/DisasterRecoveryPlan';
import { ComplianceSettings } from '@/components/admin/ComplianceSettings';
import { 
  Database, 
  HardDrive, 
  Shield, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Play,
  History,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import { formatBytes } from '@/lib/utils';

export const BackupManagement: React.FC = () => {
  const {
    configurations,
    jobs,
    restorePoints,
    recoveryPlans,
    backupStatus,
    loading,
    triggerManualBackup,
    fetchData
  } = useBackupManagement();
  
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500';
      case 'running':
        return 'bg-blue-500';
      case 'failed':
        return 'bg-red-500';
      case 'pending':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getBackupTypeIcon = (type: string) => {
    switch (type) {
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'storage':
        return <HardDrive className="h-4 w-4" />;
      case 'configuration':
        return <Shield className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const handleManualBackup = async (configId: string) => {
    try {
      await triggerManualBackup(configId);
    } catch (error) {
      console.error('Error triggering manual backup:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Backup & Disaster Recovery</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Backup & Disaster Recovery</h1>
          <p className="text-muted-foreground">
            Manage backups, restore points, and disaster recovery plans
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => fetchData()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowConfigDialog(true)}>
            <Shield className="h-4 w-4 mr-2" />
            New Configuration
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      {backupStatus && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Backups</p>
                  <p className="text-2xl font-bold">{backupStatus.total_backups}</p>
                </div>
                <Database className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">
                    {backupStatus.total_backups > 0 
                      ? Math.round((backupStatus.successful_backups / backupStatus.total_backups) * 100)
                      : 0}%
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
                  <p className="text-2xl font-bold">{backupStatus.total_size_gb} GB</p>
                </div>
                <HardDrive className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Failed Backups</p>
                  <p className="text-2xl font-bold text-red-500">{backupStatus.failed_backups}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="configurations">Configurations</TabsTrigger>
          <TabsTrigger value="jobs">Backup Jobs</TabsTrigger>
          <TabsTrigger value="restore">Restore Points</TabsTrigger>
          <TabsTrigger value="recovery">Recovery Plans</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Backup Jobs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Backup Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(job.status)}`} />
                        <div>
                          <p className="font-medium">{job.job_type} backup</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(job.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={job.status === 'completed' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                        {job.status === 'running' && (
                          <Progress value={job.progress_percentage} className="w-20 mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recovery Plans Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Recovery Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recoveryPlans.slice(0, 3).map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{plan.plan_name}</p>
                        <p className="text-sm text-muted-foreground">
                          RTO: {plan.recovery_time_objective || 'N/A'} min | 
                          RPO: {plan.recovery_point_objective || 'N/A'} min
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={plan.priority_level === 'critical' ? 'destructive' : 'default'}>
                          {plan.priority_level}
                        </Badge>
                        {plan.last_tested_at && (
                          <Badge variant="outline">
                            Last tested: {new Date(plan.last_tested_at).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configurations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup Configurations</CardTitle>
              <CardDescription>
                Manage automated backup schedules and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {configurations.map((config) => (
                  <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getBackupTypeIcon(config.backup_type)}
                      <div>
                        <p className="font-medium capitalize">{config.backup_type} Backup</p>
                        <p className="text-sm text-muted-foreground">
                          {config.frequency} | Retention: {config.retention_days} days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={config.is_enabled ? 'default' : 'secondary'}>
                        {config.is_enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      {config.encryption_enabled && (
                        <Badge variant="outline">Encrypted</Badge>
                      )}
                      <Button 
                        size="sm" 
                        onClick={() => handleManualBackup(config.id)}
                        disabled={!config.is_enabled}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Run Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup Jobs History</CardTitle>
              <CardDescription>
                View all backup job executions and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(job.status)}`} />
                      <div>
                        <p className="font-medium">{job.job_type} backup</p>
                        <p className="text-sm text-muted-foreground">
                          Started: {job.started_at ? new Date(job.started_at).toLocaleString() : 'Not started'}
                        </p>
                        {job.error_message && (
                          <p className="text-sm text-red-500 mt-1">{job.error_message}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={job.status === 'completed' ? 'default' : 'secondary'}>
                        {job.status}
                      </Badge>
                      {job.backup_size_bytes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatBytes(job.backup_size_bytes)}
                        </p>
                      )}
                      {job.status === 'running' && (
                        <Progress value={job.progress_percentage} className="w-32 mt-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restore" className="space-y-6">
          <RestorePointManager restorePoints={restorePoints} />
        </TabsContent>

        <TabsContent value="recovery" className="space-y-6">
          <DisasterRecoveryPlan plans={recoveryPlans} />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <ComplianceSettings />
        </TabsContent>
      </Tabs>

      <BackupConfigurationDialog 
        open={showConfigDialog}
        onOpenChange={setShowConfigDialog}
      />
    </div>
  );
};