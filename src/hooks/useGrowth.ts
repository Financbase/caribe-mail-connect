/**
 * Growth Hook
 * Story 1.4: Integrated Growth Platform
 * 
 * React hook for managing growth metrics, referral programs,
 * customer segments, and growth campaigns
 */

import { useState, useEffect, useCallback } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { GrowthService } from '@/services/growth';
import type { 
  GrowthMetrics,
  ReferralProgram,
  CustomerSegment,
  GrowthCampaign
} from '@/types/growth';

// =====================================================
// GROWTH HOOK TYPES
// =====================================================

interface UseGrowthState {
  growthMetrics: GrowthMetrics | null;
  referralPrograms: ReferralProgram[];
  customerSegments: CustomerSegment[];
  campaignPerformance: any[];
  isLoading: boolean;
  error: string | null;
}

interface UseGrowthActions {
  // Metrics
  refreshMetrics: (timeRange?: string) => Promise<void>;
  
  // Referral programs
  createReferralProgram: (program: Omit<ReferralProgram, 'id' | 'created_at' | 'updated_at'>) => Promise<ReferralProgram | null>;
  updateReferralProgram: (programId: string, updates: Partial<ReferralProgram>) => Promise<boolean>;
  trackReferralConversion: (referralCode: string, newCustomerId: string) => Promise<boolean>;
  
  // Customer segments
  refreshSegments: () => Promise<void>;
  createSegment: (segment: Omit<CustomerSegment, 'id'>) => Promise<CustomerSegment | null>;
  
  // Growth campaigns
  refreshCampaigns: () => Promise<void>;
  createCampaign: (campaign: any) => Promise<any>;
}

type UseGrowthReturn = UseGrowthState & UseGrowthActions;

// =====================================================
// GROWTH HOOK
// =====================================================

