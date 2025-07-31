import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BookOpen, 
  Headphones,
  FileText,
  Video,
  Award,
  Star,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Upload,
  MessageSquare,
  Plus,
  Search,
  Filter,
  Eye,
  Play,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useFranchisee } from '@/hooks/useFranchisee';

interface PnLData {
  revenue: number;
  expenses: number;
  gross_profit: number;
  net_profit: number;
  profit_margin: number;
  monthly_trends: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
  expense_breakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

interface BenchmarkComparison {
  metric: string;
  your_value: number;
  network_average: number;
  top_performer: number;
  your_rank: number;
  total_locations: number;
  improvement_potential: number;
}

interface BestPractice {
  id: string;
  title: string;
  category: 'operations' | 'marketing' | 'customer_service' | 'financial' | 'compliance';
  description: string;
  author: string;
  location: string;
  implementation_difficulty: 'easy' | 'medium' | 'hard';
  impact_score: number;
  implementation_time: string;
  resources_needed: string[];
  created_at: string;
  likes: number;
  downloads: number;
}

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'operational' | 'financial' | 'marketing' | 'compliance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  resolution?: string;
}

interface TrainingResource {
  id: string;
  title: string;
  type: 'video' | 'document' | 'interactive' | 'webinar';
  category: 'onboarding' | 'operations' | 'compliance' | 'marketing' | 'technology';
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completion_rate: number;
  rating: number;
  url: string;
  thumbnail?: string;
  required: boolean;
  last_updated: string;
}

const CATEGORIES = [
  { value: 'operations', label: 'Operaciones', color: 'bg-blue-100 text-blue-800' },
  { value: 'marketing', label: 'Marketing', color: 'bg-green-100 text-green-800' },
  { value: 'customer_service', label: 'Servicio al Cliente', color: 'bg-purple-100 text-purple-800' },
  { value: 'financial', label: 'Financiero', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'compliance', label: 'Cumplimiento', color: 'bg-red-100 text-red-800' }
];

