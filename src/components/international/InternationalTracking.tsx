import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Truck } from 'lucide-react';

export const InternationalTracking: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Truck className="h-5 w-5" />
          <span>{t('international.tracking', 'International Tracking')}</span>
        </CardTitle>
        <CardDescription>
          {t('international.trackingDescription', 'Track international packages and customs clearance status')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400">
          {t('international.trackingComingSoon', 'International tracking features coming soon...')}
        </p>
      </CardContent>
    </Card>
  );
}; 