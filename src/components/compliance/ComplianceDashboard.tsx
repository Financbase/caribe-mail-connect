/**
 * Compliance Dashboard Component
 * Story 1: Clear Product Shape - Compliance Framework
 * 
 * Dashboard for managing compliance frameworks, tracking requirements,
 * and monitoring compliance status across multiple regulations
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Users,
  Globe,
  Lock,
  Eye,
  Download,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  Calendar,
  Target
} from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { ComplianceService } from '@/services/compliance';
import type { ComplianceFramework, ComplianceRequirement } from '@/services/compliance';

// =====================================================
// COMPLIANCE DASHBOARD COMPONENT
// =====================================================

export function ComplianceDashboard() {
  const { subscription } = useSubscription();
  
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =====================================================
  // DATA LOADING
  // =====================================================

  const loadComplianceData = async () => {
    if (!subscription?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const frameworksData = ComplianceService.getComplianceFrameworks();
      const dashboard = await ComplianceService.getComplianceDashboard(subscription.id);
      
      setFrameworks(frameworksData);
      setDashboardData(dashboard);
      
      if (!selectedFramework && frameworksData.length > 0) {
        setSelectedFramework(frameworksData[0].id);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load compliance data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComplianceData();
  }, [subscription?.id]);

  // =====================================================
  // RENDER HELPERS
  // =====================================================

  const renderFrameworkCard = (framework: ComplianceFramework) => {
    const requirements = framework.requirements;
    const implementedCount = requirements.filter(r => r.implementation_status === 'implemented').length;
    const compliancePercentage = requirements.length > 0 ? Math.round((implementedCount / requirements.length) * 100) : 0;
    
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'compliant': return 'text-green-600 bg-green-100';
        case 'in_progress': return 'text-yellow-600 bg-yellow-100';
        case 'non_compliant': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'compliant': return <CheckCircle className="h-4 w-4" />;
        case 'in_progress': return <Clock className="h-4 w-4" />;
        case 'non_compliant': return <AlertTriangle className="h-4 w-4" />;
        default: return <AlertCircle className="h-4 w-4" />;
      }
    };

    return (
      <Card 
        key={framework.id}
        className={`cursor-pointer transition-all ${
          selectedFramework === framework.id ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => setSelectedFramework(framework.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{framework.name}</CardTitle>
            <Badge className={getStatusColor(framework.compliance_status)}>
              {getStatusIcon(framework.compliance_status)}
              <span className="ml-1 capitalize">{framework.compliance_status.replace('_', ' ')}</span>
            </Badge>
          </div>
          <CardDescription>{framework.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Compliance Progress</span>
                <span>{compliancePercentage}%</span>
              </div>
              <Progress value={compliancePercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Requirements:</span>
                <p className="font-medium">{requirements.length}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Implemented:</span>
                <p className="font-medium">{implementedCount}</p>
              </div>
            </div>

            {framework.certification_required && (
              <Badge variant="outline" className="w-full justify-center">
                <Shield className="h-3 w-3 mr-1" />
                Certification Required
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRequirementRow = (requirement: ComplianceRequirement) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'implemented': return 'text-green-600 bg-green-100';
        case 'in_progress': return 'text-yellow-600 bg-yellow-100';
        case 'planned': return 'text-blue-600 bg-blue-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'critical': return 'text-red-600 bg-red-100';
        case 'high': return 'text-orange-600 bg-orange-100';
        case 'medium': return 'text-yellow-600 bg-yellow-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };

    return (
      <tr key={requirement.id} className="border-b hover:bg-muted/50">
        <td className="py-3 px-4">
          <div>
            <p className="font-medium">{requirement.title}</p>
            <p className="text-sm text-muted-foreground">{requirement.control_id}</p>
          </div>
        </td>
        <td className="py-3 px-4">
          <Badge className={getPriorityColor(requirement.priority)}>
            {requirement.priority}
          </Badge>
        </td>
        <td className="py-3 px-4">
          <Badge className={getStatusColor(requirement.implementation_status)}>
            {requirement.implementation_status.replace('_', ' ')}
          </Badge>
        </td>
        <td className="py-3 px-4 text-sm text-muted-foreground">
          {requirement.responsible_team}
        </td>
        <td className="py-3 px-4">
          {requirement.evidence_required && (
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="text-sm">{requirement.evidence_documents.length}</span>
            </div>
          )}
        </td>
      </tr>
    );
  };

  // =====================================================
  // MAIN RENDER
  // =====================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const selectedFrameworkData = frameworks.find(f => f.id === selectedFramework);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compliance Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage compliance across multiple regulatory frameworks
          </p>
        </div>
        <Button
          onClick={loadComplianceData}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Dashboard Overview */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Frameworks</p>
                  <p className="text-2xl font-bold">{dashboardData.frameworks}</p>
                </div>
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compliant</p>
                  <p className="text-2xl font-bold text-green-600">{dashboardData.compliant_frameworks}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Requirements</p>
                  <p className="text-2xl font-bold">{dashboardData.implemented_requirements}/{dashboardData.total_requirements}</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical Gaps</p>
                  <p className="text-2xl font-bold text-red-600">{dashboardData.critical_gaps}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="frameworks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Frameworks Tab */}
        <TabsContent value="frameworks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frameworks.map(renderFrameworkCard)}
          </div>
        </TabsContent>

        {/* Requirements Tab */}
        <TabsContent value="requirements" className="space-y-6">
          {selectedFrameworkData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {selectedFrameworkData.name} Requirements
                </CardTitle>
                <CardDescription>
                  Track implementation status of compliance requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Requirement</th>
                        <th className="text-left py-3 px-4">Priority</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Owner</th>
                        <th className="text-left py-3 px-4">Evidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedFrameworkData.requirements.map(renderRequirementRow)}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Compliance Assessments
              </CardTitle>
              <CardDescription>
                Schedule and track compliance assessments and audits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No assessments scheduled</p>
                <Button className="mt-4">Schedule Assessment</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Compliance Reports
              </CardTitle>
              <CardDescription>
                Generate and download compliance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {frameworks.map(framework => (
                  <Card key={framework.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{framework.name}</h3>
                          <p className="text-sm text-muted-foreground">Compliance Report</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