const PRIORITIES = [
  { value: 'low', label: 'Baja', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-800' }
];

export function FranchiseePortal() {
  const { 
    pnlData, 
    benchmarkComparisons, 
    bestPractices, 
    supportTickets, 
    trainingResources,
    loading 
  } = useFranchisee();

  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'technical' as string,
    priority: 'medium' as string
  });

  const getCategoryColor = (category: string) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return cat?.color || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const pri = PRIORITIES.find(p => p.value === priority);
    return pri?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const createSupportTicket = async () => {
    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      return;
    }

    // Mock implementation
    console.log('Creating ticket:', newTicket);
    setNewTicket({ title: '', description: '', category: 'technical', priority: 'medium' });
    setShowCreateTicket(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Portal de Franquiciado</h1>
          <p className="text-muted-foreground mt-2">
            Gestión integral de tu franquicia PRMCMS
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Card className="px-4 py-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Beneficio Neto</p>
                <p className="text-2xl font-bold text-green-600">
                  ${pnlData?.net_profit?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </Card>
          <Card className="px-4 py-2">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Rendimiento</p>
                <p className="text-2xl font-bold text-blue-600">
                  {benchmarkComparisons.find(b => b.metric === 'performance_score')?.your_value || 0}%
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="pnl" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pnl">P&L</TabsTrigger>
          <TabsTrigger value="benchmarks">Comparaciones</TabsTrigger>
          <TabsTrigger value="best-practices">Mejores Prácticas</TabsTrigger>
          <TabsTrigger value="support">Soporte</TabsTrigger>
          <TabsTrigger value="training">Entrenamiento</TabsTrigger>
        </TabsList>

        <TabsContent value="pnl" className="space-y-6">
          {/* P&L Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${pnlData?.revenue?.toLocaleString() || 0}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gastos</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  ${pnlData?.expenses?.toLocaleString() || 0}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">-5.2%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Beneficio Bruto</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  ${pnlData?.gross_profit?.toLocaleString() || 0}
                </div>
                <Progress value={pnlData?.profit_margin || 0} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Margen: {pnlData?.profit_margin || 0}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Beneficio Neto</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${pnlData?.net_profit?.toLocaleString() || 0}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+18.3%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Desglose de Gastos</CardTitle>
              <CardDescription>
                Análisis detallado de los gastos operativos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pnlData?.expense_breakdown?.map((expense, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium">{expense.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">${expense.amount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{expense.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Comparación con la Red</span>
              </CardTitle>
              <CardDescription>
                Compara tu rendimiento con el promedio de la red y los mejores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {benchmarkComparisons.map((benchmark, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">{benchmark.metric}</h3>
                      <Badge variant="outline">
                        #{benchmark.your_rank} de {benchmark.total_locations}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Tu Valor</p>
                        <p className="text-lg font-bold text-blue-600">{benchmark.your_value}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Promedio Red</p>
                        <p className="text-lg font-bold text-gray-600">{benchmark.network_average}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mejor</p>
                        <p className="text-lg font-bold text-green-600">{benchmark.top_performer}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Potencial de Mejora</span>
                        <span className="text-green-600">+{benchmark.improvement_potential}%</span>
                      </div>
                      <Progress value={benchmark.improvement_potential} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best-practices" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Biblioteca de Mejores Prácticas</h2>
              <p className="text-muted-foreground">
                Estrategias probadas de otros franquiciados exitosos
              </p>
            </div>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Buscar Prácticas
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestPractices.map((practice) => (
              <Card key={practice.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className={getCategoryColor(practice.category)}>
                      {CATEGORIES.find(c => c.value === practice.category)?.label}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{practice.impact_score}/10</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{practice.title}</CardTitle>
                  <CardDescription>{practice.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Autor:</span>
                      <span>{practice.author} - {practice.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Dificultad:</span>
                      <Badge variant="outline" className="text-xs">
                        {practice.implementation_difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tiempo:</span>
                      <span>{practice.implementation_time}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Me gusta:</span>
                      <span>{practice.likes}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalles
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Sistema de Soporte</h2>
              <p className="text-muted-foreground">
                Gestiona tickets de soporte y obtén ayuda cuando la necesites
              </p>
            </div>
            <Dialog open={showCreateTicket} onOpenChange={setShowCreateTicket}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Ticket
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Ticket de Soporte</DialogTitle>
                  <DialogDescription>
                    Describe tu problema para que podamos ayudarte
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ticket-title">Título</Label>
                    <Input
                      id="ticket-title"
                      value={newTicket.title}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Resumen del problema"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ticket-description">Descripción</Label>
                    <Textarea
                      id="ticket-description"
                      value={newTicket.description}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe el problema en detalle"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ticket-category">Categoría</Label>
                      <Select value={newTicket.category} onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Técnico</SelectItem>
                          <SelectItem value="operational">Operacional</SelectItem>
                          <SelectItem value="financial">Financiero</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="compliance">Cumplimiento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ticket-priority">Prioridad</Label>
                      <Select value={newTicket.priority} onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baja</SelectItem>
                          <SelectItem value="medium">Media</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateTicket(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={createSupportTicket}>
                    Crear Ticket
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {supportTickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium">{ticket.title}</h3>
                      <Badge className={getCategoryColor(ticket.category)}>
                        {CATEGORIES.find(c => c.value === ticket.category)?.label}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {PRIORITIES.find(p => p.value === ticket.priority)?.label}
                      </Badge>
                    </div>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status === 'open' ? 'Abierto' :
                       ticket.status === 'in_progress' ? 'En Progreso' :
                       ticket.status === 'resolved' ? 'Resuelto' : 'Cerrado'}
                    </Badge>
                  </div>
                  <CardDescription>
                    Creado: {new Date(ticket.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{ticket.description}</p>
                  {ticket.resolution && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-green-800">Resolución:</p>
                      <p className="text-sm text-green-700">{ticket.resolution}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Recursos de Entrenamiento</h2>
            <p className="text-muted-foreground">
              Accede a materiales de capacitación y desarrollo profesional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingResources.map((resource) => (
              <Card key={resource.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className={getCategoryColor(resource.category)}>
                      {CATEGORIES.find(c => c.value === resource.category)?.label}
                    </Badge>
                    {resource.required && (
                      <Badge variant="destructive" className="text-xs">
                        Requerido
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tipo:</span>
                      <div className="flex items-center space-x-1">
                        {resource.type === 'video' && <Video className="h-4 w-4" />}
                        {resource.type === 'document' && <FileText className="h-4 w-4" />}
                        {resource.type === 'interactive' && <BarChart3 className="h-4 w-4" />}
                        {resource.type === 'webinar' && <Users className="h-4 w-4" />}
                        <span className="capitalize">{resource.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duración:</span>
                      <span>{resource.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Dificultad:</span>
                      <Badge variant="outline" className="text-xs">
                        {resource.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Calificación:</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{resource.rating}/5</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Completado:</span>
                      <span>{resource.completion_rate}%</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Play className="h-4 w-4 mr-1" />
                      Comenzar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 