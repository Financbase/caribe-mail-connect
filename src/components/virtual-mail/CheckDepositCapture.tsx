import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, DollarSign, Check, AlertCircle, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVirtualMailbox } from '@/hooks/useVirtualMailbox';
import { useCamera } from '@/hooks/useCamera';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CachedImage } from '@/components/offline/CachedImage';

export function CheckDepositCapture() {
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  const { toast } = useToast();
  
  const { checkDeposits, createCheckDeposit, loading } = useVirtualMailbox();
  const { takePhoto } = useCamera();
  const cameraSupported = true; // Assume camera is supported for now

  const [showCaptureDialog, setShowCaptureDialog] = useState(false);
  const [checkData, setCheckData] = useState({
    amount: '',
    checkNumber: '',
    bankName: '',
    checkDate: '',
  });
  const [frontImage, setFrontImage] = useState<string>('');
  const [backImage, setBackImage] = useState<string>('');
  const [currentSide, setCurrentSide] = useState<'front' | 'back'>('front');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (side === 'front') {
          setFrontImage(result);
        } else {
          setBackImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async (side: 'front' | 'back') => {
    if (!cameraSupported) {
      toast({
        title: isSpanish ? 'Cámara no disponible' : 'Camera not available',
        description: isSpanish ? 'Use la opción de cargar archivo' : 'Please use file upload option',
        variant: 'destructive',
      });
      return;
    }

    try {
      const photo = await takePhoto();
      const imageData = 'data:image/jpeg;base64,placeholder'; // Placeholder for demo
      if (side === 'front') {
        setFrontImage(imageData);
      } else {
        setBackImage(imageData);
      }
      
      toast({
        title: isSpanish ? 'Foto capturada' : 'Photo captured',
        description: isSpanish ? `Lado ${side === 'front' ? 'frontal' : 'trasero'} capturado` : `${side} side captured`,
      });
    } catch (error) {
      console.error('Camera capture error:', error);
      toast({
        title: isSpanish ? 'Error de cámara' : 'Camera error',
        description: isSpanish ? 'No se pudo capturar la foto' : 'Failed to capture photo',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async () => {
    if (!frontImage || !backImage || !checkData.amount) {
      toast({
        title: isSpanish ? 'Datos incompletos' : 'Incomplete data',
        description: isSpanish ? 'Complete todos los campos requeridos' : 'Please complete all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // In a real implementation, you would upload images to storage first
      await createCheckDeposit({
        customer_id: 'temp-customer-id', // Would be selected customer
        amount: parseFloat(checkData.amount),
        check_number: checkData.checkNumber,
        bank_name: checkData.bankName,
        check_date: checkData.checkDate || undefined,
        front_image_url: frontImage, // Would be storage URL
        back_image_url: backImage, // Would be storage URL
        status: 'captured',
        deposit_method: 'mobile',
      });

      // Reset form
      setShowCaptureDialog(false);
      setCheckData({ amount: '', checkNumber: '', bankName: '', checkDate: '' });
      setFrontImage('');
      setBackImage('');
      
    } catch (error) {
      console.error('Error submitting check deposit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      captured: { label: isSpanish ? 'Capturado' : 'Captured', variant: 'secondary' as const },
      processing: { label: isSpanish ? 'Procesando' : 'Processing', variant: 'default' as const },
      approved: { label: isSpanish ? 'Aprobado' : 'Approved', variant: 'default' as const },
      rejected: { label: isSpanish ? 'Rechazado' : 'Rejected', variant: 'destructive' as const },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.captured;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              {isSpanish ? 'Depósito de Cheques' : 'Check Deposits'}
            </CardTitle>
            <Button onClick={() => setShowCaptureDialog(true)}>
              <Camera className="h-4 w-4 mr-2" />
              {isSpanish ? 'Nuevo Depósito' : 'New Deposit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {checkDeposits.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {isSpanish ? 'No hay depósitos' : 'No deposits'}
              </h3>
              <p className="text-muted-foreground">
                {isSpanish 
                  ? 'Los depósitos de cheques aparecerán aquí'
                  : 'Check deposits will appear here'
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{isSpanish ? 'Fecha' : 'Date'}</TableHead>
                  <TableHead>{isSpanish ? 'Número' : 'Check #'}</TableHead>
                  <TableHead>{isSpanish ? 'Banco' : 'Bank'}</TableHead>
                  <TableHead>{isSpanish ? 'Monto' : 'Amount'}</TableHead>
                  <TableHead>{isSpanish ? 'Estado' : 'Status'}</TableHead>
                  <TableHead>{isSpanish ? 'Acciones' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checkDeposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell>
                      {formatDate(deposit.created_at)}
                    </TableCell>
                    
                    <TableCell>
                      {deposit.check_number || 'N/A'}
                    </TableCell>
                    
                    <TableCell>
                      {deposit.bank_name || 'Unknown'}
                    </TableCell>
                    
                    <TableCell className="font-medium">
                      {formatCurrency(deposit.amount)}
                    </TableCell>
                    
                    <TableCell>
                      {getStatusBadge(deposit.status)}
                    </TableCell>
                    
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        {isSpanish ? 'Ver' : 'View'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Capture Dialog */}
      <Dialog open={showCaptureDialog} onOpenChange={setShowCaptureDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isSpanish ? 'Capturar Depósito de Cheque' : 'Capture Check Deposit'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Check Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  {isSpanish ? 'Información del Cheque' : 'Check Information'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">
                      {isSpanish ? 'Monto' : 'Amount'} *
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={checkData.amount}
                      onChange={(e) => setCheckData({...checkData, amount: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="checkNumber">
                      {isSpanish ? 'Número de Cheque' : 'Check Number'}
                    </Label>
                    <Input
                      id="checkNumber"
                      placeholder={isSpanish ? 'Ej: 1234' : 'e.g. 1234'}
                      value={checkData.checkNumber}
                      onChange={(e) => setCheckData({...checkData, checkNumber: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bankName">
                      {isSpanish ? 'Banco' : 'Bank Name'}
                    </Label>
                    <Input
                      id="bankName"
                      placeholder={isSpanish ? 'Nombre del banco' : 'Bank name'}
                      value={checkData.bankName}
                      onChange={(e) => setCheckData({...checkData, bankName: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="checkDate">
                      {isSpanish ? 'Fecha del Cheque' : 'Check Date'}
                    </Label>
                    <Input
                      id="checkDate"
                      type="date"
                      value={checkData.checkDate}
                      onChange={(e) => setCheckData({...checkData, checkDate: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image Capture */}
            <div className="grid grid-cols-2 gap-6">
              {/* Front Side */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    {isSpanish ? 'Frente del Cheque' : 'Front of Check'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {frontImage ? (
                    <div className="space-y-2">
                      <CachedImage
                        src={frontImage}
                        alt="Front of check"
                        className="w-full h-32 object-cover rounded border"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFrontImage('')}
                        className="w-full"
                      >
                        {isSpanish ? 'Retomar' : 'Retake'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-full h-32 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        {cameraSupported && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCameraCapture('front')}
                            className="w-full"
                          >
                            <Camera className="h-3 w-3 mr-1" />
                            {isSpanish ? 'Usar Cámara' : 'Use Camera'}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => frontInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          {isSpanish ? 'Subir Archivo' : 'Upload File'}
                        </Button>
                        <input
                          ref={frontInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'front')}
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Back Side */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    {isSpanish ? 'Reverso del Cheque' : 'Back of Check'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {backImage ? (
                    <div className="space-y-2">
                      <CachedImage
                        src={backImage}
                        alt="Back of check"
                        className="w-full h-32 object-cover rounded border"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setBackImage('')}
                        className="w-full"
                      >
                        {isSpanish ? 'Retomar' : 'Retake'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-full h-32 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        {cameraSupported && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCameraCapture('back')}
                            className="w-full"
                          >
                            <Camera className="h-3 w-3 mr-1" />
                            {isSpanish ? 'Usar Cámara' : 'Use Camera'}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => backInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          {isSpanish ? 'Subir Archivo' : 'Upload File'}
                        </Button>
                        <input
                          ref={backInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'back')}
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">
                  {isSpanish ? 'Importante' : 'Important'}
                </p>
                <p className="text-amber-700">
                  {isSpanish 
                    ? 'Asegúrese de que ambas imágenes sean claras y legibles. Los depósitos con imágenes borrosas pueden ser rechazados.'
                    : 'Make sure both images are clear and legible. Deposits with blurry images may be rejected.'
                  }
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowCaptureDialog(false)} className="flex-1">
                {isSpanish ? 'Cancelar' : 'Cancel'}
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="flex-1"
                disabled={!frontImage || !backImage || !checkData.amount || isSubmitting}
              >
                {isSubmitting 
                  ? (isSpanish ? 'Procesando...' : 'Processing...') 
                  : (isSpanish ? 'Enviar Depósito' : 'Submit Deposit')
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}