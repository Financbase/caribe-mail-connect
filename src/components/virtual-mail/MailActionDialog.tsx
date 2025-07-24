import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scan, Send, Trash2, Package, Calculator, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVirtualMailbox } from '@/hooks/useVirtualMailbox';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface MailActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mailPieceId: string;
  onClose: () => void;
}

export function MailActionDialog({ open, onOpenChange, mailPieceId, onClose }: MailActionDialogProps) {
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  const { toast } = useToast();
  
  const { 
    mailPieces, 
    virtualMailboxes, 
    pricing, 
    createMailAction, 
    calculateActionCost,
    fetchPricing 
  } = useVirtualMailbox();

  const [selectedAction, setSelectedAction] = useState<string>('');
  const [actionData, setActionData] = useState<any>({});
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mailPiece = mailPieces.find(mp => mp.id === mailPieceId);
  const virtualMailbox = mailPiece ? virtualMailboxes.find(vm => vm.id === mailPiece.virtual_mailbox_id) : null;

  useEffect(() => {
    if (open) {
      fetchPricing();
      setSelectedAction('');
      setActionData({});
      setEstimatedCost(0);
    }
  }, [open]);

  useEffect(() => {
    if (selectedAction && virtualMailbox) {
      const cost = calculateActionCost(selectedAction, virtualMailbox.service_tier, actionData);
      setEstimatedCost(cost);
    }
  }, [selectedAction, actionData, virtualMailbox]);

  const handleSubmit = async () => {
    if (!mailPiece || !virtualMailbox || !selectedAction) return;

    try {
      setIsSubmitting(true);
      await createMailAction({
        mail_piece_id: mailPieceId,
        virtual_mailbox_id: mailPiece.virtual_mailbox_id,
        action_type: selectedAction,
        action_cost: estimatedCost,
        forwarding_address: actionData.forwarding_address || null,
        scanning_instructions: actionData.scanning_instructions || null,
        notes: actionData.notes || null,
      });

      toast({
        title: isSpanish ? 'Éxito' : 'Success',
        description: isSpanish ? 'Acción creada exitosamente' : 'Action created successfully',
      });

      onClose();
    } catch (error) {
      console.error('Error creating action:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderActionForm = () => {
    switch (selectedAction) {
      case 'scan':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{isSpanish ? 'Calidad de Escaneo' : 'Scan Quality'}</Label>
                <Select 
                  value={actionData.scan_quality || 'standard'}
                  onValueChange={(value) => setActionData({...actionData, scan_quality: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">
                      {isSpanish ? 'Estándar (300 DPI)' : 'Standard (300 DPI)'}
                    </SelectItem>
                    <SelectItem value="high">
                      {isSpanish ? 'Alta (600 DPI)' : 'High (600 DPI)'}
                    </SelectItem>
                    <SelectItem value="ultra">
                      {isSpanish ? 'Ultra (1200 DPI)' : 'Ultra (1200 DPI)'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{isSpanish ? 'Tipo de Escaneo' : 'Scan Type'}</Label>
                <Select 
                  value={actionData.scan_type || 'both_sides'}
                  onValueChange={(value) => setActionData({...actionData, scan_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="front_only">
                      {isSpanish ? 'Solo Frente' : 'Front Only'}
                    </SelectItem>
                    <SelectItem value="both_sides">
                      {isSpanish ? 'Ambos Lados' : 'Both Sides'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>{isSpanish ? 'Modo de Color' : 'Color Mode'}</Label>
              <Select 
                value={actionData.color_mode || 'color'}
                onValueChange={(value) => setActionData({...actionData, color_mode: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="color">
                    {isSpanish ? 'Color' : 'Color'}
                  </SelectItem>
                  <SelectItem value="grayscale">
                    {isSpanish ? 'Escala de Grises' : 'Grayscale'}
                  </SelectItem>
                  <SelectItem value="black_white">
                    {isSpanish ? 'Blanco y Negro' : 'Black & White'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{isSpanish ? 'Páginas Estimadas' : 'Estimated Pages'}</Label>
              <Input
                type="number"
                min="1"
                value={actionData.pages || 1}
                onChange={(e) => setActionData({...actionData, pages: parseInt(e.target.value) || 1})}
              />
            </div>
          </div>
        );

      case 'forward':
        return (
          <div className="space-y-4">
            <div>
              <Label>{isSpanish ? 'Dirección de Envío' : 'Forwarding Address'}</Label>
              <Textarea
                placeholder={isSpanish ? 'Ingrese la dirección completa...' : 'Enter complete address...'}
                value={actionData.address || ''}
                onChange={(e) => setActionData({...actionData, address: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{isSpanish ? 'Método de Envío' : 'Shipping Method'}</Label>
                <Select 
                  value={actionData.shipping_method || 'standard'}
                  onValueChange={(value) => setActionData({...actionData, shipping_method: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">
                      {isSpanish ? 'Estándar (5-7 días)' : 'Standard (5-7 days)'}
                    </SelectItem>
                    <SelectItem value="express">
                      {isSpanish ? 'Express (2-3 días)' : 'Express (2-3 days)'}
                    </SelectItem>
                    <SelectItem value="overnight">
                      {isSpanish ? 'Siguiente Día' : 'Overnight'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{isSpanish ? 'Peso Estimado (oz)' : 'Estimated Weight (oz)'}</Label>
                <Input
                  type="number"
                  min="1"
                  step="0.1"
                  value={actionData.weight || 1}
                  onChange={(e) => setActionData({...actionData, weight: parseFloat(e.target.value) || 1})}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span className="text-sm">
                {isSpanish 
                  ? 'El costo final puede variar según el peso real'
                  : 'Final cost may vary based on actual weight'
                }
              </span>
            </div>
          </div>
        );

      case 'hold':
        return (
          <div className="space-y-4">
            <div>
              <Label>{isSpanish ? 'Tiempo de Retención' : 'Hold Duration'}</Label>
              <Select 
                value={actionData.hold_duration || '30'}
                onValueChange={(value) => setActionData({...actionData, hold_duration: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">
                    {isSpanish ? '7 días' : '7 days'}
                  </SelectItem>
                  <SelectItem value="30">
                    {isSpanish ? '30 días' : '30 days'}
                  </SelectItem>
                  <SelectItem value="60">
                    {isSpanish ? '60 días' : '60 days'}
                  </SelectItem>
                  <SelectItem value="90">
                    {isSpanish ? '90 días' : '90 days'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'shred':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">
                  {isSpanish ? 'Advertencia de Destrucción' : 'Destruction Warning'}
                </span>
              </div>
              <p className="text-sm text-red-700 mt-2">
                {isSpanish 
                  ? 'Esta acción es irreversible. El documento será destruido de forma segura.'
                  : 'This action is irreversible. The document will be securely destroyed.'
                }
              </p>
            </div>

            <div>
              <Label>{isSpanish ? 'Confirmación' : 'Confirmation'}</Label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="confirm-shred"
                  checked={actionData.confirmed || false}
                  onChange={(e) => setActionData({...actionData, confirmed: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="confirm-shred" className="text-sm">
                  {isSpanish 
                    ? 'Confirmo que quiero destruir este documento'
                    : 'I confirm I want to destroy this document'
                  }
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!mailPiece || !virtualMailbox) {
    return null;
  }

  const actionOptions = [
    {
      id: 'scan',
      label: isSpanish ? 'Escanear' : 'Scan',
      icon: <Scan className="h-4 w-4" />,
      description: isSpanish ? 'Abrir y escanear el contenido' : 'Open and scan contents',
    },
    {
      id: 'forward',
      label: isSpanish ? 'Enviar' : 'Forward',
      icon: <Send className="h-4 w-4" />,
      description: isSpanish ? 'Enviar a otra dirección' : 'Forward to another address',
    },
    {
      id: 'hold',
      label: isSpanish ? 'Retener' : 'Hold',
      icon: <Package className="h-4 w-4" />,
      description: isSpanish ? 'Guardar para recogida' : 'Hold for pickup',
    },
    {
      id: 'shred',
      label: isSpanish ? 'Triturar' : 'Shred',
      icon: <Trash2 className="h-4 w-4" />,
      description: isSpanish ? 'Destruir de forma segura' : 'Securely destroy',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isSpanish ? 'Crear Acción de Correo' : 'Create Mail Action'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mail Piece Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                {isSpanish ? 'Información del Correo' : 'Mail Piece Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {isSpanish ? 'Número:' : 'Number:'}
                </span>
                <span className="text-sm font-medium">{mailPiece.piece_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {isSpanish ? 'Remitente:' : 'Sender:'}
                </span>
                <span className="text-sm font-medium">{mailPiece.sender_name || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {isSpanish ? 'Tipo:' : 'Type:'}
                </span>
                <Badge variant="outline" className="text-xs capitalize">
                  {mailPiece.mail_type}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Action Selection */}
          {!selectedAction && (
            <div>
              <Label className="text-base font-medium">
                {isSpanish ? 'Seleccionar Acción' : 'Select Action'}
              </Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {actionOptions.map((action) => (
                  <Card
                    key={action.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedAction(action.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {action.icon}
                        <div>
                          <div className="font-medium">{action.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Action Form */}
          {selectedAction && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">
                  {actionOptions.find(a => a.id === selectedAction)?.label}
                </Label>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedAction('');
                    setActionData({});
                  }}
                >
                  {isSpanish ? 'Cambiar' : 'Change'}
                </Button>
              </div>

              {renderActionForm()}

              {/* Notes */}
              <div>
                <Label>{isSpanish ? 'Notas (Opcional)' : 'Notes (Optional)'}</Label>
                <Textarea
                  placeholder={isSpanish ? 'Instrucciones adicionales...' : 'Additional instructions...'}
                  value={actionData.notes || ''}
                  onChange={(e) => setActionData({...actionData, notes: e.target.value})}
                  rows={2}
                />
              </div>

              {/* Cost Estimate */}
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      <span className="font-medium">
                        {isSpanish ? 'Costo Estimado:' : 'Estimated Cost:'}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(estimatedCost)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isSpanish 
                      ? 'Basado en el nivel de servicio ' + virtualMailbox.service_tier
                      : 'Based on ' + virtualMailbox.service_tier + ' service tier'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              {isSpanish ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={!selectedAction || isSubmitting || (selectedAction === 'shred' && !actionData.confirmed)}
            >
              {isSubmitting 
                ? (isSpanish ? 'Creando...' : 'Creating...') 
                : (isSpanish ? 'Crear Acción' : 'Create Action')
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}