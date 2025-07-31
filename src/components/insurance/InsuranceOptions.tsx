import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Shield, 
  DollarSign, 
  Calculator, 
  FileText, 
  Download,
  Eye,
  CheckCircle,
  Star,
  Info,
  Package,
  Clock,
  Users
} from 'lucide-react';
import { 
  coverageTiers, 
  insuranceCompanies,
  mockPolicies 
} from '@/data/insuranceData';
import { 
  CoverageType, 
  InsuranceCompany,
  PolicyStatus 
} from '@/types/insurance';
import { useLanguage } from '@/contexts/LanguageContext';

interface InsuranceOptionsProps {
  onNavigate: (section: string) => void;
}

export function InsuranceOptions({ onNavigate }: InsuranceOptionsProps) {
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  
  const [selectedTier, setSelectedTier] = useState<CoverageType>('Standard');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [packageValue, setPackageValue] = useState(1000);
  const [customDeductible, setCustomDeductible] = useState(100);
  const [autoRenew, setAutoRenew] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const selectedTierData = coverageTiers.find(tier => tier.name === selectedTier);
  const selectedCompanyData = insuranceCompanies.find(company => company.id === selectedCompany);

  const calculatePremium = () => {
    if (!selectedTierData) return 0;
    
    const basePremium = selectedTierData.basePremium;
    const valueMultiplier = packageValue > selectedTierData.maxCoverage ? 0.015 : 0.01;
    const valuePremium = packageValue * valueMultiplier;
    
    return Math.round((basePremium + valuePremium) * 100) / 100;
  };

  const calculateCoverage = () => {
    if (!selectedTierData) return 0;
    return Math.min(packageValue, selectedTierData.maxCoverage);
  };

  const premium = calculatePremium();
  const coverage = calculateCoverage();
  const effectiveDeductible = showAdvanced ? customDeductible : selectedTierData?.deductible || 100;

  const getTierColor = (tierName: string) => {
    switch (tierName) {
      case 'Premium':
      case 'Enterprise':
        return 'bg-purple-100 text-purple-800';
      case 'Standard':
        return 'bg-blue-100 text-blue-800';
      case 'Basic':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isSpanish ? 'Opciones de Seguro' : 'Insurance Options'}
          </h1>
          <p className="text-muted-foreground">
            {isSpanish 
              ? 'Configura tu cobertura de seguro personalizada'
              : 'Configure your custom insurance coverage'
            }
          </p>
        </div>
        <Button onClick={() => onNavigate('calculator')}>
          <Calculator className="h-4 w-4 mr-2" />
          {isSpanish ? 'Calculadora Avanzada' : 'Advanced Calculator'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Coverage Tiers */}
        <div className="md:col-span-2 space-y-6">
          {/* Package Value Declaration */}
          <Card>
            <CardHeader>
              <CardTitle>{isSpanish ? 'Declaración de Valor' : 'Value Declaration'}</CardTitle>
              <CardDescription>
                {isSpanish 
                  ? 'Especifica el valor de tus paquetes para calcular la cobertura'
                  : 'Specify the value of your packages to calculate coverage'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="packageValue">
                  {isSpanish ? 'Valor del Paquete' : 'Package Value'}
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="packageValue"
                    type="number"
                    value={packageValue}
                    onChange={(e) => setPackageValue(Number(e.target.value))}
                    className="pl-10"
                    min="0"
                    step="100"
                    placeholder="1000"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {isSpanish 
                    ? 'Ingresa el valor total de los artículos en el paquete'
                    : 'Enter the total value of items in the package'
                  }
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="coverageType">
                    {isSpanish ? 'Tipo de Cobertura' : 'Coverage Type'}
                  </Label>
                  <Select value={selectedTier} onValueChange={(value) => setSelectedTier(value as CoverageType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {coverageTiers.map((tier) => (
                        <SelectItem key={tier.id} value={tier.name}>
                          {tier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="insuranceCompany">
                    {isSpanish ? 'Compañía de Seguros' : 'Insurance Company'}
                  </Label>
                  <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                    <SelectTrigger>
                      <SelectValue placeholder={isSpanish ? "Seleccionar compañía" : "Select company"} />
                    </SelectTrigger>
                    <SelectContent>
                      {insuranceCompanies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          <div className="flex items-center gap-2">
                            <img src={company.logo} alt={company.name} className="w-4 h-4" />
                            {company.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coverage Tiers Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>{isSpanish ? 'Niveles de Cobertura' : 'Coverage Tiers'}</CardTitle>
              <CardDescription>
                {isSpanish 
                  ? 'Compara diferentes niveles de cobertura'
                  : 'Compare different coverage levels'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {coverageTiers.map((tier) => (
                  <Card 
                    key={tier.id} 
                    className={`cursor-pointer transition-all ${
                      selectedTier === tier.name 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:bg-accent/50'
                    }`}
                    onClick={() => setSelectedTier(tier.name as CoverageType)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{tier.name}</CardTitle>
                        <Badge className={getTierColor(tier.name)}>
                          ${tier.maxCoverage}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {tier.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div>
                          <p className="text-2xl font-bold">${tier.basePremium}</p>
                          <p className="text-sm text-muted-foreground">
                            {isSpanish ? 'por mes' : 'per month'}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            {isSpanish ? 'Características' : 'Features'}:
                          </p>
                          <ul className="space-y-1">
                            {tier.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-medium">
                            {isSpanish ? 'Recomendado para' : 'Recommended for'}:
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {tier.recommendedFor.join(', ')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Advanced Options */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{isSpanish ? 'Opciones Avanzadas' : 'Advanced Options'}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? 'Ocultar' : 'Mostrar'}
                </Button>
              </div>
            </CardHeader>
            {showAdvanced && (
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customDeductible">
                    {isSpanish ? 'Deducible Personalizado' : 'Custom Deductible'}
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="customDeductible"
                      type="number"
                      value={customDeductible}
                      onChange={(e) => setCustomDeductible(Number(e.target.value))}
                      className="pl-10"
                      min="0"
                      step="50"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isSpanish 
                      ? 'Un deducible más alto reduce la prima mensual'
                      : 'A higher deductible reduces monthly premium'
                    }
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="autoRenew" 
                    checked={autoRenew}
                    onCheckedChange={(checked) => setAutoRenew(checked as boolean)}
                  />
                  <Label htmlFor="autoRenew">
                    {isSpanish ? 'Renovación Automática' : 'Auto Renewal'}
                  </Label>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Premium Calculator */}
          <Card>
            <CardHeader>
              <CardTitle>{isSpanish ? 'Calculadora de Prima' : 'Premium Calculator'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">{isSpanish ? 'Valor del Paquete' : 'Package Value'}</span>
                  <span className="font-medium">${packageValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{isSpanish ? 'Cobertura Máxima' : 'Max Coverage'}</span>
                  <span className="font-medium">${selectedTierData?.maxCoverage || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{isSpanish ? 'Cobertura Efectiva' : 'Effective Coverage'}</span>
                  <span className="font-medium text-green-600">${coverage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{isSpanish ? 'Deducible' : 'Deductible'}</span>
                  <span className="font-medium text-red-600">${effectiveDeductible}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium">{isSpanish ? 'Prima Mensual' : 'Monthly Premium'}</span>
                    <span className="text-xl font-bold text-blue-600">${premium}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">{isSpanish ? 'Prima Anual' : 'Annual Premium'}</span>
                    <span className="font-medium">${premium * 12}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                {isSpanish ? 'Contratar Seguro' : 'Purchase Insurance'}
              </Button>
            </CardContent>
          </Card>

          {/* Insurance Company Info */}
          {selectedCompanyData && (
            <Card>
              <CardHeader>
                <CardTitle>{isSpanish ? 'Compañía de Seguros' : 'Insurance Company'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedCompanyData.logo} 
                    alt={selectedCompanyData.name} 
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h3 className="font-semibold">{selectedCompanyData.name}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${
                            i < Math.floor(selectedCompanyData.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        {selectedCompanyData.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{isSpanish ? 'Tiempo de Proceso' : 'Process Time'}</span>
                    <span>{selectedCompanyData.claimsProcessTime} {isSpanish ? 'días' : 'days'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{isSpanish ? 'Satisfacción' : 'Satisfaction'}</span>
                    <span>{selectedCompanyData.customerSatisfaction}/5</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full" size="sm">
                    <Info className="h-4 w-4 mr-2" />
                    {isSpanish ? 'Más Información' : 'More Info'}
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    {isSpanish ? 'Contactar' : 'Contact'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Policy Documents */}
          <Card>
            <CardHeader>
              <CardTitle>{isSpanish ? 'Documentos de Póliza' : 'Policy Documents'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 border rounded">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{isSpanish ? 'Términos y Condiciones' : 'Terms & Conditions'}</p>
                    <p className="text-xs text-muted-foreground">PDF • 245 KB</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 p-2 border rounded">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{isSpanish ? 'Detalles de Cobertura' : 'Coverage Details'}</p>
                    <p className="text-xs text-muted-foreground">PDF • 180 KB</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 p-2 border rounded">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{isSpanish ? 'Exclusiones' : 'Exclusions'}</p>
                    <p className="text-xs text-muted-foreground">PDF • 95 KB</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Existing Policies */}
          <Card>
            <CardHeader>
              <CardTitle>{isSpanish ? 'Pólizas Existentes' : 'Existing Policies'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockPolicies.slice(0, 3).map((policy) => (
                  <div key={policy.id} className="p-2 border rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{policy.policyNumber}</p>
                        <p className="text-xs text-muted-foreground">{policy.customerName}</p>
                      </div>
                      <Badge className={policy.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {policy.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">${policy.coverageAmount}</span>
                      <span className="text-xs text-muted-foreground">${policy.premium}/mes</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-3" size="sm">
                {isSpanish ? 'Ver Todas las Pólizas' : 'View All Policies'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 