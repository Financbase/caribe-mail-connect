import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  Star, 
  Target, 
  CheckCircle, 
  Clock,
  Zap,
  Trophy,
  Sparkles
} from 'lucide-react';
import { LoyaltyAchievement, AchievementCategory, AchievementRarity } from '@/types/loyalty';

interface AchievementsGridProps {
  achievements: LoyaltyAchievement[];
  onAchievementUnlock?: (achievement: LoyaltyAchievement) => void;
  className?: string;
}

const AchievementsGrid: React.FC<AchievementsGridProps> = ({ 
  achievements, 
  onAchievementUnlock,
  className = '' 
}) => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [selectedRarity, setSelectedRarity] = useState<AchievementRarity | 'all'>('all');

  const categories = [
    { value: 'all', label: language === 'es' ? 'Todas' : 'All' },
    { value: 'shipments', label: language === 'es' ? 'Envíos' : 'Shipments' },
    { value: 'referrals', label: language === 'es' ? 'Referencias' : 'Referrals' },
    { value: 'social', label: language === 'es' ? 'Social' : 'Social' },
    { value: 'reviews', label: language === 'es' ? 'Reseñas' : 'Reviews' },
    { value: 'streaks', label: language === 'es' ? 'Rachas' : 'Streaks' },
    { value: 'community', label: language === 'es' ? 'Comunidad' : 'Community' },
    { value: 'special_events', label: language === 'es' ? 'Eventos Especiales' : 'Special Events' },
  ];

  const rarities = [
    { value: 'all', label: language === 'es' ? 'Todas' : 'All' },
    { value: 'common', label: language === 'es' ? 'Común' : 'Common' },
    { value: 'rare', label: language === 'es' ? 'Raro' : 'Rare' },
    { value: 'epic', label: language === 'es' ? 'Épico' : 'Epic' },
    { value: 'legendary', label: language === 'es' ? 'Legendario' : 'Legendary' },
  ];

  const filteredAchievements = achievements.filter(achievement => {
    const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory;
    const matchesRarity = selectedRarity === 'all' || achievement.rarity === selectedRarity;
    return matchesCategory && matchesRarity;
  });

  const getCategoryIcon = (category: AchievementCategory) => {
    switch (category) {
      case 'shipments':
        return '📦';
      case 'referrals':
        return '👥';
      case 'social':
        return '📱';
      case 'reviews':
        return '⭐';
      case 'streaks':
        return '🔥';
      case 'community':
        return '🤝';
      case 'special_events':
        return '🎉';
      default:
        return '🏆';
    }
  };

  const getRarityColor = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-300 bg-gray-50';
      case 'rare':
        return 'border-blue-300 bg-blue-50';
      case 'epic':
        return 'border-purple-300 bg-purple-50';
      case 'legendary':
        return 'border-yellow-300 bg-yellow-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityBadgeColor = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800';
      case 'rare':
        return 'bg-blue-100 text-blue-800';
      case 'epic':
        return 'bg-purple-100 text-purple-800';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityIcon = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'common':
        return <Star className="h-3 w-3" />;
      case 'rare':
        return <Star className="h-3 w-3" />;
      case 'epic':
        return <Sparkles className="h-3 w-3" />;
      case 'legendary':
        return <Trophy className="h-3 w-3" />;
      default:
        return <Star className="h-3 w-3" />;
    }
  };

  const getProgressPercentage = (achievement: LoyaltyAchievement) => {
    return Math.min((achievement.progress / achievement.maxProgress) * 100, 100);
  };

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'es' ? 'Logros y Insignias' : 'Achievements & Badges'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'es' 
              ? 'Completa desafíos y desbloquea insignias exclusivas'
              : 'Complete challenges and unlock exclusive badges'
            }
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            <Award className="w-4 h-4 mr-1" />
            {unlockedCount}/{totalCount}
          </Badge>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round((unlockedCount / totalCount) * 100)}%
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === 'es' ? 'Progreso General' : 'Overall Progress'}
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {unlockedCount} {language === 'es' ? 'de' : 'of'} {totalCount}
            </span>
          </div>
          <Progress value={(unlockedCount / totalCount) * 100} className="h-3" />
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col">
          <label htmlFor="category-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {language === 'es' ? 'Categoría' : 'Category'}
          </label>
          <select 
            id="category-filter"
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value as AchievementCategory | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={language === 'es' ? 'Filtrar por categoría de logros' : 'Filter achievements by category'}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="rarity-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {language === 'es' ? 'Rareza' : 'Rarity'}
          </label>
          <select 
            id="rarity-filter"
            value={selectedRarity} 
            onChange={(e) => setSelectedRarity(e.target.value as AchievementRarity | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={language === 'es' ? 'Filtrar por rareza de logros' : 'Filter achievements by rarity'}
          >
            {rarities.map((rarity) => (
              <option key={rarity.value} value={rarity.value}>
                {rarity.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => {
          const progressPercentage = getProgressPercentage(achievement);
          const isUnlocked = achievement.isUnlocked;
          
          return (
            <Card 
              key={achievement.id} 
              className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
                isUnlocked ? 'ring-2 ring-green-200' : ''
              } ${getRarityColor(achievement.rarity)}`}
            >
              {/* Unlock Overlay */}
              {isUnlocked && (
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent pointer-events-none" />
              )}

              <CardContent className="p-6 space-y-4">
                {/* Badge Icon */}
                <div className="text-center">
                  <div className={`relative inline-block p-4 rounded-full text-4xl mb-3 ${
                    isUnlocked ? 'animate-pulse' : 'opacity-50'
                  }`}>
                    {achievement.icon}
                    {isUnlocked && (
                      <div className="absolute -top-1 -right-1">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Achievement Info */}
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>

                {/* Rarity Badge */}
                <div className="flex justify-center">
                  <Badge className={`text-xs ${getRarityBadgeColor(achievement.rarity)}`}>
                    {getRarityIcon(achievement.rarity)}
                    <span className="ml-1">
                      {rarities.find(r => r.value === achievement.rarity)?.label}
                    </span>
                  </Badge>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {language === 'es' ? 'Progreso' : 'Progress'}
                    </span>
                    <span className="font-medium">
                      {achievement.progress} / {achievement.maxProgress}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                {/* Points Reward */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    <Zap className="h-3 w-3" />
                    <span className="font-medium">
                      +{achievement.pointsReward} {language === 'es' ? 'puntos' : 'points'}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="text-center">
                  {isUnlocked ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {language === 'es' ? 'Desbloqueado' : 'Unlocked'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        {language === 'es' ? 'En Progreso' : 'In Progress'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Unlock Date */}
                {isUnlocked && achievement.unlockedAt && (
                  <div className="text-center text-xs text-gray-500">
                    {language === 'es' ? 'Desbloqueado el' : 'Unlocked on'}: {achievement.unlockedAt.toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {language === 'es' ? 'No se encontraron logros' : 'No achievements found'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'es' 
              ? 'Intenta ajustar tus filtros de búsqueda'
              : 'Try adjusting your search filters'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default AchievementsGrid; 