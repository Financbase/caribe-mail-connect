import React from 'react';
import { 
  Package, 
  Users, 
  FileText, 
  Mail, 
  BarChart3, 
  Settings, 
  MapPin, 
  Bell, 
  Shield, 
  CreditCard,
  Truck,
  Building2,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info
} from 'lucide-react';
import { 
  FeaturedIcon, 
  CaribeFeaturedIcon, 
  BusinessFeaturedIcon, 
  NotificationFeaturedIcon,
  StatusFeaturedIcon 
} from '@/components/ui/featured-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FeaturedIconShowcase: React.FC = () => {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">PRMCMS Featured Icons</h1>
        <p className="text-lg text-gray-600">
          Modern, accessible icon components for Puerto Rico Private Mail Carrier Management System
        </p>
      </div>

      {/* Size Variations */}
      <Card>
        <CardHeader>
          <CardTitle>Size Variations</CardTitle>
          <CardDescription>Different sizes for various UI contexts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center space-y-2">
              <FeaturedIcon icon={Package} size="sm" />
              <p className="text-sm text-gray-500">Small (32px)</p>
            </div>
            <div className="text-center space-y-2">
              <FeaturedIcon icon={Package} size="md" />
              <p className="text-sm text-gray-500">Medium (48px)</p>
            </div>
            <div className="text-center space-y-2">
              <FeaturedIcon icon={Package} size="lg" />
              <p className="text-sm text-gray-500">Large (64px)</p>
            </div>
            <div className="text-center space-y-2">
              <FeaturedIcon icon={Package} size="xl" />
              <p className="text-sm text-gray-500">Extra Large (80px)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Style Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Style Variants</CardTitle>
          <CardDescription>Different visual styles for various design contexts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="text-center space-y-3">
              <FeaturedIcon icon={Package} variant="light" />
              <p className="text-sm font-medium">Light</p>
              <p className="text-xs text-gray-500">Subtle, primary color accent</p>
            </div>
            <div className="text-center space-y-3">
              <FeaturedIcon icon={Package} variant="gradient" />
              <p className="text-sm font-medium">Gradient</p>
              <p className="text-xs text-gray-500">Caribbean-inspired gradient</p>
            </div>
            <div className="text-center space-y-3">
              <FeaturedIcon icon={Package} variant="dark" />
              <p className="text-sm font-medium">Dark</p>
              <p className="text-xs text-gray-500">High contrast dark theme</p>
            </div>
            <div className="text-center space-y-3">
              <FeaturedIcon icon={Package} variant="outline" />
              <p className="text-sm font-medium">Outline</p>
              <p className="text-xs text-gray-500">Clean outlined style</p>
            </div>
            <div className="text-center space-y-3">
              <FeaturedIcon icon={Package} variant="modern" />
              <p className="text-sm font-medium">Modern</p>
              <p className="text-xs text-gray-500">Contemporary business style</p>
            </div>
            <div className="text-center space-y-3">
              <FeaturedIcon icon={Package} variant="modern-neue" />
              <p className="text-sm font-medium">Modern Neue</p>
              <p className="text-xs text-gray-500">Glassmorphism style</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PRMCMS Feature Icons */}
      <Card>
        <CardHeader>
          <CardTitle>PRMCMS Feature Icons</CardTitle>
          <CardDescription>Core application features with branded styling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div className="text-center space-y-3">
              <CaribeFeaturedIcon icon={Package} />
              <p className="text-sm font-medium">Paquetes</p>
            </div>
            <div className="text-center space-y-3">
              <CaribeFeaturedIcon icon={Users} />
              <p className="text-sm font-medium">Clientes</p>
            </div>
            <div className="text-center space-y-3">
              <CaribeFeaturedIcon icon={Mail} />
              <p className="text-sm font-medium">Correo Virtual</p>
            </div>
            <div className="text-center space-y-3">
              <CaribeFeaturedIcon icon={FileText} />
              <p className="text-sm font-medium">Documentos</p>
            </div>
            <div className="text-center space-y-3">
              <CaribeFeaturedIcon icon={BarChart3} />
              <p className="text-sm font-medium">Reportes</p>
            </div>
            <div className="text-center space-y-3">
              <CaribeFeaturedIcon icon={Settings} />
              <p className="text-sm font-medium">Configuración</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Business Operations</CardTitle>
          <CardDescription>Professional styling for business functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <BusinessFeaturedIcon icon={Building2} />
              <p className="text-sm font-medium">Oficinas</p>
            </div>
            <div className="text-center space-y-3">
              <BusinessFeaturedIcon icon={Truck} />
              <p className="text-sm font-medium">Rutas</p>
            </div>
            <div className="text-center space-y-3">
              <BusinessFeaturedIcon icon={CreditCard} />
              <p className="text-sm font-medium">Facturación</p>
            </div>
            <div className="text-center space-y-3">
              <BusinessFeaturedIcon icon={Shield} />
              <p className="text-sm font-medium">Seguridad</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Status Indicators</CardTitle>
          <CardDescription>Semantic status icons with appropriate colors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <StatusFeaturedIcon icon={CheckCircle} status="success" />
              <p className="text-sm font-medium text-green-600">Entregado</p>
            </div>
            <div className="text-center space-y-3">
              <StatusFeaturedIcon icon={Clock} status="warning" />
              <p className="text-sm font-medium text-amber-600">Pendiente</p>
            </div>
            <div className="text-center space-y-3">
              <StatusFeaturedIcon icon={XCircle} status="error" />
              <p className="text-sm font-medium text-red-600">Error</p>
            </div>
            <div className="text-center space-y-3">
              <StatusFeaturedIcon icon={Info} status="info" />
              <p className="text-sm font-medium text-blue-600">Información</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Icons */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Icons</CardTitle>
          <CardDescription>Subtle outlined style for notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center space-y-3">
              <NotificationFeaturedIcon icon={Bell} />
              <p className="text-sm font-medium">Notificaciones</p>
            </div>
            <div className="text-center space-y-3">
              <NotificationFeaturedIcon icon={Mail} />
              <p className="text-sm font-medium">Mensajes</p>
            </div>
            <div className="text-center space-y-3">
              <NotificationFeaturedIcon icon={AlertTriangle} />
              <p className="text-sm font-medium">Alertas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Examples</CardTitle>
          <CardDescription>Real-world usage in PRMCMS components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Dashboard Cards */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Dashboard Cards</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-white shadow-sm">
                  <div className="flex items-start gap-3">
                    <CaribeFeaturedIcon icon={Package} size="sm" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Paquetes Hoy</h5>
                      <p className="text-2xl font-bold text-gray-900">24</p>
                      <p className="text-sm text-gray-500">+12% vs ayer</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-white shadow-sm">
                  <div className="flex items-start gap-3">
                    <CaribeFeaturedIcon icon={Users} size="sm" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Clientes Nuevos</h5>
                      <p className="text-2xl font-bold text-gray-900">7</p>
                      <p className="text-sm text-gray-500">Esta semana</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-white shadow-sm">
                  <div className="flex items-start gap-3">
                    <CaribeFeaturedIcon icon={MapPin} size="sm" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Rutas Activas</h5>
                      <p className="text-2xl font-bold text-gray-900">3</p>
                      <p className="text-sm text-gray-500">En progreso</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Navigation Menu</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <BusinessFeaturedIcon icon={Package} size="sm" />
                  <span className="font-medium text-gray-700">Gestión de Paquetes</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <BusinessFeaturedIcon icon={Users} size="sm" />
                  <span className="font-medium text-gray-700">Base de Clientes</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <BusinessFeaturedIcon icon={BarChart3} size="sm" />
                  <span className="font-medium text-gray-700">Análisis y Reportes</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Code Examples</CardTitle>
          <CardDescription>How to implement these icons in your components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-semibold mb-2">Basic Usage</h5>
              <code className="text-sm text-gray-800">
                {`<FeaturedIcon icon={Package} variant="light" size="md" />`}
              </code>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-semibold mb-2">Caribbean Branded Style</h5>
              <code className="text-sm text-gray-800">
                {`<CaribeFeaturedIcon icon={Mail} size="lg" />`}
              </code>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-semibold mb-2">Status Indicator</h5>
              <code className="text-sm text-gray-800">
                {`<StatusFeaturedIcon icon={CheckCircle} status="success" />`}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedIconShowcase;
