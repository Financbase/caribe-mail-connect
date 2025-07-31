import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Coins, 
  Trophy, 
  Gift, 
  TrendingUp, 
  Users, 
  Star,
  Award,
  Target,
  Calendar,
  Zap
} from 'lucide-react';
import { 
  LoyaltyDashboardData, 
  LoyaltyPoints, 
  LoyaltyTier,
  LoyaltyReward,
  LoyaltyAchievement,
  LoyaltyChallenge,
  LeaderboardEntry
} from '@/types/loyalty';
import { useLoyalty } from '@/hooks/useLoyalty';
import PointsBalanceCard from './PointsBalanceCard';
import TierStatusCard from './TierStatusCard';
import RewardsCatalog from './RewardsCatalog';
import AchievementsGrid from './AchievementsGrid';
import ChallengesList from './ChallengesList';
import LeaderboardTable from './LeaderboardTable';
import CommunityGoals from './CommunityGoals';
import CelebrationModal from './CelebrationModal';

interface LoyaltyDashboardProps {
  className?: string;
}

const LoyaltyDashboard: React.FC<LoyaltyDashboardProps> = ({ className = '' }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<any>(null);

  // Use real loyalty hook for testing with deployed edge functions
  const { data: mockData, loading, error, earnPoints, redeemReward, unlockAchievement, completeChallenge } = useLoyalty();

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {language === 'es' ? 'Cargando programa de lealtad...' : 'Loading loyalty program...'}
          </p>
        </div>
      </div>
    );
  }

  if (error || !mockData) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <div className="text-center">
          <p className="text-destructive mb-4">
            {language === 'es' ? 'Error al cargar el programa de lealtad' : 'Error loading loyalty program'}
          </p>
          <Button onClick={() => window.location.reload()}>
            {language === 'es' ? 'Reintentar' : 'Retry'}
          </Button>
        </div>
      </div>
    );
  }

  const handleAchievementUnlock = (achievement: LoyaltyAchievement) => {
    setCelebrationData({
      type: 'achievement',
      title: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      points: achievement.pointsReward
    });
    setShowCelebration(true);
  };

  const handleTierUpgrade = (newTier: LoyaltyTier) => {
    setCelebrationData({
      type: 'tier_upgrade',
      title: `¡Felicidades! ${newTier.displayName}`,
      description: `Has alcanzado el nivel ${newTier.displayName}`,
      icon: newTier.icon,
      color: newTier.color
    });
    setShowCelebration(true);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {language === 'es' ? 'Programa de Lealtad' : 'Loyalty Program'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'es' ? 'Gana puntos y desbloquea recompensas exclusivas' : 'Earn points and unlock exclusive rewards'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {language === 'es' ? 'Nivel' : 'Tier'}: {mockData.tier.name}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            {language === 'es' ? 'Resumen' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            {language === 'es' ? 'Recompensas' : 'Rewards'}
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            {language === 'es' ? 'Logros' : 'Achievements'}
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            {language === 'es' ? 'Desafíos' : 'Challenges'}
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {language === 'es' ? 'Ranking' : 'Leaderboard'}
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {language === 'es' ? 'Comunidad' : 'Community'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PointsBalanceCard 
              points={mockData.points} 
              onEarnPoints={earnPoints}
            />
            <TierStatusCard 
              tier={mockData.tier} 
              onTierUpgrade={handleTierUpgrade}
            />
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <RewardsCatalog 
            rewards={mockData.rewards} 
            onRedeemReward={redeemReward}
            userPoints={mockData.points.balance}
          />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <AchievementsGrid 
            achievements={mockData.achievements} 
            onAchievementUnlock={handleAchievementUnlock}
          />
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <ChallengesList 
            challenges={mockData.challenges} 
            onChallengeComplete={completeChallenge}
          />
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <LeaderboardTable 
            leaderboard={mockData.leaderboard} 
            userRank={mockData.leaderboard.find(entry => entry.user_id === 'current')?.rank || 0}
          />
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <CommunityGoals 
            goals={mockData.community_goals} 
            userContribution={mockData.community_goals[0]?.contribution || 0}
          />
        </TabsContent>
      </Tabs>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        data={celebrationData}
      />
    </div>
  );
};

export default LoyaltyDashboard; 