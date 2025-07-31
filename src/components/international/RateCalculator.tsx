import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useInternational } from '@/hooks/useInternational';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Calculator, 
  Package, 
  Truck, 
  DollarSign, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader2,
  FileText
} from 'lucide-react';

export const RateCalculator: React.FC = () => {
  const { t } = useLanguage();
  const {
    countries,
    selectedOriginCountry,
    setSelectedOriginCountry,
    selectedDestinationCountry,
    setSelectedDestinationCountry,
    rateCalculationMutation,
    formatCurrency,
    calculateImportDuties,
    calculateVAT,
    getTransitTime
  } = useInternational();

  const [weight, setWeight] = useState<string>('1');
  const [service, setService] = useState<'express' | 'standard' | 'economy'>('standard');
  const [declaredValue, setDeclaredValue] = useState<string>('100');
  const [calculatedRate, setCalculatedRate] = useState<any>(null);

  const handleCalculateRate = async () => {
    if (!weight || !declaredValue) return;

    try {
      const result = await rateCalculationMutation.mutateAsync({
        originCountry: selectedOriginCountry,
        destinationCountry: selectedDestinationCountry,
        weight: parseFloat(weight),
        service
      });

      // Calculate additional fees
      const importDuties = calculateImportDuties(parseFloat(declaredValue), selectedDestinationCountry);
      const vat = calculateVAT(parseFloat(declaredValue), selectedDestinationCountry);
      const transitTime = getTransitTime(selectedOriginCountry, selectedDestinationCountry, service);

      setCalculatedRate({
        ...result,
        importDuties,
        vat,
        transitTime,
        totalWithFees: result.totalRate + importDuties + vat
      });
    } catch (error) {
      console.error('Rate calculation failed:', error);
    }
  };

  useEffect(() => {
    if (weight && declaredValue && selectedOriginCountry && selectedDestinationCountry) {
      handleCalculateRate();
    }
  }, [weight, declaredValue, selectedOriginCountry, selectedDestinationCountry, service]);

  const getServiceColor = (serviceType: string) => {
    switch (serviceType) {
      case 'express': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'standard': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'economy': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'express': return '🚀';
      case 'standard': return '📦';
      case 'economy': return '🐌';
      default: return '📦';
    }
  };

  return (
    <div className="space-y-6">
      {/* Calculator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>{t('international.rateCalculator', 'Rate Calculator')}</span>
          </CardTitle>
          <CardDescription>
            {t('international.calculateShippingRates', 'Calculate international shipping rates and fees')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Origin and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="origin-country">{t('international.originCountry', 'Origin Country')}</Label>
              <Select value={selectedOriginCountry} onValueChange={setSelectedOriginCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="mr-2">{country.flag}</span>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="destination-country">{t('international.destinationCountry', 'Destination Country')}</Label>
              <Select value={selectedDestinationCountry} onValueChange={setSelectedDestinationCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="mr-2">{country.flag}</span>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Package Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="weight">{t('international.weight', 'Weight (kg)')}</Label>
              <Input
                id="weight"
                type="number"
                min="0.1"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="1.0"
              />
            </div>

            <div>
              <Label htmlFor="declared-value">{t('international.declaredValue', 'Declared Value (USD)')}</Label>
              <Input
                id="declared-value"
                type="number"
                min="0"
                step="0.01"
                value={declaredValue}
                onChange={(e) => setDeclaredValue(e.target.value)}
                placeholder="100.00"
              />
            </div>

            <div>
              <Label htmlFor="service">{t('international.service', 'Service Type')}</Label>
              <Select value={service} onValueChange={(value: string) => setService(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="express">
                    <span className="mr-2">🚀</span>
                    {t('international.express', 'Express')}
                  </SelectItem>
                  <SelectItem value="standard">
                    <span className="mr-2">📦</span>
                    {t('international.standard', 'Standard')}
                  </SelectItem>
                  <SelectItem value="economy">
                    <span className="mr-2">🐌</span>
                    {t('international.economy', 'Economy')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Calculate Button */}
          <Button 
            onClick={handleCalculateRate}
            disabled={rateCalculationMutation.isPending}
            className="w-full"
          >
            {rateCalculationMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('international.calculating', 'Calculating...')}
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                {t('international.calculateRate', 'Calculate Rate')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {calculatedRate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>{t('international.rateBreakdown', 'Rate Breakdown')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Service Summary */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getServiceIcon(service)}</span>
                <div>
                  <p className="font-medium capitalize">{service} {t('international.service', 'Service')}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {calculatedRate.transitTime} {t('international.days', 'days')}
                  </p>
                </div>
              </div>
              <Badge className={getServiceColor(service)}>
                {calculatedRate.transitTime} {t('international.days', 'days')}
              </Badge>
            </div>

            <Separator />

            {/* Rate Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium">{t('international.rateBreakdown', 'Rate Breakdown')}</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t('international.baseRate', 'Base Rate')}
                  </span>
                  <span>{formatCurrency(calculatedRate.baseRate, 'USD')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t('international.fuelSurcharge', 'Fuel Surcharge')}
                  </span>
                  <span>{formatCurrency(calculatedRate.fuelSurcharge, 'USD')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t('international.customsFees', 'Customs Fees')}
                  </span>
                  <span>{formatCurrency(calculatedRate.customsFees, 'USD')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t('international.importDuties', 'Import Duties')}
                  </span>
                  <span>{formatCurrency(calculatedRate.importDuties, 'USD')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t('international.vat', 'VAT')}
                  </span>
                  <span>{formatCurrency(calculatedRate.vat, 'USD')}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>{t('international.totalCost', 'Total Cost')}</span>
                <span className="text-green-600">
                  {formatCurrency(calculatedRate.totalWithFees, 'USD')}
                </span>
              </div>
            </div>

            <Separator />

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>
                  {t('international.estimatedDelivery', 'Estimated Delivery')}: {calculatedRate.transitTime} {t('international.days', 'days')}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-green-600" />
                <span>
                  {t('international.weight', 'Weight')}: {weight} kg
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                {t('international.generateForms', 'Generate Forms')}
              </Button>
              <Button className="flex-1">
                <Truck className="mr-2 h-4 w-4" />
                {t('international.shipNow', 'Ship Now')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {rateCalculationMutation.isError && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span>{t('international.calculationError', 'Error calculating rate. Please try again.')}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 