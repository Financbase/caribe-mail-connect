import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MysteryShopperEvaluation {
  id: string;
  evaluation_id: string;
  location_id?: string;
  location_name: string;
  shopper_id?: string;
  shopper_name: string;
  scheduled_date: string;
  completed_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  overall_score?: number;
  customer_service_score?: number;
  package_handling_score?: number;
  communication_score?: number;
  professionalism_score?: number;
  notes?: string;
  recommendations?: string;
  created_at: string;
}

export interface ScoringRubric {
  id: string;
  category: string;
  max_score: number;
  criteria: {
    description: string;
    points: number;
  }[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EvaluationReport {
  id: string;
  report_title: string;
  report_type: string;
  status: 'draft' | 'published' | 'archived';
  evaluation_count: number;
  average_score: number;
  date_range_start: string;
  date_range_end: string;
  generated_date: string;
  generated_by?: string;
  report_data?: any;
  download_url?: string;
}

export interface TrendAnalysis {
  id: string;
  metric: string;
  current_value: number;
  previous_value: number;
  change_percentage: number;
  trend: 'improving' | 'declining' | 'stable';
  period: string;
  location_id?: string;
  recorded_at: string;
}

export interface RewardSystem {
  id: string;
  reward_name: string;
  reward_type: 'bonus' | 'certificate' | 'gift_card' | 'recognition';
  reward_value: number;
  criteria: string;
  status: 'active' | 'inactive' | 'expired';
  recipient_count: number;
  max_recipients?: number;
  start_date: string;
  end_date?: string;
  created_at: string;
}

export const useMysteryShopper = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch mystery shopper evaluations
  const { 
    data: mysteryShopperEvaluations = [], 
    isLoading: isLoadingEvaluations,
    error: evaluationsError 
  } = useQuery({
    queryKey: ['mysteryShopperEvaluations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mystery_shopper_evaluations')
        .select('*')
        .order('scheduled_date', { ascending: false });
      
      if (error) throw error;
      return data as MysteryShopperEvaluation[];
    },
  });

  // Fetch scoring rubrics
  const { 
    data: scoringRubrics = [], 
    isLoading: isLoadingRubrics,
    error: rubricsError 
  } = useQuery({
    queryKey: ['scoringRubrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scoring_rubrics')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ScoringRubric[];
    },
  });

  // Fetch evaluation reports
  const { 
    data: evaluationReports = [], 
    isLoading: isLoadingReports,
    error: reportsError 
  } = useQuery({
    queryKey: ['evaluationReports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('evaluation_reports')
        .select('*')
        .order('generated_date', { ascending: false });
      
      if (error) throw error;
      return data as EvaluationReport[];
    },
  });

  // Fetch trend analysis
  const { 
    data: trendAnalysis = [], 
    isLoading: isLoadingTrends,
    error: trendsError 
  } = useQuery({
    queryKey: ['trendAnalysis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trend_analysis')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as TrendAnalysis[];
    },
  });

  // Fetch reward system
  const { 
    data: rewardSystem = [], 
    isLoading: isLoadingRewards,
    error: rewardsError 
  } = useQuery({
    queryKey: ['rewardSystem'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reward_system')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as RewardSystem[];
    },
  });

  // Create evaluation
  const createEvaluationMutation = useMutation({
    mutationFn: async (evaluation: Omit<MysteryShopperEvaluation, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('mystery_shopper_evaluations')
        .insert([evaluation])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mysteryShopperEvaluations'] });
      toast({
        title: "Success",
        description: "Mystery shopper evaluation scheduled successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to schedule evaluation",
        variant: "destructive",
      });
    },
  });

  // Update evaluation
  const updateEvaluationMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MysteryShopperEvaluation> }) => {
      const { data, error } = await supabase
        .from('mystery_shopper_evaluations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mysteryShopperEvaluations'] });
      toast({
        title: "Success",
        description: "Evaluation updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update evaluation",
        variant: "destructive",
      });
    },
  });

  // Generate report
  const generateReportMutation = useMutation({
    mutationFn: async (report: Omit<EvaluationReport, 'id' | 'generated_date'>) => {
      const { data, error } = await supabase
        .from('evaluation_reports')
        .insert([report])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluationReports'] });
      toast({
        title: "Success",
        description: "Report generated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    },
  });

  // Create scoring rubric
  const createRubricMutation = useMutation({
    mutationFn: async (rubric: Omit<ScoringRubric, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('scoring_rubrics')
        .insert([rubric])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scoringRubrics'] });
      toast({
        title: "Success",
        description: "Scoring rubric created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create scoring rubric",
        variant: "destructive",
      });
    },
  });

  // Update scoring rubric
  const updateRubricMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ScoringRubric> }) => {
      const { data, error } = await supabase
        .from('scoring_rubrics')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scoringRubrics'] });
      toast({
        title: "Success",
        description: "Scoring rubric updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update scoring rubric",
        variant: "destructive",
      });
    },
  });

  // Create reward
  const createRewardMutation = useMutation({
    mutationFn: async (reward: Omit<RewardSystem, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('reward_system')
        .insert([reward])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardSystem'] });
      toast({
        title: "Success",
        description: "Reward created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create reward",
        variant: "destructive",
      });
    },
  });

  return {
    // Data
    mysteryShopperEvaluations,
    scoringRubrics,
    evaluationReports,
    trendAnalysis,
    rewardSystem,

    // Loading states
    isLoadingEvaluations,
    isLoadingRubrics,
    isLoadingReports,
    isLoadingTrends,
    isLoadingRewards,

    // Mutations
    createEvaluation: createEvaluationMutation.mutate,
    updateEvaluation: updateEvaluationMutation.mutate,
    generateReport: generateReportMutation.mutate,
    createRubric: createRubricMutation.mutate,
    updateRubric: updateRubricMutation.mutate,
    createReward: createRewardMutation.mutate,

    // Mutation states
    isCreatingEvaluation: createEvaluationMutation.isPending,
    isUpdatingEvaluation: updateEvaluationMutation.isPending,
    isGeneratingReport: generateReportMutation.isPending,
    isCreatingRubric: createRubricMutation.isPending,
    isUpdatingRubric: updateRubricMutation.isPending,
    isCreatingReward: createRewardMutation.isPending,
  };
}; 