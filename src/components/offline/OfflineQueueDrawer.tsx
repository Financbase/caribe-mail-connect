import React, { useMemo, useState } from 'react';
import { useMutationState, useQueryClient } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Network, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function OfflineQueueDrawer() {
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // Read-only view of all mutations; filter those paused or in error
  const mutations = useMutationState({ filters: {} });
  const pending = useMemo(() => mutations.filter((m: any) => m.isPaused || m.status === 'error'), [mutations]);

  const retryAll = async () => {
    // In v5, resumePausedMutations will attempt to run paused ones
    try {
      await queryClient.resumePausedMutations();
    } catch {}
  };

  if (pending.length === 0) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="fixed bottom-20 right-4 shadow-md" aria-label={isSpanish ? 'Cola sin conexión' : 'Offline Queue'}>
          <Network className="h-4 w-4 mr-2" />
          {isSpanish ? 'Cola sin conexión' : 'Offline Queue'} ({pending.length})
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[60vh] overflow-auto">
        <SheetHeader>
          <SheetTitle>{isSpanish ? 'Operaciones pendientes' : 'Pending operations'}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-3">
          {pending.map((m: any, idx) => {
            return (
              <div key={idx} className="rounded border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{m.options?.mutationKey?.join?.(':') || 'mutation'}</div>
                    <div className="text-muted-foreground">
                      {isSpanish ? 'Estado:' : 'Status:'} {m.status} {m.isPaused ? `· ${isSpanish ? 'Pausada' : 'Paused'}` : ''}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="pt-2 flex justify-end">
            <Button onClick={retryAll}>
              <RefreshCw className="h-4 w-4 mr-2" /> {isSpanish ? 'Reintentar todo' : 'Retry all'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
