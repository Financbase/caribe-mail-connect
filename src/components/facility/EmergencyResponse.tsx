import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertTriangle, Phone, Users, FileText, Shield, Wind,
  MapPin, Clock, CheckCircle, XCircle, Plus, Search,
  MessageSquare, Bell, Heart, Truck, Car, Building
} from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  department: string;
  priority: 'primary' | 'secondary' | 'backup';
  availability: 'available' | 'unavailable' | 'on_call';
  location: string;
}

interface EvacuationProcedure {
  id: string;
  title: string;
  description: string;
  type: 'fire' | 'hurricane' | 'earthquake' | 'power_outage' | 'medical' | 'security';
  priority: 'low' | 'medium' | 'high' | 'critical';
  steps: string[];
  assembly_point: string;
  estimated_duration: string;
  last_updated: string;
}

interface IncidentReport {
  id: string;
  title: string;
  description: string;
  type: 'emergency' | 'maintenance' | 'security' | 'environmental' | 'medical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  reported_by: string;
  reported_at: string;
  location: string;
  affected_people: number;
  estimated_damage: number;
  actions_taken: string[];
  assigned_to: string;
  resolution_notes?: string;
  resolved_at?: string;
}

interface RecoveryChecklist {
  id: string;
  title: string;
  category: 'power' | 'communications' | 'facility' | 'security' | 'medical';
  items: Array<{
    id: string;
    description: string;
    completed: boolean;
    assigned_to: string;
    due_date: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }>;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  completed_at?: string;
}

interface CommunicationTree {
  id: string;
  name: string;
  role: string;
  level: number;
  contacts: string[];
  backup_contacts: string[];
  escalation_time: number; // minutes
  notification_methods: ('phone' | 'email' | 'sms' | 'radio')[];
}

interface EmergencyResponseProps {
  emergencyContacts?: EmergencyContact[];
  evacuationProcedures?: EvacuationProcedure[];
  incidentReports?: IncidentReport[];
  recoveryChecklists?: RecoveryChecklist[];
  communicationTree?: CommunicationTree[];
}

