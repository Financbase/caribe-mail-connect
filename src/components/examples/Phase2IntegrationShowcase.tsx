import React, { useState } from 'react';
import { 
  Activity, 
  BarChart3, 
  MessageCircle, 
  TrendingUp,
  Package,
  Users,
  Calendar,
  Bell
} from 'lucide-react';

// Phase 2 Components
import { PackageActivityFeed } from '../packages/PackageActivityFeed';
import { PRMCMSMetricsDashboard } from '../analytics/PRMCMSMetricsDashboard';
import { PRMCMSMessagingCenter } from '../communication/PRMCMSMessagingCenter';

// Previous components
import { LanguageToggle } from '../LanguageToggle';
import { CaribeFeaturedIcon } from '../ui/featured-icon';

interface Phase2ShowcaseProps {
  language?: 'es' | 'en';
}

const translations = {
  es: {
    title: "PRMCMS Fase 2 - Componentes Avanzados",
    subtitle: "Cronologías, métricas, comunicación y análisis avanzado",
    tabs: {
      activityFeed: "Cronología de Paquetes",
      metrics: "Panel de Métricas",
      messaging: "Centro de Mensajería",
      overview: "Resumen General"
    },
    overview: {
      title: "¡Fase 2 Completada con Éxito!",
      description: "Nuevas funcionalidades empresariales integradas",
      features: {
        activityFeed: {
          title: "Cronología de Actividad",
          description: "Seguimiento detallado de cada paquete con línea de tiempo visual",
          benefits: ["Transparencia total", "Historial completo", "Interacciones visuales"]
        },
        metrics: {
          title: "Panel de Métricas",
          description: "Análisis en tiempo real del rendimiento operacional",
          benefits: ["KPIs en tiempo real", "Tendencias visuales", "Insights automáticos"]
        },
        messaging: {
          title: "Centro de Mensajería",
          description: "Comunicación directa con clientes integrada",
          benefits: ["Chat en tiempo real", "Respuestas rápidas", "Gestión de archivos"]
        },
        analytics: {
          title: "Análisis Avanzado",
          description: "Inteligencia empresarial para toma de decisiones",
          benefits: ["Predicción de tendencias", "Optimización operativa", "ROI medible"]
        }
      }
    }
  },
  en: {
    title: "PRMCMS Phase 2 - Advanced Components",
    subtitle: "Timelines, metrics, communication and advanced analytics",
    tabs: {
      activityFeed: "Package Timeline",
      metrics: "Metrics Dashboard",
      messaging: "Messaging Center",
      overview: "Overview"
    },
    overview: {
      title: "Phase 2 Successfully Completed!",
      description: "New enterprise functionality integrated",
      features: {
        activityFeed: {
          title: "Activity Timeline",
          description: "Detailed tracking of each package with visual timeline",
          benefits: ["Complete transparency", "Full history", "Visual interactions"]
        },
        metrics: {
          title: "Metrics Dashboard",
          description: "Real-time analysis of operational performance",
          benefits: ["Real-time KPIs", "Visual trends", "Automatic insights"]
        },
        messaging: {
          title: "Messaging Center",
          description: "Integrated direct communication with customers",
          benefits: ["Real-time chat", "Quick responses", "File management"]
        },
        analytics: {
          title: "Advanced Analytics",
          description: "Business intelligence for decision making",
          benefits: ["Trend prediction", "Operational optimization", "Measurable ROI"]
        }
      }
    }
  }
};

// Mock data
const mockActivityData = [
  {
    id: '1',
    type: 'arrival' as const,
    title: 'Paquete recibido en almacén',
    description: 'Paquete CMC-2024-001 ingresado al sistema desde Amazon',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    user: 'Carlos Rivera',
    location: 'San Juan Centro'
  },
  {
    id: '2',
    type: 'processed' as const,
    title: 'Paquete procesado',
    description: 'Asignado a buzón A-101, cliente notificado',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    user: 'María Santos',
    location: 'San Juan Centro'
  },
  {
    id: '3',
    type: 'notification' as const,
    title: 'Cliente notificado',
    description: 'SMS y email enviados a María González',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    user: 'Sistema PRMCMS',
    location: 'Automatizado'
  },
  {
    id: '4',
    type: 'pickup' as const,
    title: 'Paquete recogido',
    description: 'Cliente recogió paquete, proceso completado',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    user: 'José Martínez',
    location: 'San Juan Centro'
  }
];

