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
  'intake.positionInFrame': 'Coloca el código dentro del marco',
  'intake.scan': 'Escanear',
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
    
    // Locations
    'locations.multiLocationOverview': 'Vista General Multi-Ubicación',
    'locations.manageLocations': 'Gestionar Ubicaciones',
    'locations.overview': 'Vista General',
    'locations.performance': 'Rendimiento',
    'locations.comparison': 'Comparación',
    'locations.currentLocation': 'Ubicación Actual',
    'locations.customers': 'Clientes',
    'locations.packages': 'Paquetes',
    'locations.monthlyRevenue': 'Ingresos Mensuales',
    'locations.efficiency': 'Eficiencia',
    'locations.monthlyGrowth': 'Crecimiento Mensual',
    'locations.revenue': 'Ingresos',
    'locations.performanceRanking': 'Ranking de Rendimiento de Ubicaciones',
    'locations.notSet': 'No establecido',
    'locations.closed': 'Cerrado',
    'locations.hoursNotSet': 'Horario no establecido',
    
    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.logout': 'Cerrar sesión',

  // Virtual Mail
  'vm.title': 'Buzón Virtual',
  'vm.subtitle': 'Gestiona el correo virtual de tus clientes',
  'vm.newMail': 'Nuevo Correo',
  'vm.totalMail': 'Total Correos',
  'vm.pendingActions': 'Pendientes',
  'vm.inScanning': 'Escaneando',
  'vm.checkDeposits': 'Depósitos',
  'vm.searchPlaceholder': 'Buscar por remitente o número...',
  'vm.status.all': 'Todos los estados',
  'vm.status.received': 'Recibido',
  'vm.status.notified': 'Notificado',
  'vm.status.action_pending': 'Acción Pendiente',
  'vm.status.completed': 'Completado',
  'vm.allMailboxes': 'Todos los buzones',
  'vm.tab.mailPieces': 'Correo',
  'vm.tab.scanning': 'Escaneo',
  'vm.tab.deposits': 'Depósitos',
  'vm.tab.dashboard': 'Panel',
  'vm.tab.analytics': 'Analítica',
  'vm.tab.billing': 'Billing',
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
  'intake.positionInFrame': 'Position barcode within the frame',
  'intake.scan': 'Scan',
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
    
    // Locations
    'locations.multiLocationOverview': 'Multi-Location Overview',
    'locations.manageLocations': 'Manage Locations',
    'locations.overview': 'Overview',
    'locations.performance': 'Performance',
    'locations.comparison': 'Comparison',
    'locations.currentLocation': 'Current Location',
    'locations.customers': 'Customers',
    'locations.packages': 'Packages',
    'locations.monthlyRevenue': 'Monthly Revenue',
    'locations.efficiency': 'Efficiency',
    'locations.monthlyGrowth': 'Monthly Growth',
    'locations.revenue': 'Revenue',
    'locations.performanceRanking': 'Location Performance Ranking',
    'locations.notSet': 'Not set',
    'locations.closed': 'Closed',
    'locations.hoursNotSet': 'Hours not set',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.logout': 'Logout',

  // Virtual Mail
  'vm.title': 'Virtual Mailbox',
  'vm.subtitle': 'Manage virtual mail for your customers',
  'vm.newMail': 'New Mail',
  'vm.totalMail': 'Total Mail',
  'vm.pendingActions': 'Pending Actions',
  'vm.inScanning': 'In Scanning',
  'vm.checkDeposits': 'Check Deposits',
  'vm.searchPlaceholder': 'Search by sender or number...',
  'vm.status.all': 'All Status',
  'vm.status.received': 'Received',
  'vm.status.notified': 'Notified',
  'vm.status.action_pending': 'Action Pending',
  'vm.status.completed': 'Completed',
  'vm.allMailboxes': 'All Mailboxes',
  'vm.tab.mailPieces': 'Mail Pieces',
  'vm.tab.scanning': 'Scanning Queue',
  'vm.tab.deposits': 'Check Deposits',
  'vm.tab.dashboard': 'Dashboard',
  'vm.tab.analytics': 'Analytics',
  'vm.tab.billing': 'Billing',
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