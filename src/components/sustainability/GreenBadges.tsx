import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Star, Calendar } from 'lucide-react';
import { GreenBadge } from '@/types/sustainability';

interface GreenBadgesProps {
  badges: GreenBadge[];
  title?: string;
  description?: string;
}

export default function GreenBadges({ badges, title = "Green Badges", description = "Environmental achievements and certifications" }: GreenBadgesProps) {
  const getBadgeLevelColor = (level: string) => {
    switch (level) {
      case 'platinum': return 'bg-gradient-to-r from-gray-400 to-gray-600';
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 'bronze': return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default: return 'bg-gray-200';
    }
  };

  const getBadgeLevelTextColor = (level: string) => {
    switch (level) {
      case 'platinum': return 'text-white';
      case 'gold': return 'text-white';
      case 'silver': return 'text-white';
      case 'bronze': return 'text-white';
      default: return 'text-gray-800';
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Award className="h-6 w-6" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getBadgeLevelColor(badge.level)}`}>
                  {badge.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{badge.name}</h3>
                  <Badge className={`${getBadgeLevelColor(badge.level)} ${getBadgeLevelTextColor(badge.level)}`}>
                    {badge.level}
                  </Badge>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{badge.description}</p>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-sm text-gray-500">Impact</div>
                  <div className="font-semibold text-green-600">{formatNumber(badge.impact)} kg CO2</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Earned</div>
                  <div className="font-semibold flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(badge.earnedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-500 font-medium">Criteria:</div>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                  {badge.criteria.map((criterion, index) => (
                    <li key={index}>{criterion}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{badges.length}</div>
            <div className="text-sm text-green-700">Total Badges</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {badges.filter(b => b.level === 'gold' || b.level === 'platinum').length}
            </div>
            <div className="text-sm text-blue-700">Premium Badges</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {formatNumber(badges.reduce((sum, badge) => sum + badge.impact, 0))}
            </div>
            <div className="text-sm text-yellow-700">Total Impact (kg CO2)</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(badges.reduce((sum, badge) => sum + badge.impact, 0) / badges.length)}
            </div>
            <div className="text-sm text-purple-700">Avg Impact per Badge</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 