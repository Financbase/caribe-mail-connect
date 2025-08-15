/**
 * Loyalty Hook
 * Story 1.4: Integrated Growth Platform
 * 
 * React hook for managing loyalty system integration with growth platform
 */

import { useState, useEffect, useCallback } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { supabase } from '@/integrations/supabase/client';

// =====================================================
// LOYALTY HOOK TYPES
// =====================================================

interface LoyaltyData {
  points: any;
  tier: any;
  achievements: any[];
  challenges: any[];
  leaderboard: any[];
  communityGoals: any[];
}

interface UseLoyaltyState {
  loyaltyData: LoyaltyData | null;
  userPoints: any;
  userTier: any;
  achievements: any[];
  challenges: any[];
  isLoading: boolean;
  error: string | null;
}

interface UseLoyaltyActions {
  refreshLoyaltyData: () => Promise<void>;
  awardPoints: (event: string, data?: any) => Promise<boolean>;
  redeemReward: (rewardId: string) => Promise<boolean>;
  completeChallenge: (challengeId: string) => Promise<boolean>;
}

type UseLoyaltyReturn = UseLoyaltyState & UseLoyaltyActions;

// =====================================================
// LOYALTY HOOK
// =====================================================

export function useLoyalty(): UseLoyaltyReturn {
  const { subscription } = useSubscription();
  
  const [state, setState] = useState<UseLoyaltyState>({
    loyaltyData: null,
    userPoints: null,
    userTier: null,
    achievements: [],
    challenges: [],
    isLoading: false,
    error: null
  });

  // =====================================================
  // LOYALTY DATA MANAGEMENT
  // =====================================================

  const refreshLoyaltyData = useCallback(async () => {
    if (!subscription?.id) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Get user's loyalty points
      const { data: userPoints, error: pointsError } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', subscription.id)
        .single();

      if (pointsError && pointsError.code !== 'PGRST116') {
        throw pointsError;
      }

      // Get user's tier information
      const { data: userTier, error: tierError } = await supabase
        .from('user_tiers')
        .select(`
          *,
          loyalty_tiers (
            tier_name,
            min_points,
            benefits
          )
        `)
        .eq('user_id', subscription.id)
        .single();

      if (tierError && tierError.code !== 'PGRST116') {
        console.warn('Tier error:', tierError);
      }

      // Get user's achievements
      const { data: achievements, error: achievementsError } = await supabase
        .from('user_achievements')
        .select(`
          *,
          loyalty_achievements (
            name,
            description,
            points_reward,
            badge_icon
          )
        `)
        .eq('user_id', subscription.id)
        .order('earned_at', { ascending: false });

      if (achievementsError) {
        console.warn('Achievements error:', achievementsError);
      }

      // Get active challenges
      const { data: challenges, error: challengesError } = await supabase
        .from('loyalty_challenges')
        .select(`
          *,
          user_challenge_progress (
            progress,
            completed_at
          )
        `)
        .eq('is_active', true)
        .order('end_date', { ascending: true });

      if (challengesError) {
        console.warn('Challenges error:', challengesError);
      }

      // Calculate tier progress
      let tierProgress = null;
      if (userPoints && userTier) {
        const currentPoints = userPoints.balance || 0;
        const tierMinPoints = userTier.loyalty_tiers?.min_points || 0;
        
        // Get next tier
        const { data: nextTier } = await supabase
          .from('loyalty_tiers')
          .select('*')
          .gt('min_points', tierMinPoints)
          .order('min_points', { ascending: true })
          .limit(1)
          .single();

        if (nextTier) {
          tierProgress = {
            current_points: currentPoints,
            points_required: nextTier.min_points,
            progress_percentage: (currentPoints / nextTier.min_points) * 100
          };
        }
      }

      setState(prev => ({
        ...prev,
        loyaltyData: {
          points: userPoints,
          tier: userTier,
          achievements: achievements || [],
          challenges: challenges || [],
          leaderboard: [], // Would implement leaderboard
          communityGoals: [] // Would implement community goals
        },
        userPoints: userPoints,
        userTier: tierProgress ? { ...userTier, ...tierProgress } : userTier,
        achievements: achievements?.map(a => ({
          ...a.loyalty_achievements,
          earned_at: a.earned_at,
          id: a.achievement_id
        })) || [],
        challenges: challenges?.map(c => ({
          ...c,
          user_progress: c.user_challenge_progress?.[0] || null
        })) || [],
        isLoading: false
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch loyalty data',
        isLoading: false
      }));
    }
  }, [subscription?.id]);

  // =====================================================
  // LOYALTY ACTIONS
  // =====================================================

  const awardPoints = useCallback(async (event: string, data?: any): Promise<boolean> => {
    if (!subscription?.id) return false;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/loyalty-webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          event,
          userId: subscription.id,
          data: data || {}
        })
      });

      if (response.ok) {
        // Refresh loyalty data to reflect the new points
        await refreshLoyaltyData();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error awarding points:', error);
      return false;
    }
  }, [subscription?.id, refreshLoyaltyData]);

  const redeemReward = useCallback(async (rewardId: string): Promise<boolean> => {
    if (!subscription?.id) return false;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Get reward details
      const { data: reward, error: rewardError } = await supabase
        .from('loyalty_rewards')
        .select('*')
        .eq('id', rewardId)
        .single();

      if (rewardError || !reward) {
        throw new Error('Reward not found');
      }

      // Check if user has enough points
      if (!state.userPoints || state.userPoints.balance < reward.points_cost) {
        throw new Error('Insufficient points');
      }

      // Create redemption record
      const { error: redemptionError } = await supabase
        .from('reward_redemptions')
        .insert({
          user_id: subscription.id,
          reward_id: rewardId,
          points_cost: reward.points_cost,
          status: 'pending'
        });

      if (redemptionError) throw redemptionError;

      // Deduct points
      const { error: updateError } = await supabase
        .from('loyalty_points')
        .update({
          balance: state.userPoints.balance - reward.points_cost,
          total_redeemed: (state.userPoints.total_redeemed || 0) + reward.points_cost
        })
        .eq('user_id', subscription.id);

      if (updateError) throw updateError;

      // Refresh loyalty data
      await refreshLoyaltyData();

      setState(prev => ({ ...prev, isLoading: false }));
      return true;

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to redeem reward',
        isLoading: false
      }));
      return false;
    }
  }, [subscription?.id, state.userPoints, refreshLoyaltyData]);

  const completeChallenge = useCallback(async (challengeId: string): Promise<boolean> => {
    if (!subscription?.id) return false;

    try {
      // Update challenge progress
      const { error: progressError } = await supabase
        .from('user_challenge_progress')
        .upsert({
          user_id: subscription.id,
          challenge_id: challengeId,
          progress: 100,
          completed_at: new Date().toISOString()
        });

      if (progressError) throw progressError;

      // Get challenge details for points reward
      const { data: challenge } = await supabase
        .from('loyalty_challenges')
        .select('points_reward')
        .eq('id', challengeId)
        .single();

      if (challenge?.points_reward) {
        // Award points for challenge completion
        await awardPoints('challenge_completion', {
          challenge_id: challengeId,
          points_awarded: challenge.points_reward
        });
      }

      return true;

    } catch (error) {
      console.error('Error completing challenge:', error);
      return false;
    }
  }, [subscription?.id, awardPoints]);

  // =====================================================
  // EFFECTS
  // =====================================================

  useEffect(() => {
    if (subscription?.id) {
      refreshLoyaltyData();
    }
  }, [subscription?.id, refreshLoyaltyData]);

  // Set up real-time subscriptions for loyalty updates
  useEffect(() => {
    if (!subscription?.id) return;

    const pointsSubscription = supabase
      .channel('loyalty_points_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'loyalty_points',
          filter: `user_id=eq.${subscription.id}`
        },
        () => {
          refreshLoyaltyData();
        }
      )
      .subscribe();

    const achievementsSubscription = supabase
      .channel('user_achievements_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_achievements',
          filter: `user_id=eq.${subscription.id}`
        },
        () => {
          refreshLoyaltyData();
        }
      )
      .subscribe();

    return () => {
      pointsSubscription.unsubscribe();
      achievementsSubscription.unsubscribe();
    };
  }, [subscription?.id, refreshLoyaltyData]);

  // =====================================================
  // RETURN HOOK INTERFACE
  // =====================================================

  return {
    // State
    loyaltyData: state.loyaltyData,
    userPoints: state.userPoints,
    userTier: state.userTier,
    achievements: state.achievements,
    challenges: state.challenges,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    refreshLoyaltyData,
    awardPoints,
    redeemReward,
    completeChallenge
  };
}
