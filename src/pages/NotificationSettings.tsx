import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Bell, 
  MessageSquare, 
  Mail, 
  Smartphone,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Copy,
  TestTube
} from 'lucide-react';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { NotificationRuleDialog } from '@/components/notifications/NotificationRuleDialog';
import { NotificationTemplateDialog } from '@/components/notifications/NotificationTemplateDialog';
import { NotificationAnalyticsDashboard } from '@/components/notifications/NotificationAnalyticsDashboard';
import { WhatsAppSetup } from '@/components/notifications/WhatsAppSetup';

export function NotificationSettings() {
  const [activeTab, setActiveTab] = useState('rules');
  const [selectedRule, setSelectedRule] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);

  const {
    rules,
    templates,
    workflows,
    analytics,
    rulesLoading,
    templatesLoading,
    workflowsLoading,
    analyticsLoading,
    updateRule,
    deleteRule,
    deleteTemplate,
    testNotification,
    isUpdatingRule,
    isDeletingRule,
    isDeletingTemplate,
    isTesting
  } = useNotificationSystem();

  const toggleRuleStatus = (ruleId: string, isActive: boolean) => {
    updateRule({ id: ruleId, updates: { is_active: !isActive } });
  };

  const duplicateTemplate = (template: any) => {
    setSelectedTemplate({
      ...template,
      id: undefined,
      name: `${template.name} (Copia)`,
      is_default: false
    });
    setShowTemplateDialog(true);
  };

  const testTemplate = (templateId: string) => {
    testNotification({
      templateId,
      testData: {
        customer_name: 'Juan Pérez',
        tracking_number: 'TEST123456',
        carrier: 'UPS',
        size: 'Medium',
        arrival_date: new Date().toLocaleDateString('es-PR')
      }
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sistema de Notificaciones</h1>
          <p className="text-muted-foreground">
            Configure reglas automáticas, plantillas y analíticas de notificaciones
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedRule(null);
              setShowRuleDialog(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Regla
          </Button>
          <Button
            onClick={() => {
              setSelectedTemplate(null);
              setShowTemplateDialog(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Plantilla
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Reglas
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Plantillas
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Flujos
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analíticas
          </TabsTrigger>
        </TabsList>

        {/* Notification Rules */}
        <TabsContent value="rules" className="space-y-4">
          <div className="grid gap-4">
            {rulesLoading ? (
              <div className="text-center py-8">Cargando reglas...</div>
            ) : rules.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Settings className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay reglas configuradas</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Cree su primera regla de notificación automática
                  </p>
                  <Button onClick={() => setShowRuleDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primera Regla
                  </Button>
                </CardContent>
              </Card>
            ) : (
              rules.map((rule) => (
                <Card key={rule.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={rule.is_active ? "default" : "secondary"}>
                        {rule.is_active ? 'Activa' : 'Inactiva'}
                      </Badge>
                      <Badge variant="outline">
                        {rule.trigger_type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Canales:</span>
                          <div className="flex gap-1">
                            {rule.channels.email && <Mail className="w-4 h-4 text-blue-500" />}
                            {rule.channels.sms && <MessageSquare className="w-4 h-4 text-green-500" />}
                            {rule.channels.whatsapp && <Smartphone className="w-4 h-4 text-green-600" />}
                          </div>
                        </div>
                        {rule.delay_minutes > 0 && (
                          <Badge variant="outline">
                            Retraso: {rule.delay_minutes}m
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rule.is_active}
                          onCheckedChange={() => toggleRuleStatus(rule.id, rule.is_active)}
                          disabled={isUpdatingRule}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRule(rule);
                            setShowRuleDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRule(rule.id)}
                          disabled={isDeletingRule}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Notification Templates */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4">
            {templatesLoading ? (
              <div className="text-center py-8">Cargando plantillas...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={template.is_default ? "default" : "secondary"}>
                            {template.type}
                          </Badge>
                          <Badge variant="outline">
                            {template.language.toUpperCase()}
                          </Badge>
                        </div>
                        {template.is_default && (
                          <Badge variant="secondary">Predeterminada</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {template.description && (
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {template.subject && (
                          <div>
                            <span className="text-xs text-muted-foreground">Asunto:</span>
                            <p className="text-sm truncate">{template.subject}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-xs text-muted-foreground">Contenido:</span>
                          <p className="text-sm truncate">{template.content}</p>
                        </div>
                        {template.variables.length > 0 && (
                          <div>
                            <span className="text-xs text-muted-foreground">Variables:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.variables.slice(0, 3).map((variable) => (
                                <Badge key={variable} variant="outline" className="text-xs">
                                  {variable}
                                </Badge>
                              ))}
                              {template.variables.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{template.variables.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between pt-2">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => testTemplate(template.id)}
                              disabled={isTesting}
                            >
                              <TestTube className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => duplicateTemplate(template)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedTemplate(template);
                                setShowTemplateDialog(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                          {!template.is_default && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTemplate(template.id)}
                              disabled={isDeletingTemplate}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Notification Workflows */}
        <TabsContent value="workflows" className="space-y-4">
          <div className="grid gap-4">
            {workflowsLoading ? (
              <div className="text-center py-8">Cargando flujos...</div>
            ) : (
              workflows.map((workflow) => (
                <Card key={workflow.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{workflow.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={workflow.is_system ? "secondary" : "default"}>
                          {workflow.is_system ? 'Sistema' : 'Personalizado'}
                        </Badge>
                        <Badge variant={workflow.is_active ? "default" : "secondary"}>
                          {workflow.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium">Pasos del flujo:</span>
                        <div className="mt-2 space-y-2">
                          {workflow.steps.map((step: any, index: number) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Badge variant="outline">{step.step}</Badge>
                              <span>{step.trigger}</span>
                              {step.delay > 0 && (
                                <Badge variant="secondary">{step.delay}m</Badge>
                              )}
                              <div className="flex gap-1">
                                {step.channels?.map((channel: string) => (
                                  <Badge key={channel} variant="outline" className="text-xs">
                                    {channel}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* WhatsApp Business Setup */}
        <TabsContent value="whatsapp">
          <WhatsAppSetup />
        </TabsContent>

        {/* Analytics Dashboard */}
        <TabsContent value="analytics">
          <NotificationAnalyticsDashboard />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <NotificationRuleDialog
        open={showRuleDialog}
        onOpenChange={setShowRuleDialog}
        rule={selectedRule}
        onSuccess={() => {
          setShowRuleDialog(false);
          setSelectedRule(null);
        }}
      />

      <NotificationTemplateDialog
        open={showTemplateDialog}
        onOpenChange={setShowTemplateDialog}
        template={selectedTemplate}
        onSuccess={() => {
          setShowTemplateDialog(false);
          setSelectedTemplate(null);
        }}
      />
    </div>
  );
}