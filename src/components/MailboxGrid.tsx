import { Mail, User, AlertTriangle, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Mailbox } from '@/hooks/useMailboxes';
import { cn } from '@/lib/utils';

interface MailboxGridProps {
  mailboxes: Mailbox[];
  onMailboxClick: (mailbox: Mailbox) => void;
}

export function MailboxGrid({ mailboxes, onMailboxClick }: MailboxGridProps) {
  const { t } = useLanguage();

  const getStatusColor = (mailbox: Mailbox) => {
    if (mailbox.status === 'available') return 'bg-primary-palm border-primary-palm/50';
    if (mailbox.status === 'maintenance') return 'bg-gray-500 border-gray-400';
    
    // Check if overdue or expiring
    if (mailbox.rental_end_date) {
      const today = new Date();
      const endDate = new Date(mailbox.rental_end_date);
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      if (endDate < today) return 'bg-coral border-coral/50';
      if (endDate < thirtyDaysFromNow) return 'bg-sunset border-sunset/50';
    }
    
    return 'bg-primary-ocean border-primary-ocean/50';
  };

  const getStatusIcon = (mailbox: Mailbox) => {
    switch (mailbox.status) {
      case 'available':
        return <Mail className="h-4 w-4 text-white" />;
      case 'occupied':
        return <User className="h-4 w-4 text-white" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-white" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-white" />;
    }
  };

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return t('Small');
      case 'medium': return t('Medium');
      case 'large': return t('Large');
      case 'virtual': return t('Virtual');
      default: return size;
    }
  };

  const getStatusLabel = (mailbox: Mailbox) => {
    if (mailbox.status === 'available') return t('Available');
    if (mailbox.status === 'maintenance') return t('Maintenance');
    
    if (mailbox.rental_end_date) {
      const today = new Date();
      const endDate = new Date(mailbox.rental_end_date);
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      if (endDate < today) return t('Overdue');
      if (endDate < thirtyDaysFromNow) return t('Expiring Soon');
    }
    
    return t('Occupied');
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
      {mailboxes.map((mailbox) => (
        <Card
          key={mailbox.id}
          className={cn(
            "relative cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg",
            "aspect-square flex flex-col items-center justify-center p-2",
            "border-2",
            getStatusColor(mailbox)
          )}
          onClick={() => onMailboxClick(mailbox)}
        >
          <div className="absolute top-1 left-1">
            {getStatusIcon(mailbox)}
          </div>
          
          <div className="absolute top-1 right-1">
            <Badge 
              variant="secondary" 
              className="text-xs px-1 py-0 bg-white/20 text-white border-white/30"
            >
              {getSizeLabel(mailbox.size)[0]}
            </Badge>
          </div>

          <div className="text-center flex-1 flex flex-col justify-center">
            <div className="text-white font-bold text-sm mb-1">
              #{mailbox.number}
            </div>
            
            {mailbox.current_customer && (
              <div className="text-white/80 text-xs leading-tight">
                {mailbox.current_customer.first_name} {mailbox.current_customer.last_name}
              </div>
            )}
            
            {mailbox.package_count && mailbox.package_count > 0 && (
              <div className="absolute bottom-1 right-1">
                <Badge className="bg-primary-sunrise text-white text-xs">
                  {mailbox.package_count}
                </Badge>
              </div>
            )}
          </div>

          <div className="absolute bottom-1 left-1 text-white/70 text-xs">
            {getStatusLabel(mailbox)}
          </div>
        </Card>
      ))}
    </div>
  );
}