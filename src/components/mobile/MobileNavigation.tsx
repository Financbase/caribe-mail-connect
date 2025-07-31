import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  Home, 
  Users, 
  Leaf, 
  BarChart3, 
  Settings,
  Bell,
  User,
  LogOut,
  Package,
  Truck,
  Mail,
  FileText
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRealTimeNotifications } from '@/hooks/useRealTimeData';

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  href: string;
  badge?: number;
}

const navigationItems: NavigationItem[] = [
  { id: 'home', label: 'Inicio', icon: Home, href: '/' },
  { id: 'partners', label: 'Socios', icon: Users, href: '/partners' },
  { id: 'sustainability', label: 'Sostenibilidad', icon: Leaf, href: '/sustainability' },
  { id: 'analytics', label: 'Analíticas', icon: BarChart3, href: '/analytics' },
  { id: 'packages', label: 'Paquetes', icon: Package, href: '/packages' },
  { id: 'routes', label: 'Rutas', icon: Truck, href: '/routes' },
  { id: 'mailboxes', label: 'Buzones', icon: Mail, href: '/mailboxes' },
  { id: 'reports', label: 'Reportes', icon: FileText, href: '/reports' },
];

export const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const { user, signOut, isAdmin, isManager } = useAuth();
  const notifications = useRealTimeNotifications();

  useEffect(() => {
    setCurrentPath(window.location.hash.replace('#', '') || '/');
  }, []);

  const handleNavigation = (href: string) => {
    window.location.hash = href;
    setCurrentPath(href);
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const getNotificationCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const isActive = (href: string) => {
    return currentPath === href;
  };

  return (
    <div className="lg:hidden">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Package className="h-4 w-4 text-white" />
                    </div>
                    <span>PRMCMS</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {/* User Info */}
                  {user && (
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {user.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isAdmin() ? 'Administrador' : isManager() ? 'Gerente' : 'Personal'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Items */}
                  <nav className="space-y-1">
                    {navigationItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.href)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          isActive(item.href)
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </nav>

                  {/* Settings & Logout */}
                  <div className="pt-4 border-t">
                    <button
                      onClick={() => handleNavigation('/settings')}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-muted transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Configuración</span>
                    </button>
                    
                    {user && (
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-muted transition-colors text-red-600"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Cerrar Sesión</span>
                      </button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <div>
              <h1 className="text-lg font-semibold">PRMCMS</h1>
              <p className="text-xs text-muted-foreground">Puerto Rico Mail Carrier</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="h-5 w-5" />
              {getNotificationCount() > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {getNotificationCount()}
                </Badge>
              )}
            </Button>

            {/* User Avatar */}
            {user && (
              <Button variant="ghost" size="sm" className="p-2">
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          {navigationItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.href)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Spacer for fixed header and bottom nav */}
      <div className="h-16" /> {/* Top spacer */}
      <div className="h-16" /> {/* Bottom spacer */}
    </div>
  );
}; 