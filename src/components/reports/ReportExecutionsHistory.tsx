import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ReportExecution } from '@/hooks/useReports';
import { History, Download, Eye, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface ReportExecutionsHistoryProps {
  executions: (ReportExecution & { reports: { name: string } })[];
}

export function ReportExecutionsHistory({ executions }: ReportExecutionsHistoryProps) {
  const { language } = useLanguage();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      running: language === 'en' ? 'Running' : 'Ejecutando',
      completed: language === 'en' ? 'Completed' : 'Completado',
      failed: language === 'en' ? 'Failed' : 'Fallido',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatExecutionTime = (ms: number | null) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {language === 'en' ? 'Execution History' : 'Historial de Ejecuciones'}
        </h3>
        <div className="text-sm text-muted-foreground">
          {executions.length} {language === 'en' ? 'executions' : 'ejecuciones'}
        </div>
      </div>

      {executions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {language === 'en' ? 'No execution history' : 'No hay historial de ejecuciones'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'en' 
                ? 'Report execution history will appear here once you start running reports.'
                : 'El historial de ejecución de informes aparecerá aquí una vez que comiences a ejecutar informes.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {executions.map((execution) => (
            <Card key={execution.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(execution.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">
                          {execution.reports.name}
                        </span>
                        <Badge className={getStatusColor(execution.status)}>
                          {getStatusLabel(execution.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {language === 'en' ? 'Started' : 'Iniciado'} {formatDistanceToNow(new Date(execution.executed_at), { addSuffix: true })}
                        </span>
                        {execution.execution_time_ms && (
                          <span>
                            {language === 'en' ? 'Duration:' : 'Duración:'} {formatExecutionTime(execution.execution_time_ms)}
                          </span>
                        )}
                        {execution.row_count && (
                          <span>
                            {execution.row_count} {language === 'en' ? 'rows' : 'filas'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {execution.status === 'completed' && execution.file_url && (
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        {language === 'en' ? 'Download' : 'Descargar'}
                      </Button>
                    )}
                    {execution.result_data && (
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        {language === 'en' ? 'View' : 'Ver'}
                      </Button>
                    )}
                  </div>
                </div>

                {execution.error_message && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                      <XCircle className="h-4 w-4" />
                      <span className="font-medium">
                        {language === 'en' ? 'Error' : 'Error'}
                      </span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      {execution.error_message}
                    </p>
                  </div>
                )}

                {execution.completed_at && execution.status === 'completed' && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    {language === 'en' ? 'Completed on' : 'Completado el'} {format(new Date(execution.completed_at), 'PPpp')}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}