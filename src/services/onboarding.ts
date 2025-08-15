/**
 * User Onboarding Service
 * Story 10: Growth Infrastructure - User Onboarding Flow
 * 
 * Guided onboarding experience for new users with progressive disclosure,
 * interactive tutorials, and completion tracking
 */

import { supabase } from '@/integrations/supabase/client';

// =====================================================
// ONBOARDING TYPES
// =====================================================

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  order: number;
  required: boolean;
  estimated_time: number; // minutes
  completion_criteria: string[];
  help_resources: HelpResource[];
}

export interface HelpResource {
  type: 'video' | 'article' | 'tooltip' | 'demo';
  title: string;
  url?: string;
  content?: string;
}

export interface OnboardingProgress {
  user_id: string;
  subscription_id: string;
  current_step: string;
  completed_steps: string[];
  skipped_steps: string[];
  started_at: string;
  completed_at?: string;
  completion_percentage: number;
  time_spent: number; // minutes
}

export interface OnboardingFlow {
  id: string;
  name: string;
  description: string;
  target_audience: 'new_user' | 'existing_user' | 'admin' | 'all';
  steps: OnboardingStep[];
  estimated_total_time: number;
  completion_reward?: string;
}

// =====================================================
// ONBOARDING FLOWS DEFINITION
// =====================================================

const ONBOARDING_FLOWS: OnboardingFlow[] = [
  {
    id: 'new_user_basic',
    name: 'Getting Started with PRMCMS',
    description: 'Essential setup for new users to get started quickly',
    target_audience: 'new_user',
    estimated_total_time: 15,
    completion_reward: 'Free month of Professional features',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to PRMCMS',
        description: 'Learn about the platform and what you can accomplish',
        component: 'WelcomeStep',
        order: 1,
        required: true,
        estimated_time: 2,
        completion_criteria: ['watched_intro_video'],
        help_resources: [
          {
            type: 'video',
            title: 'PRMCMS Overview',
            url: '/onboarding/videos/overview.mp4'
          }
        ]
      },
      {
        id: 'profile_setup',
        title: 'Complete Your Profile',
        description: 'Set up your business profile and preferences',
        component: 'ProfileSetupStep',
        order: 2,
        required: true,
        estimated_time: 3,
        completion_criteria: ['business_name_set', 'contact_info_complete'],
        help_resources: [
          {
            type: 'tooltip',
            title: 'Why we need this information',
            content: 'Your business profile helps us customize the experience and enables customer communications.'
          }
        ]
      },
      {
        id: 'first_customer',
        title: 'Add Your First Customer',
        description: 'Create a customer record to see how the system works',
        component: 'FirstCustomerStep',
        order: 3,
        required: true,
        estimated_time: 3,
        completion_criteria: ['customer_created'],
        help_resources: [
          {
            type: 'demo',
            title: 'Customer Management Demo',
            content: 'Interactive demo showing customer creation process'
          }
        ]
      },
      {
        id: 'first_package',
        title: 'Create Your First Package',
        description: 'Set up a package to understand the core workflow',
        component: 'FirstPackageStep',
        order: 4,
        required: true,
        estimated_time: 4,
        completion_criteria: ['package_created', 'customer_assigned'],
        help_resources: [
          {
            type: 'article',
            title: 'Package Management Best Practices',
            url: '/help/package-management'
          }
        ]
      },
      {
        id: 'communication_setup',
        title: 'Set Up Communications',
        description: 'Configure how you want to communicate with customers',
        component: 'CommunicationSetupStep',
        order: 5,
        required: false,
        estimated_time: 3,
        completion_criteria: ['notification_preferences_set'],
        help_resources: [
          {
            type: 'video',
            title: 'Communication Options',
            url: '/onboarding/videos/communications.mp4'
          }
        ]
      }
    ]
  },
  {
    id: 'advanced_features',
    name: 'Advanced Features Tour',
    description: 'Explore advanced features for power users',
    target_audience: 'existing_user',
    estimated_total_time: 20,
    steps: [
      {
        id: 'analytics_intro',
        title: 'Analytics Dashboard',
        description: 'Learn to use analytics for business insights',
        component: 'AnalyticsIntroStep',
        order: 1,
        required: false,
        estimated_time: 5,
        completion_criteria: ['viewed_analytics_dashboard'],
        help_resources: []
      },
      {
        id: 'integrations_setup',
        title: 'Third-Party Integrations',
        description: 'Connect external services to enhance functionality',
        component: 'IntegrationsSetupStep',
        order: 2,
        required: false,
        estimated_time: 10,
        completion_criteria: ['integration_configured'],
        help_resources: []
      },
      {
        id: 'automation_rules',
        title: 'Automation Rules',
        description: 'Set up automated workflows to save time',
        component: 'AutomationRulesStep',
        order: 3,
        required: false,
        estimated_time: 5,
        completion_criteria: ['automation_rule_created'],
        help_resources: []
      }
    ]
  }
];

