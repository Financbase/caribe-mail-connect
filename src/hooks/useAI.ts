/**
 * AI/ML Management Hook
 * Story 2.1: AI-Powered Automation & Intelligence
 * 
 * React hook for managing machine learning models, predictions,
 * intelligent automation, and AI-powered insights
 */

import { useState, useEffect, useCallback } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { AIService } from '@/services/ai';
import { supabase } from '@/integrations/supabase/client';
import {
  HuggingFaceService,
  CloudflareAIService,
  LangChainAgentService,
  LangGraphWorkflowService,
  PydanticAIService,
  AIOrchestrator
} from '@/services/aiIntegrations';
import type { 
  MLModel,
  PredictionRequest,
  PredictionResult,
  IntelligentAutomationRule,
  AIInsight,
  SmartRoutingConfig,
  RouteOptimizationResult,
  CustomerIntelligenceProfile,
  TrainingJob,
  CreateMLModelRequest,
  TrainModelRequest,
  CreateAutomationRuleRequest,
  GenerateInsightsRequest,
  OptimizeRouteRequest,
  MLModelType,
  InsightType
} from '@/types/ai';

// =====================================================
// AI HOOK TYPES
// =====================================================

interface UseAIState {
  models: MLModel[];
  predictions: PredictionResult[];
  automationRules: IntelligentAutomationRule[];
  insights: AIInsight[];
  routingConfigs: SmartRoutingConfig[];
  customerProfiles: CustomerIntelligenceProfile[];
  trainingJobs: TrainingJob[];
  isLoading: boolean;
  error: string | null;
}

interface UseAIActions {
  // Model management
  createModel: (request: CreateMLModelRequest) => Promise<{ success: boolean; model?: MLModel; error?: string }>;
  trainModel: (modelId: string, request?: TrainModelRequest) => Promise<{ success: boolean; job?: TrainingJob; error?: string }>;
  deployModel: (modelId: string, environment: 'development' | 'staging' | 'production') => Promise<{ success: boolean; error?: string }>;
  deleteModel: (modelId: string) => Promise<{ success: boolean; error?: string }>;
  
  // Predictions
  makePrediction: (request: PredictionRequest) => Promise<{ success: boolean; result?: PredictionResult; error?: string }>;
  
  // Automation
  createAutomationRule: (request: CreateAutomationRuleRequest) => Promise<{ success: boolean; rule?: IntelligentAutomationRule; error?: string }>;
  updateAutomationRule: (ruleId: string, updates: Partial<IntelligentAutomationRule>) => Promise<{ success: boolean; error?: string }>;
  toggleAutomationRule: (ruleId: string, isActive: boolean) => Promise<{ success: boolean; error?: string }>;
  deleteAutomationRule: (ruleId: string) => Promise<{ success: boolean; error?: string }>;
  
  // Insights
  generateInsights: (request?: Partial<GenerateInsightsRequest>) => Promise<{ success: boolean; insights?: AIInsight[]; error?: string }>;
  acknowledgeInsight: (insightId: string) => Promise<{ success: boolean; error?: string }>;
  resolveInsight: (insightId: string) => Promise<{ success: boolean; error?: string }>;
  
  // Route optimization
  optimizeRoutes: (request: OptimizeRouteRequest) => Promise<{ success: boolean; result?: RouteOptimizationResult; error?: string }>;
  
  // Customer intelligence
  generateCustomerIntelligence: (customerId: string) => Promise<{ success: boolean; profile?: CustomerIntelligenceProfile; error?: string }>;
  
  // Utility functions
  refetch: () => Promise<void>;
}

// =====================================================
// MAIN AI HOOK
// =====================================================

