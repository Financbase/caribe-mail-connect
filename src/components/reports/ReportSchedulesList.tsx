import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { ReportSchedule } from '@/hooks/useReports';
import { Calendar, Clock, Mail, Users, Pause, Play, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface ReportSchedulesListProps {
  schedules: (ReportSchedule & { reports: { name: string } })[];
}

export function ReportSchedulesList({ schedules }: ReportSchedulesListProps) {
  const { language } = useLanguage();

  const getScheduleTypeLabel = (type: string) => {
    const labels = {
      once: language === 'en' ? 'Once' : 'Una vez',
      daily: language === 'en' ? 'Daily' : 'Diario',
      weekly: language === 'en' ? 'Weekly' : 'Semanal',
      monthly: language === 'en' ? 'Monthly' : 'Mensual',
      quarterly: language === 'en' ? 'Quarterly' : 'Trimestral',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return '📄';
      case 'excel':
        return '📊';
      case 'csv':
        return '📋';
      default:
        return '📄';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {language === 'en' ? 'Scheduled Reports' : 'Informes Programados'}
        </h3>
        <div className="text-sm text-muted-foreground">
          {schedules.length} {language === 'en' ? 'schedules' : 'programaciones'}
        </div>
      </div>

      {schedules.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {language === 'en' ? 'No scheduled reports' : 'No hay informes programados'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'en' 
                ? 'Schedule reports to run automatically at specified intervals.'
                : 'Programa informes para que se ejecuten automáticamente en intervalos especificados.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {schedules.map((schedule) => (
            <Card key={schedule.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {schedule.name}
                    </CardTitle>
                    <CardDescription>
                      {language === 'en' ? 'Report:' : 'Informe:'} {schedule.reports.name}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(schedule.is_active)}>
                      {schedule.is_active 
                        ? (language === 'en' ? 'Active' : 'Activo')
                        : (language === 'en' ? 'Inactive' : 'Inactivo')
                      }
                    </Badge>
                    <Switch 
                      checked={schedule.is_active}
                      onCheckedChange={() => {
                        // Handle toggle
                      }}
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        {language === 'en' ? 'Frequency' : 'Frecuencia'}
                      </div>
                      <div className="text-muted-foreground">
                        {getScheduleTypeLabel(schedule.schedule_type)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getFormatIcon(schedule.format)}</span>
                    <div>
                      <div className="font-medium">
                        {language === 'en' ? 'Format' : 'Formato'}
                      </div>
                      <div className="text-muted-foreground">
                        {schedule.format.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        {language === 'en' ? 'Recipients' : 'Destinatarios'}
                      </div>
                      <div className="text-muted-foreground">
                        {Array.isArray(schedule.recipients) ? schedule.recipients.length : 0}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        {language === 'en' ? 'Last Run' : 'Última Ejecución'}
                      </div>
                      <div className="text-muted-foreground">
                        {schedule.last_run_at 
                          ? formatDistanceToNow(new Date(schedule.last_run_at), { addSuffix: true })
                          : (language === 'en' ? 'Never' : 'Nunca')
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {schedule.next_run_at && (
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm font-medium mb-1">
                      {language === 'en' ? 'Next Scheduled Run' : 'Próxima Ejecución Programada'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(schedule.next_run_at), 'PPpp')}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                  >
                    {schedule.is_active ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        {language === 'en' ? 'Pause' : 'Pausar'}
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        {language === 'en' ? 'Resume' : 'Reanudar'}
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    {language === 'en' ? 'Edit' : 'Editar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    {language === 'en' ? 'Delete' : 'Eliminar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}