export function EmergencyResponse({
  emergencyContacts,
  evacuationProcedures,
  incidentReports,
  recoveryChecklists,
  communicationTree
}: EmergencyResponseProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const mockEmergencyContacts: EmergencyContact[] = [
    {
      id: '1',
      name: 'Carlos Rodríguez',
      role: 'Emergency Coordinator',
      phone: '+1-787-555-0101',
      email: 'carlos.rodriguez@prmcms.com',
      department: 'Facility Management',
      priority: 'primary',
      availability: 'available',
      location: 'Main Office'
    },
    {
      id: '2',
      name: 'María González',
      role: 'Security Lead',
      phone: '+1-787-555-0102',
      email: 'maria.gonzalez@prmcms.com',
      department: 'Security',
      priority: 'primary',
      availability: 'available',
      location: 'Security Office'
    },
    {
      id: '3',
      name: 'Luis Torres',
      role: 'Maintenance Supervisor',
      phone: '+1-787-555-0103',
      email: 'luis.torres@prmcms.com',
      department: 'Maintenance',
      priority: 'secondary',
      availability: 'on_call',
      location: 'Maintenance Shop'
    },
    {
      id: '4',
      name: 'Ana Rivera',
      role: 'Medical First Responder',
      phone: '+1-787-555-0104',
      email: 'ana.rivera@prmcms.com',
      department: 'Health & Safety',
      priority: 'primary',
      availability: 'available',
      location: 'Medical Office'
    },
    {
      id: '5',
      name: 'Roberto Méndez',
      role: 'IT Emergency Contact',
      phone: '+1-787-555-0105',
      email: 'roberto.mendez@prmcms.com',
      department: 'IT',
      priority: 'secondary',
      availability: 'on_call',
      location: 'IT Department'
    }
  ];

  const mockEvacuationProcedures: EvacuationProcedure[] = [
    {
      id: '1',
      title: 'Hurricane Evacuation Protocol',
      description: 'Complete evacuation procedure for hurricane threats in Puerto Rico',
      type: 'hurricane',
      priority: 'critical',
      steps: [
        'Activate emergency notification system',
        'Secure all equipment and documents',
        'Shut down non-essential systems',
        'Direct personnel to designated assembly points',
        'Account for all personnel',
        'Coordinate with local emergency services',
        'Monitor weather conditions',
        'Execute evacuation routes based on storm direction'
      ],
      assembly_point: 'Designated Hurricane Shelter - Calle Principal 456',
      estimated_duration: '30 minutes',
      last_updated: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Fire Emergency Evacuation',
      description: 'Standard fire evacuation procedure',
      type: 'fire',
      priority: 'critical',
      steps: [
        'Activate fire alarm system',
        'Call emergency services (911)',
        'Evacuate building immediately',
        'Use designated fire exits',
        'Do not use elevators',
        'Proceed to assembly point',
        'Account for all personnel',
        'Wait for emergency services'
      ],
      assembly_point: 'Parking Lot A - Main Building',
      estimated_duration: '5 minutes',
      last_updated: '2024-02-01T14:30:00Z'
    },
    {
      id: '3',
      title: 'Power Outage Response',
      description: 'Response procedure for extended power outages',
      type: 'power_outage',
      priority: 'high',
      steps: [
        'Assess backup power systems',
        'Activate emergency lighting',
        'Secure critical data',
        'Contact power company',
        'Implement load shedding if necessary',
        'Monitor generator fuel levels',
        'Communicate status to personnel',
        'Prepare for extended outage'
      ],
      assembly_point: 'Main Conference Room',
      estimated_duration: '15 minutes',
      last_updated: '2024-01-20T09:15:00Z'
    }
  ];

  const mockIncidentReports: IncidentReport[] = [
    {
      id: '1',
      title: 'Generator Fuel Leak Detected',
      description: 'Minor fuel leak detected in main generator during routine inspection',
      type: 'maintenance',
      severity: 'medium',
      status: 'resolved',
      reported_by: 'Luis Torres',
      reported_at: '2024-02-20T08:30:00Z',
      location: 'Generator Room A',
      affected_people: 0,
      estimated_damage: 500,
      actions_taken: [
        'Isolated affected area',
        'Contacted maintenance vendor',
        'Repair completed within 2 hours',
        'System tested and operational'
      ],
      assigned_to: 'Power Systems PR',
      resolution_notes: 'Fuel line fitting replaced. No environmental impact.',
      resolved_at: '2024-02-20T10:30:00Z'
    },
    {
      id: '2',
      title: 'Unauthorized Access Attempt',
      description: 'Multiple failed access attempts detected at main entrance',
      type: 'security',
      severity: 'high',
      status: 'investigating',
      reported_by: 'María González',
      reported_at: '2024-02-20T14:15:00Z',
      location: 'Main Entrance',
      affected_people: 0,
      estimated_damage: 0,
      actions_taken: [
        'Security system alerted',
        'Police notified',
        'Surveillance footage reviewed',
        'Additional security measures implemented'
      ],
      assigned_to: 'Security Team'
    }
  ];

  const mockRecoveryChecklists: RecoveryChecklist[] = [
    {
      id: '1',
      title: 'Post-Hurricane Recovery',
      category: 'facility',
      status: 'pending',
      created_at: '2024-02-20T12:00:00Z',
      items: [
        {
          id: '1',
          description: 'Assess building structural integrity',
          completed: false,
          assigned_to: 'Carlos Rodríguez',
          due_date: '2024-02-21T08:00:00Z',
          priority: 'critical'
        },
        {
          id: '2',
          description: 'Check electrical systems',
          completed: false,
          assigned_to: 'Luis Torres',
          due_date: '2024-02-21T10:00:00Z',
          priority: 'high'
        },
        {
          id: '3',
          description: 'Inspect HVAC systems',
          completed: false,
          assigned_to: 'Climate Control Solutions',
          due_date: '2024-02-21T12:00:00Z',
          priority: 'medium'
        },
        {
          id: '4',
          description: 'Verify communication systems',
          completed: false,
          assigned_to: 'Roberto Méndez',
          due_date: '2024-02-21T14:00:00Z',
          priority: 'high'
        }
      ]
    }
  ];

  const mockCommunicationTree: CommunicationTree[] = [
    {
      id: '1',
      name: 'Carlos Rodríguez',
      role: 'Emergency Coordinator',
      level: 1,
      contacts: ['+1-787-555-0101', 'carlos.rodriguez@prmcms.com'],
      backup_contacts: ['+1-787-555-0102'],
      escalation_time: 5,
      notification_methods: ['phone', 'email', 'sms']
    },
    {
      id: '2',
      name: 'María González',
      role: 'Security Lead',
      level: 2,
      contacts: ['+1-787-555-0102', 'maria.gonzalez@prmcms.com'],
      backup_contacts: ['+1-787-555-0103'],
      escalation_time: 10,
      notification_methods: ['phone', 'radio']
    },
    {
      id: '3',
      name: 'Luis Torres',
      role: 'Maintenance Supervisor',
      level: 3,
      contacts: ['+1-787-555-0103', 'luis.torres@prmcms.com'],
      backup_contacts: ['+1-787-555-0104'],
      escalation_time: 15,
      notification_methods: ['phone', 'sms']
    }
  ];

  const data = {
    emergencyContacts: emergencyContacts || mockEmergencyContacts,
    evacuationProcedures: evacuationProcedures || mockEvacuationProcedures,
    incidentReports: incidentReports || mockIncidentReports,
    recoveryChecklists: recoveryChecklists || mockRecoveryChecklists,
    communicationTree: communicationTree || mockCommunicationTree
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'on_call': return 'bg-yellow-100 text-yellow-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeIncidents = data.incidentReports.filter(incident => 
    incident.status === 'open' || incident.status === 'investigating'
  );

  const pendingRecoveryTasks = data.recoveryChecklists.filter(checklist => 
    checklist.status === 'pending' || checklist.status === 'in_progress'
  );

  return (
    <div className="space-y-6">
      {/* Header with Quick Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Active Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-red-600">
                {activeIncidents.length}
              </span>
              <Badge variant="destructive">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-blue-600">
                {data.emergencyContacts.filter(c => c.availability === 'available').length}
              </span>
              <Badge variant="default">Available</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Recovery Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-orange-600">
                {pendingRecoveryTasks.length}
              </span>
              <Badge variant="secondary">Pending</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Wind className="h-4 w-4 mr-2" />
              Hurricane Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-green-600">
                CLEAR
              </span>
              <Badge variant="default">No Threat</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Contactos</span>
          </TabsTrigger>
          <TabsTrigger value="procedures" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Procedimientos</span>
          </TabsTrigger>
          <TabsTrigger value="incidents" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Incidentes</span>
          </TabsTrigger>
          <TabsTrigger value="recovery" className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Recuperación</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Emergency Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Emergency Status
                </CardTitle>
                <CardDescription>Current emergency situation overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">ALL CLEAR</div>
                    <div className="text-sm text-muted-foreground">No Active Emergencies</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">READY</div>
                    <div className="text-sm text-muted-foreground">Response Team Available</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Emergency Contacts Available</span>
                    <span className="text-green-600">{data.emergencyContacts.filter(c => c.availability === 'available').length}/{data.emergencyContacts.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Active Incidents</span>
                    <span className="text-red-600">{activeIncidents.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Recovery Tasks Pending</span>
                    <span className="text-orange-600">{pendingRecoveryTasks.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Emergency response actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="destructive" className="h-16 flex-col">
                    <Bell className="h-5 w-5 mb-1" />
                    <span className="text-xs">Emergency Alert</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Phone className="h-5 w-5 mb-1" />
                    <span className="text-xs">Call 911</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Users className="h-5 w-5 mb-1" />
                    <span className="text-xs">Contact Team</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <FileText className="h-5 w-5 mb-1" />
                    <span className="text-xs">Report Incident</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Emergency Contacts</span>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </CardTitle>
                <CardDescription>Primary and secondary emergency contacts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.emergencyContacts.map((contact) => (
                    <div key={contact.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{contact.name}</h3>
                            <Badge className={getAvailabilityColor(contact.availability)}>
                              {contact.availability}
                            </Badge>
                            <Badge variant={contact.priority === 'primary' ? 'default' : 'outline'}>
                              {contact.priority}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {contact.role} • {contact.department}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {contact.phone}
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {contact.email}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Location: {contact.location}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Communication Tree */}
            <Card>
              <CardHeader>
                <CardTitle>Communication Tree</CardTitle>
                <CardDescription>Emergency notification hierarchy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.communicationTree.map((contact) => (
                    <div key={contact.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold">{contact.name}</div>
                          <div className="text-sm text-muted-foreground">{contact.role}</div>
                        </div>
                        <Badge variant="outline">Level {contact.level}</Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Escalation: {contact.escalation_time} minutes
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          Primary: {contact.contacts[0]}
                        </div>
                        {contact.backup_contacts.length > 0 && (
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            Backup: {contact.backup_contacts[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Procedures Tab */}
        <TabsContent value="procedures" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Evacuation Procedures</span>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Procedure
                </Button>
              </CardTitle>
              <CardDescription>Emergency evacuation and response procedures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.evacuationProcedures.map((procedure) => (
                  <div key={procedure.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{procedure.title}</h3>
                          <Badge className={getPriorityColor(procedure.priority)}>
                            {procedure.priority}
                          </Badge>
                          <Badge variant="outline">{procedure.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{procedure.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                          <div>
                            <span className="font-medium">Assembly Point:</span> {procedure.assembly_point}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span> {procedure.estimated_duration}
                          </div>
                          <div>
                            <span className="font-medium">Updated:</span> {new Date(procedure.last_updated).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium text-sm">Steps:</div>
                          <ol className="list-decimal list-inside space-y-1 text-sm">
                            {procedure.steps.map((step, index) => (
                              <li key={index} className="text-muted-foreground">{step}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Execute</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Incidents Tab */}
        <TabsContent value="incidents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Incident Reports</span>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Report Incident
                </Button>
              </CardTitle>
              <CardDescription>Emergency and maintenance incident tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.incidentReports.map((incident) => (
                  <div key={incident.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{incident.title}</h3>
                          <Badge className={getSeverityColor(incident.severity)}>
                            {incident.severity}
                          </Badge>
                          <Badge className={getStatusColor(incident.status)}>
                            {incident.status}
                          </Badge>
                          <Badge variant="outline">{incident.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="font-medium">Reported:</span> {new Date(incident.reported_at).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">By:</span> {incident.reported_by}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span> {incident.location}
                          </div>
                          <div>
                            <span className="font-medium">Damage:</span> ${incident.estimated_damage}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium text-sm">Actions Taken:</div>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {incident.actions_taken.map((action, index) => (
                              <li key={index} className="text-muted-foreground">{action}</li>
                            ))}
                          </ul>
                        </div>
                        {incident.resolution_notes && (
                          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                            <div className="font-medium text-sm text-green-800">Resolution:</div>
                            <div className="text-sm text-green-700">{incident.resolution_notes}</div>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recovery Tab */}
        <TabsContent value="recovery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recovery Checklists</span>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Checklist
                </Button>
              </CardTitle>
              <CardDescription>Post-emergency recovery procedures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recoveryChecklists.map((checklist) => (
                  <div key={checklist.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{checklist.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{checklist.category}</Badge>
                          <Badge className={getStatusColor(checklist.status)}>
                            {checklist.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Created: {new Date(checklist.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {checklist.items.map((item) => (
                        <div key={item.id} className={`flex items-center justify-between p-2 rounded ${
                          item.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                        }`}>
                          <div className="flex items-center space-x-2">
                            {item.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                            <span className={`text-sm ${item.completed ? 'line-through text-gray-600' : ''}`}>
                              {item.description}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Due: {new Date(item.due_date).toLocaleDateString()}
                            </span>
                            <Button variant="outline" size="sm">
                              {item.completed ? 'Completed' : 'Mark Complete'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 