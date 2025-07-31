import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  FileText, 
  Clock, 
  AlertTriangle, 
  Building,
  Shield,
  Users,
  MessageSquare,
  Settings,
  Camera,
  MapPin,
  DollarSign,
  Calendar,
  TrendingUp,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Edit
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DamageAssessment {
  id: string;
  area: string;
  type: 'structural' | 'electrical' | 'equipment' | 'inventory' | 'vehicle';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  estimatedCost: number;
  status: 'assessed' | 'repairing' | 'completed' | 'pending';
  photos: string[];
  assessedBy: string;
  assessedDate: string;
  estimatedRepairTime: string;
}

interface InsuranceClaim {
  id: string;
  type: 'property' | 'business-interruption' | 'equipment' | 'vehicle';
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'paid' | 'denied';
  amount: number;
  description: string;
  submittedDate: string;
  claimNumber: string;
  adjuster: string;
  documents: string[];
  notes: string;
}

interface RecoveryTask {
  id: string;
  title: string;
  category: 'infrastructure' | 'operations' | 'communications' | 'staff' | 'customers';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  assignedTo: string;
  dueDate: string;
  completedDate?: string;
  progress: number;
  dependencies: string[];
  estimatedHours: number;
  actualHours?: number;
}

interface CustomerUpdate {
  id: string;
  type: 'service-resumption' | 'delivery-update' | 'facility-status' | 'general';
  title: string;
  message: string;
  targetAudience: 'all' | 'premium' | 'affected' | 'specific';
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  scheduledDate: string;
  sentDate?: string;
  recipients: number;
  openRate?: number;
}

