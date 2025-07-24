import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scan } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ScanningQueueItem } from '@/hooks/useVirtualMailbox';

interface ScanningQueueProps {
  queueItems: ScanningQueueItem[];
  loading: boolean;
}

export function ScanningQueue({ queueItems, loading }: ScanningQueueProps) {
  const { language } = useLanguage();
  const isSpanish = language === 'es';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="h-5 w-5" />
          {isSpanish ? 'Cola de Escaneo' : 'Scanning Queue'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {isSpanish ? 'Cola de escaneo - Próximamente' : 'Scanning queue - Coming soon'}
        </p>
      </CardContent>
    </Card>
  );
}