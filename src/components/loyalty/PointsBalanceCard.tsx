import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Coins, 
  TrendingUp, 
  History, 
  Gift,
  ArrowUpRight,
  Calendar
} from 'lucide-react';
import { LoyaltyPoints, PointsTransaction } from '@/types/loyalty';

interface PointsBalanceCardProps {
  points: LoyaltyPoints;
  recentTransactions?: PointsTransaction[];
  className?: string;
}

const PointsBalanceCard: React.FC<PointsBalanceCardProps> = ({ 
  points, 
  recentTransactions = [],
  className = '' 
}) => {
  const { language } = useLanguage();

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getPointsExpiryText = () => {
    if (!points.expiresAt) {
      return language === 'es' ? 'Sin expiración' : 'No expiration';
    }
    
    const daysUntilExpiry = Math.ceil((points.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 0) {
      return language === 'es' ? 'Expirados' : 'Expired';
    } else if (daysUntilExpiry <= 30) {
      return language === 'es' 
        ? `${daysUntilExpiry} días para expirar`
        : `${daysUntilExpiry} days to expire`;
    } else {
      return language === 'es' ? 'Válidos' : 'Valid';
    }
  };

  const getRecentActivity = () => {
    if (recentTransactions.length === 0) {
      return language === 'es' ? 'Sin actividad reciente' : 'No recent activity';
    }

    const latest = recentTransactions[0];
    const isEarned = latest.amount > 0;
    
    return {
      type: isEarned ? 'earned' : 'redeemed',
      amount: Math.abs(latest.amount),
      description: latest.description,
      date: latest.createdAt
    };
  };

  const recentActivity = getRecentActivity();

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 opacity-50"></div>
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-600" />
            {language === 'es' ? 'Puntos de Lealtad' : 'Loyalty Points'}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            {getPointsExpiryText()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {/* Main Balance */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {formatNumber(points.balance)}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {language === 'es' ? 'puntos disponibles' : 'points available'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {language === 'es' ? 'Progreso del mes' : 'Monthly progress'}
            </span>
            <span className="font-medium">
              {Math.round((points.balance / points.totalEarned) * 100)}%
            </span>
          </div>
          <Progress 
            value={(points.balance / points.totalEarned) * 100} 
            className="h-2"
          />
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm font-medium text-green-600">
                {language === 'es' ? 'Ganados' : 'Earned'}
              </span>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {formatNumber(points.totalEarned)}
            </div>
          </div>

          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
            <div className="flex items-center justify-center mb-1">
              <Gift className="h-4 w-4 text-purple-600 mr-1" />
              <span className="text-sm font-medium text-purple-600">
                {language === 'es' ? 'Canjeados' : 'Redeemed'}
              </span>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {formatNumber(points.totalRedeemed)}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {recentTransactions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {language === 'es' ? 'Actividad Reciente' : 'Recent Activity'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  recentActivity.type === 'earned' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {recentActivity.type === 'earned' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <Gift className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {recentActivity.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {recentActivity.date.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className={`text-sm font-bold ${
                recentActivity.type === 'earned' ? 'text-green-600' : 'text-red-600'
              }`}>
                {recentActivity.type === 'earned' ? '+' : '-'}
                {formatNumber(recentActivity.amount)}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" size="sm">
            <History className="h-4 w-4 mr-1" />
            {language === 'es' ? 'Historial' : 'History'}
          </Button>
          <Button className="flex-1" size="sm">
            <Gift className="h-4 w-4 mr-1" />
            {language === 'es' ? 'Canjear' : 'Redeem'}
          </Button>
        </div>

        {/* Last Updated */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {language === 'es' ? 'Actualizado' : 'Updated'}: {points.lastUpdated.toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsBalanceCard; 