const mockCustomers = [
  {
    id: '1',
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '+1-787-555-0123',
    lastSeen: new Date(Date.now() - 1000 * 60 * 5),
    isOnline: true,
    language: 'es' as const,
    vip: true,
    packages: 12
  },
  {
    id: '2',
    name: 'Carlos Rivera',
    email: 'carlos.rivera@email.com',
    phone: '+1-787-555-0124',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isOnline: false,
    language: 'es' as const,
    vip: false,
    packages: 8
  },
  {
    id: '3',
    name: 'Ana Rodríguez',
    email: 'ana.rodriguez@email.com',
    phone: '+1-787-555-0125',
    lastSeen: new Date(Date.now() - 1000 * 60 * 15),
    isOnline: true,
    language: 'en' as const,
    vip: true,
    packages: 24
  }
];

export function Phase2IntegrationShowcase({ language = 'es' }: Phase2ShowcaseProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentLang, setCurrentLang] = useState<'es' | 'en'>(language);
  const [timeRange, setTimeRange] = useState('today');

  const t = translations[currentLang];

  const tabs = [
    { id: 'overview', label: t.tabs.overview, icon: TrendingUp, color: 'text-purple-600' },
    { id: 'activityFeed', label: t.tabs.activityFeed, icon: Activity, color: 'text-blue-600' },
    { id: 'metrics', label: t.tabs.metrics, icon: BarChart3, color: 'text-orange-600' },
    { id: 'messaging', label: t.tabs.messaging, icon: MessageCircle, color: 'text-green-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CaribeFeaturedIcon
                icon={Package}
                size="lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
                <p className="text-gray-600">{t.subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-ocean-500 text-ocean-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-ocean-600' : tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Success Banner */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-8 text-white">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{t.overview.title}</h2>
                  <p className="text-green-100 mt-2">{t.overview.description}</p>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(t.overview.features).map(([key, feature]) => (
                <div key={key} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {currentLang === 'es' ? 'Impacto de la Fase 2' : 'Phase 2 Impact'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">+4</div>
                  <div className="text-sm text-gray-600">
                    {currentLang === 'es' ? 'Componentes Nuevos' : 'New Components'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-gray-600">
                    {currentLang === 'es' ? 'Bilingual Support' : 'Soporte Bilingüe'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">60+</div>
                  <div className="text-sm text-gray-600">
                    {currentLang === 'es' ? 'Total Components' : 'Componentes Totales'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">95%</div>
                  <div className="text-sm text-gray-600">
                    {currentLang === 'es' ? 'User Satisfaction' : 'Satisfacción Usuario'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activityFeed' && (
          <PackageActivityFeed
            packageId="CMC-2024-001"
            customer="María González"
            activities={mockActivityData}
            language={currentLang}
            onAddNote={(note) => console.log('Note added:', note)}
            onTakePhoto={() => console.log('Photo capture initiated')}
          />
        )}

        {activeTab === 'metrics' && (
          <PRMCMSMetricsDashboard
            language={currentLang}
            timeRange={timeRange as any}
            onTimeRangeChange={setTimeRange}
          />
        )}

        {activeTab === 'messaging' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
            <PRMCMSMessagingCenter
              currentUser="admin-1"
              language={currentLang}
              customers={mockCustomers}
              onSendMessage={(customerId, message) => console.log('Message sent:', customerId, message)}
              onSendFile={(customerId, file) => console.log('File sent:', customerId, file.name)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Phase2IntegrationShowcase;
