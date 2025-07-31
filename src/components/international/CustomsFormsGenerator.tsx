import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText } from 'lucide-react';

export const CustomsFormsGenerator: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>{t('international.customsForms', 'Customs Forms')}</span>
        </CardTitle>
        <CardDescription>
          {t('international.customsFormsDescription', 'Generate CN22, CN23, commercial invoices, and export declarations')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400">
          {t('international.customsFormsComingSoon', 'Customs forms generator features coming soon...')}
        </p>
      </CardContent>
    </Card>
  );
}; 