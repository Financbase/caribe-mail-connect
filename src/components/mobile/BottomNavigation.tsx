import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Package, 
  Users, 
  Bell, 
  Menu,
  Search,
  Camera,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { useMobile } from '@/hooks/useMobile';

interface BottomNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Inicio', icon: Home },
  { id: 'intake', label: 'Paquetes', icon: Package },
  { id: 'customers', label: 'Clientes', icon: Users },
  { id: 'notifications', label: 'Avisos', icon: Bell },
  { id: 'more', label: 'Más', icon: Menu },
];

const moreItems = [
  { id: 'mailboxes', label: 'Buzones', icon: Package },
  { id: 'billing', label: 'Facturación', icon: DollarSign },
  { id: 'analytics', label: 'Reportes', icon: BarChart3 },
  { id: 'routes', label: 'Rutas', icon: Search },
  { id: 'camera', label: 'Cámara', icon: Camera },
];

export function BottomNavigation({ currentPage, onNavigate }: BottomNavigationProps) {
  const [showMore, setShowMore] = useState(false);
  const { isMobile, hapticFeedback } = useMobile();

  // Auto-hide "more" menu when navigating away
  useEffect(() => {
    if (currentPage !== 'more') {
      setShowMore(false);
    }
  }, [currentPage]);

  const handleNavigation = (pageId: string) => {
    hapticFeedback.light();
    
    if (pageId === 'more') {
      setShowMore(!showMore);
      return;
    }
    
    // Use hash navigation for consistency
    window.location.hash = `#/${pageId}`;
    setShowMore(false);
  };

  // Don't show on desktop
  if (!isMobile) {
    return null;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const buttons = Array.from(
      (e.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('button[data-nav-item="true"]')
    );
    const activeIndex = buttons.findIndex((btn) => btn === document.activeElement);
    const delta = e.key === 'ArrowLeft' ? -1 : 1;
    const nextIndex = (activeIndex + delta + buttons.length) % buttons.length;
    const next = buttons[nextIndex];
    next?.focus();
    e.preventDefault();
  };

  return (
    <>
      {/* More items overlay */}
      {showMore && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMore(false)}>
          <div className="absolute bottom-16 left-0 right-0 bg-background border-t shadow-xl">
            <div className="grid grid-cols-3 gap-1 p-4">
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigation(item.id);
                    }}
                    className="flex flex-col items-center py-3 px-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <Icon className="w-6 h-6 mb-1 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-50 pb-safe" aria-label="Navegación principal">
        <div className="flex items-center justify-around h-16" onKeyDown={handleKeyDown}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || (item.id === 'more' && showMore);
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                data-nav-item="true"
                className={cn(
                  "flex flex-col items-center py-1 px-2 rounded-lg transition-all duration-200 min-w-0 flex-1 touch-target",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon 
                  className={cn(
                    "w-6 h-6 mb-1 transition-transform",
                    isActive && "scale-110"
                  )} 
                />
                <span className="text-xs font-medium truncate">
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 bg-primary rounded-full mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}