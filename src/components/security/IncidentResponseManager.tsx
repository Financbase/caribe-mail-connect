import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle, 
  Clock, 
  User, 
  Users, 
  FileText, 
  Download, 
  Upload,
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Activity,
  MapPin,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Lock,
  Unlock
} from 'lucide-react';
import { toast } from 'sonner';

interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
  category: 'intrusion' | 'data_breach' | 'malware' | 'phishing' | 'ddos' | 'insider_threat' | 'other';
  reported_by: string;
  reported_at: string;
  assigned_to?: string;
  assigned_at?: string;
  resolved_at?: string;
  closed_at?: string;
  affected_systems: string[];
  affected_users: string[];
  estimated_impact: string;
  tags: string[];
}

interface ResponseTeam {
  id: string;
  name: string;
  role: 'incident_commander' | 'technical_lead' | 'communications' | 'legal' | 'forensics';
  email: string;
  phone: string;
  is_available: boolean;
  current_incident?: string;
  last_contact: string;
}

interface InvestigationNote {
  id: string;
  incident_id: string;
  author: string;
  content: string;
  timestamp: string;
  type: 'observation' | 'hypothesis' | 'evidence' | 'action' | 'decision';
  attachments: string[];
}

interface Evidence {
  id: string;
  incident_id: string;
  type: 'log_file' | 'screenshot' | 'network_capture' | 'memory_dump' | 'disk_image' | 'document' | 'other';
  name: string;
  description: string;
  file_path: string;
  file_size: number;
  hash: string;
  collected_by: string;
  collected_at: string;
  chain_of_custody: string[];
  is_analyzed: boolean;
}

interface PostMortemReport {
  id: string;
  incident_id: string;
  title: string;
  executive_summary: string;
  timeline: Array<{
    timestamp: string;
    event: string;
    actor: string;
    details: string;
  }>;
  root_cause_analysis: string;
  impact_assessment: string;
  lessons_learned: string[];
  action_items: string[];
  recommendations: string[];
  author: string;
  created_at: string;
  reviewed_by: string;
  reviewed_at?: string;
}

const INCIDENT_CATEGORIES = [
  { value: 'intrusion', label: 'Intrusión', color: 'bg-red-100 text-red-800' },
  { value: 'data_breach', label: 'Fuga de Datos', color: 'bg-orange-100 text-orange-800' },
  { value: 'malware', label: 'Malware', color: 'bg-purple-100 text-purple-800' },
  { value: 'phishing', label: 'Phishing', color: 'bg-blue-100 text-blue-800' },
  { value: 'ddos', label: 'DDoS', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'insider_threat', label: 'Amenaza Interna', color: 'bg-gray-100 text-gray-800' },
  { value: 'other', label: 'Otro', color: 'bg-gray-100 text-gray-800' }
];

