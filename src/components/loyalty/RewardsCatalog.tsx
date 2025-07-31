import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Gift, 
  Search, 
  Filter, 
  Coins, 
  Clock,
  Star,
  ShoppingCart,
  Truck,
  CreditCard,
  Heart,
  Calendar,
  Users
} from 'lucide-react';
import { LoyaltyReward, RewardCategory } from '@/types/loyalty';

interface RewardsCatalogProps {
  rewards: LoyaltyReward[];
  onRedeem?: (reward: LoyaltyReward) => void;
  className?: string;
}

const RewardsCatalog: React.FC<RewardsCatalogProps> = ({ 
  rewards, 
  onRedeem,
  className = '' 
}) => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'points' | 'value' | 'popularity'>('points');

  const categories = [
    { value: 'all', label: language === 'es' ? 'Todas' : 'All' },
    { value: 'shipping_credits', label: language === 'es' ? 'Créditos de Envío' : 'Shipping Credits' },
    { value: 'service_upgrades', label: language === 'es' ? 'Mejoras de Servicio' : 'Service Upgrades' },
    { value: 'partner_rewards', label: language === 'es' ? 'Recompensas de Socios' : 'Partner Rewards' },
    { value: 'gift_cards', label: language === 'es' ? 'Tarjetas de Regalo' : 'Gift Cards' },
    { value: 'charitable_donations', label: language === 'es' ? 'Donaciones' : 'Charitable Donations' },
    { value: 'exclusive_events', label: language === 'es' ? 'Eventos Exclusivos' : 'Exclusive Events' },
    { value: 'premium_features', label: language === 'es' ? 'Características Premium' : 'Premium Features' },
  ];

  const sortOptions = [
    { value: 'points', label: language === 'es' ? 'Puntos (Menor)' : 'Points (Lowest)' },
    { value: 'value', label: language === 'es' ? 'Valor (Mayor)' : 'Value (Highest)' },
    { value: 'popularity', label: language === 'es' ? 'Popularidad' : 'Popularity' },
  ];

  const filteredAndSortedRewards = useMemo(() => {
    let filtered = rewards.filter(reward => {
      const matchesSearch = reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           reward.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || reward.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort rewards
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'points':
          return a.pointsCost - b.pointsCost;
        case 'value':
          return b.currentValue - a.currentValue;
        case 'popularity':
          return b.currentRedemptions - a.currentRedemptions;
        default:
          return 0;
      }
    });

    return filtered;
  }, [rewards, searchTerm, selectedCategory, sortBy]);

  const getCategoryIcon = (category: RewardCategory) => {
    switch (category) {
      case 'shipping_credits':
        return <Truck className="h-4 w-4" />;
      case 'service_upgrades':
        return <Star className="h-4 w-4" />;
      case 'partner_rewards':
        return <Users className="h-4 w-4" />;
      case 'gift_cards':
        return <CreditCard className="h-4 w-4" />;
      case 'charitable_donations':
        return <Heart className="h-4 w-4" />;
      case 'exclusive_events':
        return <Calendar className="h-4 w-4" />;
      case 'premium_features':
        return <Star className="h-4 w-4" />;
      default:
        return <Gift className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: RewardCategory) => {
    switch (category) {
      case 'shipping_credits':
        return 'bg-blue-100 text-blue-600';
      case 'service_upgrades':
        return 'bg-purple-100 text-purple-600';
      case 'partner_rewards':
        return 'bg-green-100 text-green-600';
      case 'gift_cards':
        return 'bg-yellow-100 text-yellow-600';
      case 'charitable_donations':
        return 'bg-red-100 text-red-600';
      case 'exclusive_events':
        return 'bg-pink-100 text-pink-600';
      case 'premium_features':
        return 'bg-indigo-100 text-indigo-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatValue = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  const getAvailabilityStatus = (reward: LoyaltyReward) => {
    if (!reward.isAvailable) {
      return { status: 'unavailable', text: language === 'es' ? 'No Disponible' : 'Unavailable' };
    }
    if (reward.isLimited && reward.maxRedemptions && reward.currentRedemptions >= reward.maxRedemptions) {
      return { status: 'limited', text: language === 'es' ? 'Agotado' : 'Sold Out' };
    }
    if (reward.validUntil && new Date() > reward.validUntil) {
      return { status: 'expired', text: language === 'es' ? 'Expirado' : 'Expired' };
    }
    return { status: 'available', text: language === 'es' ? 'Disponible' : 'Available' };
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'es' ? 'Catálogo de Recompensas' : 'Rewards Catalog'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'es' 
              ? 'Canjea tus puntos por recompensas increíbles'
              : 'Redeem your points for amazing rewards'
            }
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Gift className="w-4 h-4 mr-1" />
          {rewards.length} {language === 'es' ? 'recompensas' : 'rewards'}
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={language === 'es' ? 'Buscar recompensas...' : 'Search rewards...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as RewardCategory | 'all')}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder={language === 'es' ? 'Categoría' : 'Category'} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'points' | 'value' | 'popularity')}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={language === 'es' ? 'Ordenar por' : 'Sort by'} />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedRewards.map((reward) => {
          const availability = getAvailabilityStatus(reward);
          const isAvailable = availability.status === 'available';
          
          return (
            <Card key={reward.id} className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
              !isAvailable ? 'opacity-60' : ''
            }`}>
              {/* Reward Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Gift className="h-16 w-16 text-gray-400" />
                </div>
                {reward.isLimited && reward.maxRedemptions && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="destructive" className="text-xs">
                      {language === 'es' ? 'Limitado' : 'Limited'}
                    </Badge>
                  </div>
                )}
                {availability.status !== 'available' && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="secondary" className="text-white">
                      {availability.text}
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-4 space-y-4">
                {/* Category Badge */}
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-full ${getCategoryColor(reward.category)}`}>
                    {getCategoryIcon(reward.category)}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {categories.find(c => c.value === reward.category)?.label}
                  </Badge>
                </div>

                {/* Reward Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {reward.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {reward.description}
                  </p>
                </div>

                {/* Value and Points */}
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      {language === 'es' ? 'Valor' : 'Value'}
                    </p>
                    <p className="font-bold text-green-600">
                      {formatValue(reward.currentValue)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      {language === 'es' ? 'Puntos' : 'Points'}
                    </p>
                    <p className="font-bold text-yellow-600 flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      {reward.pointsCost.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Popularity */}
                {reward.currentRedemptions > 0 && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Users className="h-3 w-3" />
                    <span>
                      {language === 'es' 
                        ? `${reward.currentRedemptions} canjes`
                        : `${reward.currentRedemptions} redemptions`
                      }
                    </span>
                  </div>
                )}

                {/* Validity */}
                {reward.validUntil && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>
                      {language === 'es' 
                        ? `Válido hasta ${reward.validUntil.toLocaleDateString()}`
                        : `Valid until ${reward.validUntil.toLocaleDateString()}`
                      }
                    </span>
                  </div>
                )}

                {/* Action Button */}
                <Button 
                  className="w-full" 
                  disabled={!isAvailable}
                  onClick={() => isAvailable && onRedeem?.(reward)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isAvailable 
                    ? (language === 'es' ? 'Canjear' : 'Redeem')
                    : availability.text
                  }
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAndSortedRewards.length === 0 && (
        <div className="text-center py-12">
          <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {language === 'es' ? 'No se encontraron recompensas' : 'No rewards found'}
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

export default RewardsCatalog; 