import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Truck, 
  Fuel, 
  Battery, 
  AlertTriangle, 
  MapPin,
  Clock,
  Users,
  Phone,
  FileText,
  Settings,
  RefreshCw,
  Play,
  Pause,
  Stop,
  Zap,
  Droplets,
  Shield,
  Wifi,
  Radio,
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PriorityPackage {
  id: string;
  trackingNumber: string;
  type: 'medical' | 'legal' | 'financial' | 'personal';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in-transit' | 'delivered' | 'failed';
  origin: string;
  destination: string;
  estimatedDelivery: string;
  specialInstructions: string;
}

interface EmergencySupply {
  name: string;
  category: 'medical' | 'food' | 'water' | 'power' | 'communication' | 'safety';
  quantity: number;
  unit: string;
  status: 'available' | 'low' | 'critical' | 'out';
  location: string;
  expiryDate?: string;
  lastUpdated: string;
}

interface GeneratorStatus {
  id: string;
  name: string;
  status: 'operational' | 'maintenance' | 'offline' | 'fuel-low';
  fuelLevel: number;
  runtime: string;
  load: number;
  temperature: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

interface FuelReserve {
  type: 'diesel' | 'gasoline' | 'propane';
  quantity: number;
  unit: string;
  capacity: number;
  status: 'full' | 'adequate' | 'low' | 'critical';
  location: string;
  lastRefill: string;
}

const EmergencyLogistics: React.FC = () => {
  const { language } = useLanguage();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const priorityPackages: PriorityPackage[] = [
    {
      id: 'PKG-2024-001',
      trackingNumber: 'TRK001234567',
      type: 'medical',
      priority: 'critical',
      status: 'pending',
      origin: 'San Juan Medical Center',
      destination: 'Bayamón Regional Hospital',
      estimatedDelivery: '2024-07-30T18:00:00Z',
      specialInstructions: language === 'es' ? 'Medicamentos refrigerados - Entrega urgente' : 'Refrigerated medications - Urgent delivery'
    },
    {
      id: 'PKG-2024-002',
      trackingNumber: 'TRK001234568',
      type: 'legal',
      priority: 'high',
      status: 'in-transit',
      origin: 'San Juan Court House',
      destination: 'Ponce Legal Office',
      estimatedDelivery: '2024-07-30T20:00:00Z',
      specialInstructions: language === 'es' ? 'Documentos legales - Manejar con cuidado' : 'Legal documents - Handle with care'
    },
    {
      id: 'PKG-2024-003',
      trackingNumber: 'TRK001234569',
      type: 'financial',
      priority: 'high',
      status: 'pending',
      origin: 'San Juan Bank',
      destination: 'Bayamón Branch',
      estimatedDelivery: '2024-07-30T19:00:00Z',
      specialInstructions: language === 'es' ? 'Documentos financieros - Seguridad máxima' : 'Financial documents - Maximum security'
    }
  ];

  const emergencySupplies: EmergencySupply[] = [
    {
      name: language === 'es' ? 'Botiquines de Primeros Auxilios' : 'First Aid Kits',
      category: 'medical',
      quantity: 25,
      unit: language === 'es' ? 'kits' : 'kits',
      status: 'available',
      location: language === 'es' ? 'Sala de Emergencias' : 'Emergency Room',
      expiryDate: '2025-12-31',
      lastUpdated: '2024-07-30T03:00:00Z'
    },
    {
      name: language === 'es' ? 'Agua Potable' : 'Drinking Water',
      category: 'water',
      quantity: 1000,
      unit: 'gal',
      status: 'available',
      location: language === 'es' ? 'Almacén Principal' : 'Main Warehouse',
      expiryDate: '2025-06-30',
      lastUpdated: '2024-07-30T02:30:00Z'
    },
    {
      name: language === 'es' ? 'Comida de Emergencia' : 'Emergency Food',
      category: 'food',
      quantity: 500,
      unit: language === 'es' ? 'raciones' : 'rations',
      status: 'low',
      location: language === 'es' ? 'Almacén de Comida' : 'Food Storage',
      expiryDate: '2024-12-31',
      lastUpdated: '2024-07-29T18:00:00Z'
    },
    {
      name: language === 'es' ? 'Baterías AA' : 'AA Batteries',
      category: 'power',
      quantity: 200,
      unit: language === 'es' ? 'unidades' : 'units',
      status: 'critical',
      location: language === 'es' ? 'Almacén de Equipos' : 'Equipment Storage',
      lastUpdated: '2024-07-28T12:00:00Z'
    },
    {
      name: language === 'es' ? 'Radios de Emergencia' : 'Emergency Radios',
      category: 'communication',
      quantity: 15,
      unit: language === 'es' ? 'unidades' : 'units',
      status: 'available',
      location: language === 'es' ? 'Sala de Comunicaciones' : 'Communications Room',
      lastUpdated: '2024-07-30T01:00:00Z'
    },
    {
      name: language === 'es' ? 'Chalecos de Seguridad' : 'Safety Vests',
      category: 'safety',
      quantity: 30,
      unit: language === 'es' ? 'unidades' : 'units',
      status: 'available',
      location: language === 'es' ? 'Almacén de Seguridad' : 'Safety Storage',
      lastUpdated: '2024-07-29T15:00:00Z'
    }
  ];

  const generators: GeneratorStatus[] = [
    {
      id: 'GEN-001',
      name: language === 'es' ? 'Generador Principal' : 'Main Generator',
      status: 'operational',
      fuelLevel: 85,
      runtime: '72h',
      load: 65,
      temperature: 45,
      lastMaintenance: '2024-07-15T10:00:00Z',
      nextMaintenance: '2024-08-15T10:00:00Z'
    },
    {
      id: 'GEN-002',
      name: language === 'es' ? 'Generador de Respaldo' : 'Backup Generator',
      status: 'operational',
      fuelLevel: 90,
      runtime: '96h',
      load: 0,
      temperature: 25,
      lastMaintenance: '2024-07-20T14:00:00Z',
      nextMaintenance: '2024-08-20T14:00:00Z'
    },
    {
      id: 'GEN-003',
      name: language === 'es' ? 'Generador de Emergencia' : 'Emergency Generator',
      status: 'maintenance',
      fuelLevel: 60,
      runtime: '48h',
      load: 0,
      temperature: 30,
      lastMaintenance: '2024-07-25T09:00:00Z',
      nextMaintenance: '2024-08-25T09:00:00Z'
    }
  ];

  const fuelReserves: FuelReserve[] = [
    {
      type: 'diesel',
      quantity: 500,
      unit: 'gal',
      capacity: 1000,
      status: 'adequate',
      location: language === 'es' ? 'Tanque Principal' : 'Main Tank',
      lastRefill: '2024-07-28T16:00:00Z'
    },
    {
      type: 'gasoline',
      quantity: 200,
      unit: 'gal',
      capacity: 500,
      status: 'low',
      location: language === 'es' ? 'Tanque Secundario' : 'Secondary Tank',
      lastRefill: '2024-07-25T12:00:00Z'
    },
    {
      type: 'propane',
      quantity: 100,
      unit: 'gal',
      capacity: 200,
      status: 'adequate',
      location: language === 'es' ? 'Tanque de Propano' : 'Propane Tank',
      lastRefill: '2024-07-29T10:00:00Z'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
      case 'operational':
      case 'full':
        return 'bg-green-500';
      case 'low':
      case 'adequate':
        return 'bg-yellow-500';
      case 'critical':
      case 'maintenance':
        return 'bg-orange-500';
      case 'out':
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    if (language === 'es') {
      switch (status) {
        case 'available':
        case 'operational':
        case 'full':
          return 'Disponible';
        case 'low':
        case 'adequate':
          return 'Bajo';
        case 'critical':
        case 'maintenance':
          return 'Crítico';
        case 'out':
        case 'offline':
          return 'Agotado';
        default:
          return 'Desconocido';
      }
    } else {
      switch (status) {
        case 'available':
        case 'operational':
        case 'full':
          return 'Available';
        case 'low':
        case 'adequate':
          return 'Low';
        case 'critical':
        case 'maintenance':
          return 'Critical';
        case 'out':
        case 'offline':
          return 'Out';
        default:
          return 'Unknown';
      }
    }
  };

  const getPackageTypeIcon = (type: string) => {
    switch (type) {
      case 'medical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'legal': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'financial': return <Shield className="h-4 w-4 text-green-500" />;
      case 'personal': return <Package className="h-4 w-4 text-gray-500" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Priority Package Handling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {language === 'es' ? 'Manejo de Paquetes Prioritarios' : 'Priority Package Handling'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {priorityPackages.map((pkg) => (
              <div key={pkg.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getPackageTypeIcon(pkg.type)}
                    <div>
                      <h3 className="font-semibold">{pkg.id}</h3>
                      <p className="text-sm text-muted-foreground">{pkg.trackingNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getPriorityColor(pkg.priority)} text-white`}>
                      {pkg.priority === 'critical' ? (language === 'es' ? 'Crítico' : 'Critical') :
                       pkg.priority === 'high' ? (language === 'es' ? 'Alta' : 'High') :
                       pkg.priority === 'medium' ? (language === 'es' ? 'Media' : 'Medium') :
                       (language === 'es' ? 'Baja' : 'Low')}
                    </Badge>
                    <Badge className={`${getStatusColor(pkg.status)} text-white`}>
                      {pkg.status === 'pending' ? (language === 'es' ? 'Pendiente' : 'Pending') :
                       pkg.status === 'in-transit' ? (language === 'es' ? 'En Tránsito' : 'In Transit') :
                       pkg.status === 'delivered' ? (language === 'es' ? 'Entregado' : 'Delivered') :
                       (language === 'es' ? 'Fallido' : 'Failed')}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Origen:' : 'Origin:'}
                    </p>
                    <p className="font-medium">{pkg.origin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Destino:' : 'Destination:'}
                    </p>
                    <p className="font-medium">{pkg.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Entrega Estimada:' : 'Estimated Delivery:'}
                    </p>
                    <p className="font-medium">
                      {new Date(pkg.estimatedDelivery).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Instrucciones Especiales:' : 'Special Instructions:'}
                    </p>
                    <p className="font-medium text-sm">{pkg.specialInstructions}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Truck className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Asignar Transporte' : 'Assign Transport'}
                  </Button>
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Contactar Destinatario' : 'Contact Recipient'}
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Ver Detalles' : 'View Details'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Supplies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {language === 'es' ? 'Suministros de Emergencia' : 'Emergency Supplies'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emergencySupplies.map((supply, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{supply.name}</h3>
                  <Badge className={`${getStatusColor(supply.status)} text-white`}>
                    {getStatusText(supply.status)}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span>{language === 'es' ? 'Cantidad:' : 'Quantity:'}</span>
                    <span className="font-medium">{supply.quantity} {supply.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{language === 'es' ? 'Ubicación:' : 'Location:'}</span>
                    <span className="font-medium">{supply.location}</span>
                  </div>
                  {supply.expiryDate && (
                    <div className="flex justify-between text-sm">
                      <span>{language === 'es' ? 'Vencimiento:' : 'Expiry:'}</span>
                      <span className="font-medium">
                        {new Date(supply.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    {language === 'es' ? 'Reabastecer' : 'Restock'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generator Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Battery className="h-5 w-5" />
            {language === 'es' ? 'Gestión de Generadores' : 'Generator Management'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generators.map((generator) => (
              <div key={generator.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{generator.name}</h3>
                    <p className="text-sm text-muted-foreground">ID: {generator.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(generator.status)} text-white`}>
                      {getStatusText(generator.status)}
                    </Badge>
                    {generator.status === 'operational' && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Zap className="h-4 w-4" />
                        <span className="text-sm font-medium">{generator.load}%</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Nivel de Combustible' : 'Fuel Level'}
                    </p>
                    <div className="flex items-center gap-2">
                      <Progress value={generator.fuelLevel} className="flex-1" />
                      <span className="text-sm font-medium">{generator.fuelLevel}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Tiempo de Funcionamiento' : 'Runtime'}
                    </p>
                    <p className="font-medium">{generator.runtime}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Temperatura' : 'Temperature'}
                    </p>
                    <p className="font-medium">{generator.temperature}°C</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Próximo Mantenimiento' : 'Next Maintenance'}
                    </p>
                    <p className="font-medium">
                      {new Date(generator.nextMaintenance).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {generator.status === 'operational' ? (
                    <>
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4 mr-2" />
                        {language === 'es' ? 'Pausar' : 'Pause'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Stop className="h-4 w-4 mr-2" />
                        {language === 'es' ? 'Detener' : 'Stop'}
                      </Button>
                    </>
                  ) : (
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      {language === 'es' ? 'Iniciar' : 'Start'}
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Configurar' : 'Configure'}
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Mantenimiento' : 'Maintenance'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fuel Reserves */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            {language === 'es' ? 'Reservas de Combustible' : 'Fuel Reserves'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fuelReserves.map((fuel, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold capitalize">{fuel.type}</h3>
                  <Badge className={`${getStatusColor(fuel.status)} text-white`}>
                    {getStatusText(fuel.status)}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span>{language === 'es' ? 'Cantidad:' : 'Quantity:'}</span>
                    <span className="font-medium">{fuel.quantity} {fuel.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{language === 'es' ? 'Capacidad:' : 'Capacity:'}</span>
                    <span className="font-medium">{fuel.capacity} {fuel.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{language === 'es' ? 'Ubicación:' : 'Location:'}</span>
                    <span className="font-medium">{fuel.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{language === 'es' ? 'Último Reabastecimiento:' : 'Last Refill:'}</span>
                    <span className="font-medium">
                      {new Date(fuel.lastRefill).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    {language === 'es' ? 'Reabastecer' : 'Refill'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Droplets className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communication Systems */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            {language === 'es' ? 'Sistemas de Comunicación' : 'Communication Systems'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">
                {language === 'es' ? 'Estado de la Red' : 'Network Status'}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-green-600" />
                    <span>{language === 'es' ? 'WiFi Principal' : 'Main WiFi'}</span>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    {language === 'es' ? 'Activo' : 'Active'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-green-600" />
                    <span>{language === 'es' ? 'Radio de Emergencia' : 'Emergency Radio'}</span>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    {language === 'es' ? 'Operativo' : 'Operational'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-yellow-600" />
                    <span>{language === 'es' ? 'Líneas Telefónicas' : 'Phone Lines'}</span>
                  </div>
                  <Badge className="bg-yellow-500 text-white">
                    {language === 'es' ? 'Limitado' : 'Limited'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">
                {language === 'es' ? 'Acciones Rápidas' : 'Quick Actions'}
              </h4>
              <div className="space-y-2">
                <Button className="w-full">
                  <Radio className="h-4 w-4 mr-2" />
                  {language === 'es' ? 'Probar Comunicaciones' : 'Test Communications'}
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {language === 'es' ? 'Enviar Alerta Masiva' : 'Send Mass Alert'}
                </Button>
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  {language === 'es' ? 'Conferencia de Emergencia' : 'Emergency Conference'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyLogistics; 