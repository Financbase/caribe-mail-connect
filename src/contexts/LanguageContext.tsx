import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  es: {
    // Auth
    'auth.title': 'PRMCMS',
    'auth.subtitle': 'Sistema de Gestión de Paquetes',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.rememberMe': 'Recordarme',
    'auth.login': 'Iniciar sesión',
    'auth.welcome': 'Bienvenido',
    
    // Dashboard
    'dashboard.goodMorning': 'Buenos días',
    'dashboard.goodAfternoon': 'Buenas tardes',
    'dashboard.goodEvening': 'Buenas noches',
    'dashboard.todayStats': 'Estadísticas de hoy',
    'dashboard.packagesReceived': 'Paquetes recibidos',
    'dashboard.pendingDeliveries': 'Entregas pendientes',
    'dashboard.recentActivity': 'Actividad reciente',
    
    // Actions
    'actions.receivePackages': 'Recibir Paquetes',
    'actions.search': 'Buscar',
    'actions.deliver': 'Entregar',
    'actions.customers': 'Clientes',
    'actions.act60Dashboard': 'Panel Act 60',
    'actions.mailboxes': 'Buzones',
    'actions.routes': 'Rutas',
    'actions.analytics': 'Analíticas',
    'actions.driverView': 'Vista del Conductor',
    
    // Package Intake
    'intake.title': 'Recepción de Paquetes',
    'intake.scanBarcode': 'Escanear código de barras',
    'intake.trackingNumber': 'Número de seguimiento',
    'intake.carrier': 'Transportista',
    'intake.customer': 'Cliente',
    'intake.packageSize': 'Tamaño del paquete',
    'intake.specialHandling': 'Manejo especial',
    'intake.saveAndNotify': 'Guardar y notificar',
    'intake.small': 'Pequeño',
    'intake.medium': 'Mediano',
    'intake.large': 'Grande',
    
    // Customers
    'customers.title': 'Directorio de Clientes',
    'customers.search': 'Buscar cliente...',
    'customers.addNew': 'Agregar nuevo cliente',
    'customers.name': 'Nombre',
    'customers.mailbox': 'Buzón',
    'customers.phone': 'Teléfono',
    'customers.activePackages': 'Paquetes activos',
    
    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.logout': 'Cerrar sesión',
  },
  en: {
    // Auth
    'auth.title': 'PRMCMS',
    'auth.subtitle': 'Package Management System',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.rememberMe': 'Remember me',
    'auth.login': 'Login',
    'auth.welcome': 'Welcome',
    
    // Dashboard
    'dashboard.goodMorning': 'Good morning',
    'dashboard.goodAfternoon': 'Good afternoon', 
    'dashboard.goodEvening': 'Good evening',
    'dashboard.todayStats': "Today's stats",
    'dashboard.packagesReceived': 'Packages received',
    'dashboard.pendingDeliveries': 'Pending deliveries',
    'dashboard.recentActivity': 'Recent activity',
    
    // Actions
    'actions.receivePackages': 'Receive Packages',
    'actions.search': 'Search',
    'actions.deliver': 'Deliver',
    'actions.customers': 'Customers',
    'actions.act60Dashboard': 'Act 60 Dashboard',
    'actions.mailboxes': 'Mailboxes',
    'actions.routes': 'Routes',
    'actions.analytics': 'Analytics',
    'actions.driverView': 'Driver View',
    
    // Package Intake
    'intake.title': 'Package Intake',
    'intake.scanBarcode': 'Scan barcode',
    'intake.trackingNumber': 'Tracking number',
    'intake.carrier': 'Carrier',
    'intake.customer': 'Customer',
    'intake.packageSize': 'Package size',
    'intake.specialHandling': 'Special handling',
    'intake.saveAndNotify': 'Save and notify',
    'intake.small': 'Small',
    'intake.medium': 'Medium',
    'intake.large': 'Large',
    
    // Customers
    'customers.title': 'Customer Directory',
    'customers.search': 'Search customer...',
    'customers.addNew': 'Add new customer',
    'customers.name': 'Name',
    'customers.mailbox': 'Mailbox',
    'customers.phone': 'Phone',
    'customers.activePackages': 'Active packages',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.logout': 'Logout',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    const saved = localStorage.getItem('prmcms-language') as Language;
    if (saved && (saved === 'es' || saved === 'en')) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('prmcms-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['es']] || key;
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