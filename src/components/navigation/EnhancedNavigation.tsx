import React from 'react';
import { 
  Package, 
  Users, 
  Mail, 
  FileText, 
  BarChart3, 
  Settings, 
  MapPin, 
  Building2,
  Truck,
  Crown,
  Search,
  Palette,
  LucideIcon
} from 'lucide-react';
import { BusinessFeaturedIcon, CaribeFeaturedIcon } from '@/components/ui/featured-icon';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string;
  titleKey: string;
  icon: LucideIcon;
  variant: 'business' | 'caribe';
  category: 'primary' | 'admin' | 'demo';
  description?: string;
}

const navigationItems: NavigationItem[] = [
  // Primary Features
  {
    id: 'intake',
    titleKey: 'nav.packageIntake',
    icon: Package,
    variant: 'caribe',
    category: 'primary'
  },
  {
    id: 'customers',
    titleKey: 'nav.customers',
    icon: Users,
    variant: 'caribe',
    category: 'primary'
  },
  {
    id: 'virtual-mail',
    titleKey: 'nav.virtualMail',
    icon: Mail,
    variant: 'caribe',
    category: 'primary'
  },
  {
    id: 'documents',
    titleKey: 'nav.documents',
    icon: FileText,
    variant: 'caribe',
    category: 'primary'
  },
  {
    id: 'analytics',
    titleKey: 'nav.analytics',
    icon: BarChart3,
    variant: 'caribe',
    category: 'primary'
  },
  // Business Operations
  {
    id: 'mailboxes',
    titleKey: 'nav.mailboxes',
    icon: Building2,
    variant: 'business',
    category: 'admin'
  },
  {
    id: 'routes',
    titleKey: 'nav.routes',
    icon: Truck,
    variant: 'business',
    category: 'admin'
  },
  {
    id: 'driver-route',
    titleKey: 'nav.driverView',
    icon: Search,
    variant: 'business',
    category: 'admin'
  },
  {
    id: 'act60-dashboard',
    titleKey: 'nav.act60',
    icon: Crown,
    variant: 'business',
    category: 'admin'
  },
  {
    id: 'settings',
    titleKey: 'nav.settings',
    icon: Settings,
    variant: 'business',
    category: 'admin'
  },
  // Demo/Examples
  {
    id: 'featured-icons',
    titleKey: 'nav.featuredIcons',
    icon: Palette,
    variant: 'business',
    category: 'demo',
    description: 'Icon component showcase'
  }
];

interface EnhancedNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  className?: string;
  showCategories?: boolean;
}

export const EnhancedNavigation: React.FC<EnhancedNavigationProps> = ({
  currentPage,
  onNavigate,
  className,
  showCategories = true
}) => {
  const { t } = useLanguage();

  const getTranslation = (key: string): string => {
    // Fallback translations for new keys
    const fallbackTranslations: Record<string, string> = {
      'nav.packageIntake': 'Recepción de Paquetes',
      'nav.customers': 'Clientes',
      'nav.virtualMail': 'Correo Virtual',
      'nav.documents': 'Documentos',
      'nav.analytics': 'Análisis',
      'nav.mailboxes': 'Buzones',
      'nav.routes': 'Rutas',
      'nav.driverView': 'Vista del Conductor',
      'nav.act60': 'Act 60',
      'nav.settings': 'Configuración',
      'nav.featuredIcons': 'Iconos Destacados',
      'nav.category.primary': 'Operaciones Principales',
      'nav.category.admin': 'Administración',
      'nav.category.demo': 'Demostración'
    };

    return t(key) !== key ? t(key) : fallbackTranslations[key] || key;
  };

  const renderNavigationItem = (item: NavigationItem) => {
    const IconComponent = item.variant === 'caribe' ? CaribeFeaturedIcon : BusinessFeaturedIcon;
    const isActive = currentPage === item.id;

    return (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id)}
        className={cn(
          'flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200',
          'hover:bg-gray-50 hover:shadow-sm',
          isActive && 'bg-primary/10 border border-primary/20 shadow-sm',
          'text-left group'
        )}
      >
        <IconComponent 
          icon={item.icon} 
          size="sm"
          className={cn(
            'transition-transform duration-200',
            'group-hover:scale-110',
            isActive && 'scale-110'
          )}
        />
        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-medium text-gray-700 truncate',
            isActive && 'text-primary'
          )}>
            {getTranslation(item.titleKey)}
          </p>
          {item.description && (
            <p className="text-xs text-gray-500 truncate">
              {item.description}
            </p>
          )}
        </div>
        {isActive && (
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        )}
      </button>
    );
  };

  const renderCategory = (category: 'primary' | 'admin' | 'demo') => {
    const categoryItems = navigationItems.filter(item => item.category === category);
    if (categoryItems.length === 0) return null;

    const categoryLabels = {
      primary: 'nav.category.primary',
      admin: 'nav.category.admin',
      demo: 'nav.category.demo'
    };

    return (
      <div key={category} className="space-y-3">
        {showCategories && (
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-3">
            {getTranslation(categoryLabels[category])}
          </h3>
        )}
        <div className="space-y-2">
          {categoryItems.map(renderNavigationItem)}
        </div>
      </div>
    );
  };

  return (
    <nav className={cn('space-y-6', className)}>
      {renderCategory('primary')}
      {renderCategory('admin')}
      {renderCategory('demo')}
    </nav>
  );
};

// Mobile optimized version
export const MobileEnhancedNavigation: React.FC<EnhancedNavigationProps> = ({
  currentPage,
  onNavigate,
  className
}) => {
  const primaryItems = navigationItems.filter(item => item.category === 'primary');
  
  return (
    <nav className={cn('flex justify-between items-center px-4 py-2 bg-white border-t', className)}>
      {primaryItems.slice(0, 4).map(item => {
        const IconComponent = item.variant === 'caribe' ? CaribeFeaturedIcon : BusinessFeaturedIcon;
        const isActive = currentPage === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-lg transition-all',
              isActive && 'bg-primary/10'
            )}
          >
            <IconComponent 
              icon={item.icon} 
              size="sm"
              className={cn(isActive && 'scale-110')}
            />
            <span className={cn(
              'text-xs font-medium',
              isActive ? 'text-primary' : 'text-gray-600'
            )}>
              {item.titleKey.split('.')[1]}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
