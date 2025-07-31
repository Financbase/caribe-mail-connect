import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  TrendingUp,
  Users,
  Award,
  Zap
} from 'lucide-react';
import { LeaderboardEntry } from '@/types/loyalty';

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
  currentUserId?: string;
  className?: string;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ 
  leaderboard, 
  currentUserId,
  className = '' 
}) => {
  const { language } = useLanguage();
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-gray-600">{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 2:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 3:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'bg-gray-100 text-gray-800';
      case 'Gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'Silver':
        return 'bg-gray-100 text-gray-600';
      case 'Bronze':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const filteredLeaderboard = leaderboard.slice(0, 50); // Show top 50

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'es' ? 'Clasificación de Líderes' : 'Leaderboard'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'es' 
              ? 'Los mejores miembros de nuestra comunidad'
              : 'Top members of our community'
            }
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            <Trophy className="w-4 h-4 mr-1" />
            {leaderboard.length} {language === 'es' ? 'miembros' : 'members'}
          </Badge>
        </div>
      </div>

      {/* Time Filter */}
      <div className="flex gap-2">
        <Button 
          variant={timeFilter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setTimeFilter('all')}
        >
          {language === 'es' ? 'Todo el Tiempo' : 'All Time'}
        </Button>
        <Button 
          variant={timeFilter === 'month' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setTimeFilter('month')}
        >
          {language === 'es' ? 'Este Mes' : 'This Month'}
        </Button>
        <Button 
          variant={timeFilter === 'week' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setTimeFilter('week')}
        >
          {language === 'es' ? 'Esta Semana' : 'This Week'}
        </Button>
      </div>

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            {language === 'es' ? 'Top 50 Líderes' : 'Top 50 Leaders'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLeaderboard.map((entry, index) => {
              const isCurrentUser = entry.userId === currentUserId;
              const rank = index + 1;
              
              return (
                <div 
                  key={entry.userId}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    isCurrentUser 
                      ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(rank)}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                      {entry.avatar ? (
                        <img 
                          src={entry.avatar} 
                          alt={entry.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {entry.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {isCurrentUser && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                          <Star className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${
                          isCurrentUser ? 'text-blue-600' : 'text-gray-900 dark:text-white'
                        }`}>
                          {entry.username}
                        </span>
                        {isCurrentUser && (
                          <Badge variant="outline" className="text-xs">
                            {language === 'es' ? 'Tú' : 'You'}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getTierColor(entry.tier)}`}>
                          {entry.tier}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Award className="h-3 w-3" />
                          {entry.achievements}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Zap className="h-3 w-3" />
                          {entry.streak}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900 dark:text-white">
                      {formatNumber(entry.points)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {language === 'es' ? 'puntos' : 'points'}
                    </div>
                  </div>

                  {/* Rank Badge */}
                  <div className="hidden sm:block">
                    <Badge className={`${getRankBadgeColor(rank)}`}>
                      #{rank}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current User Position */}
      {currentUserId && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900">
                    {language === 'es' ? 'Tu Posición' : 'Your Position'}
                  </p>
                  <p className="text-sm text-blue-700">
                    {language === 'es' 
                      ? 'Mantén tu actividad para subir en la clasificación'
                      : 'Keep up your activity to climb the ranks'
                    }
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                {language === 'es' ? 'Ver Mi Perfil' : 'View My Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {leaderboard.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'es' ? 'Miembros Activos' : 'Active Members'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(leaderboard.reduce((sum, entry) => sum + entry.points, 0))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'es' ? 'Puntos Totales' : 'Total Points'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(leaderboard.reduce((sum, entry) => sum + entry.achievements, 0) / leaderboard.length)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'es' ? 'Logros Promedio' : 'Avg Achievements'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaderboardTable; 