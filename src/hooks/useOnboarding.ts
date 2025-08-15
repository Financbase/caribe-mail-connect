/**
 * Onboarding Hook
 * Story 10: Growth Infrastructure - User Onboarding Flow
 * 
 * React hook for managing user onboarding flows,
 * progress tracking, and step completion
 */

import { useState, useEffect, useCallback } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { OnboardingService } from '@/services/onboarding';
import type { 
  OnboardingFlow,
  OnboardingProgress,
  OnboardingStep
} from '@/services/onboarding';

// =====================================================
// ONBOARDING HOOK TYPES
// =====================================================

interface UseOnboardingState {
  availableFlows: OnboardingFlow[];
  currentFlow: OnboardingFlow | null;
  progress: OnboardingProgress | null;
  analytics: any;
  isLoading: boolean;
  error: string | null;
}

interface UseOnboardingActions {
  // Flow management
  loadAvailableFlows: () => Promise<void>;
  startFlow: (flowId: string) => Promise<boolean>;
  resetFlow: (flowId: string) => Promise<boolean>;
  
  // Step management
  completeStep: (stepId: string, timeSpent?: number) => Promise<boolean>;
  skipStep: (stepId: string) => Promise<boolean>;
  goToStep: (stepId: string) => Promise<boolean>;
  
  // Progress tracking
  refreshProgress: (flowId?: string) => Promise<void>;
  getStepProgress: (stepId: string) => 'not_started' | 'current' | 'completed' | 'skipped';
  
  // Analytics
  loadAnalytics: () => Promise<void>;
  trackStepView: (stepId: string) => Promise<void>;
  trackStepInteraction: (stepId: string, interaction: string) => Promise<void>;
}

type UseOnboardingReturn = UseOnboardingState & UseOnboardingActions;

// =====================================================
// ONBOARDING HOOK
// =====================================================

