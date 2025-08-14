import React from 'react';
import { Plus, Scan, Bell, UserPlus, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface QuickActionsMenuProps {
  onAction?: (action: 'scan' | 'notify' | 'customer' | 'search') => void;
}

export function QuickActionsMenu({ onAction }: QuickActionsMenuProps) {
  const { language } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const isSpanish = language === 'es';

  const actions = [
    { id: 'scan', label: isSpanish ? 'Escanear' : 'Scan', icon: <Scan className="h-5 w-5" /> },
    { id: 'notify', label: isSpanish ? 'Notificar' : 'Notify', icon: <Bell className="h-5 w-5" /> },
    { id: 'customer', label: isSpanish ? 'Cliente' : 'Customer', icon: <UserPlus className="h-5 w-5" /> },
    { id: 'search', label: isSpanish ? 'Buscar' : 'Search', icon: <Search className="h-5 w-5" /> },
  ] as const;

  const handleAction = (id: typeof actions[number]['id']) => () => {
    onAction?.(id);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Expanded actions */}
      <div
        className={`transition-all duration-200 origin-bottom-right ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
        aria-hidden={!open}
      >
        <ul className="mb-3 flex flex-col items-end gap-2">
          {actions.map((a) => (
            <li key={a.id}>
              <Button
                onClick={handleAction(a.id)}
                className="h-12 px-3 rounded-full shadow-lg bg-white text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                variant="secondary"
              >
                <span className="sr-only">{a.label}</span>
                {a.icon}
                <span className="text-sm font-medium min-w-[84px] text-right">{a.label}</span>
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* FAB */}
      <Button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? (isSpanish ? 'Cerrar acciones rápidas' : 'Close quick actions') : (isSpanish ? 'Abrir acciones rápidas' : 'Open quick actions')}
        className="rounded-full h-14 w-14 shadow-xl flex items-center justify-center"
        style={{ backgroundColor: '#FF6B35' }}
      >
        <Plus className={`h-7 w-7 text-white transition-transform ${open ? 'rotate-45' : ''}`} />
      </Button>
    </div>
  );
}

export default QuickActionsMenu;
