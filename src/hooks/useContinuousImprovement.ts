import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  submitted_by: string;
  location_id?: string;
  status: 'pending' | 'reviewed' | 'approved' | 'in_progress' | 'implemented' | 'rejected';
  impact_score: number;
  vote_count: number;
  estimated_cost?: number;
  estimated_benefit?: number;
  assigned_to?: string;
  review_notes?: string;
  implementation_date?: string;
  created_at: string;
}

export interface KaizenEvent {
  id: string;
  event_name: string;
  description: string;
  team_lead: string;
  team_members: string[];
  start_date: string;
  end_date?: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  progress: number;
  improvement_metric?: string;
  cost_savings?: number;
  time_savings?: number;
  quality_improvement?: number;
  notes?: string;
  created_at: string;
}

export interface ProcessDocumentation {
  id: string;
  process_name: string;
  description: string;
  version: string;
  status: 'draft' | 'current' | 'archived' | 'under_review';
  owner: string;
  reviewer?: string;
  review_status: 'pending' | 'approved' | 'rejected' | 'completed';
  document_url?: string;
  last_updated: string;
  next_review_date?: string;
  created_at: string;
}

export interface TrainingEffectiveness {
  id: string;
  training_name: string;
  description: string;
  instructor: string;
  training_date: string;
  effectiveness_score: number;
  completion_rate: number;
  satisfaction_score: number;
  knowledge_retention: number;
  practical_application: number;
  participant_count: number;
  feedback_summary?: string;
  improvement_areas?: string[];
  created_at: string;
}

export interface BestPractice {
  id: string;
  practice_name: string;
  description: string;
  category: string;
  shared_by: string;
  location: string;
  success_rate: number;
  adopted_count: number;
  implementation_time?: number;
  cost_benefit_ratio?: number;
  difficulty_level: 'low' | 'medium' | 'high';
  prerequisites?: string[];
  step_by_step_guide?: string;
  supporting_documents?: string[];
  created_at: string;
}

export const useContinuousImprovement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch suggestions
  const { 
    data: suggestions = [], 
    isLoading: isLoadingSuggestions,
    error: suggestionsError 
  } = useQuery({
    queryKey: ['suggestions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Suggestion[];
    },
  });

  // Fetch Kaizen events
  const { 
    data: kaizenEvents = [], 
    isLoading: isLoadingKaizenEvents,
    error: kaizenEventsError 
  } = useQuery({
    queryKey: ['kaizenEvents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kaizen_events')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data as KaizenEvent[];
    },
  });

  // Fetch process documentation
  const { 
    data: processDocumentation = [], 
    isLoading: isLoadingProcessDocumentation,
    error: processDocumentationError 
  } = useQuery({
    queryKey: ['processDocumentation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('process_documentation')
        .select('*')
        .order('last_updated', { ascending: false });
      
      if (error) throw error;
      return data as ProcessDocumentation[];
    },
  });

  // Fetch training effectiveness
  const { 
    data: trainingEffectiveness = [], 
    isLoading: isLoadingTrainingEffectiveness,
    error: trainingEffectivenessError 
  } = useQuery({
    queryKey: ['trainingEffectiveness'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_effectiveness')
        .select('*')
        .order('training_date', { ascending: false });
      
      if (error) throw error;
      return data as TrainingEffectiveness[];
    },
  });

  // Fetch best practices
  const { 
    data: bestPractices = [], 
    isLoading: isLoadingBestPractices,
    error: bestPracticesError 
  } = useQuery({
    queryKey: ['bestPractices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('best_practices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BestPractice[];
    },
  });

  // Create suggestion
  const createSuggestionMutation = useMutation({
    mutationFn: async (suggestion: Omit<Suggestion, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('suggestions')
        .insert([suggestion])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      toast({
        title: "Success",
        description: "Suggestion submitted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit suggestion",
        variant: "destructive",
      });
    },
  });

  // Update suggestion
  const updateSuggestionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Suggestion> }) => {
      const { data, error } = await supabase
        .from('suggestions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      toast({
        title: "Success",
        description: "Suggestion updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update suggestion",
        variant: "destructive",
      });
    },
  });

  // Create Kaizen event
  const createKaizenEventMutation = useMutation({
    mutationFn: async (kaizenEvent: Omit<KaizenEvent, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('kaizen_events')
        .insert([kaizenEvent])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kaizenEvents'] });
      toast({
        title: "Success",
        description: "Kaizen event created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create Kaizen event",
        variant: "destructive",
      });
    },
  });

  // Update Kaizen event
  const updateKaizenEventMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<KaizenEvent> }) => {
      const { data, error } = await supabase
        .from('kaizen_events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kaizenEvents'] });
      toast({
        title: "Success",
        description: "Kaizen event updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update Kaizen event",
        variant: "destructive",
      });
    },
  });

  // Create process documentation
  const createProcessDocumentationMutation = useMutation({
    mutationFn: async (processDoc: Omit<ProcessDocumentation, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('process_documentation')
        .insert([processDoc])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processDocumentation'] });
      toast({
        title: "Success",
        description: "Process documentation created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create process documentation",
        variant: "destructive",
      });
    },
  });

  // Create best practice
  const createBestPracticeMutation = useMutation({
    mutationFn: async (bestPractice: Omit<BestPractice, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('best_practices')
        .insert([bestPractice])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bestPractices'] });
      toast({
        title: "Success",
        description: "Best practice shared successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to share best practice",
        variant: "destructive",
      });
    },
  });

  return {
    // Data
    suggestions,
    kaizenEvents,
    processDocumentation,
    trainingEffectiveness,
    bestPractices,

    // Loading states
    isLoadingSuggestions,
    isLoadingKaizenEvents,
    isLoadingProcessDocumentation,
    isLoadingTrainingEffectiveness,
    isLoadingBestPractices,

    // Mutations
    createSuggestion: createSuggestionMutation.mutate,
    updateSuggestion: updateSuggestionMutation.mutate,
    createKaizenEvent: createKaizenEventMutation.mutate,
    updateKaizenEvent: updateKaizenEventMutation.mutate,
    createProcessDocumentation: createProcessDocumentationMutation.mutate,
    createBestPractice: createBestPracticeMutation.mutate,

    // Mutation states
    isCreatingSuggestion: createSuggestionMutation.isPending,
    isUpdatingSuggestion: updateSuggestionMutation.isPending,
    isCreatingKaizenEvent: createKaizenEventMutation.isPending,
    isUpdatingKaizenEvent: updateKaizenEventMutation.isPending,
    isCreatingProcessDocumentation: createProcessDocumentationMutation.isPending,
    isCreatingBestPractice: createBestPracticeMutation.isPending,
  };
}; 