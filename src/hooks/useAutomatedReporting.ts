import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ReportSchedule {
  id: string;
  name: string;
  description: string;
  report_type: 'compliance' | 'quality' | 'mystery_shopper' | 'continuous_improvement' | 'custom';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  is_active: boolean;
  last_generated?: string;
  next_generation?: string;
  created_at: string;
  updated_at: string;
}

export interface ReportExecution {
  id: string;
  schedule_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  file_url?: string;
  file_size?: number;
  error_message?: string;
  started_at: string;
  completed_at?: string;
  created_at: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  template_type: 'compliance' | 'quality' | 'mystery_shopper' | 'continuous_improvement';
  sections: string[];
  filters: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useAutomatedReporting = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch report schedules
  const { data: reportSchedules = [], isLoading: isLoadingSchedules } = useQuery({
    queryKey: ['report-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_schedules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch report executions
  const { data: reportExecutions = [], isLoading: isLoadingExecutions } = useQuery({
    queryKey: ['report-executions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_executions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch report templates
  const { data: reportTemplates = [], isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['report-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create report schedule
  const createScheduleMutation = useMutation({
    mutationFn: async (schedule: Omit<ReportSchedule, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('report_schedules')
        .insert([schedule])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-schedules'] });
      toast({
        title: "Report schedule created",
        description: "The automated report schedule has been created successfully.",
      });
    }
  });

  // Update report schedule
  const updateScheduleMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ReportSchedule> }) => {
      const { data, error } = await supabase
        .from('report_schedules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-schedules'] });
      toast({
        title: "Report schedule updated",
        description: "The automated report schedule has been updated successfully.",
      });
    }
  });

  // Generate report manually
  const generateReportMutation = useMutation({
    mutationFn: async ({ scheduleId, format }: { scheduleId: string; format: 'pdf' | 'excel' | 'csv' }) => {
      const { data, error } = await supabase
        .from('report_executions')
        .insert([{
          schedule_id: scheduleId,
          status: 'pending',
          started_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-executions'] });
      toast({
        title: "Report generation started",
        description: "Your report is being generated. You'll be notified when it's ready.",
      });
    }
  });

  // Create report template
  const createTemplateMutation = useMutation({
    mutationFn: async (template: Omit<ReportTemplate, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('report_templates')
        .insert([template])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-templates'] });
      toast({
        title: "Report template created",
        description: "The report template has been created successfully.",
      });
    }
  });

  // Generate compliance report data
  const generateComplianceReport = async (startDate: string, endDate: string) => {
    const { data: checklist, error: checklistError } = await supabase
      .from('compliance_checklist')
      .select('*')
      .gte('due_date', startDate)
      .lte('due_date', endDate);

    const { data: audits, error: auditsError } = await supabase
      .from('self_audits')
      .select('*')
      .gte('audit_date', startDate)
      .lte('audit_date', endDate);

    const { data: actions, error: actionsError } = await supabase
      .from('corrective_actions')
      .select('*')
      .gte('due_date', startDate)
      .lte('due_date', endDate);

    if (checklistError || auditsError || actionsError) {
      throw new Error('Failed to fetch compliance data');
    }

    return {
      checklist,
      audits,
      actions,
      summary: {
        totalItems: checklist.length,
        completedItems: checklist.filter(item => item.status === 'completed').length,
        overdueItems: checklist.filter(item => 
          item.status !== 'completed' && new Date(item.due_date) < new Date()
        ).length,
        averageAuditScore: audits.length > 0 
          ? audits.reduce((acc, audit) => acc + (audit.score || 0), 0) / audits.length 
          : 0,
        openActions: actions.filter(action => action.status !== 'completed').length
      }
    };
  };

  // Generate quality report data
  const generateQualityReport = async (startDate: string, endDate: string) => {
    const { data: qualityChecks, error: checksError } = await supabase
      .from('quality_checks')
      .select('*')
      .gte('performed_at', startDate)
      .lte('performed_at', endDate);

    const { data: mysteryShopper, error: shopperError } = await supabase
      .from('mystery_shopper_evaluations')
      .select('*')
      .gte('evaluation_date', startDate)
      .lte('evaluation_date', endDate);

    if (checksError || shopperError) {
      throw new Error('Failed to fetch quality data');
    }

    return {
      qualityChecks,
      mysteryShopper,
      summary: {
        totalChecks: qualityChecks.length,
        passedChecks: qualityChecks.filter(check => check.status === 'passed').length,
        passRate: qualityChecks.length > 0 
          ? (qualityChecks.filter(check => check.status === 'passed').length / qualityChecks.length) * 100 
          : 0,
        averageScore: qualityChecks.length > 0 
          ? qualityChecks.reduce((acc, check) => acc + (check.score || 0), 0) / qualityChecks.length 
          : 0,
        mysteryShopperEvaluations: mysteryShopper.length,
        averageMysteryShopperScore: mysteryShopper.length > 0 
          ? mysteryShopper.reduce((acc, eval) => acc + (eval.overall_score || 0), 0) / mysteryShopper.length 
          : 0
      }
    };
  };

  // Get active schedules
  const activeSchedules = reportSchedules.filter(schedule => schedule.is_active);

  // Get recent executions
  const recentExecutions = reportExecutions.slice(0, 10);

  // Get failed executions
  const failedExecutions = reportExecutions.filter(execution => execution.status === 'failed');

  return {
    // Data
    reportSchedules,
    reportExecutions,
    reportTemplates,
    activeSchedules,
    recentExecutions,
    failedExecutions,
    
    // Loading states
    isLoadingSchedules,
    isLoadingExecutions,
    isLoadingTemplates,
    
    // Mutations
    createSchedule: createScheduleMutation.mutate,
    updateSchedule: updateScheduleMutation.mutate,
    generateReport: generateReportMutation.mutate,
    createTemplate: createTemplateMutation.mutate,
    
    // Report generation functions
    generateComplianceReport,
    generateQualityReport,
    
    // Mutation loading states
    isCreatingSchedule: createScheduleMutation.isPending,
    isUpdatingSchedule: updateScheduleMutation.isPending,
    isGeneratingReport: generateReportMutation.isPending,
    isCreatingTemplate: createTemplateMutation.isPending,
  };
}; 