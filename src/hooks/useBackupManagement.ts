import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BackupConfiguration {
  id: string;
  location_id?: string;
  backup_type: string;
  frequency: string;
  retention_days: number;
  is_enabled: boolean;
  encryption_enabled: boolean;
  cross_region_enabled: boolean;
  target_region?: string;
  backup_schedule: any;
  configuration: any;
  created_at: string;
  updated_at: string;
}

export interface BackupJob {
  id: string;
  configuration_id: string;
  job_type: string;
  status: string;
  started_at?: string;
  completed_at?: string;
  backup_size_bytes?: number;
  backup_location?: string;
  progress_percentage: number;
  error_message?: string;
  created_at: string;
}

export interface RestorePoint {
  id: string;
  backup_job_id: string;
  restore_point_name: string;
  timestamp: string;
  backup_type: string;
  data_integrity_verified: boolean;
  is_available: boolean;
  size_bytes?: number;
  location_path?: string;
  metadata?: any;
  created_at: string;
}

export interface DisasterRecoveryPlan {
  id: string;
  plan_name: string;
  location_id?: string;
  plan_type: string;
  priority_level: string;
  recovery_time_objective?: number;
  recovery_point_objective?: number;
  automated_execution: boolean;
  plan_steps: any[];
  emergency_contacts: any[];
  last_tested_at?: string;
  is_active: boolean;
  created_at: string;
}

export interface BackupStatus {
  total_backups: number;
  successful_backups: number;
  failed_backups: number;
  total_size_gb: number;
  oldest_backup?: string;
  latest_backup?: string;
}

export const useBackupManagement = () => {
  const [configurations, setConfigurations] = useState<BackupConfiguration[]>([]);
  const [jobs, setJobs] = useState<BackupJob[]>([]);
  const [restorePoints, setRestorePoints] = useState<RestorePoint[]>([]);
  const [recoveryPlans, setRecoveryPlans] = useState<DisasterRecoveryPlan[]>([]);
  const [backupStatus, setBackupStatus] = useState<BackupStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchConfigurations(),
        fetchJobs(),
        fetchRestorePoints(),
        fetchRecoveryPlans(),
        fetchBackupStatus()
      ]);
    } catch (error) {
      console.error('Error fetching backup data:', error);
      toast({
        title: "Error",
        description: "Failed to load backup data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchConfigurations = async () => {
    const { data, error } = await supabase
      .from('backup_configurations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setConfigurations(data || []);
  };

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('backup_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    setJobs(data || []);
  };

  const fetchRestorePoints = async () => {
    const { data, error } = await supabase
      .from('restore_points')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;
    setRestorePoints(data || []);
  };

  const fetchRecoveryPlans = async () => {
    const { data, error } = await supabase
      .from('disaster_recovery_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setRecoveryPlans(data || []);
  };

  const fetchBackupStatus = async () => {
    const { data, error } = await supabase
      .rpc('get_backup_status');

    if (error) throw error;
    if (data && data.length > 0) {
      setBackupStatus(data[0]);
    }
  };

  const createConfiguration = async (config: any) => {
    const { data, error } = await supabase
      .from('backup_configurations')
      .insert([config])
      .select()
      .single();

    if (error) throw error;
    
    setConfigurations(prev => [data, ...prev]);
    toast({
      title: "Success",
      description: "Backup configuration created successfully"
    });
    
    return data;
  };

  const updateConfiguration = async (id: string, updates: Partial<BackupConfiguration>) => {
    const { data, error } = await supabase
      .from('backup_configurations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    setConfigurations(prev => prev.map(config => 
      config.id === id ? { ...config, ...data } : config
    ));
    
    toast({
      title: "Success",
      description: "Backup configuration updated successfully"
    });
    
    return data;
  };

  const triggerManualBackup = async (configurationId: string) => {
    const { data, error } = await supabase
      .rpc('schedule_backup', {
        p_configuration_id: configurationId,
        p_job_type: 'manual'
      });

    if (error) throw error;
    
    // Trigger the actual backup process via edge function
    const { error: functionError } = await supabase.functions.invoke('run-backup', {
      body: { jobId: data, configurationId }
    });

    if (functionError) throw functionError;
    
    toast({
      title: "Success",
      description: "Manual backup initiated successfully"
    });
    
    fetchJobs(); // Refresh jobs list
    return data;
  };

  const testRestore = async (restorePointId: string, planId: string) => {
    const { data, error } = await supabase
      .from('recovery_executions')
      .insert([{
        plan_id: planId,
        restore_point_id: restorePointId,
        execution_type: 'test'
      }])
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Test restore initiated successfully"
    });
    
    return data;
  };

  const performRestore = async (restorePointId: string, planId: string) => {
    const { data, error } = await supabase
      .from('recovery_executions')
      .insert([{
        plan_id: planId,
        restore_point_id: restorePointId,
        execution_type: 'actual'
      }])
      .select()
      .single();

    if (error) throw error;
    
    // Trigger the actual restore process via edge function
    const { error: functionError } = await supabase.functions.invoke('execute-restore', {
      body: { executionId: data.id, restorePointId, planId }
    });

    if (functionError) throw functionError;
    
    toast({
      title: "Warning",
      description: "Restore operation initiated. System may be temporarily unavailable.",
      variant: "destructive"
    });
    
    return data;
  };

  const scheduleRecoveryDrill = async (planId: string) => {
    const { data, error } = await supabase
      .from('recovery_executions')
      .insert([{
        plan_id: planId,
        execution_type: 'drill'
      }])
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Recovery drill scheduled successfully"
    });
    
    return data;
  };

  const createRecoveryPlan = async (plan: Partial<DisasterRecoveryPlan>) => {
    const { data, error } = await supabase
      .from('disaster_recovery_plans')
      .insert([plan])
      .select()
      .single();

    if (error) throw error;
    
    setRecoveryPlans(prev => [data, ...prev]);
    toast({
      title: "Success",
      description: "Disaster recovery plan created successfully"
    });
    
    return data;
  };

  const updateRecoveryPlan = async (id: string, updates: Partial<DisasterRecoveryPlan>) => {
    const { data, error } = await supabase
      .from('disaster_recovery_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    setRecoveryPlans(prev => prev.map(plan => 
      plan.id === id ? { ...plan, ...data } : plan
    ));
    
    toast({
      title: "Success",
      description: "Disaster recovery plan updated successfully"
    });
    
    return data;
  };

  return {
    configurations,
    jobs,
    restorePoints,
    recoveryPlans,
    backupStatus,
    loading,
    fetchData,
    createConfiguration,
    updateConfiguration,
    triggerManualBackup,
    testRestore,
    performRestore,
    scheduleRecoveryDrill,
    createRecoveryPlan,
    updateRecoveryPlan
  };
};