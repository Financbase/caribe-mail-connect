import { useState, useEffect } from 'react';
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
} from '../types/loyalty';

// Mock data for testing
const mockLoyaltyData: LoyaltyDashboardData = {
  points: {
    balance: 1250,
    total_earned: 2500,
    total_redeemed: 1250,
    tier: 'Silver'
  },
  tier: {
    id: 'silver',
    name: 'Silver',
    min_points: 1000,
    max_points: 4999,
    benefits: [
      'Free shipping on orders over $50',
      'Priority customer support',
      'Exclusive monthly offers'
    ],
    current_points: 1250,
    next_tier_points: 5000,
    progress_percentage: 25
  },
  rewards: [
    {
      id: '1',
      name: 'Free Shipping',
      description: 'Free shipping on your next order',
      points_cost: 500,
      category: 'shipping',
      is_available: true,
      image_url: '/rewards/free-shipping.svg'
    },
    {
      id: '2',
      name: '$10 Gift Card',
      description: 'Redeem for a $10 gift card',
      points_cost: 1000,
      category: 'gift_cards',
      is_available: true,
      image_url: '/rewards/gift-card.svg'
    },
    {
      id: '3',
      name: 'Priority Support',
      description: 'Get priority customer support for 30 days',
      points_cost: 300,
      category: 'service',
      is_available: true,
      image_url: '/rewards/priority-support.svg'
    }
  ],
  achievements: [
    {
      id: '1',
      name: 'First Shipment',
      description: 'Complete your first shipment',
      points_reward: 100,
      rarity: 'common',
      is_unlocked: true,
      progress: 1,
      max_progress: 1,
      unlocked_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Social Butterfly',
      description: 'Share 5 times on social media',
      points_reward: 250,
      rarity: 'rare',
      is_unlocked: false,
      progress: 3,
      max_progress: 5,
      unlocked_at: null
    }
  ],
  challenges: [
    {
      id: '1',
      name: 'Weekly Warrior',
      description: 'Complete 10 shipments this week',
      points_reward: 500,
      goal: 10,
      current_progress: 7,
      end_date: '2024-01-21T23:59:59Z',
      is_completed: false,
      is_active: true
    }
  ],
  leaderboard: [
    {
      user_id: 'user1',
      username: 'JohnDoe',
      points: 5000,
      tier: 'Gold',
      rank: 1
    },
    {
      user_id: 'user2',
      username: 'JaneSmith',
      points: 3500,
      tier: 'Silver',
      rank: 2
    },
    {
      user_id: 'current',
      username: 'You',
      points: 1250,
      tier: 'Silver',
      rank: 15
    }
  ],
  community_goals: [
    {
      id: '1',
      name: 'Community Milestone',
      description: 'Collect 100,000 points as a community',
      goal: 100000,
      current_progress: 75000,
      reward: 'Double points weekend',
      end_date: '2024-01-31T23:59:59Z',
      is_active: true
    }
  ],
  recent_transactions: [
    {
      id: '1',
      transaction_type: 'shipment',
      amount: 100,
      balance: 1250,
      description: 'Puntos por envío - Valor: $100',
      created_at: '2024-01-20T14:30:00Z'
    },
    {
      id: '2',
      transaction_type: 'referral',
      amount: 500,
      balance: 1150,
      description: 'Bono por referido - Nuevo cliente',
      created_at: '2024-01-19T09:15:00Z'
    }
  ]
};

export const useLoyaltyMock = () => {
  const [data, setData] = useState<LoyaltyDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setData(mockLoyaltyData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const earnPoints = async (action: string, metadata?: any) => {
    // Simulate earning points
    const pointsToAdd = action === 'shipment' ? 100 : 50;
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        points: {
          ...prev.points,
          balance: prev.points.balance + pointsToAdd,
          total_earned: prev.points.total_earned + pointsToAdd
        },
        recent_transactions: [
          {
            id: Date.now().toString(),
            transaction_type: action as any,
            amount: pointsToAdd,
            balance: prev.points.balance + pointsToAdd,
            description: `Mock ${action} points`,
            created_at: new Date().toISOString()
          },
          ...prev.recent_transactions.slice(0, 9)
        ]
      };
    });
    return { success: true, pointsAwarded: pointsToAdd };
  };

  const redeemReward = async (rewardId: string) => {
    // Simulate redeeming a reward
    const reward = data?.rewards.find(r => r.id === rewardId);
    if (!reward || reward.points_cost > (data?.points.balance || 0)) {
      throw new Error('Insufficient points or reward not available');
    }

    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        points: {
          ...prev.points,
          balance: prev.points.balance - reward.points_cost,
          total_redeemed: prev.points.total_redeemed + reward.points_cost
        }
      };
    });
    return { success: true, reward };
  };

  const unlockAchievement = async (achievementId: string) => {
    // Simulate unlocking an achievement
    setData(prev => {
      if (!prev) return prev;
      const achievement = prev.achievements.find(a => a.id === achievementId);
      if (!achievement) return prev;

      return {
        ...prev,
        achievements: prev.achievements.map(a => 
          a.id === achievementId 
            ? { ...a, is_unlocked: true, unlocked_at: new Date().toISOString() }
            : a
        )
      };
    });
    return { success: true };
  };

  const completeChallenge = async (challengeId: string) => {
    // Simulate completing a challenge
    setData(prev => {
      if (!prev) return prev;
      const challenge = prev.challenges.find(c => c.id === challengeId);
      if (!challenge) return prev;

      return {
        ...prev,
        challenges: prev.challenges.map(c => 
          c.id === challengeId 
            ? { ...c, is_completed: true, current_progress: c.goal }
            : c
        )
      };
    });
    return { success: true };
  };

  return {
    data,
    loading,
    error,
    earnPoints,
    redeemReward,
    unlockAchievement,
    completeChallenge,
    refetch: () => {
      setLoading(true);
      setTimeout(() => {
        setData(mockLoyaltyData);
        setLoading(false);
      }, 500);
    }
  };
}; 