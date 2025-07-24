import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';

interface MailActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mailPieceId: string;
  onClose: () => void;
}

export function MailActionDialog({ open, onOpenChange, mailPieceId, onClose }: MailActionDialogProps) {
  const { language } = useLanguage();
  const isSpanish = language === 'es';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isSpanish ? 'Acción de Correo' : 'Mail Action'}
          </DialogTitle>
        </DialogHeader>
        <p>Coming soon</p>
      </DialogContent>
    </Dialog>
  );
}