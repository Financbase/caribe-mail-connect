import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Clock, 
  Users, 
  Trophy, 
  Zap,
  Calendar,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { LoyaltyChallenge, ChallengeType } from '@/types/loyalty';
import styles from './ChallengesList.module.css';

interface ChallengesListProps {
  challenges: LoyaltyChallenge[];
  onChallengeComplete?: (challenge: LoyaltyChallenge) => void;
  className?: string;
}

const ChallengesList: React.FC<ChallengesListProps> = ({ 
  challenges, 
  onChallengeComplete,
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

  const getChallengeIcon = (type: ChallengeType) => {
    switch (type) {
      case 'shipment_count':
        return '📦';
      case 'referral_count':
        return '👥';
      case 'social_shares':
        return '📱';
      case 'review_count':
        return '⭐';
      case 'streak_days':
        return '🔥';
      case 'community_contribution':
        return '🤝';
      default:
        return '🎯';
    }
  };

  const getChallengeTypeLabel = (type: ChallengeType) => {
    switch (type) {
      case 'shipment_count':
        return language === 'es' ? 'Envíos' : 'Shipments';
      case 'referral_count':
        return language === 'es' ? 'Referencias' : 'Referrals';
      case 'social_shares':
        return language === 'es' ? 'Compartir Social' : 'Social Shares';
      case 'review_count':
        return language === 'es' ? 'Reseñas' : 'Reviews';
      case 'streak_days':
        return language === 'es' ? 'Rachas' : 'Streaks';
      case 'community_contribution':
        return language === 'es' ? 'Comunidad' : 'Community';
      default:
        return language === 'es' ? 'Desafío' : 'Challenge';
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

  const getProgressPercentage = (challenge: LoyaltyChallenge) => {
    return Math.min((challenge.currentProgress / challenge.goal) * 100, 100);
  };

  const getStatusColor = (challenge: LoyaltyChallenge) => {
    if (challenge.isCompleted) {
      return 'border-green-200 bg-green-50';
    }
    if (!challenge.isActive) {
      return 'border-gray-200 bg-gray-50';
    }
    const progress = getProgressPercentage(challenge);
    if (progress >= 80) {
      return 'border-yellow-200 bg-yellow-50';
    }
    return 'border-blue-200 bg-blue-50';
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

  const activeChallenges = challenges.filter(c => c.isActive);
  const completedChallenges = challenges.filter(c => c.isCompleted);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'es' ? 'Desafíos Activos' : 'Active Challenges'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'es' 
              ? 'Completa desafíos para ganar puntos extra'
              : 'Complete challenges to earn bonus points'
            }
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            <Target className="w-4 h-4 mr-1" />
            {activeChallenges.length} {language === 'es' ? 'activos' : 'active'}
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Trophy className="w-4 h-4 mr-1" />
            {completedChallenges.length} {language === 'es' ? 'completados' : 'completed'}
          </Badge>
        </div>
      </div>

      {/* Active Challenges */}
      <div className="space-y-4">
        {activeChallenges.map((challenge) => {
          const timeRemaining = getTimeRemaining(challenge.endDate);
          const progressPercentage = getProgressPercentage(challenge);
          const isNearCompletion = progressPercentage >= 80;
          
          return (
            <Card key={challenge.id} className={`${styles.challengeCard} ${getStatusColor(challenge)}`}>
              {/* Progress indicator */}
              <div className={`${styles.progressIndicator} ${getProgressClass(progressPercentage)}`} />
              
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Challenge Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">
                        {getChallengeIcon(challenge.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {challenge.name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {getChallengeTypeLabel(challenge.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {challenge.description}
                        </p>
                        
                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              {language === 'es' ? 'Progreso' : 'Progress'}
                            </span>
                            <span className="font-medium">
                              {challenge.currentProgress} / {challenge.goal}
                            </span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Challenge Stats */}
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

                    {/* Points Reward */}
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Zap className="h-4 w-4" />
                        <span>{language === 'es' ? 'Recompensa' : 'Reward'}</span>
                      </div>
                      <div className="font-bold text-yellow-600">
                        +{challenge.pointsReward} {language === 'es' ? 'puntos' : 'points'}
                      </div>
                    </div>

                    {/* Participants */}
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>{language === 'es' ? 'Participantes' : 'Participants'}</span>
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {challenge.participants}
                        {challenge.maxParticipants && ` / ${challenge.maxParticipants}`}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex gap-2">
                      {challenge.isCompleted ? (
                        <Button variant="outline" size="sm" disabled>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {language === 'es' ? 'Completado' : 'Completed'}
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          className={isNearCompletion ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                          onClick={() => onChallengeComplete?.(challenge)}
                        >
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {language === 'es' ? 'Ver Progreso' : 'View Progress'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Challenge Dates */}
                <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {language === 'es' ? 'Inicio' : 'Start'}: {challenge.startDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {language === 'es' ? 'Fin' : 'End'}: {challenge.endDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {language === 'es' ? 'Desafíos Completados' : 'Completed Challenges'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedChallenges.map((challenge) => (
              <Card key={challenge.id} className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getChallengeIcon(challenge.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {challenge.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {language === 'es' ? 'Completado el' : 'Completed on'}: {challenge.completedAt?.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        +{challenge.pointsReward}
                      </div>
                      <div className="text-xs text-gray-500">
                        {language === 'es' ? 'puntos' : 'points'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeChallenges.length === 0 && completedChallenges.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {language === 'es' ? 'No hay desafíos disponibles' : 'No challenges available'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'es' 
              ? 'Vuelve más tarde para nuevos desafíos'
              : 'Check back later for new challenges'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ChallengesList; 