import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  MapPin, 
  Clock, 
  MessageSquare, 
  Camera, 
  Star, 
  Send,
  Phone,
  Mail,
  Bell,
  BellOff,
  CheckCircle,
  AlertTriangle,
  Navigation,
  User,
  ThumbsUp,
  ThumbsDown,
  Image,
  FileText,
  Smile,
  Frown
} from 'lucide-react';

interface DeliveryUpdate {
  id: string;
  customerId: string;
  customerName: string;
  deliveryId: string;
  status: 'out-for-delivery' | 'in-transit' | 'delivered' | 'failed' | 'rescheduled';
  eta: string;
  actualTime?: string;
  driverName: string;
  driverPhone: string;
  driverPhoto?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  lastUpdate: string;
  notifications: boolean;
}

interface ChatMessage {
  id: string;
  deliveryId: string;
  sender: 'customer' | 'driver' | 'system';
  message: string;
  timestamp: string;
  read: boolean;
}

interface DeliveryPhoto {
  id: string;
  deliveryId: string;
  photoUrl: string;
  timestamp: string;
  description: string;
  location: string;
}

interface CustomerFeedback {
  id: string;
  deliveryId: string;
  customerName: string;
  rating: number;
  comment: string;
  timestamp: string;
  category: 'delivery-time' | 'driver-service' | 'package-condition' | 'communication';
}