export function useGrowth(): UseGrowthReturn {
  const { subscription } = useSubscription();
  
  const [state, setState] = useState<UseGrowthState>({
    growthMetrics: null,
    referralPrograms: [],
    customerSegments: [],
    campaignPerformance: [],
    isLoading: false,
    error: null
  });

  // =====================================================
  // METRICS MANAGEMENT
  // =====================================================

  const refreshMetrics = useCallback(async (timeRange: string = '30d') => {
    if (!subscription?.id) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const metrics = await GrowthService.getGrowthMetrics(subscription.id, timeRange);
      setState(prev => ({ 
        ...prev, 
        growthMetrics: metrics,
        isLoading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to fetch growth metrics',
        isLoading: false 
      }));
    }
  }, [subscription?.id]);

  // =====================================================
  // REFERRAL PROGRAM MANAGEMENT
  // =====================================================

  const refreshReferralPrograms = useCallback(async () => {
    if (!subscription?.id) return;

    try {
      const programs = await GrowthService.getReferralPrograms(subscription.id);
      setState(prev => ({ ...prev, referralPrograms: programs }));
    } catch (error) {
      console.error('Error refreshing referral programs:', error);
    }
  }, [subscription?.id]);

  const createReferralProgram = useCallback(async (
    program: Omit<ReferralProgram, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ReferralProgram | null> => {
    if (!subscription?.id) return null;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const newProgram = await GrowthService.createReferralProgram(subscription.id, program);
      
      if (newProgram) {
        setState(prev => ({ 
          ...prev, 
          referralPrograms: [...prev.referralPrograms, newProgram],
          isLoading: false 
        }));
      }

      return newProgram;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to create referral program',
        isLoading: false 
      }));
      return null;
    }
  }, [subscription?.id]);

  const updateReferralProgram = useCallback(async (
    programId: string,
    updates: Partial<ReferralProgram>
  ): Promise<boolean> => {
    if (!subscription?.id) return false;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Update in database (would implement actual update logic)
      // For now, update local state
      setState(prev => ({
        ...prev,
        referralPrograms: prev.referralPrograms.map(program =>
          program.id === programId ? { ...program, ...updates } : program
        ),
        isLoading: false
      }));

      return true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to update referral program',
        isLoading: false 
      }));
      return false;
    }
  }, [subscription?.id]);

  const trackReferralConversion = useCallback(async (
    referralCode: string,
    newCustomerId: string
  ): Promise<boolean> => {
    if (!subscription?.id) return false;

    try {
      const success = await GrowthService.trackReferralConversion(
        referralCode,
        newCustomerId,
        subscription.id
      );

      if (success) {
        // Refresh metrics and programs to reflect the conversion
        await Promise.all([
          refreshMetrics(),
          refreshReferralPrograms()
        ]);
      }

      return success;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to track referral conversion'
      }));
      return false;
    }
  }, [subscription?.id, refreshMetrics, refreshReferralPrograms]);

  // =====================================================
  // CUSTOMER SEGMENT MANAGEMENT
  // =====================================================

  const refreshSegments = useCallback(async () => {
    if (!subscription?.id) return;

    try {
      const segments = await GrowthService.getCustomerSegments(subscription.id);
      setState(prev => ({ ...prev, customerSegments: segments }));
    } catch (error) {
      console.error('Error refreshing customer segments:', error);
    }
  }, [subscription?.id]);

  const createSegment = useCallback(async (
    segment: Omit<CustomerSegment, 'id'>
  ): Promise<CustomerSegment | null> => {
    if (!subscription?.id) return null;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Create segment (would implement actual creation logic)
      const newSegment: CustomerSegment = {
        ...segment,
        id: `segment_${Date.now()}`
      };

      setState(prev => ({ 
        ...prev, 
        customerSegments: [...prev.customerSegments, newSegment],
        isLoading: false 
      }));

      return newSegment;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to create customer segment',
        isLoading: false 
      }));
      return null;
    }
  }, [subscription?.id]);

  // =====================================================
  // CAMPAIGN MANAGEMENT
  // =====================================================

  const refreshCampaigns = useCallback(async () => {
    if (!subscription?.id) return;

    try {
      // Mock campaign data - would implement actual campaign fetching
      const campaigns = [
        {
          id: 'campaign_1',
          name: 'Referral Bonus Campaign',
          type: 'referral',
          status: 'active',
          performance: { conversions: 45, cost_per_acquisition: 25 }
        },
        {
          id: 'campaign_2',
          name: 'Loyalty Tier Upgrade',
          type: 'loyalty',
          status: 'active',
          performance: { conversions: 32, cost_per_acquisition: 18 }
        }
      ];

      setState(prev => ({ ...prev, campaignPerformance: campaigns }));
    } catch (error) {
      console.error('Error refreshing campaigns:', error);
    }
  }, [subscription?.id]);

  const createCampaign = useCallback(async (campaign: any): Promise<any> => {
    if (!subscription?.id) return null;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Create campaign (would implement actual creation logic)
      const newCampaign = {
        ...campaign,
        id: `campaign_${Date.now()}`,
        created_at: new Date().toISOString()
      };

      setState(prev => ({ 
        ...prev, 
        campaignPerformance: [...prev.campaignPerformance, newCampaign],
        isLoading: false 
      }));

      return newCampaign;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to create campaign',
        isLoading: false 
      }));
      return null;
    }
  }, [subscription?.id]);

  // =====================================================
  // EFFECTS
  // =====================================================

  useEffect(() => {
    if (subscription?.id) {
      Promise.all([
        refreshMetrics(),
        refreshReferralPrograms(),
        refreshSegments(),
        refreshCampaigns()
      ]);
    }
  }, [subscription?.id, refreshMetrics, refreshReferralPrograms, refreshSegments, refreshCampaigns]);

  // =====================================================
  // RETURN HOOK INTERFACE
  // =====================================================

  return {
    // State
    growthMetrics: state.growthMetrics,
    referralPrograms: state.referralPrograms,
    customerSegments: state.customerSegments,
    campaignPerformance: state.campaignPerformance,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    refreshMetrics,
    createReferralProgram,
    updateReferralProgram,
    trackReferralConversion,
    refreshSegments,
    createSegment,
    refreshCampaigns,
    createCampaign
  };
}