export function useAI(): UseAIState & UseAIActions {
  const { subscription } = useSubscription();
  const { user } = useAuth();
  
  // State
  const [models, setModels] = useState<MLModel[]>([]);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [automationRules, setAutomationRules] = useState<IntelligentAutomationRule[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [routingConfigs, setRoutingConfigs] = useState<SmartRoutingConfig[]>([]);
  const [customerProfiles, setCustomerProfiles] = useState<CustomerIntelligenceProfile[]>([]);
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =====================================================
  // MODEL MANAGEMENT
  // =====================================================

  const createModel = useCallback(async (request: CreateMLModelRequest) => {
    if (!subscription || !user) return { success: false, error: 'No active subscription or user' };

    try {
      setError(null);
      
      const result = await AIService.createMLModel(subscription.id, request, user.id);
      
      if (result.success && result.data) {
        setModels(prev => [result.data!, ...prev]);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create model';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [subscription, user]);

  const trainModel = useCallback(async (modelId: string, request?: TrainModelRequest) => {
    if (!user) return { success: false, error: 'No active user' };

    try {
      setError(null);
      
      const result = await AIService.trainModel(modelId, request || {}, user.id);
      
      if (result.success && result.data) {
        setTrainingJobs(prev => [result.data!, ...prev]);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to train model';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [user]);

  const deployModel = useCallback(async (modelId: string, environment: 'development' | 'staging' | 'production') => {
    try {
      setError(null);
      
      // Update model status to deployed
      const { error: updateError } = await supabase
        .from('ml_models')
        .update({
          status: 'deployed',
          deployed_at: new Date().toISOString()
        })
        .eq('id', modelId);

      if (updateError) throw updateError;

      // Update local state
      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { ...model, status: 'deployed', deployed_at: new Date().toISOString() }
          : model
      ));

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deploy model';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteModel = useCallback(async (modelId: string) => {
    try {
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('ml_models')
        .delete()
        .eq('id', modelId);

      if (deleteError) throw deleteError;

      setModels(prev => prev.filter(model => model.id !== modelId));

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete model';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // =====================================================
  // PREDICTIONS
  // =====================================================

  const makePrediction = useCallback(async (request: PredictionRequest) => {
    if (!subscription) return { success: false, error: 'No active subscription' };

    try {
      setError(null);
      
      const result = await AIService.makePrediction(request, subscription.id);
      
      if (result.success && result.data) {
        setPredictions(prev => [result.data!, ...prev.slice(0, 99)]); // Keep last 100 predictions
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to make prediction';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [subscription]);

  // =====================================================
  // AUTOMATION
  // =====================================================

  const createAutomationRule = useCallback(async (request: CreateAutomationRuleRequest) => {
    if (!subscription || !user) return { success: false, error: 'No active subscription or user' };

    try {
      setError(null);
      
      const result = await AIService.createAutomationRule(subscription.id, request, user.id);
      
      if (result.success && result.data) {
        setAutomationRules(prev => [result.data!, ...prev]);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create automation rule';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [subscription, user]);

  const updateAutomationRule = useCallback(async (ruleId: string, updates: Partial<IntelligentAutomationRule>) => {
    try {
      setError(null);
      
      const { error: updateError } = await supabase
        .from('intelligent_automation_rules')
        .update(updates)
        .eq('id', ruleId);

      if (updateError) throw updateError;

      setAutomationRules(prev => prev.map(rule => 
        rule.id === ruleId ? { ...rule, ...updates } : rule
      ));

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update automation rule';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const toggleAutomationRule = useCallback(async (ruleId: string, isActive: boolean) => {
    return await updateAutomationRule(ruleId, { is_active: isActive });
  }, [updateAutomationRule]);

  const deleteAutomationRule = useCallback(async (ruleId: string) => {
    try {
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('intelligent_automation_rules')
        .delete()
        .eq('id', ruleId);

      if (deleteError) throw deleteError;

      setAutomationRules(prev => prev.filter(rule => rule.id !== ruleId));

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete automation rule';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // =====================================================
  // INSIGHTS
  // =====================================================

  const generateInsights = useCallback(async (request?: Partial<GenerateInsightsRequest>) => {
    if (!subscription) return { success: false, error: 'No active subscription' };

    try {
      setError(null);
      
      const fullRequest: GenerateInsightsRequest = {
        subscription_id: subscription.id,
        insight_types: request?.insight_types,
        time_range: request?.time_range,
        confidence_threshold: request?.confidence_threshold || 0.7
      };
      
      const result = await AIService.generateInsights(fullRequest);
      
      if (result.success && result.data) {
        setInsights(prev => [...result.data!, ...prev]);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate insights';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [subscription]);

  const acknowledgeInsight = useCallback(async (insightId: string) => {
    if (!user) return { success: false, error: 'No active user' };

    try {
      setError(null);
      
      const { error: updateError } = await supabase
        .from('ai_insights')
        .update({
          status: 'acknowledged',
          acknowledged_by: user.id,
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', insightId);

      if (updateError) throw updateError;

      setInsights(prev => prev.map(insight => 
        insight.id === insightId 
          ? { ...insight, status: 'acknowledged', acknowledged_by: user.id, acknowledged_at: new Date().toISOString() }
          : insight
      ));

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to acknowledge insight';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [user]);

  const resolveInsight = useCallback(async (insightId: string) => {
    try {
      setError(null);
      
      const { error: updateError } = await supabase
        .from('ai_insights')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', insightId);

      if (updateError) throw updateError;

      setInsights(prev => prev.map(insight => 
        insight.id === insightId 
          ? { ...insight, status: 'resolved', resolved_at: new Date().toISOString() }
          : insight
      ));

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resolve insight';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // =====================================================
  // ROUTE OPTIMIZATION
  // =====================================================

  const optimizeRoutes = useCallback(async (request: OptimizeRouteRequest) => {
    if (!subscription) return { success: false, error: 'No active subscription' };

    try {
      setError(null);
      
      const result = await AIService.optimizeRoutes(subscription.id, request);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to optimize routes';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [subscription]);

  // =====================================================
  // CUSTOMER INTELLIGENCE
  // =====================================================

  const generateCustomerIntelligence = useCallback(async (customerId: string) => {
    if (!subscription) return { success: false, error: 'No active subscription' };

    try {
      setError(null);
      
      const result = await AIService.generateCustomerIntelligence(customerId, subscription.id);
      
      if (result.success && result.data) {
        setCustomerProfiles(prev => {
          const existing = prev.findIndex(p => p.customer_id === customerId);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = result.data!;
            return updated;
          } else {
            return [result.data!, ...prev];
          }
        });
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate customer intelligence';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [subscription]);

  // =====================================================
  // DATA FETCHING
  // =====================================================

  const fetchData = useCallback(async () => {
    if (!subscription) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch all AI/ML data
      const [
        modelsData,
        predictionsData,
        rulesData,
        insightsData,
        profilesData,
        jobsData
      ] = await Promise.all([
        supabase.from('ml_models').select('*').eq('subscription_id', subscription.id).order('created_at', { ascending: false }),
        supabase.from('model_predictions').select('*').eq('subscription_id', subscription.id).order('created_at', { ascending: false }).limit(50),
        supabase.from('intelligent_automation_rules').select('*').eq('subscription_id', subscription.id).order('priority', { ascending: true }),
        supabase.from('ai_insights').select('*').eq('subscription_id', subscription.id).order('created_at', { ascending: false }).limit(20),
        supabase.from('customer_intelligence_profiles').select('*').eq('subscription_id', subscription.id).order('last_analyzed_at', { ascending: false }),
        supabase.from('training_jobs').select('*').eq('subscription_id', subscription.id).order('created_at', { ascending: false }).limit(10)
      ]);

      setModels(modelsData.data || []);
      setPredictions(predictionsData.data || []);
      setAutomationRules(rulesData.data || []);
      setInsights(insightsData.data || []);
      setCustomerProfiles(profilesData.data || []);
      setTrainingJobs(jobsData.data || []);

    } catch (err) {
      console.error('Error fetching AI data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch AI data');
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchData();
  }, [fetchData]);

  // =====================================================
  // EFFECTS
  // =====================================================

  // Initial data loading
  useEffect(() => {
    if (subscription) {
      fetchData();
    }
  }, [subscription, fetchData]);

  // =====================================================
  // RETURN HOOK INTERFACE
  // =====================================================

  return {
    // State
    models,
    predictions,
    automationRules,
    insights,
    routingConfigs,
    customerProfiles,
    trainingJobs,
    isLoading,
    error,
    
    // Actions
    createModel,
    trainModel,
    deployModel,
    deleteModel,
    makePrediction,
    createAutomationRule,
    updateAutomationRule,
    toggleAutomationRule,
    deleteAutomationRule,
    generateInsights,
    acknowledgeInsight,
    resolveInsight,
    optimizeRoutes,
    generateCustomerIntelligence,
    refetch
  };
}

// =====================================================
// SPECIALIZED AI HOOKS
// =====================================================

/**
 * Hook for machine learning models
 */
export function useMLModels() {
  const { models, createModel, trainModel, deployModel, deleteModel, isLoading, error } = useAI();

  return {
    models,
    createModel,
    trainModel,
    deployModel,
    deleteModel,
    isLoading,
    error
  };
}

/**
 * Hook for intelligent automation
 */
export function useIntelligentAutomation() {
  const { 
    automationRules, 
    createAutomationRule, 
    updateAutomationRule, 
    toggleAutomationRule, 
    deleteAutomationRule,
    isLoading,
    error 
  } = useAI();

  return {
    rules: automationRules,
    createRule: createAutomationRule,
    updateRule: updateAutomationRule,
    toggleRule: toggleAutomationRule,
    deleteRule: deleteAutomationRule,
    isLoading,
    error
  };
}

/**
 * Hook for AI insights
 */
export function useAIInsights() {
  const { insights, generateInsights, acknowledgeInsight, resolveInsight, isLoading, error } = useAI();

  return {
    insights,
    generateInsights,
    acknowledgeInsight,
    resolveInsight,
    isLoading,
    error
  };
}

// =====================================================
// AI INTEGRATIONS HOOK
// =====================================================

/**
 * Hook for external AI service integrations
 */
export function useAIIntegrations() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processWithHuggingFace = useCallback(async (text: string, task: string) => {
    setIsProcessing(true);
    try {
      switch (task) {
        case 'sentiment':
          return await HuggingFaceService.analyzeSentiment(text);
        case 'classification':
          return await HuggingFaceService.classifyText(text);
        case 'entities':
          return await HuggingFaceService.extractEntities(text);
        case 'summarization':
          return await HuggingFaceService.summarizeText(text);
        default:
          throw new Error(`Unknown task: ${task}`);
      }
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const processWithCloudflare = useCallback(async (input: string | ArrayBuffer, task: string) => {
    setIsProcessing(true);
    try {
      switch (task) {
        case 'text_generation':
          return await CloudflareAIService.generateText(input as string);
        case 'embeddings':
          return await CloudflareAIService.generateEmbeddings(input as string);
        case 'image_classification':
          return await CloudflareAIService.classifyImage(input as ArrayBuffer);
        case 'speech_recognition':
          return await CloudflareAIService.transcribeAudio(input as ArrayBuffer);
        default:
          throw new Error(`Unknown task: ${task}`);
      }
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const processWithLangChain = useCallback(async (input: string, agentId: string, context: any = {}) => {
    setIsProcessing(true);
    try {
      return await LangChainAgentService.executeAgentWorkflow(agentId, input, context);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const processWithLangGraph = useCallback(async (workflowId: string, input: any, state: any = {}) => {
    setIsProcessing(true);
    try {
      return await LangGraphWorkflowService.executeWorkflow(workflowId, input, state);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const processWithPydanticAI = useCallback(async (text: string, schema: any) => {
    setIsProcessing(true);
    try {
      return await PydanticAIService.extractStructuredData(text, schema);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const orchestrateAI = useCallback(async (inquiry: string, customerId: string, subscriptionId: string) => {
    setIsProcessing(true);
    try {
      return await AIOrchestrator.processCustomerInquiry(inquiry, customerId, subscriptionId);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    isProcessing,
    processWithHuggingFace,
    processWithCloudflare,
    processWithLangChain,
    processWithLangGraph,
    processWithPydanticAI,
    orchestrateAI
  };
}
