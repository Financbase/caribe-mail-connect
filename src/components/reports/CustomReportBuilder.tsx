import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { useReports } from '@/hooks/useReports';
import { Database, Table, BarChart3, Settings, Eye } from 'lucide-react';

interface CustomReportBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomReportBuilder({ open, onOpenChange }: CustomReportBuilderProps) {
  const { language } = useLanguage();
  const { createReport, isCreatingReport } = useReports();
  
  const [activeTab, setActiveTab] = useState('basic');
  const [reportData, setReportData] = useState({
    name: '',
    description: '',
    type: 'custom' as const,
    category: '',
    query_config: {
      tables: [] as string[],
      fields: [] as string[],
      filters: {},
      groupBy: '',
      orderBy: '',
      limit: 100
    },
    visualization_config: {
      chartType: 'table',
      xAxis: '',
      yAxis: '',
      colors: []
    },
    filters: {},
    parameters: {},
    is_public: false
  });

  const availableTables = [
    { name: 'customers', label: 'Customers', description: 'Customer information and details' },
    { name: 'packages', label: 'Packages', description: 'Package tracking and status' },
    { name: 'mailboxes', label: 'Mailboxes', description: 'Mailbox rental and assignments' },
    { name: 'invoices', label: 'Invoices', description: 'Billing and invoice data' },
    { name: 'deliveries', label: 'Deliveries', description: 'Delivery tracking and routes' },
    { name: 'locations', label: 'Locations', description: 'Mail center locations' },
    { name: 'payments', label: 'Payments', description: 'Payment history and records' },
  ];

  const chartTypes = [
    { value: 'table', label: 'Table', description: 'Standard data table' },
    { value: 'bar', label: 'Bar Chart', description: 'Vertical bar chart' },
    { value: 'line', label: 'Line Chart', description: 'Line graph over time' },
    { value: 'pie', label: 'Pie Chart', description: 'Circular percentage chart' },
    { value: 'area', label: 'Area Chart', description: 'Filled area chart' },
  ];

  const handleSubmit = async () => {
    if (!reportData.name || !reportData.category || reportData.query_config.tables.length === 0) {
      return;
    }

    await createReport({
      ...reportData,
      query_config: reportData.query_config,
      visualization_config: reportData.visualization_config,
      filters: reportData.filters,
      parameters: reportData.parameters,
      created_by: null, // Will be set by backend
      updated_by: null,
      location_id: null,
      is_system: false
    });

    onOpenChange(false);
    
    // Reset form
    setReportData({
      name: '',
      description: '',
      type: 'custom',
      category: '',
      query_config: {
        tables: [],
        fields: [],
        filters: {},
        groupBy: '',
        orderBy: '',
        limit: 100
      },
      visualization_config: {
        chartType: 'table',
        xAxis: '',
        yAxis: '',
        colors: []
      },
      filters: {},
      parameters: {},
      is_public: false
    });
  };

