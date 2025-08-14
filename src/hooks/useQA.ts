import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SystemHealthMetric {
  id: string;
  location_id?: string;
  metric_type: string;
  metric_value: number;
  threshold_warning?: number;
  threshold_critical?: number;
  status: 'normal' | 'warning' | 'critical';
  recorded_at: string;
}

export interface FailedProcess {
  id: string;
  location_id?: string;
  process_name: string;
  process_type: string;
  error_message?: string;
  error_details?: unknown;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  failed_at: string;
  resolved_at?: string;
  resolved_by?: string;
  resolution_notes?: string;
}

export interface UserErrorReport {
  id: string;
  user_id?: string;
  location_id?: string;
  error_type: string;
  title: string;
  description: string;
  steps_to_reproduce?: string;
  expected_behavior?: string;
  actual_behavior?: string;
  browser_info?: unknown;
  screenshot_urls?: string[];
  video_url?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'triaged' | 'in_progress' | 'resolved' | 'closed';
  assigned_to?: string;
  resolution_notes?: string;
  reported_at: string;
  resolved_at?: string;
}

export interface PerformanceMetric {
  id: string;
  location_id?: string;
  metric_type: string;
  endpoint_or_page?: string;
  response_time_ms?: number;
  memory_usage_mb?: number;
  error_rate?: number;
  throughput_per_second?: number;
  recorded_at: string;
}

export interface UserFeedback {
  id: string;
  user_id?: string;
  location_id?: string;
  feedback_type: 'bug_report' | 'feature_request' | 'improvement' | 'compliment' | 'complaint';
  title: string;
  description: string;
  category?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  page_url?: string;
  browser_info?: unknown;
  screenshot_urls?: string[];
  priority_score?: number;
  status: 'open' | 'reviewed' | 'in_progress' | 'completed' | 'rejected';
  assigned_to?: string;
  response?: string;
  satisfaction_rating?: number;
  responded_at?: string;
  created_at: string;
}

export interface TestCase {
  id: string;
  location_id?: string;
  title: string;
  description?: string;
  test_type: 'manual' | 'automated' | 'integration' | 'performance';
  category: 'functionality' | 'ui' | 'api' | 'database' | 'security';
  priority: 'low' | 'medium' | 'high' | 'critical';
  preconditions?: string;
  test_steps?: unknown[];
  expected_results?: string;
  automation_script?: string;
  tags?: string[];
  status: 'active' | 'deprecated' | 'draft';
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AutomatedTestRun {
  id: string;
  location_id?: string;
  test_suite_name: string;
  test_type: string;
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
  skipped_tests: number;
  execution_time_ms?: number;
  test_results?: unknown;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  started_at: string;
  completed_at?: string;
}

export interface DailyHealthReport {
  id: string;
  location_id?: string;
  report_date: string;
  overall_health_score: number;
  system_uptime_percentage?: number;
  error_count: number;
  performance_score?: number;
  user_satisfaction_score?: number;
  critical_issues_count: number;
  warnings_count: number;
  tests_passed_percentage?: number;
  anomalies_detected?: unknown[];
  recommendations?: unknown[];
  report_data?: unknown;
  generated_at: string;
}

export interface QAChecklist {
  id: string;
  location_id?: string;
  name: string;
  description?: string;
  checklist_type: 'deployment' | 'feature_release' | 'daily_checks' | 'security_audit';
  checklist_items: unknown[];
  is_template: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export const useQA = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch system health metrics
  const { 
    data: healthMetrics = [], 
    isLoading: isLoadingHealthMetrics,
    error: healthMetricsError 
  } = useQuery({
    queryKey: ['healthMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_health_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as SystemHealthMetric[];
    },
  });

  // Fetch failed processes
  const { 
    data: failedProcesses = [], 
    isLoading: isLoadingFailedProcesses,
    error: failedProcessesError 
  } = useQuery({
    queryKey: ['failedProcesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('failed_processes')
        .select('*')
        .order('failed_at', { ascending: false });
      
      if (error) throw error;
      return data as FailedProcess[];
    },
  });

