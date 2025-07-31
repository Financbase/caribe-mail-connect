import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  BarChart3,
  Calculator
} from 'lucide-react';
import { insuranceStats, mockClaims, mockPolicies } from '@/data/insuranceData';
import { ClaimStatus, PolicyStatus } from '@/types/insurance';
import { useLanguage } from '@/contexts/LanguageContext';

interface InsuranceDashboardProps {
  onNavigate: (section: string) => void;
}

export function InsuranceDashboard({ onNavigate }: InsuranceDashboardProps) {
  const { language } = useLanguage();
  const isSpanish = language === 'es';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isSpanish ? 'Panel de Seguros' : 'Insurance Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {isSpanish 
              ? 'Gestión integral de pólizas y reclamos'
              : 'Comprehensive policy and claims management'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onNavigate('policies')}>
            <Plus className="h-4 w-4 mr-2" />
            {isSpanish ? 'Nueva Póliza' : 'New Policy'}
          </Button>
          <Button onClick={() => onNavigate('claims')}>
            <FileText className="h-4 w-4 mr-2" />
            {isSpanish ? 'Nuevo Reclamo' : 'New Claim'}
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
            <Progress 
              value={(insuranceStats.activePolicies / insuranceStats.totalPolicies) * 100} 
              className="mt-2" 
            />
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
            <Progress 
              value={(insuranceStats.openClaims / insuranceStats.totalClaims) * 100} 
              className="mt-2" 
            />
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
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+$450</span>
            </div>
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
            <div className="flex items-center mt-2">
              <BarChart3 className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-xs text-blue-500">23 {isSpanish ? 'reclamos' : 'claims'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Claims by Status */}
        <Card>
          <CardHeader>
            <CardTitle>{isSpanish ? 'Reclamos por Estado' : 'Claims by Status'}</CardTitle>
            <CardDescription>
              {isSpanish ? 'Distribución de reclamos por estado actual' : 'Distribution of claims by current status'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(insuranceStats.claimsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'Settled' || status === 'Approved' ? 'bg-green-500' :
                      status === 'Under Review' || status === 'Investigation' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    <span className="text-sm">{status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={(count / insuranceStats.totalClaims) * 100} className="w-20" />
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Claims by Type */}
        <Card>
          <CardHeader>
            <CardTitle>{isSpanish ? 'Reclamos por Tipo' : 'Claims by Type'}</CardTitle>
            <CardDescription>
              {isSpanish ? 'Distribución de reclamos por tipo de incidente' : 'Distribution of claims by incident type'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(insuranceStats.claimsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{type}</span>
                  </div>
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
          <CardDescription>
            {isSpanish ? 'Últimos reclamos y actualizaciones' : 'Latest claims and updates'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockClaims.slice(0, 5).map((claim) => (
              <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{claim.claimNumber}</p>
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status}
                      </Badge>
                      <Badge className={getPriorityColor(claim.priority)}>
                        {claim.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{claim.customerName}</p>
                    <p className="text-sm text-muted-foreground">{claim.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${claim.reportedAmount}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(claim.reportedAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {isSpanish ? 'Hace 2 días' : '2 days ago'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => onNavigate('claims')}>
              {isSpanish ? 'Ver Todos los Reclamos' : 'View All Claims'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{isSpanish ? 'Acciones Rápidas' : 'Quick Actions'}</CardTitle>
          <CardDescription>
            {isSpanish ? 'Acceso rápido a funciones comunes' : 'Quick access to common functions'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => onNavigate('calculator')}
            >
              <Calculator className="h-6 w-6" />
              <span>{isSpanish ? 'Calculadora' : 'Calculator'}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => onNavigate('risk')}
            >
              <AlertTriangle className="h-6 w-6" />
              <span>{isSpanish ? 'Evaluación de Riesgo' : 'Risk Assessment'}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => onNavigate('reports')}
            >
              <BarChart3 className="h-6 w-6" />
              <span>{isSpanish ? 'Reportes' : 'Reports'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 