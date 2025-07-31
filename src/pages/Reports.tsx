import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useReports } from '@/hooks/useReports';
import { ReportTemplatesGrid } from '@/components/reports/ReportTemplatesGrid';
import { CustomReportsList } from '@/components/reports/CustomReportsList';
import { ReportSchedulesList } from '@/components/reports/ReportSchedulesList';
import { ReportExecutionsHistory } from '@/components/reports/ReportExecutionsHistory';
import { CustomReportBuilder } from '@/components/reports/CustomReportBuilder';
import { ReportScheduleDialog } from '@/components/reports/ReportScheduleDialog';
import { FileText, Calendar, History, Settings, Plus, TrendingUp, DollarSign, Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ReportsProps {
  onNavigate?: (page: string) => void;
}

export default function Reports({ onNavigate }: ReportsProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('templates');
  const [showReportBuilder, setShowReportBuilder] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const {
    reportTemplates,
    reports,
    reportSchedules,
    reportExecutions,
    templatesLoading,
    reportsLoading,
    schedulesLoading,
    executionsLoading,
    executeReport,
    isExecutingReport,
  } = useReports();

  const handleCreateCustomReport = () => {
    setShowReportBuilder(true);
  };

  const handleScheduleReport = (reportId: string) => {
    setSelectedReportId(reportId);
    setShowScheduleDialog(true);
  };

  const handleExecuteReport = (reportId: string, parameters?: Record<string, unknown>) => {
    executeReport({ reportId, parameters });
  };

  const getReportTypeStats = () => {
    const operational = reportTemplates.filter(t => t.type === 'operational').length;
    const financial = reportTemplates.filter(t => t.type === 'financial').length;
    const compliance = reportTemplates.filter(t => t.type === 'compliance').length;
    
    return { operational, financial, compliance };
  };

  const stats = getReportTypeStats();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* API Configuration Alert */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          {language === 'en' 
            ? 'Email delivery for scheduled reports requires Resend API configuration. Please contact your administrator to set up the RESEND_API_KEY in the system settings.'
            : 'La entrega de email para informes programados requiere configuración de API de Resend. Por favor contacte a su administrador para configurar RESEND_API_KEY en la configuración del sistema.'}
        </AlertDescription>
      </Alert>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {language === 'en' ? 'Reports Center' : 'Centro de Informes'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Generate, schedule, and manage reports for your mail center operations'
              : 'Generar, programar y gestionar informes para las operaciones de tu centro de correo'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleCreateCustomReport}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {language === 'en' ? 'Custom Report' : 'Informe Personalizado'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'en' ? 'Operational Reports' : 'Informes Operacionales'}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.operational}</div>
            <p className="text-xs text-muted-foreground">
              {language === 'en' ? 'Available templates' : 'Plantillas disponibles'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'en' ? 'Financial Reports' : 'Informes Financieros'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.financial}</div>
            <p className="text-xs text-muted-foreground">
              {language === 'en' ? 'Available templates' : 'Plantillas disponibles'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'en' ? 'Compliance Reports' : 'Informes de Cumplimiento'}
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.compliance}</div>
            <p className="text-xs text-muted-foreground">
              {language === 'en' ? 'Available templates' : 'Plantillas disponibles'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'en' ? 'Active Schedules' : 'Programaciones Activas'}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportSchedules.filter(s => s.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'en' ? 'Scheduled reports' : 'Informes programados'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {language === 'en' ? 'Templates' : 'Plantillas'}
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {language === 'en' ? 'Custom Reports' : 'Informes Personalizados'}
          </TabsTrigger>
          <TabsTrigger value="schedules" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {language === 'en' ? 'Schedules' : 'Programaciones'}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            {language === 'en' ? 'History' : 'Historial'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          {templatesLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <ReportTemplatesGrid
              templates={reportTemplates}
              onExecute={handleExecuteReport}
              onSchedule={handleScheduleReport}
              isExecuting={isExecutingReport}
            />
          )}
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          {reportsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <CustomReportsList
              reports={reports}
              onExecute={handleExecuteReport}
              onSchedule={handleScheduleReport}
              isExecuting={isExecutingReport}
            />
          )}
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          {schedulesLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <ReportSchedulesList
              schedules={reportSchedules}
            />
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {executionsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <ReportExecutionsHistory
              executions={reportExecutions}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Custom Report Builder Dialog */}
      {showReportBuilder && (
        <CustomReportBuilder
          open={showReportBuilder}
          onOpenChange={setShowReportBuilder}
        />
      )}

      {/* Report Schedule Dialog */}
      {showScheduleDialog && selectedReportId && (
        <ReportScheduleDialog
          open={showScheduleDialog}
          onOpenChange={setShowScheduleDialog}
          reportId={selectedReportId}
        />
      )}
    </div>
  );
}