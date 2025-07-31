import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Users, 
  Clock, 
  Trophy, 
  Zap,
  Calendar,
  TrendingUp,
  Heart,
  Star
} from 'lucide-react';
import { CommunityGoal, CommunityReward } from '@/types/loyalty';
import styles from './CommunityGoals.module.css';

interface CommunityGoalsProps {
  goals: CommunityGoal[];
  onGoalContribute?: (goal: CommunityGoal) => void;
  className?: string;
}

const CommunityGoals: React.FC<CommunityGoalsProps> = ({ 
  goals, 
  onGoalContribute,
  className = '' 
}) => {
  const { language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGoalIcon = (goal: CommunityGoal) => {
    if (goal.name.toLowerCase().includes('envío')) return '📦';
    if (goal.name.toLowerCase().includes('referencia')) return '👥';
    if (goal.name.toLowerCase().includes('comunidad')) return '🤝';
    if (goal.name.toLowerCase().includes('donación')) return '❤️';
    return '🎯';
  };

  const getRewardIcon = (reward: CommunityReward) => {
    switch (reward.type) {
      case 'points':
        return <Zap className="h-4 w-4" />;
      case 'feature':
        return <Star className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
    }
  };

  const getTimeRemaining = (endDate: Date) => {
    const timeLeft = endDate.getTime() - currentTime.getTime();
    
    if (timeLeft <= 0) {
      return { expired: true, text: language === 'es' ? 'Expirado' : 'Expired' };
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return { 
        expired: false, 
        text: language === 'es' ? `${days}d ${hours}h` : `${days}d ${hours}h` 
      };
    } else if (hours > 0) {
      return { 
        expired: false, 
        text: language === 'es' ? `${hours}h ${minutes}m` : `${hours}h ${minutes}m` 
      };
    } else {
      return { 
        expired: false, 
        text: language === 'es' ? `${minutes}m` : `${minutes}m` 
      };
    }
  };

  const getProgressPercentage = (goal: CommunityGoal) => {
    return Math.min((goal.currentProgress / goal.target) * 100, 100);
  };

  const getStatusColor = (goal: CommunityGoal) => {
    if (!goal.isActive) {
      return 'border-gray-200 bg-gray-50';
    }
    const progress = getProgressPercentage(goal);
    if (progress >= 100) {
      return 'border-green-200 bg-green-50';
    } else if (progress >= 80) {
      return 'border-yellow-200 bg-yellow-50';
    } else if (progress >= 50) {
      return 'border-blue-200 bg-blue-50';
    }
    return 'border-orange-200 bg-orange-50';
  };

  const getRewardDisplay = (reward: CommunityReward) => {
    switch (reward.type) {
      case 'points':
        return `${reward.value} ${language === 'es' ? 'puntos' : 'points'}`;
      case 'feature':
        return reward.description;
      case 'event':
        return reward.description;
      default:
        return reward.description;
    }
  };

  const getProgressClass = (percentage: number) => {
    const roundedPercentage = Math.round(percentage);
    return styles[`progress${roundedPercentage}`] || styles.progress0;
  };

  const getTimeRemainingClass = (timeRemaining: { expired: boolean; text: string }) => {
    if (timeRemaining.expired) {
      return styles.timeRemainingExpired;
    } else if (timeRemaining.text.includes('h') || timeRemaining.text.includes('m')) {
      return styles.timeRemainingWarning;
    }
    return styles.timeRemainingNormal;
  };

  const activeGoals = goals.filter(g => g.isActive);
  const completedGoals = goals.filter(g => !g.isActive && getProgressPercentage(g) >= 100);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'es' ? 'Metas Comunitarias' : 'Community Goals'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'es' 
              ? 'Trabaja junto con la comunidad para alcanzar metas increíbles'
              : 'Work together with the community to reach amazing goals'
            }
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            <Users className="w-4 h-4 mr-1" />
            {activeGoals.length} {language === 'es' ? 'activas' : 'active'}
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Trophy className="w-4 h-4 mr-1" />
            {completedGoals.length} {language === 'es' ? 'completadas' : 'completed'}
          </Badge>
        </div>
      </div>

      {/* Active Goals */}
      <div className="space-y-4">
        {activeGoals.map((goal) => {
          const timeRemaining = getTimeRemaining(goal.endDate);
          const progressPercentage = getProgressPercentage(goal);
          const isNearCompletion = progressPercentage >= 80;
          const isCompleted = progressPercentage >= 100;
          
          return (
            <Card key={goal.id} className={`${styles.goalCard} ${getStatusColor(goal)}`}>
              {/* Progress indicator */}
              <div className={`${styles.progressIndicator} ${getProgressClass(progressPercentage)}`} />
              
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Goal Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">
                        {getGoalIcon(goal)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {goal.name}
                          </h3>
                          {isCompleted && (
                            <Badge className="bg-green-100 text-green-800">
                              <Trophy className="h-3 w-3 mr-1" />
                              {language === 'es' ? 'Completado' : 'Completed'}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {goal.description}
                        </p>
                        
                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              {language === 'es' ? 'Progreso Comunitario' : 'Community Progress'}
                            </span>
                            <span className="font-medium">
                              {goal.currentProgress.toLocaleString()} / {goal.target.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={progressPercentage} className="h-3" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{Math.round(progressPercentage)}% {language === 'es' ? 'completado' : 'complete'}</span>
                            <span>{goal.participants} {language === 'es' ? 'participantes' : 'participants'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Goal Stats */}
                  <div className="flex flex-col items-end gap-3">
                    {/* Time Remaining */}
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>
                          {language === 'es' ? 'Tiempo restante' : 'Time remaining'}
                        </span>
                      </div>
                      <div className={`font-semibold ${getTimeRemainingClass(timeRemaining)}`}>
                        {timeRemaining.text}
                      </div>
                    </div>

                    {/* Reward */}
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        {getRewardIcon(goal.reward)}
                        <span>{language === 'es' ? 'Recompensa' : 'Reward'}</span>
                      </div>
                      <div className="font-bold text-purple-600">
                        {getRewardDisplay(goal.reward)}
                      </div>
                    </div>

                    {/* Your Contribution */}
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'es' ? 'Tu Contribución' : 'Your Contribution'}
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {goal.contribution.toLocaleString()}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex gap-2">
                      {isCompleted ? (
                        <Button variant="outline" size="sm" disabled>
                          <Trophy className="h-4 w-4 mr-1" />
                          {language === 'es' ? '¡Completado!' : 'Completed!'}
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          className={isNearCompletion ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                          onClick={() => onGoalContribute?.(goal)}
                        >
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {language === 'es' ? 'Contribuir' : 'Contribute'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Goal Dates */}
                <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {language === 'es' ? 'Inicio' : 'Start'}: {goal.startDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {language === 'es' ? 'Fin' : 'End'}: {goal.endDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {language === 'es' ? 'Metas Completadas' : 'Completed Goals'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedGoals.map((goal) => (
              <Card key={goal.id} className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getGoalIcon(goal)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {goal.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {language === 'es' ? 'Completado el' : 'Completed on'}: {goal.endDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        {getRewardDisplay(goal.reward)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {goal.participants} {language === 'es' ? 'participantes' : 'participants'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {goals.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'es' ? 'Metas Totales' : 'Total Goals'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {goals.reduce((sum, goal) => sum + goal.participants, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'es' ? 'Participantes Totales' : 'Total Participants'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(goals.reduce((sum, goal) => sum + getProgressPercentage(goal), 0) / goals.length)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'es' ? 'Progreso Promedio' : 'Average Progress'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {language === 'es' ? 'No hay metas comunitarias' : 'No community goals'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'es' 
              ? 'Vuelve más tarde para nuevas metas comunitarias'
              : 'Check back later for new community goals'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityGoals; 