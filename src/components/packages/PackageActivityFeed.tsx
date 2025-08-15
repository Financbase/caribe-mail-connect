import React from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  User, 
  Calendar,
  AlertTriangle,
  MessageCircle,
  Camera
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'arrival' | 'processed' | 'notification' | 'pickup' | 'delivery' | 'note' | 'photo';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  location?: string;
  metadata?: Record<string, any>;
}

interface ActivityFeedProps {
  packageId: string;
  customer: string;
  activities: ActivityItem[];
  language?: 'es' | 'en';
  onAddNote?: (note: string) => void;
  onTakePhoto?: () => void;
}

const translations = {
  es: {
    title: "Cronología del Paquete",
    addNote: "Agregar Nota",
    takePhoto: "Tomar Foto",
    noActivity: "No hay actividad registrada",
    types: {
      arrival: "Llegada",
      processed: "Procesado",
      notification: "Notificación",
      pickup: "Recogido",
      delivery: "Entregado",
      note: "Nota",
      photo: "Foto"
    },
    time: {
      today: "Hoy",
      yesterday: "Ayer",
      daysAgo: "días atrás"
    }
  },
  en: {
    title: "Package Timeline",
    addNote: "Add Note",
    takePhoto: "Take Photo",
    noActivity: "No activity recorded",
    types: {
      arrival: "Arrival",
      processed: "Processed",
      notification: "Notification",
      pickup: "Picked Up",
      delivery: "Delivered",
      note: "Note",
      photo: "Photo"
    },
    time: {
      today: "Today",
      yesterday: "Yesterday",
      daysAgo: "days ago"
    }
  }
};

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'arrival':
      return Package;
    case 'processed':
      return CheckCircle;
    case 'notification':
      return MessageCircle;
    case 'pickup':
    case 'delivery':
      return Truck;
    case 'note':
      return MessageCircle;
    case 'photo':
      return Camera;
    default:
      return Clock;
  }
};

const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'arrival':
      return 'bg-blue-100 text-blue-600 border-blue-200';
    case 'processed':
      return 'bg-green-100 text-green-600 border-green-200';
    case 'notification':
      return 'bg-orange-100 text-orange-600 border-orange-200';
    case 'pickup':
    case 'delivery':
      return 'bg-purple-100 text-purple-600 border-purple-200';
    case 'note':
      return 'bg-gray-100 text-gray-600 border-gray-200';
    case 'photo':
      return 'bg-pink-100 text-pink-600 border-pink-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

const formatRelativeTime = (date: Date, language: 'es' | 'en') => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);
  
  const t = translations[language];
  
  if (diffInHours < 24) {
    return t.time.today;
  } else if (diffInDays === 1) {
    return t.time.yesterday;
  } else {
    return `${diffInDays} ${t.time.daysAgo}`;
  }
};

export function PackageActivityFeed({
  packageId,
  customer,
  activities,
  language = 'es',
  onAddNote,
  onTakePhoto
}: ActivityFeedProps) {
  const t = translations[language];
  
  // Sort activities by timestamp (newest first)
  const sortedActivities = [...activities].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-ocean-100 to-sunrise-100 rounded-lg">
            <Package className="w-6 h-6 text-ocean-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
            <p className="text-sm text-gray-600">{customer} • {packageId}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {onTakePhoto && (
            <button
              onClick={onTakePhoto}
              className="px-3 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium border border-pink-200"
            >
              <Camera className="w-4 h-4 mr-2 inline" />
              {t.takePhoto}
            </button>
          )}
          {onAddNote && (
            <button
              onClick={() => {
                const note = prompt(language === 'es' ? 'Agregar nota:' : 'Add note:');
                if (note) onAddNote(note);
              }}
              className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-200"
            >
              <MessageCircle className="w-4 h-4 mr-2 inline" />
              {t.addNote}
            </button>
          )}
        </div>
      </div>

      {/* Timeline */}
      {sortedActivities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">{t.noActivity}</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-ocean-200 via-orange-200 to-green-200"></div>
          
          <div className="space-y-6">
            {sortedActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              const colorClasses = getActivityColor(activity.type);
              
              return (
                <div key={activity.id} className="relative flex items-start">
                  {/* Timeline dot */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 ${colorClasses} flex items-center justify-center bg-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  {/* Content */}
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {t.types[activity.type]} • {activity.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{formatRelativeTime(activity.timestamp, language)}</span>
                          <span>
                            {activity.timestamp.toLocaleTimeString(
                              language === 'es' ? 'es-PR' : 'en-US',
                              { hour: '2-digit', minute: '2-digit' }
                            )}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">
                        {activity.description}
                      </p>
                      
                      {/* Metadata */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          {activity.user && (
                            <div className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {activity.user}
                            </div>
                          )}
                          {activity.location && (
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {activity.location}
                            </div>
                          )}
                        </div>
                        
                        {activity.metadata?.priority === 'high' && (
                          <div className="flex items-center text-orange-600">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {language === 'es' ? 'Prioridad Alta' : 'High Priority'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-ocean-600">
              {activities.length}
            </div>
            <div className="text-xs text-gray-500">
              {language === 'es' ? 'Eventos' : 'Events'}
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-orange-600">
              {activities.filter(a => a.type === 'notification').length}
            </div>
            <div className="text-xs text-gray-500">
              {language === 'es' ? 'Notificaciones' : 'Notifications'}
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600">
              {activities.filter(a => a.user).length}
            </div>
            <div className="text-xs text-gray-500">
              {language === 'es' ? 'Interacciones' : 'Interactions'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackageActivityFeed;
