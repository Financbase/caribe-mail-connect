import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ReportTemplate } from '@/hooks/useReports';
import { Play, Calendar, TrendingUp, DollarSign, Shield, Clock, Users, BarChart3 } from 'lucide-react';

interface ReportTemplatesGridProps {
  templates: ReportTemplate[];
  onExecute: (templateId: string, parameters?: unknown) => void;
  onSchedule: (templateId: string) => void;
  isExecuting: boolean;
}

export function ReportTemplatesGrid({ templates, onExecute, onSchedule, isExecuting }: ReportTemplatesGridProps) {
  const { language } = useLanguage();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'operational':
        return <TrendingUp className="h-5 w-5" />;
      case 'financial':
        return <DollarSign className="h-5 w-5" />;
      case 'compliance':
        return <Shield className="h-5 w-5" />;
      default:
        return <BarChart3 className="h-5 w-5" />;
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'operational':
        return 'default';
      case 'financial':
        return 'secondary';
      case 'compliance':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'daily_operations':
      case 'package_management':
        return <Clock className="h-4 w-4" />;
      case 'staff_management':
      case 'route_management':
        return <Users className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const groupedTemplates = templates.reduce((groups, template) => {
    const type = template.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(template);
    return groups;
  }, {} as Record<string, ReportTemplate[]>);

  const typeLabels = {
    operational: language === 'en' ? 'Operational Reports' : 'Informes Operacionales',
    financial: language === 'en' ? 'Financial Reports' : 'Informes Financieros',
    compliance: language === 'en' ? 'Compliance Reports' : 'Informes de Cumplimiento',
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedTemplates).map(([type, typeTemplates]) => (
        <div key={type} className="space-y-4">
          <div className="flex items-center gap-2">
            {getTypeIcon(type)}
            <h3 className="text-lg font-semibold">
              {typeLabels[type as keyof typeof typeLabels] || type}
            </h3>
            <Badge variant={getTypeBadgeVariant(type)}>
              {typeTemplates.length} {language === 'en' ? 'reports' : 'informes'}
            </Badge>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {typeTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {getCategoryIcon(template.category)}
                        {template.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                    {template.required_roles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onExecute(template.id)}
                      disabled={isExecuting}
                      className="flex-1"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      {language === 'en' ? 'Run' : 'Ejecutar'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSchedule(template.id)}
                      className="flex-1"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      {language === 'en' ? 'Schedule' : 'Programar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
      
      {templates.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {language === 'en' ? 'No report templates available' : 'No hay plantillas de informes disponibles'}
          </h3>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Report templates will appear here when they are configured.'
              : 'Las plantillas de informes aparecerán aquí cuando estén configuradas.'}
          </p>
        </div>
      )}
    </div>
  );
}