  // Fetch user error reports
  const { 
    data: errorReports = [], 
    isLoading: isLoadingErrorReports,
    error: errorReportsError 
  } = useQuery({
    queryKey: ['errorReports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_error_reports')
        .select('*')
        .order('reported_at', { ascending: false });
      
      if (error) throw error;
      return data as UserErrorReport[];
    },
  });

  // Fetch performance metrics
  const { 
    data: performanceMetrics = [], 
    isLoading: isLoadingPerformanceMetrics,
    error: performanceMetricsError 
  } = useQuery({
    queryKey: ['performanceMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(1000);
      
      if (error) throw error;
      return data as PerformanceMetric[];
    },
  });

  // Fetch user feedback
  const { 
    data: userFeedback = [], 
    isLoading: isLoadingUserFeedback,
    error: userFeedbackError 
  } = useQuery({
    queryKey: ['userFeedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_feedback')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserFeedback[];
    },
  });

  // Fetch test cases
  const { 
    data: testCases = [], 
    isLoading: isLoadingTestCases,
    error: testCasesError 
  } = useQuery({
    queryKey: ['testCases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('test_cases')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as TestCase[];
    },
  });

  // Fetch automated test runs
  const { 
    data: testRuns = [], 
    isLoading: isLoadingTestRuns,
    error: testRunsError 
  } = useQuery({
    queryKey: ['testRuns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automated_test_runs')
        .select('*')
        .order('started_at', { ascending: false });
      
      if (error) throw error;
      return data as AutomatedTestRun[];
    },
  });

  // Fetch daily health reports
  const { 
    data: healthReports = [], 
    isLoading: isLoadingHealthReports,
    error: healthReportsError 
  } = useQuery({
    queryKey: ['healthReports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_health_reports')
        .select('*')
        .order('report_date', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data as DailyHealthReport[];
    },
  });

  // Fetch QA checklists
  const { 
    data: qaChecklists = [], 
    isLoading: isLoadingQAChecklists,
    error: qaChecklistsError 
  } = useQuery({
    queryKey: ['qaChecklists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('qa_checklists')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as QAChecklist[];
    },
  });

  // Create user feedback
  const createFeedbackMutation = useMutation({
    mutationFn: async (feedback: Omit<UserFeedback, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('user_feedback')
        .insert([feedback])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userFeedback'] });
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create error report
  const createErrorReportMutation = useMutation({
    mutationFn: async (report: Omit<UserErrorReport, 'id' | 'reported_at' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('user_error_reports')
        .insert([report])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['errorReports'] });
      toast({
        title: "Error report submitted",
        description: "Thank you for reporting this issue!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit error report. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update error report status
  const updateErrorReportMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<UserErrorReport> }) => {
      const { data, error } = await supabase
        .from('user_error_reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['errorReports'] });
      toast({
        title: "Success",
        description: "Error report updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update error report",
        variant: "destructive",
      });
    },
  });

  // Create test case
  const createTestCaseMutation = useMutation({
    mutationFn: async (testCase: Omit<TestCase, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('test_cases')
        .insert([testCase])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testCases'] });
      toast({
        title: "Success",
        description: "Test case created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create test case",
        variant: "destructive",
      });
    },
  });

  return {
    // Data
    healthMetrics,
    failedProcesses,
    errorReports,
    performanceMetrics,
    userFeedback,
    testCases,
    testRuns,
    healthReports,
    qaChecklists,

    // Loading states
    isLoadingHealthMetrics,
    isLoadingFailedProcesses,
    isLoadingErrorReports,
    isLoadingPerformanceMetrics,
    isLoadingUserFeedback,
    isLoadingTestCases,
    isLoadingTestRuns,
    isLoadingHealthReports,
    isLoadingQAChecklists,

    // Mutations
    createFeedback: createFeedbackMutation.mutate,
    createErrorReport: createErrorReportMutation.mutate,
    updateErrorReport: updateErrorReportMutation.mutate,
    createTestCase: createTestCaseMutation.mutate,

    // Mutation states
    isCreatingFeedback: createFeedbackMutation.isPending,
    isCreatingErrorReport: createErrorReportMutation.isPending,
    isUpdatingErrorReport: updateErrorReportMutation.isPending,
    isCreatingTestCase: createTestCaseMutation.isPending,
  };
};