import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ComplianceChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'usps' | 'pr' | 'security' | 'privacy';
  status: 'not_started' | 'in_progress' | 'completed';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SelfAudit {
  id: string;
  title: string;
  description: string;
  auditDate: string;
  score: number;
  findings: string[];
  recommendations: string[];
  auditor: string;
  status: 'draft' | 'completed' | 'reviewed';
  createdAt: string;
  updatedAt: string;
}

export interface CorrectiveAction {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
  status: 'open' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  relatedAuditId?: string;
  relatedChecklistItemId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  id: string;
  name: string;
  description: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending_renewal';
  certificateNumber: string;
  renewalReminderDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceScore {
  id: string;
  month: string;
  score: number;
  category: string;
  notes?: string;
  createdAt: string;
}

export interface RegulatoryUpdate {
  id: string;
  title: string;
  description: string;
  source: string;
  effectiveDate: string;
  impact: 'low' | 'medium' | 'high';
  status: 'pending' | 'implemented' | 'reviewed';
  createdAt: string;
}

export const useComplianceMonitoring = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch compliance checklist
  const { data: complianceChecklist = [], isLoading: isLoadingChecklist } = useQuery({
    queryKey: ['compliance-checklist'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compliance_checklist')
        .select('*')
        .order('dueDate', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch self audits
  const { data: selfAudits = [], isLoading: isLoadingAudits } = useQuery({
    queryKey: ['self-audits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('self_audits')
        .select('*')
        .order('auditDate', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch corrective actions
  const { data: correctiveActions = [], isLoading: isLoadingActions } = useQuery({
    queryKey: ['corrective-actions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('corrective_actions')
        .select('*')
        .order('dueDate', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch documentation library
  const { data: documentationLibrary = [], isLoading: isLoadingDocs } = useQuery({
    queryKey: ['compliance-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compliance_documents')
        .select('*')
        .order('updatedAt', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch certifications
  const { data: certifications = [], isLoading: isLoadingCertifications } = useQuery({
    queryKey: ['certifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('expiryDate', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch compliance scores
  const { data: complianceScores = [], isLoading: isLoadingScores } = useQuery({
    queryKey: ['compliance-scores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compliance_scores')
        .select('*')
        .order('month', { ascending: false })
        .limit(12);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch regulatory updates
  const { data: regulatoryUpdates = [], isLoading: isLoadingUpdates } = useQuery({
    queryKey: ['regulatory-updates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regulatory_updates')
        .select('*')
        .order('effectiveDate', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create self audit mutation
  const createSelfAuditMutation = useMutation({
    mutationFn: async (audit: Omit<SelfAudit, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('self_audits')
        .insert([audit])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['self-audits'] });
      toast({
        title: "Self audit created",
        description: "The self audit has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating self audit",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update corrective action mutation
  const updateCorrectiveActionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CorrectiveAction> }) => {
      const { data, error } = await supabase
        .from('corrective_actions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['corrective-actions'] });
      toast({
        title: "Corrective action updated",
        description: "The corrective action has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating corrective action",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Upload document mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: async (document: Omit<ComplianceDocument, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('compliance_documents')
        .insert([document])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-documents'] });
      toast({
        title: "Document uploaded",
        description: "The compliance document has been successfully uploaded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error uploading document",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update certification mutation
  const updateCertificationMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Certification> }) => {
      const { data, error } = await supabase
        .from('certifications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast({
        title: "Certification updated",
        description: "The certification has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating certification",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Create compliance score mutation
  const createComplianceScoreMutation = useMutation({
    mutationFn: async (score: Omit<ComplianceScore, 'id' | 'createdAt'>) => {
      const { data, error } = await supabase
        .from('compliance_scores')
        .insert([score])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-scores'] });
      toast({
        title: "Compliance score recorded",
        description: "The compliance score has been successfully recorded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error recording compliance score",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update checklist item mutation
  const updateChecklistItemMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ComplianceChecklistItem> }) => {
      const { data, error } = await supabase
        .from('compliance_checklist')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-checklist'] });
      toast({
        title: "Checklist item updated",
        description: "The checklist item has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating checklist item",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    // Data
    complianceChecklist,
    selfAudits,
    correctiveActions,
    documentationLibrary,
    certifications,
    complianceScores,
    regulatoryUpdates,
    
    // Loading states
    isLoadingChecklist,
    isLoadingAudits,
    isLoadingActions,
    isLoadingDocs,
    isLoadingCertifications,
    isLoadingScores,
    isLoadingUpdates,
    
    // Mutations
    createSelfAudit: createSelfAuditMutation.mutate,
    updateCorrectiveAction: updateCorrectiveActionMutation.mutate,
    uploadDocument: uploadDocumentMutation.mutate,
    updateCertification: updateCertificationMutation.mutate,
    createComplianceScore: createComplianceScoreMutation.mutate,
    updateChecklistItem: updateChecklistItemMutation.mutate,
    
    // Mutation loading states
    isCreatingAudit: createSelfAuditMutation.isPending,
    isUpdatingAction: updateCorrectiveActionMutation.isPending,
    isUploadingDocument: uploadDocumentMutation.isPending,
    isUpdatingCertification: updateCertificationMutation.isPending,
    isCreatingScore: createComplianceScoreMutation.isPending,
    isUpdatingChecklist: updateChecklistItemMutation.isPending,
  };
}; 