// =====================================================
// ONBOARDING SERVICE
// =====================================================

export class OnboardingService {

  /**
   * Get available onboarding flows for user
   */
  static async getAvailableFlows(userId: string): Promise<OnboardingFlow[]> {
    try {
      // Get user's subscription to determine available flows
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('plan_tier')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching subscription:', error);
        return ONBOARDING_FLOWS.filter(flow => flow.target_audience === 'new_user');
      }

      // Filter flows based on user's plan and status
      return ONBOARDING_FLOWS.filter(flow => {
        if (flow.target_audience === 'all') return true;
        if (flow.target_audience === 'new_user') return true;
        if (flow.target_audience === 'admin' && subscription?.plan_tier === 'enterprise') return true;
        return false;
      });
    } catch (error) {
      console.error('Error getting available flows:', error);
      return [];
    }
  }

  /**
   * Start onboarding flow for user
   */
  static async startOnboardingFlow(
    userId: string,
    subscriptionId: string,
    flowId: string
  ): Promise<OnboardingProgress | null> {
    try {
      const flow = ONBOARDING_FLOWS.find(f => f.id === flowId);
      if (!flow) {
        throw new Error('Onboarding flow not found');
      }

      const firstStep = flow.steps.sort((a, b) => a.order - b.order)[0];
      
      const progress: OnboardingProgress = {
        user_id: userId,
        subscription_id: subscriptionId,
        current_step: firstStep.id,
        completed_steps: [],
        skipped_steps: [],
        started_at: new Date().toISOString(),
        completion_percentage: 0,
        time_spent: 0
      };

      // Save progress to database
      const { error } = await supabase
        .from('onboarding_progress')
        .insert({
          ...progress,
          flow_id: flowId
        });

      if (error) throw error;

      return progress;
    } catch (error) {
      console.error('Error starting onboarding flow:', error);
      return null;
    }
  }

  /**
   * Get user's onboarding progress
   */
  static async getOnboardingProgress(
    userId: string,
    flowId?: string
  ): Promise<OnboardingProgress | null> {
    try {
      let query = supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', userId);

      if (flowId) {
        query = query.eq('flow_id', flowId);
      }

      const { data, error } = await query
        .order('started_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting onboarding progress:', error);
      return null;
    }
  }

  /**
   * Complete onboarding step
   */
  static async completeStep(
    userId: string,
    flowId: string,
    stepId: string,
    timeSpent: number = 0
  ): Promise<boolean> {
    try {
      const progress = await this.getOnboardingProgress(userId, flowId);
      if (!progress) {
        throw new Error('Onboarding progress not found');
      }

      const flow = ONBOARDING_FLOWS.find(f => f.id === flowId);
      if (!flow) {
        throw new Error('Onboarding flow not found');
      }

      // Update completed steps
      const completedSteps = [...progress.completed_steps];
      if (!completedSteps.includes(stepId)) {
        completedSteps.push(stepId);
      }

      // Calculate next step
      const currentStepIndex = flow.steps.findIndex(s => s.id === stepId);
      const nextStep = flow.steps[currentStepIndex + 1];
      const currentStep = nextStep ? nextStep.id : stepId;

      // Calculate completion percentage
      const totalSteps = flow.steps.length;
      const completionPercentage = Math.round((completedSteps.length / totalSteps) * 100);

      // Check if flow is completed
      const isCompleted = completedSteps.length === totalSteps;

      // Update progress
      const { error } = await supabase
        .from('onboarding_progress')
        .update({
          current_step: currentStep,
          completed_steps: completedSteps,
          completion_percentage: completionPercentage,
          time_spent: progress.time_spent + timeSpent,
          completed_at: isCompleted ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('flow_id', flowId);

      if (error) throw error;

      // Award completion reward if flow is completed
      if (isCompleted && flow.completion_reward) {
        await this.awardCompletionReward(userId, flow.completion_reward);
      }

      return true;
    } catch (error) {
      console.error('Error completing step:', error);
      return false;
    }
  }

  /**
   * Skip onboarding step
   */
  static async skipStep(
    userId: string,
    flowId: string,
    stepId: string
  ): Promise<boolean> {
    try {
      const progress = await this.getOnboardingProgress(userId, flowId);
      if (!progress) {
        throw new Error('Onboarding progress not found');
      }

      const flow = ONBOARDING_FLOWS.find(f => f.id === flowId);
      if (!flow) {
        throw new Error('Onboarding flow not found');
      }

      // Check if step can be skipped
      const step = flow.steps.find(s => s.id === stepId);
      if (step?.required) {
        throw new Error('Required step cannot be skipped');
      }

      // Update skipped steps
      const skippedSteps = [...progress.skipped_steps];
      if (!skippedSteps.includes(stepId)) {
        skippedSteps.push(stepId);
      }

      // Find next step
      const currentStepIndex = flow.steps.findIndex(s => s.id === stepId);
      const nextStep = flow.steps[currentStepIndex + 1];
      const currentStep = nextStep ? nextStep.id : stepId;

      // Update progress
      const { error } = await supabase
        .from('onboarding_progress')
        .update({
          current_step: currentStep,
          skipped_steps: skippedSteps,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('flow_id', flowId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error skipping step:', error);
      return false;
    }
  }

  /**
   * Reset onboarding progress
   */
  static async resetOnboarding(userId: string, flowId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('onboarding_progress')
        .delete()
        .eq('user_id', userId)
        .eq('flow_id', flowId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      return false;
    }
  }

  /**
   * Get onboarding analytics
   */
  static async getOnboardingAnalytics(subscriptionId?: string): Promise<any> {
    try {
      let query = supabase
        .from('onboarding_progress')
        .select('*');

      if (subscriptionId) {
        query = query.eq('subscription_id', subscriptionId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Calculate analytics
      const totalUsers = data?.length || 0;
      const completedUsers = data?.filter(p => p.completed_at).length || 0;
      const averageTimeSpent = data?.reduce((sum, p) => sum + (p.time_spent || 0), 0) / totalUsers || 0;
      const completionRate = totalUsers > 0 ? (completedUsers / totalUsers) * 100 : 0;

      // Step completion rates
      const stepCompletionRates: Record<string, number> = {};
      ONBOARDING_FLOWS.forEach(flow => {
        flow.steps.forEach(step => {
          const completions = data?.filter(p => p.completed_steps?.includes(step.id)).length || 0;
          stepCompletionRates[step.id] = totalUsers > 0 ? (completions / totalUsers) * 100 : 0;
        });
      });

      return {
        total_users: totalUsers,
        completed_users: completedUsers,
        completion_rate: Math.round(completionRate),
        average_time_spent: Math.round(averageTimeSpent),
        step_completion_rates: stepCompletionRates,
        most_skipped_steps: this.getMostSkippedSteps(data || []),
        drop_off_points: this.getDropOffPoints(data || [])
      };
    } catch (error) {
      console.error('Error getting onboarding analytics:', error);
      return null;
    }
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  private static async awardCompletionReward(userId: string, reward: string): Promise<void> {
    try {
      // Record completion reward
      await supabase
        .from('onboarding_rewards')
        .insert({
          user_id: userId,
          reward_description: reward,
          awarded_at: new Date().toISOString()
        });

      console.log(`Awarded completion reward to user ${userId}: ${reward}`);
    } catch (error) {
      console.error('Error awarding completion reward:', error);
    }
  }

  private static getMostSkippedSteps(progressData: any[]): Array<{ step_id: string; skip_count: number }> {
    const skipCounts: Record<string, number> = {};
    
    progressData.forEach(progress => {
      progress.skipped_steps?.forEach((stepId: string) => {
        skipCounts[stepId] = (skipCounts[stepId] || 0) + 1;
      });
    });

    return Object.entries(skipCounts)
      .map(([step_id, skip_count]) => ({ step_id, skip_count }))
      .sort((a, b) => b.skip_count - a.skip_count)
      .slice(0, 5);
  }

  private static getDropOffPoints(progressData: any[]): Array<{ step_id: string; drop_off_rate: number }> {
    const stepCounts: Record<string, { started: number; completed: number }> = {};
    
    ONBOARDING_FLOWS.forEach(flow => {
      flow.steps.forEach(step => {
        stepCounts[step.id] = { started: 0, completed: 0 };
      });
    });

    progressData.forEach(progress => {
      // Count users who started each step
      ONBOARDING_FLOWS.forEach(flow => {
        const currentStepIndex = flow.steps.findIndex(s => s.id === progress.current_step);
        flow.steps.forEach((step, index) => {
          if (index <= currentStepIndex) {
            stepCounts[step.id].started++;
          }
          if (progress.completed_steps?.includes(step.id)) {
            stepCounts[step.id].completed++;
          }
        });
      });
    });

    return Object.entries(stepCounts)
      .map(([step_id, counts]) => ({
        step_id,
        drop_off_rate: counts.started > 0 ? ((counts.started - counts.completed) / counts.started) * 100 : 0
      }))
      .sort((a, b) => b.drop_off_rate - a.drop_off_rate)
      .slice(0, 5);
  }
}
