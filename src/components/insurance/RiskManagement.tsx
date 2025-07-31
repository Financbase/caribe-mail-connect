import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  FileText, 
  BarChart3,
  Eye,
  Clock,
  DollarSign,
  Package,
  CheckCircle,
  X,
  Download,
  Play,
  BookOpen,
  Target,
  Zap
} from 'lucide-react';
import { 
  mockRiskAssessments, 
  mockFraudAlerts,
  mockClaims 
} from '@/data/insuranceData';
import { 
  RiskAssessment, 
  FraudAlert, 
  RiskLevel, 
  AlertSeverity,
  FraudAlertType 
} from '@/types/insurance';
import { useLanguage } from '@/contexts/LanguageContext';

interface RiskManagementProps {
  onNavigate: (section: string) => void;
}

export function RiskManagement({ onNavigate }: RiskManagementProps) {
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  
  const [selectedRisk, setSelectedRisk] = useState<RiskAssessment | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const getRiskLevelColor = (level: RiskLevel) => {
    switch (level) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Very High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'Critical':
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

  const getAlertTypeIcon = (type: FraudAlertType) => {
    switch (type) {
      case 'Multiple Claims':
        return <FileText className="h-4 w-4" />;
      case 'Suspicious Pattern':
        return <TrendingUp className="h-4 w-4" />;
      case 'Inconsistent Information':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Fake Documents':
        return <FileText className="h-4 w-4" />;
      case 'Exaggerated Damages':
        return <Package className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Calculate risk statistics
  const totalRiskScore = mockRiskAssessments.reduce((sum, assessment) => sum + assessment.score, 0);
  const averageRiskScore = totalRiskScore / mockRiskAssessments.length;
  const highRiskCount = mockRiskAssessments.filter(a => a.score > 60).length;
  const activeAlerts = mockFraudAlerts.filter(a => !a.resolvedAt).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isSpanish ? 'Gestión de Riesgo' : 'Risk Management'}
          </h1>
          <p className="text-muted-foreground">
            {isSpanish 
              ? 'Monitoreo y prevención de riesgos de seguro'
              : 'Insurance risk monitoring and prevention'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onNavigate('training')}>
            <BookOpen className="h-4 w-4 mr-2" />
            {isSpanish ? 'Capacitación' : 'Training'}
          </Button>
          <Button onClick={() => onNavigate('reports')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            {isSpanish ? 'Reportes' : 'Reports'}
          </Button>
        </div>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isSpanish ? 'Puntuación Promedio' : 'Average Risk Score'}
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRiskScore.toFixed(0)}/100</div>
            <Progress value={averageRiskScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {isSpanish ? 'Basado en' : 'Based on'} {mockRiskAssessments.length} {isSpanish ? 'evaluaciones' : 'assessments'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isSpanish ? 'Riesgo Alto' : 'High Risk'}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highRiskCount}</div>
            <p className="text-xs text-muted-foreground">
              {isSpanish ? 'Clientes con riesgo alto' : 'High-risk customers'}
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-xs text-red-500">+2 {isSpanish ? 'este mes' : 'this month'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isSpanish ? 'Alertas Activas' : 'Active Alerts'}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts}</div>
            <p className="text-xs text-muted-foreground">
              {isSpanish ? 'Alertas de fraude pendientes' : 'Pending fraud alerts'}
            </p>
            <div className="flex items-center mt-2">
              <Clock className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-xs text-yellow-500">{isSpanish ? 'Requieren atención' : 'Require attention'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isSpanish ? 'Prevención' : 'Prevention'}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              {isSpanish ? 'Tasa de éxito en prevención' : 'Prevention success rate'}
            </p>
            <div className="flex items-center mt-2">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+5% {isSpanish ? 'vs mes anterior' : 'vs last month'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Risk Assessments */}
        <Card>
          <CardHeader>
            <CardTitle>{isSpanish ? 'Evaluaciones de Riesgo' : 'Risk Assessments'}</CardTitle>
            <CardDescription>
              {isSpanish 
                ? 'Análisis detallado de riesgo por cliente'
                : 'Detailed risk analysis by customer'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRiskAssessments.map((assessment) => (
                <div 
                  key={assessment.id} 
                  className="p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setSelectedRisk(assessment)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Cliente {assessment.customerId}</span>
                    </div>
                    <Badge className={getRiskLevelColor(assessment.score < 30 ? 'Low' : 
                                                       assessment.score < 60 ? 'Medium' : 
                                                       assessment.score < 80 ? 'High' : 'Very High')}>
                      {assessment.score}/100
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{isSpanish ? 'Factores de Riesgo' : 'Risk Factors'}</span>
                      <span>{assessment.factors.length}</span>
                    </div>
                    <Progress value={assessment.score} className="w-full" />
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">
                      {isSpanish ? 'Última actualización' : 'Last updated'}: {assessment.lastUpdated}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fraud Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>{isSpanish ? 'Alertas de Fraude' : 'Fraud Alerts'}</CardTitle>
            <CardDescription>
              {isSpanish 
                ? 'Detección automática de actividades sospechosas'
                : 'Automatic detection of suspicious activities'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockFraudAlerts.map((alert) => (
                <Alert 
                  key={alert.id}
                  className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                    alert.severity === 'Critical' ? 'border-red-200 bg-red-50' :
                    alert.severity === 'High' ? 'border-orange-200 bg-orange-50' :
                    alert.severity === 'Medium' ? 'border-yellow-200 bg-yellow-50' :
                    'border-green-200 bg-green-50'
                  }`}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="flex items-start gap-3">
                    {getAlertTypeIcon(alert.alertType)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{alert.alertType}</h4>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        {alert.resolvedAt && (
                          <Badge className="bg-green-100 text-green-800">
                            {isSpanish ? 'Resuelto' : 'Resolved'}
                          </Badge>
                        )}
                      </div>
                      <AlertDescription className="text-sm">
                        {alert.description}
                      </AlertDescription>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.detectedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pattern Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>{isSpanish ? 'Análisis de Patrones' : 'Pattern Analysis'}</CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Identificación de patrones de riesgo y fraude'
              : 'Identification of risk and fraud patterns'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Risk Patterns */}
            <div className="space-y-4">
              <h3 className="font-semibold">{isSpanish ? 'Patrones de Riesgo' : 'Risk Patterns'}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{isSpanish ? 'Múltiples Reclamos' : 'Multiple Claims'}</p>
                    <p className="text-sm text-muted-foreground">12 {isSpanish ? 'casos detectados' : 'cases detected'}</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Alto</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{isSpanish ? 'Valores Exagerados' : 'Exaggerated Values'}</p>
                    <p className="text-sm text-muted-foreground">8 {isSpanish ? 'casos detectados' : 'cases detected'}</p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">Medio</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{isSpanish ? 'Documentación Faltante' : 'Missing Documentation'}</p>
                    <p className="text-sm text-muted-foreground">15 {isSpanish ? 'casos detectados' : 'cases detected'}</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Bajo</Badge>
                </div>
              </div>
            </div>

            {/* Geographic Risk */}
            <div className="space-y-4">
              <h3 className="font-semibold">{isSpanish ? 'Riesgo Geográfico' : 'Geographic Risk'}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">San Juan</p>
                    <p className="text-sm text-muted-foreground">45% {isSpanish ? 'de reclamos' : 'of claims'}</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Alto</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Bayamón</p>
                    <p className="text-sm text-muted-foreground">23% {isSpanish ? 'de reclamos' : 'of claims'}</p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">Medio</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Caguas</p>
                    <p className="text-sm text-muted-foreground">12% {isSpanish ? 'de reclamos' : 'of claims'}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Bajo</Badge>
                </div>
              </div>
            </div>

            {/* Time-based Patterns */}
            <div className="space-y-4">
              <h3 className="font-semibold">{isSpanish ? 'Patrones Temporales' : 'Time-based Patterns'}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{isSpanish ? 'Fines de Semana' : 'Weekends'}</p>
                    <p className="text-sm text-muted-foreground">+35% {isSpanish ? 'más reclamos' : 'more claims'}</p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">Alto</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{isSpanish ? 'Meses de Vacaciones' : 'Holiday Months'}</p>
                    <p className="text-sm text-muted-foreground">+28% {isSpanish ? 'más reclamos' : 'more claims'}</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Medio</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{isSpanish ? 'Horas Pico' : 'Peak Hours'}</p>
                    <p className="text-sm text-muted-foreground">2-6 PM</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Bajo</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prevention Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>{isSpanish ? 'Recomendaciones de Prevención' : 'Prevention Recommendations'}</CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Acciones específicas para reducir riesgos'
              : 'Specific actions to reduce risks'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* High-Value Item Protocols */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                {isSpanish ? 'Protocolos para Artículos de Alto Valor' : 'High-Value Item Protocols'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">{isSpanish ? 'Fotografía Detallada' : 'Detailed Photography'}</p>
                    <p className="text-sm text-muted-foreground">
                      {isSpanish 
                        ? 'Documentar cada ángulo del artículo antes del envío'
                        : 'Document every angle of the item before shipping'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">{isSpanish ? 'Embalaje Especializado' : 'Specialized Packaging'}</p>
                    <p className="text-sm text-muted-foreground">
                      {isSpanish 
                        ? 'Usar materiales de embalaje aprobados para alto valor'
                        : 'Use approved packaging materials for high-value items'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">{isSpanish ? 'Seguro Adicional' : 'Additional Insurance'}</p>
                    <p className="text-sm text-muted-foreground">
                      {isSpanish 
                        ? 'Recomendar cobertura premium para artículos costosos'
                        : 'Recommend premium coverage for expensive items'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fraud Prevention */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                {isSpanish ? 'Prevención de Fraude' : 'Fraud Prevention'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">{isSpanish ? 'Verificación de Identidad' : 'Identity Verification'}</p>
                    <p className="text-sm text-muted-foreground">
                      {isSpanish 
                        ? 'Verificar identidad del cliente antes de procesar reclamos'
                        : 'Verify customer identity before processing claims'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">{isSpanish ? 'Análisis de Patrones' : 'Pattern Analysis'}</p>
                    <p className="text-sm text-muted-foreground">
                      {isSpanish 
                        ? 'Monitorear patrones de reclamos sospechosos'
                        : 'Monitor suspicious claim patterns'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">{isSpanish ? 'Documentación Requerida' : 'Required Documentation'}</p>
                    <p className="text-sm text-muted-foreground">
                      {isSpanish 
                        ? 'Solicitar documentación completa para reclamos grandes'
                        : 'Request complete documentation for large claims'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Materials */}
      <Card>
        <CardHeader>
          <CardTitle>{isSpanish ? 'Materiales de Capacitación' : 'Training Materials'}</CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Recursos para capacitar al personal en gestión de riesgos'
              : 'Resources to train staff in risk management'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Play className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">{isSpanish ? 'Videos de Capacitación' : 'Training Videos'}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{isSpanish ? 'Detección de Fraude' : 'Fraud Detection'}</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{isSpanish ? 'Protocolos de Seguridad' : 'Security Protocols'}</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{isSpanish ? 'Manejo de Reclamos' : 'Claims Handling'}</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">{isSpanish ? 'Documentos' : 'Documents'}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{isSpanish ? 'Manual de Procedimientos' : 'Procedure Manual'}</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{isSpanish ? 'Lista de Verificación' : 'Checklist'}</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{isSpanish ? 'Guías de Mejores Prácticas' : 'Best Practices Guide'}</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">{isSpanish ? 'Evaluaciones' : 'Assessments'}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{isSpanish ? 'Examen de Conocimientos' : 'Knowledge Test'}</span>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{isSpanish ? 'Simulaciones' : 'Simulations'}</span>
                  <Button variant="ghost" size="sm">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{isSpanish ? 'Certificaciones' : 'Certifications'}</span>
                  <Button variant="ghost" size="sm">
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 