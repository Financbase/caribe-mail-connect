import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarProvider, SidebarHeader, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { PanelLeft, Package, Users, Mail, BarChart3, Truck, MessageSquare, Store, Smartphone, Zap, UserCheck, GraduationCap, Code, Shield, Navigation } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', icon: Package, label: 'Dashboard' },
  { id: 'customers', icon: Users, label: 'Customers' },
  { id: 'mailboxes', icon: Mail, label: 'Mailboxes' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'routes', icon: Truck, label: 'Routes' },
  { id: 'last-mile', icon: Navigation, label: 'Last-Mile Delivery' },
  { id: 'communications', icon: MessageSquare, label: 'Communications' },
  { id: 'marketplace', icon: Store, label: 'Marketplace' },
  { id: 'devices', icon: Smartphone, label: 'Devices' },
  { id: 'iot-monitoring', icon: Zap, label: 'IoT Monitoring' },
  { id: 'insurance', icon: Shield, label: 'Insurance' },
  { id: 'employees', icon: UserCheck, label: 'Employees' },
  { id: 'training', icon: GraduationCap, label: 'Training' },
  { id: 'qa', icon: Shield, label: 'Quality Assurance' },
  { id: 'developers', icon: Code, label: 'Developers' },
];

export function MainLayout({ children, currentPage, onNavigate }: MainLayoutProps) {
  const isMobile = useIsMobile();

  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.hash = `#/${page}`;
    }
  };

  // Use MobileLayout for mobile devices
  if (isMobile) {
    return (
      <MobileLayout
        currentPage={currentPage || 'dashboard'}
        onNavigate={handleNavigation}
        data-testid="mobile-layout"
      >
        {children}
      </MobileLayout>
    );
  }

  // Use Sidebar for desktop devices
  return (
    <SidebarProvider data-testid="sidebar-provider">
      <div className="flex h-screen overflow-hidden">
        <Sidebar data-testid="sidebar">
          <SidebarHeader>
            <div className="flex items-center justify-between w-full">
              <h2 className="text-xl font-semibold">PRMCMS</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <PanelLeft className="h-4 w-4" />
              </Button>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <nav className="space-y-1 px-2" data-testid="main-navigation">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${currentPage === item.id ? 'bg-accent' : ''}`}
                  onClick={() => handleNavigation(item.id)}
                  data-testid={`nav-${item.id}`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </SidebarContent>
          
          <SidebarFooter>
            <div className="text-xs text-muted-foreground">
              PRMCMS v1.0.0
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-background to-accent/20">
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
