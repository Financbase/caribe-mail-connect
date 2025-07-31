import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ServiceMetrics {
  id: string;
  location_id?: string;
  overall_score: number;
  complaint_resolution_rate: number;
  avg_response_time_minutes: number;
  customer_satisfaction_score: number;
  service_quality_score: number;
  process_efficiency_score: number;
  error_rate: number;
  recorded_at: string;
}

export interface CustomerComplaint {
  id: string;
  customer_id?: string;
  location_id?: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  assigned_to?: string;
  resolution_notes?: string;
  satisfaction_rating?: number;
  created_at: string;
  resolved_at?: string;
}

export interface ComplianceScore {
  id: string;
  location_id?: string;
  process: string;
  description: string;
  score: number;
  target_score: number;
  audit_date: string;
  next_audit_date: string;
  auditor?: string;
  notes?: string;
}

export interface ImprovementInitiative {
  id: string;
  location_id?: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  progress: number;
  impact_score?: number;
  start_date: string;
  due_date: string;
  completed_date?: string;
  assigned_to?: string;
  budget?: number;
  actual_cost?: number;
}

export interface QualityTrend {
  id: string;
  metric: string;
  current_value: number;
  previous_value: number;
  change_percentage: number;
  direction: 'up' | 'down';
  period: string;
  recorded_at: string;
}

export interface ErrorRate {
  id: string;
  category: string;
  description: string;
  rate: number;
  count: number;
  total_attempts: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recorded_at: string;
}

export interface CustomerSatisfaction {
  id: string;
  location_id?: string;
  overall_score: number;
  service_quality_score: number;
  communication_score: number;
  timeliness_score: number;
  professionalism_score: number;
  value_score: number;
  total_responses: number;
  period: string;
  recorded_at: string;
}

export const useServiceQuality = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch service metrics
  const { 
    data: serviceMetrics = {} as ServiceMetrics, 
    isLoading: isLoadingServiceMetrics,
    error: serviceMetricsError 
  } = useQuery({
    queryKey: ['serviceMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data as ServiceMetrics;
    },
  });

  // Fetch customer complaints
  const { 
    data: customerComplaints = [], 
    isLoading: isLoadingCustomerComplaints,
    error: customerComplaintsError 
  } = useQuery({
    queryKey: ['customerComplaints'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_complaints')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CustomerComplaint[];
    },
  });

  // Fetch compliance scores
  const { 
    data: complianceScores = [], 
    isLoading: isLoadingComplianceScores,
    error: complianceScoresError 
  } = useQuery({
    queryKey: ['complianceScores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compliance_scores')
        .select('*')
        .order('audit_date', { ascending: false });
      
      if (error) throw error;
      return data as ComplianceScore[];
    },
  });

  // Fetch improvement initiatives
  const { 
    data: improvementInitiatives = [], 
    isLoading: isLoadingImprovementInitiatives,
    error: improvementInitiativesError 
  } = useQuery({
    queryKey: ['improvementInitiatives'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('improvement_initiatives')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ImprovementInitiative[];
    },
  });

  // Fetch quality trends
  const { 
    data: qualityTrends = [], 
    isLoading: isLoadingQualityTrends,
    error: qualityTrendsError 
  } = useQuery({
    queryKey: ['qualityTrends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quality_trends')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as QualityTrend[];
    },
  });

  // Fetch error rates
  const { 
    data: errorRates = [], 
    isLoading: isLoadingErrorRates,
    error: errorRatesError 
  } = useQuery({
    queryKey: ['errorRates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_rates')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data as ErrorRate[];
    },
  });

  // Fetch customer satisfaction
  const { 
    data: customerSatisfaction = {} as CustomerSatisfaction, 
    isLoading: isLoadingCustomerSatisfaction,
    error: customerSatisfactionError 
  } = useQuery({
    queryKey: ['customerSatisfaction'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_satisfaction')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data as CustomerSatisfaction;
    },
  });

  // Create customer complaint
  const createComplaintMutation = useMutation({
    mutationFn: async (complaint: Omit<CustomerComplaint, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('customer_complaints')
        .insert([complaint])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerComplaints'] });
      toast({
        title: "Complaint submitted",
        description: "Thank you for your feedback. We'll address this promptly.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit complaint. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update complaint status
  const updateComplaintMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CustomerComplaint> }) => {
      const { data, error } = await supabase
        .from('customer_complaints')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerComplaints'] });
      toast({
        title: "Success",
        description: "Complaint updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update complaint",
        variant: "destructive",
      });
    },
  });

  // Create improvement initiative
  const createInitiativeMutation = useMutation({
    mutationFn: async (initiative: Omit<ImprovementInitiative, 'id'>) => {
      const { data, error } = await supabase
        .from('improvement_initiatives')
        .insert([initiative])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['improvementInitiatives'] });
      toast({
        title: "Success",
        description: "Improvement initiative created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create improvement initiative",
        variant: "destructive",
      });
    },
  });

  // Update initiative progress
  const updateInitiativeMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ImprovementInitiative> }) => {
      const { data, error } = await supabase
        .from('improvement_initiatives')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['improvementInitiatives'] });
      toast({
        title: "Success",
        description: "Initiative updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update initiative",
        variant: "destructive",
      });
    },
  });

  return {
    // Data
    serviceMetrics,
    customerComplaints,
    complianceScores,
    improvementInitiatives,
    qualityTrends,
    errorRates,
    customerSatisfaction,

    // Loading states
    isLoadingServiceMetrics,
    isLoadingCustomerComplaints,
    isLoadingComplianceScores,
    isLoadingImprovementInitiatives,
    isLoadingQualityTrends,
    isLoadingErrorRates,
    isLoadingCustomerSatisfaction,

    // Mutations
    createComplaint: createComplaintMutation.mutate,
    updateComplaint: updateComplaintMutation.mutate,
    createInitiative: createInitiativeMutation.mutate,
    updateInitiative: updateInitiativeMutation.mutate,

    // Mutation states
    isCreatingComplaint: createComplaintMutation.isPending,
    isUpdatingComplaint: updateComplaintMutation.isPending,
    isCreatingInitiative: createInitiativeMutation.isPending,
    isUpdatingInitiative: updateInitiativeMutation.isPending,
  };
}; 