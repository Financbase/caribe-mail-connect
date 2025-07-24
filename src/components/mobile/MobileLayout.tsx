import { useState, useEffect } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { MobileHeader } from '../MobileHeader';
import { useMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export function MobileLayout({ 
  children, 
  currentPage, 
  onNavigate,
  title,
  showBack = false,
  onBack
}: MobileLayoutProps) {
  const { isMobile, deviceInfo } = useMobile();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Handle PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
      
      setDeferredPrompt(null);
    }
  };

  if (!isMobile) {
    // Desktop layout
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 pb-16">
      {/* Install app prompt */}
      {showInstallPrompt && !deviceInfo?.isNative && (
        <div className="fixed top-0 left-0 right-0 bg-primary text-primary-foreground p-3 z-50 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5" />
              <div>
                <p className="text-sm font-medium">Instalar PRMCMS</p>
                <p className="text-xs opacity-90">Acceso rápido desde tu inicio</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleInstallApp}
                className="text-xs"
              >
                Instalar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowInstallPrompt(false)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={cn(showInstallPrompt && !deviceInfo?.isNative && "mt-16")}>
        <MobileHeader title={title || getTitleForPage(currentPage)} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      {/* Bottom navigation */}
      <BottomNavigation 
        currentPage={currentPage}
        onNavigate={onNavigate}
      />
    </div>
  );
}

function getTitleForPage(page: string): string {
  const titles: Record<string, string> = {
    dashboard: 'Panel de Control',
    intake: 'Recepción de Paquetes',
    customers: 'Gestión de Clientes',
    mailboxes: 'Buzones de Correo',
    notifications: 'Notificaciones',
    analytics: 'Análisis y Reportes',
    routes: 'Rutas de Entrega',
    billing: 'Facturación',
    'profile-settings': 'Configuración',
    'location-management': 'Ubicaciones',
    'act60-dashboard': 'Dashboard Act 60',
    'driver-route': 'Ruta del Conductor',
  };
  
  return titles[page] || 'PRMCMS';
}