export function useOnboarding(): UseOnboardingReturn {
  const { subscription, user } = useSubscription();
  
  const [state, setState] = useState<UseOnboardingState>({
    availableFlows: [],
    currentFlow: null,
    progress: null,
    analytics: null,
    isLoading: false,
    error: null
  });

  // =====================================================
  // FLOW MANAGEMENT
  // =====================================================

  const loadAvailableFlows = useCallback(async () => {
    if (!user?.id) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const flows = await OnboardingService.getAvailableFlows(user.id);
      setState(prev => ({
        ...prev,
        availableFlows: flows,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load onboarding flows',
        isLoading: false
      }));
    }
  }, [user?.id]);

  const startFlow = useCallback(async (flowId: string): Promise<boolean> => {
    if (!user?.id || !subscription?.id) return false;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check if flow is already in progress
      const existingProgress = await OnboardingService.getOnboardingProgress(user.id, flowId);
      
      let progress: OnboardingProgress | null;
      
      if (existingProgress && !existingProgress.completed_at) {
        // Resume existing flow
        progress = existingProgress;
      } else {
        // Start new flow
        progress = await OnboardingService.startOnboardingFlow(user.id, subscription.id, flowId);
      }

      if (progress) {
        // Get flow definition
        const flows = await OnboardingService.getAvailableFlows(user.id);
        const flow = flows.find(f => f.id === flowId);

        setState(prev => ({
          ...prev,
          currentFlow: flow || null,
          progress,
          isLoading: false
        }));

        return true;
      } else {
        throw new Error('Failed to start onboarding flow');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to start onboarding flow',
        isLoading: false
      }));
      return false;
    }
  }, [user?.id, subscription?.id]);

  const resetFlow = useCallback(async (flowId: string): Promise<boolean> => {
    if (!user?.id) return false;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const success = await OnboardingService.resetOnboarding(user.id, flowId);
      
      if (success) {
        setState(prev => ({
          ...prev,
          currentFlow: null,
          progress: null,
          isLoading: false
        }));
      }

      return success;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to reset onboarding flow',
        isLoading: false
      }));
      return false;
    }
  }, [user?.id]);

  // =====================================================
  // STEP MANAGEMENT
  // =====================================================

  const completeStep = useCallback(async (stepId: string, timeSpent: number = 0): Promise<boolean> => {
    if (!user?.id || !state.currentFlow) return false;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const success = await OnboardingService.completeStep(
        user.id,
        state.currentFlow.id,
        stepId,
        timeSpent
      );

      if (success) {
        // Refresh progress
        await refreshProgress(state.currentFlow.id);
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to complete step',
        isLoading: false
      }));
      return false;
    }
  }, [user?.id, state.currentFlow]);

  const skipStep = useCallback(async (stepId: string): Promise<boolean> => {
    if (!user?.id || !state.currentFlow) return false;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const success = await OnboardingService.skipStep(
        user.id,
        state.currentFlow.id,
        stepId
      );

      if (success) {
        // Refresh progress
        await refreshProgress(state.currentFlow.id);
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to skip step',
        isLoading: false
      }));
      return false;
    }
  }, [user?.id, state.currentFlow]);

  const goToStep = useCallback(async (stepId: string): Promise<boolean> => {
    if (!user?.id || !state.currentFlow || !state.progress) return false;

    try {
      // Update current step in progress
      // This would require additional service method
      console.log(`Going to step: ${stepId}`);
      
      // For now, just update local state
      setState(prev => ({
        ...prev,
        progress: prev.progress ? {
          ...prev.progress,
          current_step: stepId
        } : null
      }));

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to go to step'
      }));
      return false;
    }
  }, [user?.id, state.currentFlow, state.progress]);

  // =====================================================
  // PROGRESS TRACKING
  // =====================================================

  const refreshProgress = useCallback(async (flowId?: string) => {
    if (!user?.id) return;

    try {
      const targetFlowId = flowId || state.currentFlow?.id;
      if (!targetFlowId) return;

      const progress = await OnboardingService.getOnboardingProgress(user.id, targetFlowId);
      
      setState(prev => ({
        ...prev,
        progress
      }));
    } catch (error) {
      console.error('Error refreshing progress:', error);
    }
  }, [user?.id, state.currentFlow?.id]);

  const getStepProgress = useCallback((stepId: string): 'not_started' | 'current' | 'completed' | 'skipped' => {
    if (!state.progress) return 'not_started';

    if (state.progress.completed_steps.includes(stepId)) {
      return 'completed';
    }
    
    if (state.progress.skipped_steps.includes(stepId)) {
      return 'skipped';
    }
    
    if (state.progress.current_step === stepId) {
      return 'current';
    }
    
    return 'not_started';
  }, [state.progress]);

  // =====================================================
  // ANALYTICS
  // =====================================================

  const loadAnalytics = useCallback(async () => {
    if (!subscription?.id) return;

    try {
      const analytics = await OnboardingService.getOnboardingAnalytics(subscription.id);
      setState(prev => ({
        ...prev,
        analytics
      }));
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  }, [subscription?.id]);

  const trackStepView = useCallback(async (stepId: string) => {
    if (!user?.id || !state.currentFlow) return;

    try {
      // Track step view analytics
      console.log(`Tracking step view: ${stepId}`);
      
      // This would integrate with analytics service
      // await AnalyticsService.track('onboarding_step_viewed', {
      //   user_id: user.id,
      //   flow_id: state.currentFlow.id,
      //   step_id: stepId,
      //   timestamp: new Date().toISOString()
      // });
    } catch (error) {
      console.error('Error tracking step view:', error);
    }
  }, [user?.id, state.currentFlow]);

  const trackStepInteraction = useCallback(async (stepId: string, interaction: string) => {
    if (!user?.id || !state.currentFlow) return;

    try {
      // Track step interaction analytics
      console.log(`Tracking step interaction: ${stepId} - ${interaction}`);
      
      // This would integrate with analytics service
      // await AnalyticsService.track('onboarding_step_interaction', {
      //   user_id: user.id,
      //   flow_id: state.currentFlow.id,
      //   step_id: stepId,
      //   interaction,
      //   timestamp: new Date().toISOString()
      // });
    } catch (error) {
      console.error('Error tracking step interaction:', error);
    }
  }, [user?.id, state.currentFlow]);

  // =====================================================
  // EFFECTS
  // =====================================================

  useEffect(() => {
    if (user?.id) {
      loadAvailableFlows();
    }
  }, [user?.id, loadAvailableFlows]);

  useEffect(() => {
    if (subscription?.id) {
      loadAnalytics();
    }
  }, [subscription?.id, loadAnalytics]);

  // Track current step view
  useEffect(() => {
    if (state.progress?.current_step) {
      trackStepView(state.progress.current_step);
    }
  }, [state.progress?.current_step, trackStepView]);

  // =====================================================
  // RETURN HOOK INTERFACE
  // =====================================================

  return {
    // State
    availableFlows: state.availableFlows,
    currentFlow: state.currentFlow,
    progress: state.progress,
    analytics: state.analytics,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    loadAvailableFlows,
    startFlow,
    resetFlow,
    completeStep,
    skipStep,
    goToStep,
    refreshProgress,
    getStepProgress,
    loadAnalytics,
    trackStepView,
    trackStepInteraction
  };
}
