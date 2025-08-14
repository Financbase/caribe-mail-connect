import { Mail, User, AlertTriangle, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Mailbox } from '@/hooks/useMailboxes';
import { cn } from '@/lib/utils';
import { FixedSizeGrid as Grid } from 'react-window';
import { useEffect, useRef, useState } from 'react';

interface MailboxGridProps {
  mailboxes: Mailbox[];
  onMailboxClick: (mailbox: Mailbox) => void;
}

export function MailboxGrid({ mailboxes, onMailboxClick }: MailboxGridProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

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

  // Windowed grid for large datasets
  // Responsive columns based on container width breakpoints
  const containerPadding = 32;
  const baseCell = 120;
  const gap = 12;
  const vw = containerWidth;
  const columnCount = vw >= 1536 ? 10 : vw >= 1280 ? 8 : vw >= 1024 ? 6 : vw >= 640 ? 4 : 2;
  const columnWidth = baseCell;
  const rowHeight = baseCell;
  const rowCount = Math.ceil(mailboxes.length / columnCount);
  const width = Math.min(columnCount * (columnWidth + gap), vw - containerPadding);
  const height = Math.min(720, rowCount * (rowHeight + gap));

  const Cell = ({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= mailboxes.length) return null;
    const mailbox = mailboxes[index];
    return (
      <div className="vt-mailbox-cell" style={style}>
        <Card
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
            <Badge variant="secondary" className="text-xs px-1 py-0 bg-white/20 text-white border-white/30">
              {getSizeLabel(mailbox.size)[0]}
            </Badge>
          </div>
          <div className="text-center flex-1 flex flex-col justify-center">
            <div className="text-white font-bold text-sm mb-1">#{mailbox.number}</div>
            {mailbox.current_customer && (
              <div className="text-white/80 text-xs leading-tight">
                {mailbox.current_customer.first_name} {mailbox.current_customer.last_name}
              </div>
            )}
            {mailbox.package_count && mailbox.package_count > 0 && (
              <div className="absolute bottom-1 right-1">
                <Badge className="bg-primary-sunrise text-white text-xs">{mailbox.package_count}</Badge>
              </div>
            )}
          </div>
          <div className="absolute bottom-1 left-1 text-white/70 text-xs">{getStatusLabel(mailbox)}</div>
        </Card>
      </div>
    );
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setContainerWidth(width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="w-full" ref={containerRef}>
      <Grid
        columnCount={columnCount}
        columnWidth={columnWidth + 12}
        height={height}
        rowCount={rowCount}
        rowHeight={rowHeight + 12}
        width={width}
      >
        {Cell}
      </Grid>
    </div>
  );
}