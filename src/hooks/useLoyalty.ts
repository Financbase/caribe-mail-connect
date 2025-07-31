import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LoyaltyDashboardData, 
  LoyaltyPoints, 
  LoyaltyTier, 
  LoyaltyReward, 
  LoyaltyAchievement, 
  LoyaltyChallenge,
  PointsTransaction,
  LeaderboardEntry,
  CommunityGoal
} from '@/types/loyalty';

export function useLoyalty() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user loyalty points
  const { data: userPoints, isLoading: pointsLoading } = useQuery({
    queryKey: ['loyalty-points', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_loyalty_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data || {
        user_id: user.id,
        balance: 0,
        total_earned: 0,
        total_redeemed: 0,
        tier_id: 'bronze'
      };
    },
    enabled: !!user?.id
  });

  // Fetch user tier
  const { data: userTier, isLoading: tierLoading } = useQuery({
    queryKey: ['loyalty-tier', userPoints?.tier_id],
    queryFn: async () => {
      if (!userPoints?.tier_id) return null;
      
      const { data, error } = await supabase
        .from('loyalty_tiers')
        .select('*')
        .eq('id', userPoints.tier_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userPoints?.tier_id
  });

  // Fetch points transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['loyalty-transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  // Fetch available rewards
  const { data: rewards, isLoading: rewardsLoading } = useQuery({
    queryKey: ['loyalty-rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loyalty_rewards')
        .select('*')
        .eq('is_active', true)
        .order('points_required', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch user achievements
  const { data: userAchievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          loyalty_achievements (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  // Fetch user challenges
  const { data: userChallenges, isLoading: challengesLoading } = useQuery({
    queryKey: ['user-challenges', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_challenges')
        .select(`
          *,
          loyalty_challenges (*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  // Fetch leaderboard
  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['loyalty-leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard_entries')
        .select(`
          *,
          user_loyalty_points (balance, total_earned)
        `)
        .order('rank', { ascending: true })
        .limit(50);

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch community goals
  const { data: communityGoals, isLoading: goalsLoading } = useQuery({
    queryKey: ['community-goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_goals')
        .select('*')
        .eq('is_active', true)
        .order('end_date', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });

  // Earn points mutation
  const earnPointsMutation = useMutation({
    mutationFn: async ({ action, metadata }: { action: string; metadata?: any }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calculate-loyalty-points`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          action,
          metadata
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to earn points');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch loyalty data
      queryClient.invalidateQueries({ queryKey: ['loyalty-points', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['loyalty-transactions', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['user-achievements', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['user-challenges', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['loyalty-leaderboard'] });
    }
  });

  // Redeem reward mutation
  const redeemRewardMutation = useMutation({
    mutationFn: async (rewardId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data: reward, error: rewardError } = await supabase
        .from('loyalty_rewards')
        .select('*')
        .eq('id', rewardId)
        .single();

      if (rewardError) throw rewardError;
      if (!reward) throw new Error('Reward not found');

      // Check if user has enough points
      if (userPoints && userPoints.balance < reward.points_required) {
        throw new Error('Insufficient points');
      }

      // Create redemption record
      const { error: redemptionError } = await supabase
        .from('reward_redemptions')
        .insert({
          user_id: user.id,
          reward_id: rewardId,
          points_spent: reward.points_required,
          status: 'pending'
        });

      if (redemptionError) throw redemptionError;

      // Deduct points from user
      const { error: updateError } = await supabase
        .from('user_loyalty_points')
        .update({
          balance: userPoints.balance - reward.points_required,
          total_redeemed: userPoints.total_redeemed + reward.points_required
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      return reward;
    },
    onSuccess: () => {
      // Invalidate and refetch loyalty data
      queryClient.invalidateQueries({ queryKey: ['loyalty-points', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['loyalty-transactions', user?.id] });
    }
  });

  // Unlock achievement mutation
  const unlockAchievementMutation = useMutation({
    mutationFn: async (achievementId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_achievements')
        .upsert({
          user_id: user.id,
          achievement_id: achievementId,
          is_unlocked: true,
          unlocked_at: new Date().toISOString()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-achievements', user?.id] });
    }
  });

  // Complete challenge mutation
  const completeChallengeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_challenges')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('challenge_id', challengeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-challenges', user?.id] });
    }
  });

  // Combine all loading states
  const isLoading = pointsLoading || tierLoading || transactionsLoading || 
                   rewardsLoading || achievementsLoading || challengesLoading || 
                   leaderboardLoading || goalsLoading;

  // Combine all data into dashboard format
  const dashboardData: LoyaltyDashboardData | null = user ? {
    points: userPoints ? {
      balance: userPoints.balance,
      total_earned: userPoints.total_earned,
      total_redeemed: userPoints.total_redeemed,
      tier: userTier?.name || 'Bronze'
    } : null,
    tier: userTier ? {
      id: userTier.id,
      name: userTier.name,
      min_points: userTier.min_points,
      max_points: userTier.max_points,
      benefits: userTier.benefits || [],
      current_points: userPoints?.balance || 0,
      next_tier_points: userTier.max_points + 1,
      progress_percentage: userPoints ? Math.min(100, (userPoints.balance / userTier.max_points) * 100) : 0
    } : null,
    transactions: transactions || [],
    rewards: rewards || [],
    achievements: userAchievements || [],
    challenges: userChallenges || [],
    leaderboard: leaderboard || [],
    communityGoals: communityGoals || []
  } : null;

  return {
    data: dashboardData,
    loading: isLoading,
    error,
    earnPoints: earnPointsMutation.mutate,
    redeemReward: redeemRewardMutation.mutate,
    unlockAchievement: unlockAchievementMutation.mutate,
    completeChallenge: completeChallengeMutation.mutate,
    isEarningPoints: earnPointsMutation.isPending,
    isRedeemingReward: redeemRewardMutation.isPending,
    isUnlockingAchievement: unlockAchievementMutation.isPending,
    isCompletingChallenge: completeChallengeMutation.isPending
  };
} 