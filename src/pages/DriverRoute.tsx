import { useState } from 'react';
import { ArrowLeft, MapPin, Phone, Navigation, Camera, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRoutes } from '@/hooks/useRoutes';
import { toast } from '@/hooks/use-toast';

interface Delivery {
  id: string;
  address_line1: string;
  city: string;
  state: string;
  zip_code: string;
  status: string;
  customer_name: string;
  tracking_number: string;
  estimated_time: string;
  notes?: string;
}

interface DriverRouteProps {
  onNavigate: (page: string) => void;
}

export default function DriverRoute({ onNavigate }: DriverRouteProps) {
  const { t } = useLanguage();
  const { routes, updateDeliveryStatus, recordDeliveryAttempt } = useRoutes();
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [showProofDialog, setShowProofDialog] = useState(false);

  // Get today's route for the current driver
  const todayRoute = routes.find(route => 
    route.status === 'in_progress' || route.status === 'planned'
  );

  const deliveries = todayRoute?.deliveries || [];
  const activeDeliveries = deliveries.filter(d => 
    d.status === 'pending' || d.status === 'assigned' || d.status === 'in_transit'
  );

  const handleNavigate = (delivery: Delivery) => {
    const address = `${delivery.address_line1}, ${delivery.city}, ${delivery.state} ${delivery.zip_code}`;
    const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleStartDelivery = async (delivery: Delivery) => {
    const result = await updateDeliveryStatus(delivery.id, 'in_transit');
    if (result.success) {
      toast({
        title: t('Delivery Started'),
        description: t('Delivery is now in transit'),
      });
    } else {
      toast({
        title: t('Error'),
        description: result.error || t('Failed to start delivery'),
        variant: 'destructive',
      });
    }
  };

  const handleCompleteDelivery = async (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowProofDialog(true);
  };

  const handleConfirmDelivery = async () => {
    if (!selectedDelivery) return;

    const proofData = {
      timestamp: new Date().toISOString(),
      notes: deliveryNotes,
      // In a real app, this would include signature and photo data
      signature: 'digital_signature_placeholder',
      photo: 'delivery_photo_placeholder'
    };

    const result = await updateDeliveryStatus(
      selectedDelivery.id, 
      'delivered', 
      deliveryNotes,
      proofData
    );

    if (result.success) {
      await recordDeliveryAttempt(selectedDelivery.id, 'delivered', undefined, deliveryNotes);
      
      toast({
        title: t('Delivery Completed'),
        description: t('Package has been successfully delivered'),
      });
      
      setShowProofDialog(false);
      setSelectedDelivery(null);
      setDeliveryNotes('');
    } else {
      toast({
        title: t('Error'),
        description: result.error || t('Failed to complete delivery'),
        variant: 'destructive',
      });
    }
  };

  const handleFailedDelivery = async (delivery: Delivery) => {
    const reason = prompt(t('Enter failure reason:'));
    if (!reason) return;

    const result = await recordDeliveryAttempt(delivery.id, 'failed', reason);
    
    if (result.success) {
      toast({
        title: t('Delivery Attempt Recorded'),
        description: t('Failed delivery has been logged'),
      });
    } else {
      toast({
        title: t('Error'),
        description: result.error || t('Failed to record delivery attempt'),
        variant: 'destructive',
      });
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-primary-palm';
      case 'in_transit': return 'bg-primary-sunrise';
      case 'failed': return 'bg-coral';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return t('Pending');
      case 'assigned': return t('Assigned');
      case 'in_transit': return t('In Transit');
      case 'delivered': return t('Delivered');
      case 'failed': return t('Failed');
      default: return status;
    }
  };

  if (!todayRoute) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">{t('No Route Assigned')}</div>
          <p className="text-muted-foreground mb-6">{t('You don\'t have any delivery routes assigned for today')}</p>
          <Button onClick={() => onNavigate('dashboard')}>
            {t('Back to Dashboard')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-optimized header */}
      <div className="bg-primary text-white p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('dashboard')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">{todayRoute.name}</h1>
              <div className="text-sm opacity-90">
                {activeDeliveries.length} {t('deliveries remaining')}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm opacity-90">{t('Progress')}</div>
            <div className="text-lg font-bold">
              {todayRoute.completed_stops || 0}/{todayRoute.total_stops || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery list */}
      <div className="p-4 space-y-4 pb-20">
        {activeDeliveries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-2xl font-bold text-primary-palm mb-2">
                🎉 {t('All Deliveries Complete!')}
              </div>
              <p className="text-muted-foreground">
                {t('Great job! You\'ve completed all deliveries for today.')}
              </p>
            </CardContent>
          </Card>
        ) : (
          activeDeliveries.map((delivery, index) => (
            <Card key={delivery.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      {delivery.customer?.first_name} {delivery.customer?.last_name}
                    </CardTitle>
                    <div className="mt-2">
                      <Badge className={getDeliveryStatusColor(delivery.status)}>
                        {getStatusLabel(delivery.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  {delivery.priority && delivery.priority > 1 && (
                    <Badge variant="destructive">
                      {t('High Priority')}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">{delivery.address_line1}</div>
                    {delivery.address_line2 && (
                      <div className="text-sm text-muted-foreground">{delivery.address_line2}</div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      {delivery.city}, {delivery.state} {delivery.zip_code}
                    </div>
                  </div>
                </div>

                {/* Contact */}
                {delivery.customer?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <a 
                      href={`tel:${delivery.customer.phone}`}
                      className="text-primary font-medium"
                    >
                      {delivery.customer.phone}
                    </a>
                  </div>
                )}

                {/* Package info */}
                {delivery.package && (
                  <div className="bg-accent/50 rounded-lg p-3">
                    <div className="text-sm font-medium">{t('Package')}: {delivery.package.tracking_number}</div>
                    <div className="text-sm text-muted-foreground">{delivery.package.customer_name}</div>
                  </div>
                )}

                {/* Special instructions */}
                {delivery.special_instructions && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                    <div className="text-sm font-medium text-yellow-800">{t('Special Instructions')}</div>
                    <div className="text-sm text-yellow-700">{delivery.special_instructions}</div>
                  </div>
                )}

                {/* Delivery window */}
                {(delivery.delivery_window_start || delivery.delivery_window_end) && (
                  <div className="text-sm text-muted-foreground">
                    {t('Delivery window')}: {delivery.delivery_window_start} - {delivery.delivery_window_end}
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-1 gap-3 pt-2">
                  <Button 
                    size="lg" 
                    className="w-full" 
                    onClick={() => handleNavigate(delivery)}
                  >
                    <Navigation className="h-5 w-5 mr-2" />
                    {t('Navigate')}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {delivery.status === 'pending' || delivery.status === 'assigned' ? (
                      <Button 
                        size="lg" 
                        variant="outline" 
                        onClick={() => handleStartDelivery(delivery)}
                        className="w-full"
                      >
                        {t('Start Delivery')}
                      </Button>
                    ) : null}
                    
                    {delivery.status === 'in_transit' && (
                      <>
                        <Button 
                          size="lg" 
                          onClick={() => handleCompleteDelivery(delivery)}
                          className="w-full bg-primary-palm hover:bg-primary-palm/90"
                        >
                          {t('Complete')}
                        </Button>
                        <Button 
                          size="lg" 
                          variant="destructive" 
                          onClick={() => handleFailedDelivery(delivery)}
                          className="w-full"
                        >
                          {t('Failed')}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delivery proof dialog */}
      <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>{t('Confirm Delivery')}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {t('Please provide delivery confirmation for')}:
            </div>
            
            {selectedDelivery && (
              <div className="bg-accent/50 rounded-lg p-3">
                <div className="font-medium">
                  {selectedDelivery.customer?.first_name} {selectedDelivery.customer?.last_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedDelivery.address_line1}, {selectedDelivery.city}
                </div>
              </div>
            )}

            {/* Photo capture placeholder */}
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                {t('Take photo proof')}
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                <Camera className="h-4 w-4 mr-2" />
                {t('Capture Photo')}
              </Button>
            </div>

            {/* Signature placeholder */}
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                {t('Customer signature')}
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                <FileText className="h-4 w-4 mr-2" />
                {t('Get Signature')}
              </Button>
            </div>

            {/* Delivery notes */}
            <div>
              <label className="text-sm font-medium">{t('Delivery Notes')}</label>
              <Textarea
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder={t('Add any delivery notes...')}
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowProofDialog(false)}
                className="flex-1"
              >
                {t('Cancel')}
              </Button>
              <Button 
                onClick={handleConfirmDelivery}
                className="flex-1"
              >
                {t('Confirm Delivery')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}