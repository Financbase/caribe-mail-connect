import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useInternational } from '@/hooks/useInternational';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  FileText, 
  Shield,
  Info
} from 'lucide-react';

interface CountryRegulationsCardProps {
  originCountry: string;
  destinationCountry: string;
}

export const CountryRegulationsCard: React.FC<CountryRegulationsCardProps> = ({
  originCountry,
  destinationCountry
}) => {
  const { t } = useLanguage();
  const {
    getCountryByCode,
    getProhibitedItemsByCountry,
    getRestrictedItemsByCountry,
    getRequiredDocuments,
    calculateImportDuties,
    calculateVAT,
    getTransitTime
  } = useInternational();

  const origin = getCountryByCode(originCountry);
  const destination = getCountryByCode(destinationCountry);

  if (!origin || !destination) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <Info className="h-4 w-4" />
            <span>{t('international.selectCountries', 'Please select origin and destination countries')}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const importDutyRate = destination.importDutyRate * 100;
  const vatRate = destination.vatRate * 100;
  const prohibitedItems = getProhibitedItemsByCountry(destinationCountry);
  const restrictedItems = getRestrictedItemsByCountry(destinationCountry);
  const requiredDocuments = getRequiredDocuments(destinationCountry);

  return (
    <div className="space-y-4">
      {/* Destination Country Info */}
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{destination.flag}</span>
        <div>
          <h3 className="font-semibold">{destination.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {destination.currency} ({destination.currencySymbol})
          </p>
        </div>
      </div>

      <Separator />

      {/* Customs Information */}
      <div className="space-y-3">
        <h4 className="font-medium flex items-center space-x-2">
          <Shield className="h-4 w-4" />
          <span>{t('international.customsInfo', 'Customs Information')}</span>
        </h4>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              {t('international.importDuty', 'Import Duty')}
            </p>
            <p className="font-medium">{importDutyRate}%</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              {t('international.vat', 'VAT')}
            </p>
            <p className="font-medium">{vatRate}%</p>
          </div>
        </div>

        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t('international.customsOffice', 'Customs Office')}
          </p>
          <p className="font-medium text-sm">{destination.customsOffice}</p>
        </div>
      </div>

      <Separator />

      {/* Transit Times */}
      <div className="space-y-3">
        <h4 className="font-medium flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span>{t('international.transitTimes', 'Transit Times')}</span>
        </h4>
        
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <p className="font-medium text-blue-600 dark:text-blue-400">
              {t('international.express', 'Express')}
            </p>
            <p className="text-xs">{destination.transitTime.express} {t('international.days', 'days')}</p>
          </div>
          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
            <p className="font-medium text-green-600 dark:text-green-400">
              {t('international.standard', 'Standard')}
            </p>
            <p className="text-xs">{destination.transitTime.standard} {t('international.days', 'days')}</p>
          </div>
          <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
            <p className="font-medium text-orange-600 dark:text-orange-400">
              {t('international.economy', 'Economy')}
            </p>
            <p className="text-xs">{destination.transitTime.economy} {t('international.days', 'days')}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Required Documents */}
      <div className="space-y-3">
        <h4 className="font-medium flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>{t('international.requiredDocuments', 'Required Documents')}</span>
        </h4>
        
        <div className="space-y-2">
          {requiredDocuments.map((doc, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span className="text-sm">{doc}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Prohibited Items */}
      <div className="space-y-3">
        <h4 className="font-medium flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span>{t('international.prohibitedItems', 'Prohibited Items')}</span>
        </h4>
        
        <div className="space-y-1">
          {destination.prohibitedItems.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <AlertTriangle className="h-3 w-3 text-red-600" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
          {destination.prohibitedItems.length > 3 && (
            <p className="text-xs text-gray-500">
              +{destination.prohibitedItems.length - 3} {t('international.more', 'more')}
            </p>
          )}
        </div>
      </div>

      <Separator />

      {/* Restricted Items */}
      <div className="space-y-3">
        <h4 className="font-medium flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <span>{t('international.restrictedItems', 'Restricted Items')}</span>
        </h4>
        
        <div className="space-y-1">
          {destination.restrictedItems.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <AlertTriangle className="h-3 w-3 text-yellow-600" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
          {destination.restrictedItems.length > 3 && (
            <p className="text-xs text-gray-500">
              +{destination.restrictedItems.length - 3} {t('international.more', 'more')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 