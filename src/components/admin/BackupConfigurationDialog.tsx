import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBackupManagement } from '@/hooks/useBackupManagement';
import { Shield, Database, HardDrive, Settings, Clock } from 'lucide-react';

interface BackupConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BackupConfigurationDialog: React.FC<BackupConfigurationDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { createConfiguration } = useBackupManagement();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    backup_type: 'database' as const,
    frequency: 'daily' as const,
    retention_days: 30,
    is_enabled: true,
    encryption_enabled: true,
    cross_region_enabled: false,
    target_region: '',
    schedule_time: '02:00',
    notification_emails: '',
    pre_backup_script: '',
    post_backup_script: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const configuration = {
        backup_type: formData.backup_type,
        frequency: formData.frequency,
        retention_days: formData.retention_days,
        is_enabled: formData.is_enabled,
        encryption_enabled: formData.encryption_enabled,
        cross_region_enabled: formData.cross_region_enabled,
        target_region: formData.target_region || null,
        backup_schedule: {
          time: formData.schedule_time,
          notification_emails: formData.notification_emails.split(',').map(e => e.trim()).filter(Boolean)
        },
        configuration: {
          pre_backup_script: formData.pre_backup_script,
          post_backup_script: formData.post_backup_script
        }
      };

      await createConfiguration(configuration);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error creating backup configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      backup_type: 'database',
      frequency: 'daily',
      retention_days: 30,
      is_enabled: true,
      encryption_enabled: true,
      cross_region_enabled: false,
      target_region: '',
      schedule_time: '02:00',
      notification_emails: '',
      pre_backup_script: '',
      post_backup_script: ''
    });
  };

  const getBackupTypeIcon = (type: string) => {
    switch (type) {
      case 'database':
        return <Database className="h-5 w-5" />;
      case 'storage':
        return <HardDrive className="h-5 w-5" />;
      case 'configuration':
        return <Settings className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Create Backup Configuration
          </DialogTitle>
          <DialogDescription>
            Set up automated backups with custom schedules and retention policies
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Configuration</CardTitle>
              <CardDescription>
                Define what to backup and how often
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backup_type">Backup Type</Label>
                  <Select 
                    value={formData.backup_type} 
                    onValueChange={(value: unknown) => setFormData(prev => ({ ...prev, backup_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="database">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          Database Only
                        </div>
                      </SelectItem>
                      <SelectItem value="storage">
                        <div className="flex items-center gap-2">
                          <HardDrive className="h-4 w-4" />
                          File Storage
                        </div>
                      </SelectItem>
                      <SelectItem value="configuration">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Configuration
                        </div>
                      </SelectItem>
                      <SelectItem value="full">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Full System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select 
                    value={formData.frequency} 
                    onValueChange={(value: unknown) => setFormData(prev => ({ ...prev, frequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Hourly
                        </div>
                      </SelectItem>
                      <SelectItem value="daily">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Daily
                        </div>
                      </SelectItem>
                      <SelectItem value="weekly">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Weekly
                        </div>
                      </SelectItem>
                      <SelectItem value="monthly">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Monthly
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="retention_days">Retention (Days)</Label>
                  <Input
                    id="retention_days"
                    type="number"
                    min="1"
                    max="365"
                    value={formData.retention_days}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      retention_days: parseInt(e.target.value) || 30 
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule_time">Schedule Time</Label>
                  <Input
                    id="schedule_time"
                    type="time"
                    value={formData.schedule_time}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      schedule_time: e.target.value 
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security & Compliance</CardTitle>
              <CardDescription>
                Configure encryption and compliance settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Backup</Label>
                  <p className="text-sm text-muted-foreground">
                    Activate this backup configuration
                  </p>
                </div>
                <Switch
                  checked={formData.is_enabled}
                  onCheckedChange={(checked) => setFormData(prev => ({ 
                    ...prev, 
                    is_enabled: checked 
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Encryption at Rest</Label>
                  <p className="text-sm text-muted-foreground">
                    Encrypt backup files using AES-256
                  </p>
                </div>
                <Switch
                  checked={formData.encryption_enabled}
                  onCheckedChange={(checked) => setFormData(prev => ({ 
                    ...prev, 
                    encryption_enabled: checked 
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cross-Region Replication</Label>
                  <p className="text-sm text-muted-foreground">
                    Replicate backups to another region
                  </p>
                </div>
                <Switch
                  checked={formData.cross_region_enabled}
                  onCheckedChange={(checked) => setFormData(prev => ({ 
                    ...prev, 
                    cross_region_enabled: checked 
                  }))}
                />
              </div>

              {formData.cross_region_enabled && (
                <div className="space-y-2">
                  <Label htmlFor="target_region">Target Region</Label>
                  <Select 
                    value={formData.target_region} 
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      target_region: value 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                      <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                      <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                      <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications & Scripts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notifications & Scripts</CardTitle>
              <CardDescription>
                Configure notifications and custom scripts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notification_emails">Notification Emails</Label>
                <Input
                  id="notification_emails"
                  placeholder="admin@company.com, backup@company.com"
                  value={formData.notification_emails}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    notification_emails: e.target.value 
                  }))}
                />
                <p className="text-sm text-muted-foreground">
                  Comma-separated email addresses for backup notifications
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pre_backup_script">Pre-Backup Script</Label>
                <Textarea
                  id="pre_backup_script"
                  placeholder="#!/bin/bash&#10;# Script to run before backup"
                  value={formData.pre_backup_script}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    pre_backup_script: e.target.value 
                  }))}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="post_backup_script">Post-Backup Script</Label>
                <Textarea
                  id="post_backup_script"
                  placeholder="#!/bin/bash&#10;# Script to run after backup"
                  value={formData.post_backup_script}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    post_backup_script: e.target.value 
                  }))}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Configuration'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};