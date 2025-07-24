import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import type { VirtualMailbox } from '@/hooks/useVirtualMailbox';

interface AddMailPieceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  virtualMailboxes: VirtualMailbox[];
}

export function AddMailPieceDialog({ open, onOpenChange, virtualMailboxes }: AddMailPieceDialogProps) {
  const { language } = useLanguage();
  const isSpanish = language === 'es';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isSpanish ? 'Agregar Correo' : 'Add Mail Piece'}
          </DialogTitle>
        </DialogHeader>
        <p>Coming soon</p>
      </DialogContent>
    </Dialog>
  );
}