import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Coins, 
  Gift, 
  Star, 
  Users,
  TrendingUp,
  Award,
  Target,
  Calendar,
  Zap,
  Crown,
  Sparkles
} from 'lucide-react';
import LoyaltyDashboard from '@/components/loyalty/LoyaltyDashboard';
import { LoyaltyDashboardData, LoyaltyState } from '@/types/loyalty';

const Loyalty: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [loyaltyState, setLoyaltyState] = useState<LoyaltyState>({
    loading: true,
    error: null,
    data: null,
    settings: null
  });

  // Mock data - replace with actual API calls
  const mockLoyaltyData: LoyaltyDashboardData = {
    points: {
      id: '1',
      userId: user?.id || 'user123',
      balance: 2847,
      totalEarned: 3500,
      totalRedeemed: 653,
      lastUpdated: new Date(),
    },
    tier: {
      id: '2',
      name: 'Gold',
      displayName: 'Oro',
      description: 'Miembro Gold con beneficios exclusivos',
      minPoints: 2000,
      maxPoints: 4999,
      color: '#FFD700',
      icon: '👑',
      benefits: [
        {
          id: '1',
          name: 'Envío Gratis',
          description: 'Envío gratis en pedidos superiores a $50',
          icon: '🚚',
          isActive: true,
          value: 50,
          type: 'fixed'
        },
        {
          id: '2',
          name: 'Prioridad',
          description: 'Procesamiento prioritario de paquetes',
          icon: '⚡',
          isActive: true,
          type: 'feature'
        }
      ],
      upgradeRequirements: [
        {
          id: '1',
          type: 'points',
          value: 5000,
          description: '5000 puntos para Platinum',
          progress: 2847,
          completed: false
        }
      ]
    },
    nextTier: {
      id: '3',
      name: 'Platinum',
      displayName: 'Platino',
      description: 'Miembro Platinum con beneficios premium',
      minPoints: 5000,
      color: '#E5E4E2',
      icon: '💎',
      benefits: [],
      upgradeRequirements: []
    },
    recentTransactions: [
      {
        id: '1',
        userId: user?.id || 'user123',
        type: 'shipment_earned',
        amount: 100,
        balance: 2847,
        description: 'Puntos por envío #12345',
        createdAt: new Date('2024-01-15T10:30:00'),
      },
      {
        id: '2',
        userId: user?.id || 'user123',
        type: 'referral_bonus',
        amount: 500,
        balance: 2747,
        description: 'Bono por referir a María G.',
        createdAt: new Date('2024-01-14T15:45:00'),
      }
    ],
    availableRewards: [
      {
        id: '1',
        name: 'Crédito de Envío $25',
        description: 'Crédito para tu próximo envío',
        category: 'shipping_credits',
        pointsCost: 2500,
        originalValue: 25,
        currentValue: 25,
        image: '/rewards/shipping-credit.png',
        isAvailable: true,
        isLimited: false,
        currentRedemptions: 0,
        validFrom: new Date(),
      },
      {
        id: '2',
        name: 'Tarjeta de Regalo Amazon',
        description: 'Tarjeta de regalo de $50',
        category: 'gift_cards',
        pointsCost: 5000,
        originalValue: 50,
        currentValue: 50,
        image: '/rewards/amazon-gift-card.png',
        isAvailable: true,
        isLimited: true,
        maxRedemptions: 100,
        currentRedemptions: 45,
        validFrom: new Date(),
      },
      {
        id: '3',
        name: 'Donación a Caridad',
        description: 'Donación de $20 a organización benéfica',
        category: 'charitable_donations',
        pointsCost: 2000,
        originalValue: 20,
        currentValue: 20,
        image: '/rewards/charity.png',
        isAvailable: true,
        isLimited: false,
        currentRedemptions: 0,
        validFrom: new Date(),
      }
    ],
    achievements: [
      {
        id: '1',
        name: 'Primer Envío',
        description: 'Completa tu primer envío',
        category: 'shipments',
        icon: '📦',
        pointsReward: 100,
        isUnlocked: true,
        unlockedAt: new Date('2024-01-15'),
        progress: 1,
        maxProgress: 1,
        rarity: 'common',
        badgeImage: '/badges/first-shipment.png'
      },
      {
        id: '2',
        name: 'Referidor Estrella',
        description: 'Invita a 5 amigos',
        category: 'referrals',
        icon: '🌟',
        pointsReward: 500,
        isUnlocked: false,
        progress: 3,
        maxProgress: 5,
        rarity: 'rare',
        badgeImage: '/badges/referral-star.png'
      },
      {
        id: '3',
        name: 'Racha de 7 Días',
        description: 'Mantén actividad por 7 días consecutivos',
        category: 'streaks',
        icon: '🔥',
        pointsReward: 200,
        isUnlocked: false,
        progress: 5,
        maxProgress: 7,
        rarity: 'common',
        badgeImage: '/badges/7-day-streak.png'
      }
    ],
    activeChallenges: [
      {
        id: '1',
        name: 'Desafío de Enero',
        description: 'Envía 10 paquetes este mes',
        type: 'shipment_count',
        goal: 10,
        currentProgress: 7,
        pointsReward: 1000,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        isActive: true,
        isCompleted: false,
        participants: 150
      },
      {
        id: '2',
        name: 'Compartir en Redes',
        description: 'Comparte 5 veces en redes sociales',
        type: 'social_shares',
        goal: 5,
        currentProgress: 2,
        pointsReward: 300,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        isActive: true,
        isCompleted: false,
        participants: 75
      }
    ],
    streaks: [
      {
        id: '1',
        userId: user?.id || 'user123',
        type: 'shipments',
        currentStreak: 5,
        longestStreak: 12,
        lastActivity: new Date('2024-01-15'),
        nextMilestone: 7,
        milestoneReward: 100
      }
    ],
    leaderboard: [
      {
        userId: 'user1',
        username: 'María G.',
        points: 12500,
        tier: 'Platinum',
        rank: 1,
        achievements: 15,
        streak: 30
      },
      {
        userId: 'user2',
        username: 'Carlos R.',
        points: 8900,
        tier: 'Gold',
        rank: 2,
        achievements: 12,
        streak: 25
      },
      {
        userId: 'user3',
        username: 'Ana L.',
        points: 7200,
        tier: 'Gold',
        rank: 3,
        achievements: 10,
        streak: 18
      }
    ],
    communityGoals: [
      {
        id: '1',
        name: 'Meta Comunitaria: 1000 Envíos',
        description: 'Ayuda a la comunidad a alcanzar 1000 envíos',
        target: 1000,
        currentProgress: 750,
        reward: {
          type: 'points',
          value: 500,
          description: '500 puntos para todos los participantes'
        },
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        isActive: true,
        participants: 200,
        contribution: 3
      }
    ],
    analytics: {
      totalPoints: 2847,
      averagePointsPerUser: 1500,
      topEarners: [],
      popularRewards: [],
      tierDistribution: { Bronze: 40, Silver: 30, Gold: 20, Platinum: 10 },
      monthlyGrowth: 15,
      redemptionRate: 0.25,
      engagementScore: 85
    }
  };

  useEffect(() => {
    // Simulate API call
    const loadLoyaltyData = async () => {
      setLoyaltyState(prev => ({ ...prev, loading: true }));
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setLoyaltyState({
          loading: false,
          error: null,
          data: mockLoyaltyData,
          settings: {
            userId: user?.id || 'user123',
            emailNotifications: true,
            pushNotifications: true,
            birthdayReminders: true,
            achievementAlerts: true,
            challengeReminders: true,
            privacySettings: {
              showOnLeaderboard: true,
              shareAchievements: true,
              allowReferrals: true,
              publicProfile: true
            }
          }
        });
      } catch (error) {
        setLoyaltyState({
          loading: false,
          error: 'Error loading loyalty data',
          data: null,
          settings: null
        });
      }
    };

    loadLoyaltyData();
  }, [user?.id]);

  if (loyaltyState.loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (loyaltyState.error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{loyaltyState.error}</p>
        <Button onClick={() => window.location.reload()}>
          {language === 'es' ? 'Reintentar' : 'Retry'}
        </Button>
      </div>
    );
  }

  if (!loyaltyState.data) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {language === 'es' ? 'No se pudo cargar el programa de lealtad' : 'Could not load loyalty program'}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {language === 'es' ? 'Programa de Lealtad' : 'Loyalty Program'}
          </h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {language === 'es' 
            ? 'Gana puntos, sube de nivel y disfruta de recompensas exclusivas diseñadas para nuestros mejores clientes'
            : 'Earn points, level up and enjoy exclusive rewards designed for our best customers'
          }
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Coins className="h-6 w-6 text-yellow-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {loyaltyState.data.points.balance.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'es' ? 'Puntos Disponibles' : 'Available Points'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Crown className="h-6 w-6 text-yellow-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {loyaltyState.data.tier.displayName}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'es' ? 'Nivel Actual' : 'Current Tier'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-6 w-6 text-purple-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {loyaltyState.data.achievements.filter(a => a.isUnlocked).length}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'es' ? 'Logros Desbloqueados' : 'Achievements Unlocked'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {loyaltyState.data.streaks[0]?.currentStreak || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'es' ? 'Días de Racha' : 'Streak Days'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <LoyaltyDashboard data={loyaltyState.data} />

      {/* How to Earn Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            {language === 'es' ? 'Cómo Ganar Puntos' : 'How to Earn Points'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <Gift className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {language === 'es' ? 'Envíos' : 'Shipments'}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'es' ? '100 puntos por envío' : '100 points per shipment'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {language === 'es' ? 'Referencias' : 'Referrals'}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'es' ? '500 puntos por referido' : '500 points per referral'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-full">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {language === 'es' ? 'Reseñas' : 'Reviews'}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'es' ? '200 puntos por reseña' : '200 points per review'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Loyalty; 