import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  FileText, 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Package,
  BarChart3,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { 
  mockPolicies, 
  mockClaims, 
  insuranceStats, 
  coverageTiers,
  insuranceCompanies,
  mockRiskAssessments
} from '@/data/insuranceData';
import { 
  InsurancePolicy, 
  InsuranceClaim, 
  ClaimStatus, 
  PolicyStatus,
  CoverageType 
} from '@/types/insurance';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Insurance() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const isSpanish = language === 'es';

  // Filter policies and claims based on search and status
  const filteredPolicies = mockPolicies.filter(policy => {
    const matchesSearch = policy.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || policy.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredClaims = mockClaims.filter(claim => {
    const matchesSearch = claim.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Approved':
      case 'Settled':
        return 'bg-green-100 text-green-800';
      case 'Pending':
      case 'Under Review':
      case 'Investigation':
        return 'bg-yellow-100 text-yellow-800';
      case 'Expired':
      case 'Denied':
      case 'Closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
      case 'Urgent':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateCoverage = (packageValue: number, coverageType: CoverageType) => {
    const tier = coverageTiers.find(t => t.name === coverageType);
    if (!tier) return { premium: 0, deductible: 0, coverage: 0 };
    
    const coverage = Math.min(packageValue, tier.maxCoverage);
    const premium = tier.basePremium + (packageValue * 0.01);
    
    return {
      premium: Math.round(premium * 100) / 100,
      deductible: tier.deductible,
      coverage: coverage
    };
  };

  return (
    <MainLayout currentPage="insurance">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isSpanish ? 'Seguros y Reclamos' : 'Insurance & Claims'}
            </h1>
            <p className="text-muted-foreground">
              {isSpanish 
                ? 'Gestión integral de pólizas de seguro y procesamiento de reclamos'
                : 'Comprehensive insurance policy management and claims processing'
              }
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              {isSpanish ? 'Buscar' : 'Search'}
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {isSpanish ? 'Nueva Póliza' : 'New Policy'}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isSpanish ? 'Pólizas Activas' : 'Active Policies'}
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insuranceStats.activePolicies}</div>
              <p className="text-xs text-muted-foreground">
                {isSpanish ? 'De' : 'Of'} {insuranceStats.totalPolicies} {isSpanish ? 'total' : 'total'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isSpanish ? 'Reclamos Abiertos' : 'Open Claims'}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insuranceStats.openClaims}</div>
              <p className="text-xs text-muted-foreground">
                {isSpanish ? 'De' : 'Of'} {insuranceStats.totalClaims} {isSpanish ? 'total' : 'total'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isSpanish ? 'Prima Mensual' : 'Monthly Premium'}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${insuranceStats.totalPremium}</div>
              <p className="text-xs text-muted-foreground">
                +12% {isSpanish ? 'vs mes anterior' : 'vs last month'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isSpanish ? 'Pagos Totales' : 'Total Payouts'}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${insuranceStats.totalPayouts}</div>
              <p className="text-xs text-muted-foreground">
                {isSpanish ? 'Promedio' : 'Average'} ${insuranceStats.averageClaimAmount}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">
              {isSpanish ? 'Resumen' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="policies">
              {isSpanish ? 'Pólizas' : 'Policies'}
            </TabsTrigger>
            <TabsTrigger value="claims">
              {isSpanish ? 'Reclamos' : 'Claims'}
            </TabsTrigger>
            <TabsTrigger value="calculator">
              {isSpanish ? 'Calculadora' : 'Calculator'}
            </TabsTrigger>
            <TabsTrigger value="risk">
              {isSpanish ? 'Riesgo' : 'Risk'}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Claims by Status Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>{isSpanish ? 'Reclamos por Estado' : 'Claims by Status'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(insuranceStats.claimsByStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm">{status}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={(count / insuranceStats.totalClaims) * 100} className="w-20" />
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Claims by Type Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>{isSpanish ? 'Reclamos por Tipo' : 'Claims by Type'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(insuranceStats.claimsByType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm">{type}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={(count / insuranceStats.totalClaims) * 100} className="w-20" />
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>{isSpanish ? 'Actividad Reciente' : 'Recent Activity'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockClaims.slice(0, 5).map((claim) => (
                    <div key={claim.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">{claim.claimNumber}</p>
                          <p className="text-sm text-muted-foreground">{claim.customerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          ${claim.reportedAmount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={isSpanish ? "Buscar pólizas..." : "Search policies..."}
                  className="w-full px-3 py-2 border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 border rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">{isSpanish ? 'Todos los Estados' : 'All Statuses'}</option>
                <option value="Active">{isSpanish ? 'Activo' : 'Active'}</option>
                <option value="Pending">{isSpanish ? 'Pendiente' : 'Pending'}</option>
                <option value="Expired">{isSpanish ? 'Expirado' : 'Expired'}</option>
              </select>
            </div>

            {/* Policies List */}
            <div className="grid gap-4">
              {filteredPolicies.map((policy) => (
                <Card key={policy.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{policy.policyNumber}</h3>
                          <p className="text-sm text-muted-foreground">{policy.customerName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(policy.status)}>
                              {policy.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {policy.coverageType}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${policy.coverageAmount}</p>
                        <p className="text-sm text-muted-foreground">
                          {isSpanish ? 'Prima' : 'Premium'}: ${policy.premium}/mes
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {policy.insuranceCompany.name}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Claims Tab */}
          <TabsContent value="claims" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={isSpanish ? "Buscar reclamos..." : "Search claims..."}
                  className="w-full px-3 py-2 border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 border rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">{isSpanish ? 'Todos los Estados' : 'All Statuses'}</option>
                <option value="Reported">{isSpanish ? 'Reportado' : 'Reported'}</option>
                <option value="Under Review">{isSpanish ? 'En Revisión' : 'Under Review'}</option>
                <option value="Investigation">{isSpanish ? 'Investigación' : 'Investigation'}</option>
                <option value="Approved">{isSpanish ? 'Aprobado' : 'Approved'}</option>
                <option value="Settled">{isSpanish ? 'Resuelto' : 'Settled'}</option>
              </select>
            </div>

            {/* Claims List */}
            <div className="grid gap-4">
              {filteredClaims.map((claim) => (
                <Card key={claim.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{claim.claimNumber}</h3>
                          <p className="text-sm text-muted-foreground">{claim.customerName}</p>
                          <p className="text-sm text-muted-foreground">{claim.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(claim.status)}>
                              {claim.status}
                            </Badge>
                            <Badge className={getPriorityColor(claim.priority)}>
                              {claim.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${claim.reportedAmount}</p>
                        <p className="text-sm text-muted-foreground">
                          {claim.claimType}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(claim.reportedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{isSpanish ? 'Calculadora de Cobertura' : 'Coverage Calculator'}</CardTitle>
                <CardDescription>
                  {isSpanish 
                    ? 'Calcula el costo de seguro para tus paquetes'
                    : 'Calculate insurance costs for your packages'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CoverageCalculator />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Tab */}
          <TabsContent value="risk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{isSpanish ? 'Evaluación de Riesgo' : 'Risk Assessment'}</CardTitle>
                <CardDescription>
                  {isSpanish 
                    ? 'Análisis de riesgo y recomendaciones de seguridad'
                    : 'Risk analysis and security recommendations'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RiskAssessmentDisplay />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

// Coverage Calculator Component
function CoverageCalculator() {
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  const [packageValue, setPackageValue] = useState(1000);
  const [selectedTier, setSelectedTier] = useState<CoverageType>('Standard');

  const calculation = calculateCoverage(packageValue, selectedTier);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">
            {isSpanish ? 'Valor del Paquete' : 'Package Value'}
          </label>
          <input
            type="number"
            value={packageValue}
            onChange={(e) => setPackageValue(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
            min="0"
            step="100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            {isSpanish ? 'Nivel de Cobertura' : 'Coverage Tier'}
          </label>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value as CoverageType)}
            className="w-full px-3 py-2 border rounded-md"
          >
            {coverageTiers.map((tier) => (
              <option key={tier.id} value={tier.name}>
                {tier.name} - ${tier.maxCoverage} {isSpanish ? 'máximo' : 'max'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {isSpanish ? 'Prima Mensual' : 'Monthly Premium'}
              </p>
              <p className="text-2xl font-bold text-blue-600">${calculation.premium}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {isSpanish ? 'Deducible' : 'Deductible'}
              </p>
              <p className="text-2xl font-bold text-orange-600">${calculation.deductible}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {isSpanish ? 'Cobertura' : 'Coverage'}
              </p>
              <p className="text-2xl font-bold text-green-600">${calculation.coverage}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Risk Assessment Component
function RiskAssessmentDisplay() {
  const { language } = useLanguage();
  const isSpanish = language === 'es';

  return (
    <div className="space-y-6">
      {mockRiskAssessments.map((assessment) => (
        <Card key={assessment.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {isSpanish ? 'Evaluación de Riesgo' : 'Risk Assessment'}
              </CardTitle>
              <Badge className={assessment.score < 30 ? 'bg-green-100 text-green-800' : 
                               assessment.score < 60 ? 'bg-yellow-100 text-yellow-800' : 
                               'bg-red-100 text-red-800'}>
                {assessment.score}/100
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">
                  {isSpanish ? 'Factores de Riesgo' : 'Risk Factors'}
                </h4>
                <div className="space-y-2">
                  {assessment.factors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{factor.factor}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={factor.score} className="w-20" />
                        <span className="text-sm font-medium">{factor.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">
                  {isSpanish ? 'Recomendaciones' : 'Recommendations'}
                </h4>
                <ul className="space-y-1">
                  {assessment.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 