import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'operational' | 'financial' | 'compliance';
  category: string;
  template_config: any;
  default_parameters: any;
  required_roles: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  name: string;
  description: string;
  type: 'operational' | 'financial' | 'compliance' | 'custom';
  category: string;
  query_config: any;
  visualization_config: any;
  filters: any;
  parameters: any;
  is_public: boolean;
  is_system: boolean;
  location_id: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReportSchedule {
  id: string;
  report_id: string;
  name: string;
  schedule_type: 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  schedule_config: any;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  is_active: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
  location_id: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReportExecution {
  id: string;
  report_id: string;
  schedule_id: string | null;
  status: 'running' | 'completed' | 'failed';
  parameters: any;
  result_data: any;
  file_url: string | null;
  error_message: string | null;
  execution_time_ms: number | null;
  row_count: number | null;
  executed_by: string | null;
  executed_at: string;
  completed_at: string | null;
}

export function useReports() {
  const queryClient = useQueryClient();

  // Fetch report templates
  const {
    data: reportTemplates,
    isLoading: templatesLoading,
    error: templatesError,
  } = useQuery({
    queryKey: ['reportTemplates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_templates')
        .select('*')
        .eq('is_active', true)
        .order('type', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as ReportTemplate[];
    },
  });

  // Fetch custom reports
  const {
    data: reports,
    isLoading: reportsLoading,
    error: reportsError,
  } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Report[];
    },
  });

  // Fetch report schedules
  const {
    data: reportSchedules,
    isLoading: schedulesLoading,
    error: schedulesError,
  } = useQuery({
    queryKey: ['reportSchedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_schedules')
        .select('*, reports(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as (ReportSchedule & { reports: { name: string } })[];
    },
  });

  // Fetch report executions
  const {
    data: reportExecutions,
    isLoading: executionsLoading,
    error: executionsError,
  } = useQuery({
    queryKey: ['reportExecutions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_executions')
        .select('*, reports(name)')
        .order('executed_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as (ReportExecution & { reports: { name: string } })[];
    },
  });

  // Create report mutation
  const createReportMutation = useMutation({
    mutationFn: async (reportData: Omit<Report, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('reports')
        .insert([reportData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: 'Report created',
        description: 'The report has been created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating report',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update report mutation
  const updateReportMutation = useMutation({
    mutationFn: async ({ id, ...reportData }: Partial<Report> & { id: string }) => {
      const { data, error } = await supabase
        .from('reports')
        .update(reportData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: 'Report updated',
        description: 'The report has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating report',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete report mutation
  const deleteReportMutation = useMutation({
    mutationFn: async (reportId: string) => {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: 'Report deleted',
        description: 'The report has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting report',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Create schedule mutation
  const createScheduleMutation = useMutation({
    mutationFn: async (scheduleData: Omit<ReportSchedule, 'id' | 'created_at' | 'updated_at' | 'last_run_at' | 'next_run_at'>) => {
      const { data, error } = await supabase
        .from('report_schedules')
        .insert([scheduleData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportSchedules'] });
      toast({
        title: 'Schedule created',
        description: 'The report schedule has been created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating schedule',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Execute report mutation
  const executeReportMutation = useMutation({
    mutationFn: async ({ reportId, parameters }: { reportId: string; parameters?: any }) => {
      const { data, error } = await supabase.functions.invoke('execute-report', {
        body: { reportId, parameters },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportExecutions'] });
      toast({
        title: 'Report executed',
        description: 'The report has been executed successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error executing report',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    // Data
    reportTemplates: reportTemplates || [],
    reports: reports || [],
    reportSchedules: reportSchedules || [],
    reportExecutions: reportExecutions || [],

    // Loading states
    templatesLoading,
    reportsLoading,
    schedulesLoading,
    executionsLoading,

    // Error states
    templatesError,
    reportsError,
    schedulesError,
    executionsError,

    // Actions
    createReport: createReportMutation.mutate,
    updateReport: updateReportMutation.mutate,
    deleteReport: deleteReportMutation.mutate,
    createSchedule: createScheduleMutation.mutate,
    executeReport: executeReportMutation.mutate,

    // Pending states
    isCreatingReport: createReportMutation.isPending,
    isUpdatingReport: updateReportMutation.isPending,
    isDeletingReport: deleteReportMutation.isPending,
    isCreatingSchedule: createScheduleMutation.isPending,
    isExecutingReport: executeReportMutation.isPending,
  };
}