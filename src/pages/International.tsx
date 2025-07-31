import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useInternational } from '@/hooks/useInternational';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Globe, 
  Calculator, 
  FileText, 
  Truck, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Package,
  Users,
  TrendingUp
} from 'lucide-react';

// Import sub-components
import { CountryRegulationsCard } from '@/components/international/CountryRegulationsCard';
import { RateCalculator } from '@/components/international/RateCalculator';
import { CustomsFormsGenerator } from '@/components/international/CustomsFormsGenerator';
import { InternationalTracking } from '@/components/international/InternationalTracking';
import { WorldMapView } from '@/components/international/WorldMapView';
import { CurrencyConverter } from '@/components/international/CurrencyConverter';
import { ProhibitedItemsDatabase } from '@/components/international/ProhibitedItemsDatabase';
import { InternationalAnalytics } from '@/components/international/InternationalAnalytics';

const International: React.FC = () => {
  const { t } = useLanguage();
  const {
    countries,
    internationalPackages,
    internationalAnalytics,
    selectedOriginCountry,
    setSelectedOriginCountry,
    selectedDestinationCountry,
    setSelectedDestinationCountry,
    getCountriesByRegion,
    getAnalytics
  } = useInternational();

  const [activeTab, setActiveTab] = useState('dashboard');

  const analytics = getAnalytics();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('international.shipping', 'International Shipping')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('international.description', 'Manage international shipments, customs, and compliance')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Globe className="h-8 w-8 text-blue-600" />
          <Badge variant="secondary" className="text-sm">
            {internationalPackages.length} {t('international.activeShipments', 'Active Shipments')}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('international.totalShipments', 'Total Shipments')}
                </p>
                <p className="text-2xl font-bold">{analytics.totalShipments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('international.activeShipments', 'Active Shipments')}
                </p>
                <p className="text-2xl font-bold">{analytics.activeShipments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('international.deliveredThisMonth', 'Delivered This Month')}
                </p>
                <p className="text-2xl font-bold">{analytics.deliveredThisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('international.clearanceRate', 'Clearance Rate')}
                </p>
                <p className="text-2xl font-bold">{(analytics.customsClearanceRate * 100).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">
            <Globe className="h-4 w-4 mr-2" />
            {t('international.dashboard', 'Dashboard')}
          </TabsTrigger>
          <TabsTrigger value="calculator">
            <Calculator className="h-4 w-4 mr-2" />
            {t('international.rateCalculator', 'Rate Calculator')}
          </TabsTrigger>
          <TabsTrigger value="forms">
            <FileText className="h-4 w-4 mr-2" />
            {t('international.customsForms', 'Customs Forms')}
          </TabsTrigger>
          <TabsTrigger value="tracking">
            <Truck className="h-4 w-4 mr-2" />
            {t('international.tracking', 'Tracking')}
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {t('international.compliance', 'Compliance')}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="h-4 w-4 mr-2" />
            {t('international.analytics', 'Analytics')}
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* World Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>{t('international.worldMap', 'World Map')}</span>
                </CardTitle>
                <CardDescription>
                  {t('international.mapDescription', 'View active shipments and shipping zones')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WorldMapView />
              </CardContent>
            </Card>

            {/* Country Selection */}
            <Card>
              <CardHeader>
                <CardTitle>{t('international.countrySelection', 'Country Selection')}</CardTitle>
                <CardDescription>
                  {t('international.selectCountries', 'Select origin and destination countries')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <Separator />

                <CountryRegulationsCard 
                  originCountry={selectedOriginCountry}
                  destinationCountry={selectedDestinationCountry}
                />
              </CardContent>
            </Card>
          </div>

          {/* Currency Converter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>{t('international.currencyConverter', 'Currency Converter')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CurrencyConverter />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rate Calculator Tab */}
        <TabsContent value="calculator">
          <RateCalculator />
        </TabsContent>

        {/* Customs Forms Tab */}
        <TabsContent value="forms">
          <CustomsFormsGenerator />
        </TabsContent>

        {/* Tracking Tab */}
        <TabsContent value="tracking">
          <InternationalTracking />
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance">
          <ProhibitedItemsDatabase />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <InternationalAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default International; 