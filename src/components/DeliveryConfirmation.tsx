import { useState } from 'react';
import { CheckCircle, Package, User, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { Package as PackageType, Customer } from '@/data/mockData';

interface DeliveryConfirmationProps {
  package: PackageType;
  customer: Customer;
  onConfirmDelivery: (packageId: string, notes?: string) => void;
}

const DeliveryConfirmation = ({ package: pkg, customer, onConfirmDelivery }: DeliveryConfirmationProps) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [customerSignature, setCustomerSignature] = useState('');

  const handleConfirmDelivery = () => {
    if (!customerSignature.trim()) {
      toast({
        title: language === 'en' ? 'Signature required' : 'Firma requerida',
        description: language === 'en' 
          ? 'Please enter customer name for confirmation'
          : 'Por favor ingresa el nombre del cliente para confirmación',
        variant: 'destructive'
      });
      return;
    }

    onConfirmDelivery(pkg.id, notes);
    
    // Show delivery confirmation notification
    toast({
      title: language === 'en' ? 'Package delivered' : 'Paquete entregado',
      description: language === 'en' 
        ? `Package ${pkg.trackingNumber} delivered to ${customer.name}`
        : `Paquete ${pkg.trackingNumber} entregado a ${customer.name}`
    });

    // Simulate sending delivery confirmation notification
    setTimeout(() => {
      toast({
        title: language === 'en' ? 'Notification sent' : 'Notificación enviada',
        description: language === 'en' 
          ? 'Delivery confirmation sent to customer'
          : 'Confirmación de entrega enviada al cliente'
      });
    }, 1000);

    setIsOpen(false);
    setNotes('');
    setCustomerSignature('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <CheckCircle className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Confirm Delivery' : 'Confirmar Entrega'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {language === 'en' ? 'Delivery Confirmation' : 'Confirmación de Entrega'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? 'Confirm package pickup and send notification to customer'
              : 'Confirma la recogida del paquete y envía notificación al cliente'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Package Details */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Tracking Number' : 'Número de Seguimiento'}
                </span>
                <Badge variant="outline">{pkg.trackingNumber}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Customer' : 'Cliente'}
                </span>
                <span className="text-sm font-medium">{customer.name}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Mailbox' : 'Casillero'}
                </span>
                <span className="text-sm font-medium">{customer.mailboxNumber}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Carrier' : 'Transportista'}
                </span>
                <span className="text-sm font-medium">{pkg.carrier}</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Time */}
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {language === 'en' ? 'Delivery Time:' : 'Hora de Entrega:'} {new Date().toLocaleString()}
            </span>
          </div>

          {/* Customer Signature */}
          <div className="space-y-2">
            <Label htmlFor="signature">
              {language === 'en' ? 'Customer Name (Confirmation)' : 'Nombre del Cliente (Confirmación)'}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="signature"
              value={customerSignature}
              onChange={(e) => setCustomerSignature(e.target.value)}
              placeholder={language === 'en' ? 'Enter customer name...' : 'Ingresa nombre del cliente...'}
            />
            <p className="text-xs text-muted-foreground">
              {language === 'en' 
                ? 'This confirms the customer received the package'
                : 'Esto confirma que el cliente recibió el paquete'}
            </p>
          </div>

          {/* Delivery Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              {language === 'en' ? 'Delivery Notes (Optional)' : 'Notas de Entrega (Opcional)'}
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'en' 
                ? 'Add any delivery notes...' 
                : 'Agrega notas de entrega...'}
              rows={3}
            />
          </div>

          {/* Notification Preview */}
          <div className="p-3 bg-primary/10 rounded-lg">
            <h4 className="font-medium text-sm mb-2">
              📬 {language === 'en' ? 'Notification Preview' : 'Vista Previa de Notificación'}
            </h4>
            <p className="text-sm text-muted-foreground">
              {customer.notificationPreferences.language === 'es' 
                ? `¡Hola ${customer.name}! Tu paquete ${pkg.trackingNumber} ha sido entregado exitosamente. ¡Gracias por elegirnos!`
                : `Hi ${customer.name}! Your package ${pkg.trackingNumber} has been delivered successfully. Thanks for choosing us!`
              }
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              {language === 'en' ? 'Will be sent via:' : 'Se enviará por:'} {
                Object.entries(customer.notificationPreferences)
                  .filter(([key, value]) => key !== 'language' && value)
                  .map(([key]) => key === 'sms' ? 'SMS' : key === 'email' ? 'Email' : 'WhatsApp')
                  .join(', ')
              }
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              {language === 'en' ? 'Cancel' : 'Cancelar'}
            </Button>
            <Button
              onClick={handleConfirmDelivery}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Confirm & Notify' : 'Confirmar y Notificar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryConfirmation;