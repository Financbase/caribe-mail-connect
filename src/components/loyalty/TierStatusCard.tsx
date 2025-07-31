import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Crown, 
  Star, 
  ArrowUp, 
  CheckCircle, 
  Clock,
  Zap,
  Gift,
  Shield
} from 'lucide-react';
import { LoyaltyTier, TierBenefit, UpgradeRequirement } from '@/types/loyalty';

interface TierStatusCardProps {
  tier: LoyaltyTier;
  nextTier?: LoyaltyTier;
  onTierUpgrade?: (newTier: LoyaltyTier) => void;
  className?: string;
}

const TierStatusCard: React.FC<TierStatusCardProps> = ({ 
  tier, 
  nextTier,
  onTierUpgrade,
  className = '' 
}) => {
  const { language } = useLanguage();

  const getTierColor = (tierName: string) => {
    switch (tierName) {
      case 'Bronze':
        return 'from-amber-600 to-orange-600';
      case 'Silver':
        return 'from-gray-400 to-gray-600';
      case 'Gold':
        return 'from-yellow-500 to-amber-600';
      case 'Platinum':
        return 'from-gray-300 to-gray-500';
      default:
        return 'from-blue-500 to-purple-600';
    }
  };

  const getTierIcon = (tierName: string) => {
    switch (tierName) {
      case 'Bronze':
        return '🥉';
      case 'Silver':
        return '🥈';
      case 'Gold':
        return '🥇';
      case 'Platinum':
        return '💎';
      default:
        return '⭐';
    }
  };

  const calculateUpgradeProgress = () => {
    if (!nextTier) return 100;
    
    const currentPoints = tier.minPoints;
    const nextTierPoints = nextTier.minPoints;
    const progress = ((currentPoints - (tier.minPoints - 1000)) / (nextTierPoints - (tier.minPoints - 1000))) * 100;
    
    return Math.min(Math.max(progress, 0), 100);
  };

  const getBenefitIcon = (benefit: TierBenefit) => {
    switch (benefit.type) {
      case 'percentage':
        return <Zap className="h-4 w-4" />;
      case 'fixed':
        return <Gift className="h-4 w-4" />;
      case 'feature':
        return <Shield className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const formatBenefitValue = (benefit: TierBenefit) => {
    if (benefit.type === 'percentage' && benefit.value) {
      return `${benefit.value}%`;
    } else if (benefit.type === 'fixed' && benefit.value) {
      return `$${benefit.value}`;
    }
    return '';
  };

  const upgradeProgress = calculateUpgradeProgress();

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Background gradient based on tier */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getTierColor(tier.name)} opacity-10`}></div>
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" style={{ color: tier.color }} />
            {language === 'es' ? 'Nivel de Membresía' : 'Membership Tier'}
          </CardTitle>
          <Badge 
            className="text-xs font-bold"
            style={{ 
              backgroundColor: tier.color,
              color: 'white'
            }}
          >
            {tier.displayName}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {/* Current Tier Display */}
        <div className="text-center">
          <div className="text-6xl mb-2">
            {getTierIcon(tier.name)}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {tier.displayName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {tier.description}
          </p>
        </div>

        {/* Upgrade Progress */}
        {nextTier && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {language === 'es' ? 'Progreso hacia' : 'Progress to'} {nextTier.displayName}
              </span>
              <span className="font-medium">
                {Math.round(upgradeProgress)}%
              </span>
            </div>
            <Progress value={upgradeProgress} className="h-3" />
            <p className="text-xs text-gray-500 text-center">
              {language === 'es' 
                ? `${nextTier.minPoints - tier.minPoints} puntos más para ${nextTier.displayName}`
                : `${nextTier.minPoints - tier.minPoints} more points for ${nextTier.displayName}`
              }
            </p>
          </div>
        )}

        {/* Tier Benefits */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {language === 'es' ? 'Beneficios Activos' : 'Active Benefits'}
          </h4>
          <div className="space-y-2">
            {tier.benefits.filter(b => b.isActive).map((benefit) => (
              <div 
                key={benefit.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    {getBenefitIcon(benefit)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {benefit.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {benefit.description}
                    </p>
                  </div>
                </div>
                {benefit.value && (
                  <Badge variant="secondary" className="text-xs">
                    {formatBenefitValue(benefit)}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Requirements */}
        {tier.upgradeRequirements.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {language === 'es' ? 'Requisitos de Actualización' : 'Upgrade Requirements'}
            </h4>
            <div className="space-y-2">
              {tier.upgradeRequirements.map((requirement) => (
                <div 
                  key={requirement.id}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      requirement.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {requirement.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {requirement.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {requirement.progress} / {requirement.value}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Progress 
                      value={(requirement.progress / requirement.value) * 100} 
                      className="w-16 h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" size="sm">
            <Star className="h-4 w-4 mr-1" />
            {language === 'es' ? 'Ver Todos los Beneficios' : 'View All Benefits'}
          </Button>
          {nextTier && upgradeProgress >= 100 && (
            <Button 
              className="flex-1" 
              size="sm"
              onClick={() => onTierUpgrade?.(nextTier)}
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              {language === 'es' ? 'Actualizar a' : 'Upgrade to'} {nextTier.displayName}
            </Button>
          )}
        </div>

        {/* Tier Info */}
        <div className="text-center text-xs text-gray-500">
          <p>
            {language === 'es' 
              ? `Nivel actual: ${tier.minPoints} - ${tier.maxPoints || '∞'} puntos`
              : `Current tier: ${tier.minPoints} - ${tier.maxPoints || '∞'} points`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TierStatusCard; 