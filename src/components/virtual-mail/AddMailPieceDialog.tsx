import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Upload, Package } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVirtualMailbox } from '@/hooks/useVirtualMailbox';
import { useToast } from '@/components/ui/use-toast';
import type { VirtualMailbox } from '@/hooks/useVirtualMailbox';

interface AddMailPieceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  virtualMailboxes: VirtualMailbox[];
}

export function AddMailPieceDialog({ open, onOpenChange, virtualMailboxes }: AddMailPieceDialogProps) {
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  const { toast } = useToast();
  const { addMailPiece } = useVirtualMailbox();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mailData, setMailData] = useState({
    virtual_mailbox_id: '',
    mail_type: 'letter',
    sender_name: '',
    sender_address: '',
    size_category: 'standard',
    weight_grams: '',
    notes: '',
  });

  const handleSubmit = async () => {
    if (!mailData.virtual_mailbox_id) {
      toast({
        title: isSpanish ? 'Error' : 'Error',
        description: isSpanish ? 'Seleccione un buzón virtual' : 'Please select a virtual mailbox',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await addMailPiece({
        virtual_mailbox_id: mailData.virtual_mailbox_id,
        mail_type: mailData.mail_type,
        sender_name: mailData.sender_name || null,
        sender_address: mailData.sender_address || null,
        size_category: mailData.size_category,
        weight_grams: mailData.weight_grams ? parseInt(mailData.weight_grams) : null,
        notes: mailData.notes || null,
        status: 'received',
        priority_level: 1,
      });

      // Reset form
      setMailData({
        virtual_mailbox_id: '',
        mail_type: 'letter',
        sender_name: '',
        sender_address: '',
        size_category: 'standard',
        weight_grams: '',
        notes: '',
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding mail piece:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {isSpanish ? 'Agregar Pieza de Correo' : 'Add Mail Piece'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Virtual Mailbox Selection */}
          <div>
            <Label>{isSpanish ? 'Buzón Virtual' : 'Virtual Mailbox'} *</Label>
            <Select 
              value={mailData.virtual_mailbox_id}
              onValueChange={(value) => setMailData({...mailData, virtual_mailbox_id: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder={isSpanish ? 'Seleccionar buzón...' : 'Select mailbox...'} />
              </SelectTrigger>
              <SelectContent>
                {virtualMailboxes.map((vm) => (
                  <SelectItem key={vm.id} value={vm.id}>
                    {vm.address_line1} - {vm.city}, {vm.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mail Type and Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{isSpanish ? 'Tipo de Correo' : 'Mail Type'}</Label>
              <Select 
                value={mailData.mail_type}
                onValueChange={(value) => setMailData({...mailData, mail_type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="letter">
                    {isSpanish ? 'Carta' : 'Letter'}
                  </SelectItem>
                  <SelectItem value="package">
                    {isSpanish ? 'Paquete' : 'Package'}
                  </SelectItem>
                  <SelectItem value="magazine">
                    {isSpanish ? 'Revista' : 'Magazine'}
                  </SelectItem>
                  <SelectItem value="catalog">
                    {isSpanish ? 'Catálogo' : 'Catalog'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{isSpanish ? 'Categoría de Tamaño' : 'Size Category'}</Label>
              <Select 
                value={mailData.size_category}
                onValueChange={(value) => setMailData({...mailData, size_category: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">
                    {isSpanish ? 'Estándar' : 'Standard'}
                  </SelectItem>
                  <SelectItem value="large">
                    {isSpanish ? 'Grande' : 'Large'}
                  </SelectItem>
                  <SelectItem value="oversized">
                    {isSpanish ? 'Extragrande' : 'Oversized'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sender Information */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>{isSpanish ? 'Nombre del Remitente' : 'Sender Name'}</Label>
              <Input
                placeholder={isSpanish ? 'Ej: Juan Pérez' : 'e.g. John Smith'}
                value={mailData.sender_name}
                onChange={(e) => setMailData({...mailData, sender_name: e.target.value})}
              />
            </div>

            <div>
              <Label>{isSpanish ? 'Dirección del Remitente' : 'Sender Address'}</Label>
              <Textarea
                placeholder={isSpanish ? 'Dirección completa del remitente...' : 'Complete sender address...'}
                value={mailData.sender_address}
                onChange={(e) => setMailData({...mailData, sender_address: e.target.value})}
                rows={2}
              />
            </div>
          </div>

          {/* Weight */}
          <div>
            <Label>{isSpanish ? 'Peso (gramos)' : 'Weight (grams)'}</Label>
            <Input
              type="number"
              placeholder={isSpanish ? 'Peso estimado...' : 'Estimated weight...'}
              value={mailData.weight_grams}
              onChange={(e) => setMailData({...mailData, weight_grams: e.target.value})}
            />
          </div>

          {/* Notes */}
          <div>
            <Label>{isSpanish ? 'Notas (Opcional)' : 'Notes (Optional)'}</Label>
            <Textarea
              placeholder={isSpanish ? 'Notas adicionales...' : 'Additional notes...'}
              value={mailData.notes}
              onChange={(e) => setMailData({...mailData, notes: e.target.value})}
              rows={2}
            />
          </div>

          {/* Photo Capture Section */}
          <div className="border-t pt-4">
            <Label className="text-base font-medium">
              {isSpanish ? 'Foto del Exterior' : 'Exterior Photo'}
            </Label>
            <div className="mt-2 p-4 border-2 border-dashed border-muted-foreground/20 rounded-lg">
              <div className="text-center">
                <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  {isSpanish 
                    ? 'Tome una foto del exterior del correo'
                    : 'Take a photo of the mail exterior'
                  }
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm">
                    <Camera className="h-3 w-3 mr-1" />
                    {isSpanish ? 'Cámara' : 'Camera'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-3 w-3 mr-1" />
                    {isSpanish ? 'Archivo' : 'File'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              {isSpanish ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={!mailData.virtual_mailbox_id || isSubmitting}
            >
              {isSubmitting 
                ? (isSpanish ? 'Agregando...' : 'Adding...') 
                : (isSpanish ? 'Agregar Correo' : 'Add Mail')
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}