const SEVERITY_LEVELS = [
  { value: 'low', label: 'Baja', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Crítica', color: 'bg-red-100 text-red-800' }
];

const STATUS_STAGES = [
  { value: 'open', label: 'Abierto', color: 'bg-red-100 text-red-800' },
  { value: 'investigating', label: 'Investigando', color: 'bg-blue-100 text-blue-800' },
  { value: 'contained', label: 'Contenido', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'resolved', label: 'Resuelto', color: 'bg-green-100 text-green-800' },
  { value: 'closed', label: 'Cerrado', color: 'bg-gray-100 text-gray-800' }
];

export function IncidentResponseManager() {
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [responseTeam, setResponseTeam] = useState<ResponseTeam[]>([]);
  const [investigationNotes, setInvestigationNotes] = useState<InvestigationNote[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [postMortemReports, setPostMortemReports] = useState<PostMortemReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateIncident, setShowCreateIncident] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null);
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    category: 'other' as string,
    affected_systems: [] as string[],
    affected_users: [] as string[],
    estimated_impact: '',
    tags: [] as string[]
  });

  useEffect(() => {
    fetchIncidentData();
  }, []);

  const fetchIncidentData = async () => {
    setLoading(true);
    try {
      // Mock incidents
      const mockIncidents: SecurityIncident[] = [
        {
          id: '1',
          title: 'Intento de intrusión detectado',
          description: 'Múltiples intentos de inicio de sesión fallidos desde IPs desconocidas',
          severity: 'high',
          status: 'investigating',
          category: 'intrusion',
          reported_by: 'security@prmcms.com',
          reported_at: new Date().toISOString(),
          assigned_to: 'admin@prmcms.com',
          assigned_at: new Date().toISOString(),
          affected_systems: ['auth_service', 'database'],
          affected_users: ['user1', 'user2'],
          estimated_impact: 'Potencial compromiso de cuentas de usuario',
          tags: ['authentication', 'brute_force']
        },
        {
          id: '2',
          title: 'Sospecha de fuga de datos',
          description: 'Actividad inusual en acceso a datos de clientes',
          severity: 'critical',
          status: 'open',
          category: 'data_breach',
          reported_by: 'monitoring@prmcms.com',
          reported_at: new Date(Date.now() - 3600000).toISOString(),
          affected_systems: ['customer_database', 'api_gateway'],
          affected_users: ['customer1', 'customer2', 'customer3'],
          estimated_impact: 'Posible exposición de datos personales de clientes',
          tags: ['data_protection', 'gdpr']
        }
      ];

      setIncidents(mockIncidents);

      // Mock response team
      const mockTeam: ResponseTeam[] = [
        {
          id: '1',
          name: 'Juan Pérez',
          role: 'incident_commander',
          email: 'juan.perez@prmcms.com',
          phone: '+1-787-555-0101',
          is_available: true,
          current_incident: '1',
          last_contact: new Date().toISOString()
        },
        {
          id: '2',
          name: 'María García',
          role: 'technical_lead',
          email: 'maria.garcia@prmcms.com',
          phone: '+1-787-555-0102',
          is_available: true,
          last_contact: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Carlos Rodríguez',
          role: 'forensics',
          email: 'carlos.rodriguez@prmcms.com',
          phone: '+1-787-555-0103',
          is_available: false,
          last_contact: new Date(Date.now() - 7200000).toISOString()
        }
      ];

      setResponseTeam(mockTeam);

      // Mock investigation notes
      const mockNotes: InvestigationNote[] = [
        {
          id: '1',
          incident_id: '1',
          author: 'juan.perez@prmcms.com',
          content: 'Iniciando investigación del incidente. Se han bloqueado las IPs sospechosas.',
          timestamp: new Date().toISOString(),
          type: 'action',
          attachments: []
        },
        {
          id: '2',
          incident_id: '1',
          author: 'maria.garcia@prmcms.com',
          content: 'Análisis de logs muestra patrón de ataque automatizado. Recomiendo activar 2FA obligatorio.',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          type: 'observation',
          attachments: ['log_analysis.pdf']
        }
      ];

      setInvestigationNotes(mockNotes);

      // Mock evidence
      const mockEvidence: Evidence[] = [
        {
          id: '1',
          incident_id: '1',
          type: 'log_file',
          name: 'auth_logs_2024_01_16.txt',
          description: 'Logs de autenticación del período del incidente',
          file_path: '/evidence/incident_1/auth_logs.txt',
          file_size: 2048576,
          hash: 'sha256:abc123def456...',
          collected_by: 'maria.garcia@prmcms.com',
          collected_at: new Date().toISOString(),
          chain_of_custody: ['maria.garcia@prmcms.com'],
          is_analyzed: false
        }
      ];

      setEvidence(mockEvidence);

      // Mock post-mortem reports
      setPostMortemReports([]);
    } catch (error) {
      console.error('Error fetching incident data:', error);
      toast.error('Error al cargar datos de incidentes');
    } finally {
      setLoading(false);
    }
  };

  const createIncident = async () => {
    if (!newIncident.title.trim() || !newIncident.description.trim()) {
      toast.error('Título y descripción son requeridos');
      return;
    }

    try {
      const incident: SecurityIncident = {
        id: Date.now().toString(),
        title: newIncident.title,
        description: newIncident.description,
        severity: newIncident.severity,
        status: 'open',
        category: newIncident.category,
        reported_by: 'current_user@prmcms.com',
        reported_at: new Date().toISOString(),
        affected_systems: newIncident.affected_systems,
        affected_users: newIncident.affected_users,
        estimated_impact: newIncident.estimated_impact,
        tags: newIncident.tags
      };

      setIncidents([incident, ...incidents]);
      setNewIncident({
        title: '',
        description: '',
        severity: 'medium',
        category: 'other',
        affected_systems: [],
        affected_users: [],
        estimated_impact: '',
        tags: []
      });
      setShowCreateIncident(false);
      toast.success('Incidente creado exitosamente');
    } catch (error) {
      console.error('Error creating incident:', error);
      toast.error('Error al crear el incidente');
    }
  };

  const updateIncidentStatus = async (incidentId: string, status: SecurityIncident['status']) => {
    try {
      setIncidents(prev => prev.map(incident => 
        incident.id === incidentId 
          ? { ...incident, status, resolved_at: status === 'resolved' ? new Date().toISOString() : incident.resolved_at }
          : incident
      ));
      toast.success(`Estado del incidente actualizado a ${status}`);
    } catch (error) {
      console.error('Error updating incident status:', error);
      toast.error('Error al actualizar el estado del incidente');
    }
  };

  const addInvestigationNote = async (incidentId: string, content: string, type: InvestigationNote['type']) => {
    try {
      const note: InvestigationNote = {
        id: Date.now().toString(),
        incident_id: incidentId,
        author: 'current_user@prmcms.com',
        content,
        timestamp: new Date().toISOString(),
        type,
        attachments: []
      };

      setInvestigationNotes([note, ...investigationNotes]);
      toast.success('Nota de investigación agregada');
    } catch (error) {
      console.error('Error adding investigation note:', error);
      toast.error('Error al agregar nota de investigación');
    }
  };

  const getSeverityColor = (severity: string) => {
    const level = SEVERITY_LEVELS.find(l => l.value === severity);
    return level?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const stage = STATUS_STAGES.find(s => s.value === status);
    return stage?.color || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const cat = INCIDENT_CATEGORIES.find(c => c.value === category);
    return cat?.color || 'bg-gray-100 text-gray-800';
  };

  const activeIncidents = incidents.filter(incident => incident.status !== 'closed');
  const criticalIncidents = incidents.filter(incident => incident.severity === 'critical');

  return (
    <div className="space-y-6">
      {/* Incident Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidentes Activos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{activeIncidents.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidentes Críticos</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalIncidents.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Máxima prioridad
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipo Disponible</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {responseTeam.filter(member => member.is_available).length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              de {responseTeam.length} miembros
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2h</div>
            <p className="text-xs text-muted-foreground mt-2">
              Tiempo de resolución
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="incidents" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="incidents">Incidentes</TabsTrigger>
          <TabsTrigger value="team">Equipo</TabsTrigger>
          <TabsTrigger value="investigation">Investigación</TabsTrigger>
          <TabsTrigger value="evidence">Evidencia</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="incidents" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Gestión de Incidentes</h2>
              <p className="text-muted-foreground">
                Registro y seguimiento de incidentes de seguridad
              </p>
            </div>
            <Dialog open={showCreateIncident} onOpenChange={setShowCreateIncident}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Incidente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Incidente</DialogTitle>
                  <DialogDescription>
                    Registra un nuevo incidente de seguridad
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="incident-title">Título</Label>
                    <Input
                      id="incident-title"
                      value={newIncident.title}
                      onChange={(e) => setNewIncident(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Descripción breve del incidente"
                    />
                  </div>
                  <div>
                    <Label htmlFor="incident-description">Descripción</Label>
                    <Textarea
                      id="incident-description"
                      value={newIncident.description}
                      onChange={(e) => setNewIncident(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descripción detallada del incidente"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="incident-severity">Severidad</Label>
                      <Select value={newIncident.severity} onValueChange={(value) => setNewIncident(prev => ({ ...prev, severity: value as any }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SEVERITY_LEVELS.map(level => (
                            <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="incident-category">Categoría</Label>
                      <Select value={newIncident.category} onValueChange={(value) => setNewIncident(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {INCIDENT_CATEGORIES.map(category => (
                            <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="incident-impact">Impacto Estimado</Label>
                    <Textarea
                      id="incident-impact"
                      value={newIncident.estimated_impact}
                      onChange={(e) => setNewIncident(prev => ({ ...prev, estimated_impact: e.target.value }))}
                      placeholder="Describe el impacto potencial del incidente"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateIncident(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={createIncident}>
                    Crear Incidente
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {incidents.map((incident) => (
              <Card key={incident.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getSeverityColor(incident.severity)}`}>
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{incident.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Reportado por {incident.reported_by} • {new Date(incident.reported_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityColor(incident.severity)}>
                        {SEVERITY_LEVELS.find(l => l.value === incident.severity)?.label}
                      </Badge>
                      <Badge className={getStatusColor(incident.status)}>
                        {STATUS_STAGES.find(s => s.value === incident.status)?.label}
                      </Badge>
                      <Badge className={getCategoryColor(incident.category)}>
                        {INCIDENT_CATEGORIES.find(c => c.value === incident.category)?.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{incident.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Sistemas Afectados</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {incident.affected_systems.map((system) => (
                          <Badge key={system} variant="outline" className="text-xs">
                            {system}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Impacto Estimado</Label>
                      <p className="text-sm mt-1">{incident.estimated_impact}</p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => setSelectedIncident(incident)}>
                      Ver Detalles
                    </Button>
                    <Select value={incident.status} onValueChange={(value) => updateIncidentStatus(incident.id, value as any)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_STAGES.map(stage => (
                          <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Equipo de Respuesta</h2>
            <p className="text-muted-foreground">
              Gestión del equipo de respuesta a incidentes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {responseTeam.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <Badge variant={member.is_available ? 'default' : 'secondary'}>
                      {member.is_available ? 'Disponible' : 'No Disponible'}
                    </Badge>
                  </div>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{member.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{member.phone}</span>
                    </div>
                    {member.current_incident && (
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-600">Asignado a incidente</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Último contacto: {new Date(member.last_contact).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="investigation" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Investigación</h2>
            <p className="text-muted-foreground">
              Notas y hallazgos de la investigación
            </p>
          </div>

          <div className="space-y-4">
            {investigationNotes.map((note) => (
              <Card key={note.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{note.author}</span>
                    </div>
                    <Badge variant="outline">{note.type}</Badge>
                  </div>
                  <CardDescription>
                    {new Date(note.timestamp).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{note.content}</p>
                  {note.attachments.length > 0 && (
                    <div className="mt-2">
                      <Label className="text-sm font-medium">Adjuntos</Label>
                      <div className="flex space-x-2 mt-1">
                        {note.attachments.map((attachment) => (
                          <Button key={attachment} variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            {attachment}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="evidence" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Evidencia</h2>
            <p className="text-muted-foreground">
              Colección y gestión de evidencia digital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {evidence.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge variant={item.is_analyzed ? 'default' : 'secondary'}>
                      {item.is_analyzed ? 'Analizado' : 'Pendiente'}
                    </Badge>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium">Tipo</Label>
                      <p className="text-sm">{item.type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Tamaño</Label>
                      <p className="text-sm">{(item.file_size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Hash</Label>
                      <p className="text-sm font-mono text-xs">{item.hash}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Recolectado por</Label>
                      <p className="text-sm">{item.collected_by}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Reportes Post-Mortem</h2>
            <p className="text-muted-foreground">
              Análisis y lecciones aprendidas de incidentes resueltos
            </p>
          </div>

          {postMortemReports.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No hay reportes post-mortem disponibles</p>
                  <p className="text-sm text-muted-foreground">
                    Los reportes se generan automáticamente cuando se resuelven incidentes
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {postMortemReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <CardTitle>{report.title}</CardTitle>
                    <CardDescription>
                      Generado por {report.author} • {new Date(report.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Resumen Ejecutivo</Label>
                        <p className="text-sm mt-1">{report.executive_summary}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Lecciones Aprendidas</Label>
                        <ul className="list-disc list-inside text-sm mt-1">
                          {report.lessons_learned.map((lesson, index) => (
                            <li key={index}>{lesson}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Descargar PDF
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Completo
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 