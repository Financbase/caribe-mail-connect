import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AriaInput } from '@/components/ui/aria-components';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useBackupManagement, RestorePoint } from '@/hooks/useBackupManagement';
import { 
  Download, 
  Trash2, 
  TestTube, 
  RotateCcw, 
  Shield, 
  Clock,
  Database,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { formatBytes, formatDate } from '@/lib/utils';

interface RestorePointManagerProps {
  restorePoints: RestorePoint[];
}

export const RestorePointManager: React.FC<RestorePointManagerProps> = ({
  restorePoints
}) => {
  const { testRestore, performRestore, recoveryPlans } = useBackupManagement();
  const [selectedPoint, setSelectedPoint] = useState<RestorePoint | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [restoreType, setRestoreType] = useState<'test' | 'actual'>('test');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredPoints = restorePoints.filter(point => {
    const matchesSearch = point.restore_point_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         point.backup_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || point.backup_type === filterType;
    return matchesSearch && matchesType && point.is_available;
  });

  const handleRestoreConfirm = async () => {
    if (!selectedPoint || !selectedPlan) return;

    try {
      if (restoreType === 'test') {
        await testRestore(selectedPoint.id, selectedPlan);
      } else {
        await performRestore(selectedPoint.id, selectedPlan);
      }
      setShowRestoreDialog(false);
      setSelectedPoint(null);
      setSelectedPlan('');
    } catch (error) {
      console.error('Error performing restore:', error);
    }
  };

  const initiateRestore = (point: RestorePoint, type: 'test' | 'actual') => {
    setSelectedPoint(point);
    setRestoreType(type);
    setShowRestoreDialog(true);
  };

  const getBackupTypeIcon = (type: string) => {
    switch (type) {
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'storage':
        return <Download className="h-4 w-4" />;
      case 'configuration':
        return <Shield className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Restore Point Management
          </CardTitle>
          <CardDescription>
            Manage backup restore points and perform system recovery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <AriaInput
              label="Search restore points"
              placeholder="Search restore points..."
              value={searchTerm}
              onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
              className="max-w-sm"
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48" aria-label="Filter by backup type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="storage">Storage</SelectItem>
                <SelectItem value="configuration">Configuration</SelectItem>
                <SelectItem value="full">Full System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Restore Points List */}
          <div className="space-y-4" role="list" aria-label="Restore points list">
            {filteredPoints.map((point) => (
              <div
                key={point.id}
                className="border rounded-lg p-4"
                tabIndex={0}
                role="listitem"
                aria-label={`Restore point ${point.restore_point_name}, type ${point.backup_type}, ${point.data_integrity_verified ? 'verified' : 'unverified'}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    const btn = (e.currentTarget as HTMLElement).querySelector<HTMLButtonElement>('button[data-action="test-restore"]')
                    btn?.focus()
                    e.preventDefault()
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getBackupTypeIcon(point.backup_type)}
                    <div>
                      <h3 className="font-medium">{point.restore_point_name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(point.timestamp)}
                        </span>
                        {point.size_bytes && (
                          <span>{formatBytes(point.size_bytes)}</span>
                        )}
                        <span className="capitalize">{point.backup_type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {point.data_integrity_verified ? (
                      <Badge variant="default" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Unverified
                      </Badge>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => initiateRestore(point, 'test')}
                      data-action="test-restore"
                      aria-label={`Test restore ${point.restore_point_name}`}
                    >
                      <TestTube className="h-4 w-4 mr-2" />
                      Test Restore
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => initiateRestore(point, 'actual')}
                      aria-label={`Restore ${point.restore_point_name}`}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restore
                    </Button>
                  </div>
                </div>

                {point.metadata && Object.keys(point.metadata).length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground">
                      Additional metadata available
                    </p>
                  </div>
                )}
              </div>
            ))}

            {filteredPoints.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <RotateCcw className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No restore points found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {restoreType === 'test' ? 'Confirm Test Restore' : 'Confirm System Restore'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {restoreType === 'test' ? (
                <>
                  You are about to perform a test restore of "{selectedPoint?.restore_point_name}". 
                  This will not affect your production system.
                </>
              ) : (
                <>
                  <strong>WARNING:</strong> You are about to restore your system to "{selectedPoint?.restore_point_name}". 
                  This will overwrite current data and may cause temporary downtime.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <label className="text-sm font-medium">Select Recovery Plan:</label>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a recovery plan" />
              </SelectTrigger>
              <SelectContent>
                {recoveryPlans
                  .filter(plan => plan.is_active)
                  .map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.plan_name} ({plan.plan_type})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreConfirm}
              disabled={!selectedPlan}
              className={restoreType === 'actual' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {restoreType === 'test' ? 'Start Test' : 'Begin Restore'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};