import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertTriangle } from 'lucide-react';

export const ProhibitedItemsDatabase: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>{t('international.compliance', 'Compliance')}</span>
        </CardTitle>
        <CardDescription>
          {t('international.complianceDescription', 'Check prohibited and restricted items by country')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400">
          {t('international.complianceComingSoon', 'Compliance database features coming soon...')}
        </p>
      </CardContent>
    </Card>
  );
}; 