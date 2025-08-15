import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Puerto Rico Spanish translations for PRMCMS
const translations = {
  es: {
    // Navigation
    'nav.dashboard': 'Panel Principal',
    'nav.packages': 'Paquetes',
    'nav.customers': 'Clientes',
    'nav.reports': 'Reportes',
    'nav.settings': 'Configuración',
    'nav.help': 'Ayuda',
    'nav.logout': 'Cerrar Sesión',
    
    // Package Management
    'package.scan': 'Escanear Paquete',
    'package.details': 'Detalles del Paquete',
    'package.tracking': 'Rastreo',
    'package.delivered': 'Entregado',
    'package.pending': 'Pendiente',
    'package.overdue': 'Vencido',
    'package.notify': 'Notificar Cliente',
    
    // Customer Management
    'customer.search': 'Buscar Cliente',
    'customer.details': 'Detalles del Cliente',
    'customer.mailbox': 'Buzón',
    'customer.contact': 'Contacto',
    'customer.preferences': 'Preferencias',
    'customer.notifications': 'Notificaciones',
    
    // Common Actions
    'action.save': 'Guardar',
    'action.cancel': 'Cancelar',
    'action.edit': 'Editar',
    'action.delete': 'Eliminar',
    'action.search': 'Buscar',
    'action.filter': 'Filtrar',
    'action.export': 'Exportar',
    'action.print': 'Imprimir',
    
    // Status Messages
    'status.loading': 'Cargando...',
    'status.error': 'Error',
    'status.success': 'Éxito',
    'status.no_results': 'No se encontraron resultados',
    'status.offline': 'Sin conexión',
    'status.syncing': 'Sincronizando...',
    
    // Accessibility
    'a11y.skip_to_content': 'Saltar al contenido principal',
    'a11y.skip_to_nav': 'Saltar a la navegación',
    'a11y.menu_toggle': 'Alternar menú',
    'a11y.close_dialog': 'Cerrar diálogo',
    
    // Date/Time
    'date.today': 'Hoy',
    'date.yesterday': 'Ayer',
    'date.tomorrow': 'Mañana',
    'time.morning': 'Mañana',
    'time.afternoon': 'Tarde',
    'time.evening': 'Noche',
    
    // Forms
    'form.required': 'Campo obligatorio',
    'form.invalid_email': 'Email inválido',
    'form.invalid_phone': 'Teléfono inválido',
    'form.password_too_short': 'Contraseña muy corta',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.packages': 'Packages',
    'nav.customers': 'Customers',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.help': 'Help',
    'nav.logout': 'Logout',
    
    // Package Management
    'package.scan': 'Scan Package',
    'package.details': 'Package Details',
    'package.tracking': 'Tracking',
    'package.delivered': 'Delivered',
    'package.pending': 'Pending',
    'package.overdue': 'Overdue',
    'package.notify': 'Notify Customer',
    
    // Customer Management
    'customer.search': 'Search Customer',
    'customer.details': 'Customer Details',
    'customer.mailbox': 'Mailbox',
    'customer.contact': 'Contact',
    'customer.preferences': 'Preferences',
    'customer.notifications': 'Notifications',
    
    // Common Actions
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.search': 'Search',
    'action.filter': 'Filter',
    'action.export': 'Export',
    'action.print': 'Print',
    
    // Status Messages
    'status.loading': 'Loading...',
    'status.error': 'Error',
    'status.success': 'Success',
    'status.no_results': 'No results found',
    'status.offline': 'Offline',
    'status.syncing': 'Syncing...',
    
    // Accessibility
    'a11y.skip_to_content': 'Skip to main content',
    'a11y.skip_to_nav': 'Skip to navigation',
    'a11y.menu_toggle': 'Toggle menu',
    'a11y.close_dialog': 'Close dialog',
    
    // Date/Time
    'date.today': 'Today',
    'date.yesterday': 'Yesterday',
    'date.tomorrow': 'Tomorrow',
    'time.morning': 'Morning',
    'time.afternoon': 'Afternoon',
    'time.evening': 'Evening',
    
    // Forms
    'form.required': 'Required field',
    'form.invalid_email': 'Invalid email',
    'form.invalid_phone': 'Invalid phone',
    'form.password_too_short': 'Password too short',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default to Spanish for Puerto Rico
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('prmcms-language') as Language;
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language, but prefer Spanish for Puerto Rico
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('en') && !browserLang.includes('pr')) {
        setLanguage('en');
      } else {
        setLanguage('es'); // Default to Spanish for Puerto Rico
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('prmcms-language', lang);
    
    // Update document language
    document.documentElement.lang = lang === 'es' ? 'es-PR' : 'en-US';
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language][key as keyof typeof translations[typeof language]] || key;
    
    // Simple parameter interpolation
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, String(value));
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Puerto Rico specific formatting utilities
export const formatDatePR = (date: Date, language: Language = 'es'): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  const locale = language === 'es' ? 'es-PR' : 'en-US';
  return new Intl.DateTimeFormat(locale, options).format(date);
};

export const formatTimePR = (date: Date, language: Language = 'es'): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  
  const locale = language === 'es' ? 'es-PR' : 'en-US';
  return new Intl.DateTimeFormat(locale, options).format(date);
};

export const formatCurrencyPR = (amount: number, language: Language = 'es'): string => {
  const locale = language === 'es' ? 'es-PR' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default useLanguage;
