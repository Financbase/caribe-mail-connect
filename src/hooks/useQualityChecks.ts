import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface QualityCheck {
  id: string;
  location_id?: string;
  check_type: 'package_audit' | 'photo_verification' | 'delivery_accuracy' | 'data_validation' | 'service_review';
  title: string;
  description: string;
  status: 'pending' | 'passed' | 'failed' | 'in_progress';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: string;
  score?: number;
  max_score?: number;
  notes?: string;
  created_at: string;
  completed_at?: string;
}

export interface AuditResult {
  id: string;
  package_id: string;
  location_id?: string;
  status: 'passed' | 'failed' | 'partial';
  handling_score: number;
  documentation_score: number;
  storage_score: number;
  overall_score: number;
  audit_date: string;
  auditor?: string;
  notes?: string;
}

export interface PhotoVerification {
  id: string;
  package_id: string;
  location_id?: string;
  verification_status: 'verified' | 'pending' | 'failed' | 'requires_review';
  photo_quality_score: number;
  package_visibility_score: number;
  label_readability_score: number;
  lighting_quality_score: number;
  angle_consistency_score: number;
  photo_urls: string[];
  verified_by?: string;
  verification_date?: string;
  notes?: string;
}

export interface DeliveryAccuracy {
  id: string;
  delivery_id: string;
  location_id?: string;
  accuracy_score: number;
  route_efficiency_score: number;
  time_accuracy_score: number;
  customer_satisfaction_score: number;
  delivery_date: string;
  driver_id?: string;
  notes?: string;
}

export interface DataValidation {
  id: string;
  field_name: string;
  location_id?: string;
  validation_status: 'valid' | 'invalid' | 'pending';
  accuracy_rate: number;
  error_count: number;
  total_attempts: number;
  validation_rules_passed: number;
  total_rules: number;
  error_message?: string;
  validated_at: string;
  validator?: string;
}

export interface CustomerServiceReview {
  id: string;
  review_id: string;
  location_id?: string;
  rating: number;
  comment: string;
  professionalism_score: number;
  helpfulness_score: number;
  communication_score: number;
  response_time_score: number;
  overall_satisfaction_score: number;
  review_date: string;
  customer_id?: string;
  service_representative_id?: string;
}

export const useQualityChecks = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch quality checks
  const { 
    data: qualityChecks = [], 
    isLoading: isLoadingQualityChecks,
    error: qualityChecksError 
  } = useQuery({
    queryKey: ['qualityChecks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quality_checks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as QualityCheck[];
    },
  });

  // Fetch audit results
  const { 
    data: auditResults = [], 
    isLoading: isLoadingAuditResults,
    error: auditResultsError 
  } = useQuery({
    queryKey: ['auditResults'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_results')
        .select('*')
        .order('audit_date', { ascending: false });
      
      if (error) throw error;
      return data as AuditResult[];
    },
  });

  // Fetch photo verifications
  const { 
    data: photoVerifications = [], 
    isLoading: isLoadingPhotoVerifications,
    error: photoVerificationsError 
  } = useQuery({
    queryKey: ['photoVerifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photo_verifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PhotoVerification[];
    },
  });

  // Fetch delivery accuracy
  const { 
    data: deliveryAccuracy = [], 
    isLoading: isLoadingDeliveryAccuracy,
    error: deliveryAccuracyError 
  } = useQuery({
    queryKey: ['deliveryAccuracy'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delivery_accuracy')
        .select('*')
        .order('delivery_date', { ascending: false });
      
      if (error) throw error;
      return data as DeliveryAccuracy[];
    },
  });

  // Fetch data validation
  const { 
    data: dataValidation = [], 
    isLoading: isLoadingDataValidation,
    error: dataValidationError 
  } = useQuery({
    queryKey: ['dataValidation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_validation')
        .select('*')
        .order('validated_at', { ascending: false });
      
      if (error) throw error;
      return data as DataValidation[];
    },
  });

  // Fetch customer service reviews
  const { 
    data: customerServiceReviews = [], 
    isLoading: isLoadingCustomerServiceReviews,
    error: customerServiceReviewsError 
  } = useQuery({
    queryKey: ['customerServiceReviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_service_reviews')
        .select('*')
        .order('review_date', { ascending: false });
      
      if (error) throw error;
      return data as CustomerServiceReview[];
    },
  });

  // Create quality check
  const createQualityCheckMutation = useMutation({
    mutationFn: async (qualityCheck: Omit<QualityCheck, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('quality_checks')
        .insert([qualityCheck])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qualityChecks'] });
      toast({
        title: "Success",
        description: "Quality check created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create quality check",
        variant: "destructive",
      });
    },
  });

  // Update quality check
  const updateQualityCheckMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<QualityCheck> }) => {
      const { data, error } = await supabase
        .from('quality_checks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qualityChecks'] });
      toast({
        title: "Success",
        description: "Quality check updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update quality check",
        variant: "destructive",
      });
    },
  });

  // Create audit result
  const createAuditResultMutation = useMutation({
    mutationFn: async (auditResult: Omit<AuditResult, 'id'>) => {
      const { data, error } = await supabase
        .from('audit_results')
        .insert([auditResult])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auditResults'] });
      toast({
        title: "Success",
        description: "Audit result created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create audit result",
        variant: "destructive",
      });
    },
  });

  // Update photo verification
  const updatePhotoVerificationMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PhotoVerification> }) => {
      const { data, error } = await supabase
        .from('photo_verifications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photoVerifications'] });
      toast({
        title: "Success",
        description: "Photo verification updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update photo verification",
        variant: "destructive",
      });
    },
  });

  return {
    // Data
    qualityChecks,
    auditResults,
    photoVerifications,
    deliveryAccuracy,
    dataValidation,
    customerServiceReviews,

    // Loading states
    isLoadingQualityChecks,
    isLoadingAuditResults,
    isLoadingPhotoVerifications,
    isLoadingDeliveryAccuracy,
    isLoadingDataValidation,
    isLoadingCustomerServiceReviews,

    // Mutations
    createQualityCheck: createQualityCheckMutation.mutate,
    updateQualityCheck: updateQualityCheckMutation.mutate,
    createAuditResult: createAuditResultMutation.mutate,
    updatePhotoVerification: updatePhotoVerificationMutation.mutate,

    // Mutation states
    isCreatingCheck: createQualityCheckMutation.isPending,
    isUpdatingCheck: updateQualityCheckMutation.isPending,
    isCreatingAudit: createAuditResultMutation.isPending,
    isUpdatingPhotoVerification: updatePhotoVerificationMutation.isPending,
  };
}; 