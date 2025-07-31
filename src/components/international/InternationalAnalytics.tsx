import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp } from 'lucide-react';

export const InternationalAnalytics: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>{t('international.analytics', 'Analytics')}</span>
        </CardTitle>
        <CardDescription>
          {t('international.analyticsDescription', 'International shipping analytics and performance metrics')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400">
          {t('international.analyticsComingSoon', 'International analytics features coming soon...')}
        </p>
      </CardContent>
    </Card>
  );
}; 