  const handleTableToggle = (tableName: string, checked: boolean) => {
    const newTables = checked
      ? [...reportData.query_config.tables, tableName]
      : reportData.query_config.tables.filter(t => t !== tableName);
    
    setReportData(prev => ({
      ...prev,
      query_config: {
        ...prev.query_config,
        tables: newTables
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {language === 'en' ? 'Custom Report Builder' : 'Constructor de Informes Personalizados'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? 'Create a custom report by selecting data sources, fields, and visualization options.'
              : 'Crea un informe personalizado seleccionando fuentes de datos, campos y opciones de visualización.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">
              {language === 'en' ? 'Basic Info' : 'Info Básica'}
            </TabsTrigger>
            <TabsTrigger value="data">
              {language === 'en' ? 'Data Sources' : 'Fuentes de Datos'}
            </TabsTrigger>
            <TabsTrigger value="visualization">
              {language === 'en' ? 'Visualization' : 'Visualización'}
            </TabsTrigger>
            <TabsTrigger value="preview">
              {language === 'en' ? 'Preview' : 'Vista Previa'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="report-name">
                  {language === 'en' ? 'Report Name' : 'Nombre del Informe'}
                </Label>
                <Input
                  id="report-name"
                  value={reportData.name}
                  onChange={(e) => setReportData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={language === 'en' ? 'Enter report name...' : 'Ingresa el nombre del informe...'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-description">
                  {language === 'en' ? 'Description' : 'Descripción'}
                </Label>
                <Textarea
                  id="report-description"
                  value={reportData.description}
                  onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={language === 'en' ? 'Describe what this report shows...' : 'Describe qué muestra este informe...'}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-category">
                  {language === 'en' ? 'Category' : 'Categoría'}
                </Label>
                <Input
                  id="report-category"
                  value={reportData.category}
                  onChange={(e) => setReportData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder={language === 'en' ? 'e.g., Operations, Finance, Custom' : 'ej., Operaciones, Finanzas, Personalizado'}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="public-report"
                  checked={reportData.is_public}
                  onCheckedChange={(checked) => setReportData(prev => ({ ...prev, is_public: !!checked }))}
                />
                <Label htmlFor="public-report">
                  {language === 'en' ? 'Make this report public (visible to all users)' : 'Hacer este informe público (visible para todos los usuarios)'}
                </Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">
                {language === 'en' ? 'Select Data Sources' : 'Seleccionar Fuentes de Datos'}
              </h4>
              <div className="grid gap-3 md:grid-cols-2">
                {availableTables.map((table) => (
                  <Card key={table.name} className="cursor-pointer hover:shadow-sm transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`table-${table.name}`}
                          checked={reportData.query_config.tables.includes(table.name)}
                          onCheckedChange={(checked) => handleTableToggle(table.name, !!checked)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor={`table-${table.name}`} className="font-medium cursor-pointer">
                              {table.label}
                            </Label>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {table.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {reportData.query_config.tables.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">
                  {language === 'en' ? 'Query Configuration' : 'Configuración de Consulta'}
                </h4>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>
                      {language === 'en' ? 'Group By' : 'Agrupar Por'}
                    </Label>
                    <Input
                      value={reportData.query_config.groupBy}
                      onChange={(e) => setReportData(prev => ({
                        ...prev,
                        query_config: { ...prev.query_config, groupBy: e.target.value }
                      }))}
                      placeholder={language === 'en' ? 'Field to group by' : 'Campo para agrupar'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      {language === 'en' ? 'Order By' : 'Ordenar Por'}
                    </Label>
                    <Input
                      value={reportData.query_config.orderBy}
                      onChange={(e) => setReportData(prev => ({
                        ...prev,
                        query_config: { ...prev.query_config, orderBy: e.target.value }
                      }))}
                      placeholder={language === 'en' ? 'Field to order by' : 'Campo para ordenar'}
                    />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="visualization" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>
                  {language === 'en' ? 'Chart Type' : 'Tipo de Gráfico'}
                </Label>
                <Select
                  value={reportData.visualization_config.chartType}
                  onValueChange={(value) => setReportData(prev => ({
                    ...prev,
                    visualization_config: { ...prev.visualization_config, chartType: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {chartTypes.map((chart) => (
                      <SelectItem key={chart.value} value={chart.value}>
                        <div>
                          <div className="font-medium">{chart.label}</div>
                          <div className="text-xs text-muted-foreground">{chart.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {reportData.visualization_config.chartType !== 'table' && (
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>
                      {language === 'en' ? 'X-Axis Field' : 'Campo Eje X'}
                    </Label>
                    <Input
                      value={reportData.visualization_config.xAxis}
                      onChange={(e) => setReportData(prev => ({
                        ...prev,
                        visualization_config: { ...prev.visualization_config, xAxis: e.target.value }
                      }))}
                      placeholder={language === 'en' ? 'X-axis field' : 'Campo eje X'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      {language === 'en' ? 'Y-Axis Field' : 'Campo Eje Y'}
                    </Label>
                    <Input
                      value={reportData.visualization_config.yAxis}
                      onChange={(e) => setReportData(prev => ({
                        ...prev,
                        visualization_config: { ...prev.visualization_config, yAxis: e.target.value }
                      }))}
                      placeholder={language === 'en' ? 'Y-axis field' : 'Campo eje Y'}
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {language === 'en' ? 'Report Preview' : 'Vista Previa del Informe'}
                </CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Preview of your custom report configuration'
                    : 'Vista previa de la configuración de tu informe personalizado'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">{reportData.name || (language === 'en' ? 'Unnamed Report' : 'Informe Sin Nombre')}</h4>
                  <p className="text-sm text-muted-foreground">{reportData.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{reportData.type}</Badge>
                  <Badge variant="outline">{reportData.category}</Badge>
                  <Badge variant="outline">{reportData.visualization_config.chartType}</Badge>
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-2">
                    {language === 'en' ? 'Data Sources:' : 'Fuentes de Datos:'}
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {reportData.query_config.tables.map((table) => (
                      <Badge key={table} variant="secondary" className="text-xs">
                        {table}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {language === 'en' ? 'Cancel' : 'Cancelar'}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isCreatingReport || !reportData.name || !reportData.category || reportData.query_config.tables.length === 0}
          >
            {isCreatingReport 
              ? (language === 'en' ? 'Creating...' : 'Creando...')
              : (language === 'en' ? 'Create Report' : 'Crear Informe')
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}