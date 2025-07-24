import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import PortalLogin from './portal/PortalLogin';
import PortalDashboard from './portal/PortalDashboard';
import PortalNotifications from './portal/PortalNotifications';
import PortalDocuments from './portal/PortalDocuments';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Bell, 
  FileText, 
  Home,
  LogOut,
  User as UserIcon,
  Settings
} from 'lucide-react';

interface CustomerPortalProps {
  onNavigate: (page: string) => void;
}

export default function CustomerPortal({ onNavigate }: CustomerPortalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [customerData, setCustomerData] = useState<any>(null);

  useEffect(() => {
    // Auth state management
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          fetchCustomerData(session.user.id);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        fetchCustomerData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCustomerData = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      setCustomerData(data);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentPage('dashboard');
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando portal...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <PortalLogin onNavigate={onNavigate} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'notifications':
        return <PortalNotifications customerData={customerData} onNavigate={handleNavigation} />;
      case 'documents':
        return <PortalDocuments customerData={customerData} onNavigate={handleNavigation} />;
      case 'profile':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Funcionalidad de perfil próximamente...</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <PortalDashboard customerData={customerData} onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-primary/10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="h-6 w-6 text-primary" />
              <div>
                <h1 className="font-semibold text-primary">Portal Cliente</h1>
                {customerData && (
                  <p className="text-xs text-muted-foreground">
                    Buzón: {customerData.mailbox_number}
                  </p>
                )}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-muted-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-20">
        {renderPage()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-primary/10 px-4 py-2">
        <div className="flex justify-around">
          <Button
            variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleNavigation('dashboard')}
            className="flex-col h-auto py-2 px-3"
          >
            <Home className="h-4 w-4 mb-1" />
            <span className="text-xs">Inicio</span>
          </Button>
          
          <Button
            variant={currentPage === 'notifications' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleNavigation('notifications')}
            className="flex-col h-auto py-2 px-3"
          >
            <Bell className="h-4 w-4 mb-1" />
            <span className="text-xs">Avisos</span>
          </Button>
          
          <Button
            variant={currentPage === 'documents' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleNavigation('documents')}
            className="flex-col h-auto py-2 px-3"
          >
            <FileText className="h-4 w-4 mb-1" />
            <span className="text-xs">Documentos</span>
          </Button>
          
          <Button
            variant={currentPage === 'profile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleNavigation('profile')}
            className="flex-col h-auto py-2 px-3"
          >
            <UserIcon className="h-4 w-4 mb-1" />
            <span className="text-xs">Perfil</span>
          </Button>
        </div>
      </div>
    </div>
  );
}