const PostEmergencyRecovery: React.FC = () => {
  const { language } = useLanguage();
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);

  const damageAssessments: DamageAssessment[] = [
    {
      id: 'DAM-001',
      area: language === 'es' ? 'Sala de Recepción' : 'Reception Area',
      type: 'structural',
      severity: 'moderate',
      description: language === 'es' 
        ? 'Daños menores en el techo debido a filtraciones de agua'
        : 'Minor roof damage due to water leaks',
      estimatedCost: 15000,
      status: 'assessed',
      photos: ['photo1.jpg', 'photo2.jpg'],
      assessedBy: 'Juan Pérez',
      assessedDate: '2024-07-30T10:00:00Z',
      estimatedRepairTime: '2 weeks'
    },
    {
      id: 'DAM-002',
      area: language === 'es' ? 'Sistema Eléctrico' : 'Electrical System',
      type: 'electrical',
      severity: 'major',
      description: language === 'es'
        ? 'Panel eléctrico principal dañado por inundación'
        : 'Main electrical panel damaged by flooding',
      estimatedCost: 25000,
      status: 'repairing',
      photos: ['photo3.jpg'],
      assessedBy: 'María González',
      assessedDate: '2024-07-30T11:30:00Z',
      estimatedRepairTime: '1 week'
    },
    {
      id: 'DAM-003',
      area: language === 'es' ? 'Almacén de Paquetes' : 'Package Storage',
      type: 'inventory',
      severity: 'minor',
      description: language === 'es'
        ? 'Algunos paquetes mojados, sin daños mayores'
        : 'Some packages wet, no major damage',
      estimatedCost: 5000,
      status: 'completed',
      photos: ['photo4.jpg', 'photo5.jpg'],
      assessedBy: 'Carlos Rodríguez',
      assessedDate: '2024-07-30T09:15:00Z',
      estimatedRepairTime: '1 day'
    }
  ];

  const insuranceClaims: InsuranceClaim[] = [
    {
      id: 'CLAIM-001',
      type: 'property',
      status: 'submitted',
      amount: 45000,
      description: language === 'es'
        ? 'Daños a la propiedad por huracán'
        : 'Property damage from hurricane',
      submittedDate: '2024-07-30T14:00:00Z',
      claimNumber: 'IC-2024-001',
      adjuster: 'Ana Martínez',
      documents: ['claim-form.pdf', 'damage-photos.zip', 'repair-estimates.pdf'],
      notes: language === 'es'
        ? 'Ajustador programado para visita el 2 de agosto'
        : 'Adjuster scheduled for visit on August 2nd'
    },
    {
      id: 'CLAIM-002',
      type: 'business-interruption',
      status: 'draft',
      amount: 75000,
      description: language === 'es'
        ? 'Pérdida de ingresos por interrupción del negocio'
        : 'Loss of income due to business interruption',
      submittedDate: '2024-07-30T16:30:00Z',
      claimNumber: 'IC-2024-002',
      adjuster: 'Pedro López',
      documents: ['financial-records.pdf', 'business-plan.pdf'],
      notes: language === 'es'
        ? 'Pendiente documentación financiera adicional'
        : 'Pending additional financial documentation'
    }
  ];

  const recoveryTasks: RecoveryTask[] = [
    {
      id: 'TASK-001',
      title: language === 'es' ? 'Reparar Sistema Eléctrico' : 'Repair Electrical System',
      category: 'infrastructure',
      priority: 'critical',
      status: 'in-progress',
      assignedTo: 'Equipo de Mantenimiento',
      dueDate: '2024-08-06T17:00:00Z',
      progress: 60,
      dependencies: [],
      estimatedHours: 40,
      actualHours: 24
    },
    {
      id: 'TASK-002',
      title: language === 'es' ? 'Restaurar Servicios de Internet' : 'Restore Internet Services',
      category: 'communications',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Equipo de IT',
      dueDate: '2024-08-02T17:00:00Z',
      progress: 0,
      dependencies: ['TASK-001'],
      estimatedHours: 8
    },
    {
      id: 'TASK-003',
      title: language === 'es' ? 'Notificar a Clientes' : 'Notify Customers',
      category: 'customers',
      priority: 'high',
      status: 'completed',
      assignedTo: 'Equipo de Comunicaciones',
      dueDate: '2024-07-31T12:00:00Z',
      completedDate: '2024-07-31T10:30:00Z',
      progress: 100,
      dependencies: [],
      estimatedHours: 4,
      actualHours: 3
    },
    {
      id: 'TASK-004',
      title: language === 'es' ? 'Reabastecer Inventario' : 'Restock Inventory',
      category: 'operations',
      priority: 'medium',
      status: 'in-progress',
      assignedTo: 'Equipo de Logística',
      dueDate: '2024-08-05T17:00:00Z',
      progress: 30,
      dependencies: [],
      estimatedHours: 16,
      actualHours: 5
    }
  ];

  const customerUpdates: CustomerUpdate[] = [
    {
      id: 'UPDATE-001',
      type: 'service-resumption',
      title: language === 'es' ? 'Servicios Restaurados' : 'Services Restored',
      message: language === 'es'
        ? 'Nos complace informar que nuestros servicios han sido restaurados completamente. Agradecemos su paciencia durante este tiempo.'
        : 'We are pleased to inform you that our services have been fully restored. We appreciate your patience during this time.',
      targetAudience: 'all',
      status: 'sent',
      scheduledDate: '2024-07-31T10:00:00Z',
      sentDate: '2024-07-31T10:00:00Z',
      recipients: 1250,
      openRate: 78
    },
    {
      id: 'UPDATE-002',
      type: 'delivery-update',
      title: language === 'es' ? 'Actualización de Entregas' : 'Delivery Update',
      message: language === 'es'
        ? 'Las entregas se reanudarán mañana. Los paquetes retenidos serán procesados con prioridad.'
        : 'Deliveries will resume tomorrow. Held packages will be processed with priority.',
      targetAudience: 'affected',
      status: 'scheduled',
      scheduledDate: '2024-08-01T09:00:00Z',
      recipients: 450
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'major': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
      case 'paid':
      case 'sent':
        return 'bg-green-500';
      case 'in-progress':
      case 'repairing':
      case 'under-review':
      case 'scheduled':
        return 'bg-blue-500';
      case 'pending':
      case 'draft':
        return 'bg-yellow-500';
      case 'blocked':
      case 'denied':
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    if (language === 'es') {
      switch (status) {
        case 'completed':
        case 'approved':
        case 'paid':
        case 'sent':
          return 'Completado';
        case 'in-progress':
        case 'repairing':
        case 'under-review':
        case 'scheduled':
          return 'En Progreso';
        case 'pending':
        case 'draft':
          return 'Pendiente';
        case 'blocked':
        case 'denied':
        case 'cancelled':
          return 'Bloqueado';
        default:
          return 'Desconocido';
      }
    } else {
      switch (status) {
        case 'completed':
        case 'approved':
        case 'paid':
        case 'sent':
          return 'Completed';
        case 'in-progress':
        case 'repairing':
        case 'under-review':
        case 'scheduled':
          return 'In Progress';
        case 'pending':
        case 'draft':
          return 'Pending';
        case 'blocked':
        case 'denied':
        case 'cancelled':
          return 'Blocked';
        default:
          return 'Unknown';
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Damage Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {language === 'es' ? 'Evaluación de Daños' : 'Damage Assessment'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {damageAssessments.map((assessment) => (
              <div key={assessment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{assessment.area}</h3>
                    <p className="text-sm text-muted-foreground">
                      {assessment.type === 'structural' ? (language === 'es' ? 'Estructural' : 'Structural') :
                       assessment.type === 'electrical' ? (language === 'es' ? 'Eléctrico' : 'Electrical') :
                       assessment.type === 'equipment' ? (language === 'es' ? 'Equipos' : 'Equipment') :
                       assessment.type === 'inventory' ? (language === 'es' ? 'Inventario' : 'Inventory') :
                       (language === 'es' ? 'Vehículo' : 'Vehicle')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getSeverityColor(assessment.severity)} text-white`}>
                      {assessment.severity === 'minor' ? (language === 'es' ? 'Menor' : 'Minor') :
                       assessment.severity === 'moderate' ? (language === 'es' ? 'Moderado' : 'Moderate') :
                       assessment.severity === 'major' ? (language === 'es' ? 'Mayor' : 'Major') :
                       (language === 'es' ? 'Crítico' : 'Critical')}
                    </Badge>
                    <Badge className={`${getStatusColor(assessment.status)} text-white`}>
                      {getStatusText(assessment.status)}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Descripción:' : 'Description:'}
                    </p>
                    <p className="font-medium">{assessment.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Costo Estimado:' : 'Estimated Cost:'}
                    </p>
                    <p className="font-medium">${assessment.estimatedCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Evaluado por:' : 'Assessed by:'}
                    </p>
                    <p className="font-medium">{assessment.assessedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Tiempo de Reparación:' : 'Repair Time:'}
                    </p>
                    <p className="font-medium">{assessment.estimatedRepairTime}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Ver Fotos' : 'View Photos'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Editar' : 'Edit'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Generar Reporte' : 'Generate Report'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insurance Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {language === 'es' ? 'Documentación de Seguros' : 'Insurance Documentation'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insuranceClaims.map((claim) => (
              <div key={claim.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{claim.claimNumber}</h3>
                    <p className="text-sm text-muted-foreground">
                      {claim.type === 'property' ? (language === 'es' ? 'Propiedad' : 'Property') :
                       claim.type === 'business-interruption' ? (language === 'es' ? 'Interrupción de Negocio' : 'Business Interruption') :
                       claim.type === 'equipment' ? (language === 'es' ? 'Equipos' : 'Equipment') :
                       (language === 'es' ? 'Vehículo' : 'Vehicle')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(claim.status)} text-white`}>
                      {getStatusText(claim.status)}
                    </Badge>
                    <span className="font-semibold">${claim.amount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Descripción:' : 'Description:'}
                    </p>
                    <p className="font-medium">{claim.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Ajustador:' : 'Adjuster:'}
                    </p>
                    <p className="font-medium">{claim.adjuster}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Fecha de Presentación:' : 'Submitted Date:'}
                    </p>
                    <p className="font-medium">
                      {new Date(claim.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Documentos:' : 'Documents:'}
                    </p>
                    <p className="font-medium">{claim.documents.length} archivos</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Descargar Documentos' : 'Download Documents'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Subir Documentos' : 'Upload Documents'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Editar Reclamo' : 'Edit Claim'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recovery Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {language === 'es' ? 'Cronograma de Recuperación' : 'Recovery Timeline'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recoveryTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {task.category === 'infrastructure' ? (language === 'es' ? 'Infraestructura' : 'Infrastructure') :
                       task.category === 'operations' ? (language === 'es' ? 'Operaciones' : 'Operations') :
                       task.category === 'communications' ? (language === 'es' ? 'Comunicaciones' : 'Communications') :
                       task.category === 'staff' ? (language === 'es' ? 'Personal' : 'Staff') :
                       (language === 'es' ? 'Clientes' : 'Customers')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                      {task.priority === 'low' ? (language === 'es' ? 'Baja' : 'Low') :
                       task.priority === 'medium' ? (language === 'es' ? 'Media' : 'Medium') :
                       task.priority === 'high' ? (language === 'es' ? 'Alta' : 'High') :
                       (language === 'es' ? 'Crítica' : 'Critical')}
                    </Badge>
                    <Badge className={`${getStatusColor(task.status)} text-white`}>
                      {getStatusText(task.status)}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Asignado a:' : 'Assigned to:'}
                    </p>
                    <p className="font-medium">{task.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Fecha de Vencimiento:' : 'Due Date:'}
                    </p>
                    <p className="font-medium">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Horas Estimadas:' : 'Estimated Hours:'}
                    </p>
                    <p className="font-medium">{task.estimatedHours}h</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{language === 'es' ? 'Progreso:' : 'Progress:'}</span>
                    <span>{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} />
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Actualizar Progreso' : 'Update Progress'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Reasignar' : 'Reassign'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Cambiar Fecha' : 'Change Date'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {language === 'es' ? 'Actualizaciones a Clientes' : 'Customer Updates'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customerUpdates.map((update) => (
              <div key={update.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{update.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {update.type === 'service-resumption' ? (language === 'es' ? 'Reanudación de Servicios' : 'Service Resumption') :
                       update.type === 'delivery-update' ? (language === 'es' ? 'Actualización de Entregas' : 'Delivery Update') :
                       update.type === 'facility-status' ? (language === 'es' ? 'Estado de Instalaciones' : 'Facility Status') :
                       (language === 'es' ? 'General' : 'General')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(update.status)} text-white`}>
                      {getStatusText(update.status)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {update.recipients} {language === 'es' ? 'destinatarios' : 'recipients'}
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === 'es' ? 'Mensaje:' : 'Message:'}
                  </p>
                  <p className="text-sm">{update.message}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Audiencia:' : 'Audience:'}
                    </p>
                    <p className="font-medium">
                      {update.targetAudience === 'all' ? (language === 'es' ? 'Todos' : 'All') :
                       update.targetAudience === 'premium' ? (language === 'es' ? 'Premium' : 'Premium') :
                       update.targetAudience === 'affected' ? (language === 'es' ? 'Afectados' : 'Affected') :
                       (language === 'es' ? 'Específicos' : 'Specific')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Fecha Programada:' : 'Scheduled Date:'}
                    </p>
                    <p className="font-medium">
                      {new Date(update.scheduledDate).toLocaleString()}
                    </p>
                  </div>
                  {update.openRate && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'es' ? 'Tasa de Apertura:' : 'Open Rate:'}
                      </p>
                      <p className="font-medium">{update.openRate}%</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Editar' : 'Edit'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Vista Previa' : 'Preview'}
                  </Button>
                  {update.status === 'draft' && (
                    <Button size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {language === 'es' ? 'Enviar' : 'Send'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lessons Learned */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {language === 'es' ? 'Lecciones Aprendidas' : 'Lessons Learned'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">
                  {language === 'es' ? 'Áreas de Mejora' : 'Areas for Improvement'}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">
                      {language === 'es' ? 'Mejorar sistema de respaldo de energía' : 'Improve backup power system'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">
                      {language === 'es' ? 'Establecer comunicaciones redundantes' : 'Establish redundant communications'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">
                      {language === 'es' ? 'Mejorar plan de evacuación' : 'Improve evacuation plan'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">
                  {language === 'es' ? 'Fortalezas Identificadas' : 'Identified Strengths'}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      {language === 'es' ? 'Respuesta rápida del personal' : 'Quick staff response'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      {language === 'es' ? 'Sistema de comunicación efectivo' : 'Effective communication system'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      {language === 'es' ? 'Procedimientos de seguridad bien establecidos' : 'Well-established safety procedures'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                {language === 'es' ? 'Generar Reporte de Lecciones' : 'Generate Lessons Report'}
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                {language === 'es' ? 'Actualizar Procedimientos' : 'Update Procedures'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostEmergencyRecovery; 