export default function CustomerCommunication() {
  const { language } = useLanguage();
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [showMap, setShowMap] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const isSpanish = language === 'es';

  const deliveryUpdates: DeliveryUpdate[] = [
    {
      id: '1',
      customerId: 'cust-1',
      customerName: 'María López',
      deliveryId: 'del-001',
      status: 'in-transit',
      eta: '14:30',
      driverName: 'Carlos Méndez',
      driverPhone: '+1-787-555-0123',
      location: {
        lat: 18.4655,
        lng: -66.1057,
        address: 'Calle San Sebastián 123, San Juan'
      },
      lastUpdate: '2024-01-20 14:15',
      notifications: true
    },
    {
      id: '2',
      customerId: 'cust-2',
      customerName: 'Carlos Rodríguez',
      deliveryId: 'del-002',
      status: 'out-for-delivery',
      eta: '15:45',
      driverName: 'Ana Torres',
      driverPhone: '+1-787-555-0456',
      location: {
        lat: 18.3985,
        lng: -66.0617,
        address: 'Ave. Ponce de León 456, San Juan'
      },
      lastUpdate: '2024-01-20 14:20',
      notifications: true
    },
    {
      id: '3',
      customerId: 'cust-3',
      customerName: 'Luis Martínez',
      deliveryId: 'del-003',
      status: 'delivered',
      eta: '13:20',
      actualTime: '13:15',
      driverName: 'María González',
      driverPhone: '+1-787-555-0789',
      location: {
        lat: 18.4655,
        lng: -66.1057,
        address: 'Calle del Cristo 789, San Juan'
      },
      lastUpdate: '2024-01-20 13:15',
      notifications: false
    }
  ];

  const chatMessages: ChatMessage[] = [
    {
      id: '1',
      deliveryId: 'del-001',
      sender: 'system',
      message: isSpanish ? 'Su paquete está en camino. ETA: 14:30' : 'Your package is on the way. ETA: 14:30',
      timestamp: '2024-01-20 14:00',
      read: true
    },
    {
      id: '2',
      deliveryId: 'del-001',
      sender: 'customer',
      message: isSpanish ? '¿Pueden llamar antes de llegar?' : 'Can you call before arriving?',
      timestamp: '2024-01-20 14:05',
      read: true
    },
    {
      id: '3',
      deliveryId: 'del-001',
      sender: 'driver',
      message: isSpanish ? 'Por supuesto, llamaré 5 minutos antes' : 'Of course, I\'ll call 5 minutes before',
      timestamp: '2024-01-20 14:06',
      read: false
    }
  ];

  const deliveryPhotos: DeliveryPhoto[] = [
    {
      id: '1',
      deliveryId: 'del-003',
      photoUrl: '/api/photos/delivery-1.jpg',
      timestamp: '2024-01-20 13:15',
      description: isSpanish ? 'Paquete entregado en la puerta principal' : 'Package delivered at main entrance',
      location: 'Calle del Cristo 789, San Juan'
    },
    {
      id: '2',
      deliveryId: 'del-003',
      photoUrl: '/api/photos/delivery-2.jpg',
      timestamp: '2024-01-20 13:15',
      description: isSpanish ? 'Recibo de entrega firmado' : 'Signed delivery receipt',
      location: 'Calle del Cristo 789, San Juan'
    }
  ];

  const customerFeedback: CustomerFeedback[] = [
    {
      id: '1',
      deliveryId: 'del-003',
      customerName: 'Luis Martínez',
      rating: 5,
      comment: isSpanish ? 'Excelente servicio, muy puntual y profesional' : 'Excellent service, very punctual and professional',
      timestamp: '2024-01-20 13:30',
      category: 'driver-service'
    },
    {
      id: '2',
      deliveryId: 'del-002',
      customerName: 'Carlos Rodríguez',
      rating: 4,
      comment: isSpanish ? 'Buen servicio, pero llegó un poco tarde' : 'Good service, but arrived a bit late',
      timestamp: '2024-01-20 12:45',
      category: 'delivery-time'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in-transit': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'out-for-delivery': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'rescheduled': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    if (isSpanish) {
      switch (status) {
        case 'delivered': return 'Entregado';
        case 'in-transit': return 'En Tránsito';
        case 'out-for-delivery': return 'En Entrega';
        case 'failed': return 'Fallido';
        case 'rescheduled': return 'Reprogramado';
        default: return 'Desconocido';
      }
    } else {
      switch (status) {
        case 'delivered': return 'Delivered';
        case 'in-transit': return 'In Transit';
        case 'out-for-delivery': return 'Out for Delivery';
        case 'failed': return 'Failed';
        case 'rescheduled': return 'Rescheduled';
        default: return 'Unknown';
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'in-transit': return <Navigation className="w-4 h-4" />;
      case 'out-for-delivery': return <MapPin className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      case 'rescheduled': return <Clock className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Live Tracking Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {isSpanish ? 'Mapa de Seguimiento en Vivo' : 'Live Tracking Map'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Seguimiento en tiempo real de las entregas activas'
              : 'Real-time tracking of active deliveries'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {isSpanish ? 'Mapa interactivo con ubicaciones en tiempo real' : 'Interactive map with real-time locations'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {isSpanish ? 'Integración con Google Maps / Mapbox' : 'Google Maps / Mapbox integration'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {isSpanish ? 'Actualizaciones de Entrega' : 'Delivery Updates'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Estado actual y ETA de todas las entregas'
              : 'Current status and ETA of all deliveries'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deliveryUpdates.map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(delivery.status)}
                    <Badge className={getStatusColor(delivery.status)}>
                      {getStatusLabel(delivery.status)}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">{delivery.customerName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {delivery.location.address}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span>{isSpanish ? 'Conductor:' : 'Driver:'} {delivery.driverName}</span>
                      <span>{isSpanish ? 'ETA:' : 'ETA:'} {delivery.eta}</span>
                      {delivery.actualTime && (
                        <span>{isSpanish ? 'Real:' : 'Actual:'} {delivery.actualTime}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    {isSpanish ? 'Llamar' : 'Call'}
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {isSpanish ? 'Chat' : 'Chat'}
                  </Button>
                  <Button size="sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {isSpanish ? 'Rastrear' : 'Track'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Driver Chat */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {isSpanish ? 'Chat con Conductor' : 'Driver Chat'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Comunicación directa con el conductor asignado'
              : 'Direct communication with assigned driver'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chat Messages */}
            <div className="h-64 overflow-y-auto border rounded-lg p-4 space-y-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.sender === 'customer'
                        ? 'bg-blue-500 text-white'
                        : message.sender === 'driver'
                        ? 'bg-gray-100 dark:bg-gray-700'
                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.sender === 'driver' && (
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">CM</AvatarFallback>
                        </Avatar>
                      )}
                      <span className="text-xs opacity-75">
                        {message.sender === 'customer' ? (isSpanish ? 'Tú' : 'You') :
                         message.sender === 'driver' ? 'Carlos' : (isSpanish ? 'Sistema' : 'System')}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-75 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder={isSpanish ? 'Escribe tu mensaje...' : 'Type your message...'}
                className="flex-1"
              />
              <Button size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            {isSpanish ? 'Fotos de Entrega' : 'Delivery Photos'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Evidencia fotográfica de entregas completadas'
              : 'Photographic evidence of completed deliveries'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliveryPhotos.map((photo) => (
              <div key={photo.id} className="border rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {isSpanish ? 'Vista previa de imagen' : 'Image preview'}
                    </p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium mb-1">{photo.description}</p>
                  <p className="text-xs text-gray-500 mb-2">{photo.location}</p>
                  <p className="text-xs text-gray-400">{photo.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            {isSpanish ? 'Comentarios de Clientes' : 'Customer Feedback'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Evaluaciones y comentarios de los clientes'
              : 'Customer ratings and comments'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customerFeedback.map((feedback) => (
              <div key={feedback.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{feedback.customerName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {isSpanish 
                        ? (feedback.category === 'delivery-time' ? 'Tiempo de Entrega' :
                           feedback.category === 'driver-service' ? 'Servicio del Conductor' :
                           feedback.category === 'package-condition' ? 'Estado del Paquete' : 'Comunicación')
                        : feedback.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(feedback.rating)}
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {feedback.comment}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{feedback.timestamp}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {isSpanish ? 'Útil' : 'Helpful'}
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="w-3 h-3 mr-1" />
                      {isSpanish ? 'Responder' : 'Reply'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            {isSpanish ? 'Configuración de Notificaciones' : 'Notification Settings'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Personaliza las notificaciones de entrega'
              : 'Customize delivery notifications'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">
                  {isSpanish ? 'Notificaciones Push' : 'Push Notifications'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isSpanish 
                    ? 'Recibe alertas en tiempo real sobre el estado de tu entrega'
                    : 'Receive real-time alerts about your delivery status'
                  }
                </p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {isSpanish ? 'Tipo de Notificación' : 'Notification Type'}
                </Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isSpanish ? 'Todas' : 'All'}</SelectItem>
                    <SelectItem value="eta">{isSpanish ? 'Solo ETA' : 'ETA Only'}</SelectItem>
                    <SelectItem value="status">{isSpanish ? 'Solo Estado' : 'Status Only'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {isSpanish ? 'Frecuencia' : 'Frequency'}
                </Label>
                <Select defaultValue="realtime">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">{isSpanish ? 'Tiempo Real' : 'Real-time'}</SelectItem>
                    <SelectItem value="hourly">{isSpanish ? 'Cada Hora' : 'Hourly'}</SelectItem>
                    <SelectItem value="daily">{isSpanish ? 'Diario' : 'Daily'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 