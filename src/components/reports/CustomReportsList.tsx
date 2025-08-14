import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Report } from '@/hooks/useReports';
import { Play, Calendar, Edit, Trash2, BarChart3, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CustomReportsListProps {
  reports: Report[];
  onExecute: (reportId: string, parameters?: unknown) => void;
  onSchedule: (reportId: string) => void;
  isExecuting: boolean;
}

export function CustomReportsList({ reports, onExecute, onSchedule, isExecuting }: CustomReportsListProps) {
  const { language } = useLanguage();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'operational':
        return 'bg-blue-100 text-blue-800';
      case 'financial':
        return 'bg-green-100 text-green-800';
      case 'compliance':
        return 'bg-orange-100 text-orange-800';
      case 'custom':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {language === 'en' ? 'Custom Reports' : 'Informes Personalizados'}
        </h3>
        <div className="text-sm text-muted-foreground">
          {reports.length} {language === 'en' ? 'reports' : 'informes'}
        </div>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {language === 'en' ? 'No custom reports yet' : 'Aún no hay informes personalizados'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'en' 
                ? 'Create your first custom report using the report builder.'
                : 'Crea tu primer informe personalizado usando el constructor de informes.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card
              key={report.id}
              className="hover:shadow-md transition-shadow"
              tabIndex={0}
              aria-label={`${language === 'en' ? 'Open report' : 'Abrir informe'} ${report.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onExecute(report.id)
                  e.preventDefault()
                }
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      {report.name}
                    </CardTitle>
                    <CardDescription>
                      {report.description || (
                        language === 'en' ? 'No description provided' : 'Sin descripción'
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(report.type)}>
                      {report.type}
                    </Badge>
                    {report.is_public && (
                      <Badge variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        {language === 'en' ? 'Public' : 'Público'}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {language === 'en' ? 'Category:' : 'Categoría:'} {report.category}
                  </span>
                  <span>
                    {language === 'en' ? 'Created' : 'Creado'} {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onExecute(report.id)}
                    disabled={isExecuting}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    {language === 'en' ? 'Run' : 'Ejecutar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSchedule(report.id)}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    {language === 'en' ? 'Schedule' : 'Programar'}
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