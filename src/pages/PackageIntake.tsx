import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Scan, Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { MobileHeader } from '@/components/MobileHeader';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePackages, type PackageFormData } from '@/hooks/usePackages';
import { useCustomers } from '@/hooks/useCustomers';
import { VipBadge } from '@/components/VipBadge';
import { toast } from '@/hooks/use-toast';
import { BarcodeScanner } from '@/components/scan/BarcodeScanner';

interface PackageIntakeProps {
  onNavigate: (page: string) => void;
}

export default function PackageIntake({ onNavigate }: PackageIntakeProps) {
  const { t } = useLanguage();
  const { createPackage } = usePackages();
  const { customers, loading: customersLoading } = useCustomers();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showScanSuccess, setShowScanSuccess] = useState(false);
  const [packagePhoto, setPackagePhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<PackageFormData>({
    tracking_number: '',
    carrier: 'UPS',
    customer_id: '',
    customer_name: '',
    size: 'Medium',
    special_handling: false,
    weight: '',
    dimensions: '',
    requires_signature: false,
    notes: ''
  });

  const carriers = ['UPS', 'FedEx', 'USPS', 'DHL', 'Other'];
  const packageSizes = [
    { value: 'Small', label: t('intake.small') },
    { value: 'Medium', label: t('intake.medium') },
    { value: 'Large', label: t('intake.large') },
  ];

  // Update customer name when customer is selected
  useEffect(() => {
    if (formData.customer_id) {
      const selectedCustomer = customers.find(c => c.id === formData.customer_id);
      if (selectedCustomer) {
        setFormData(prev => ({
          ...prev,
          customer_name: `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
        }));
      }
    }
  }, [formData.customer_id, customers]);

  const handleInputChange = (field: keyof PackageFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.tracking_number.trim()) {
      newErrors.tracking_number = 'Tracking number is required';
    }
    
    if (!formData.customer_id) {
      newErrors.customer_id = 'Please select a customer';
    }
    
    if (!formData.carrier) {
      newErrors.carrier = 'Please select a carrier';
    }
    
    if (!formData.size) {
      newErrors.size = 'Please select a package size';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: t('common.error'),
        description: 'Please fix the errors in the form',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Submitting package:', formData);
      
      const result = await createPackage(formData);
      
      if (result.success) {
        toast({
          title: t('common.success'),
          description: `Package ${formData.tracking_number} received successfully!`,
        });

        // Reset form
        setFormData({
          tracking_number: '',
          carrier: 'UPS',
          customer_id: '',
          customer_name: '',
          size: 'Medium',
          special_handling: false,
          weight: '',
          dimensions: '',
          requires_signature: false,
          notes: ''
        });
        setErrors({});
        setPackagePhoto(null);
        
      } else {
        toast({
          title: result.error?.includes('queued') ? 'Queued for Sync' : t('common.error'),
          description: result.error || 'Failed to save package',
          variant: result.error?.includes('queued') ? 'default' : 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting package:', error);
      toast({
        title: t('common.error'),
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetected = (code: string) => {
    handleInputChange('tracking_number', code);
    setIsScanning(false);
    setShowScanSuccess(true);
    toast({ title: 'Barcode Scanned', description: `Tracking: ${code}` });
    setTimeout(() => setShowScanSuccess(false), 1000);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPackagePhoto(file);
      toast({
        title: 'Photo Added',
        description: 'Package photo uploaded successfully',
      });
    }
  };

  const removePhoto = () => {
    setPackagePhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <MobileHeader title={t('intake.title')} showLogout onNavigate={onNavigate} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => onNavigate('dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Barcode Scanner Section */}
          <Card className="shadow-elegant">
            <CardContent className="p-6 space-y-4">
              {!isScanning ? (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-20 h-20 bg-gradient-ocean rounded-2xl flex items-center justify-center">
                    <Camera className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{t('intake.scanBarcode')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('intake.positionInFrame') || 'Position barcode within the frame'}
                    </p>
                  </div>
                  <Button
                    variant="tropical"
                    size="mobile"
                    onClick={() => setIsScanning(true)}
                    className="w-full"
                  >
                    <Scan className="h-5 w-5 mr-2" />
                    {t('intake.scan') || 'Scan Barcode'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <BarcodeScanner onDetected={handleDetected} onError={(e) => {
                    console.error('Scanner error', e);
                    toast({ title: t('common.error'), description: 'Camera unavailable' });
                    setIsScanning(false);
                  }} />
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => setIsScanning(false)}>
                      <X className="h-4 w-4 mr-1" /> {t('common.cancel')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Manual Entry Form */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Package Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tracking Number */}
                <div className="space-y-2">
                  <Label htmlFor="tracking">{t('intake.trackingNumber')}</Label>
                  <Input
                    id="tracking"
                    value={formData.tracking_number}
                    onChange={(e) => handleInputChange('tracking_number', e.target.value)}
                    placeholder="1Z999AA1234567890"
                    className={`h-12 ${errors.tracking_number ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.tracking_number && (
                    <p className="text-sm text-red-500">{errors.tracking_number}</p>
                  )}
                </div>

                {/* Carrier */}
                <div className="space-y-2">
                  <Label>{t('intake.carrier')}</Label>
                  <Select
                    value={formData.carrier}
                    onValueChange={(value) => handleInputChange('carrier', value)}
                    required
                  >
                    <SelectTrigger className={`h-12 ${errors.carrier ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select carrier" />
                    </SelectTrigger>
                    <SelectContent>
                      {carriers.map((carrier) => (
                        <SelectItem key={carrier} value={carrier}>
                          {carrier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.carrier && (
                    <p className="text-sm text-red-500">{errors.carrier}</p>
                  )}
                </div>

                {/* Customer */}
                <div className="space-y-2">
                  <Label>{t('intake.customer')}</Label>
                  <Select
                    value={formData.customer_id}
                    onValueChange={(value) => handleInputChange('customer_id', value)}
                    required
                    disabled={customersLoading}
                  >
                    <SelectTrigger className={`h-12 ${errors.customer_id ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder={customersLoading ? "Loading customers..." : "Select customer"} />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{customer.first_name} {customer.last_name} - {customer.mailbox_number}</span>
                            <VipBadge isAct60={customer.act_60_status} size="sm" variant="icon" />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.customer_id && (
                    <p className="text-sm text-red-500">{errors.customer_id}</p>
                  )}
                </div>

                {/* Package Size */}
                <div className="space-y-2">
                  <Label>{t('intake.packageSize')}</Label>
                  <Select
                    value={formData.size}
                    onValueChange={(value) => handleInputChange('size', value)}
                    required
                  >
                    <SelectTrigger className={`h-12 ${errors.size ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {packageSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.size && (
                    <p className="text-sm text-red-500">{errors.size}</p>
                  )}
                </div>

                {/* Weight and Dimensions */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="2.5 lbs"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      value={formData.dimensions}
                      onChange={(e) => handleInputChange('dimensions', e.target.value)}
                      placeholder="12x8x6 in"
                      className="h-12"
                    />
                  </div>
                </div>

                {/* Package Photo */}
                <div className="space-y-2">
                  <Label>Package Photo</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                    {packagePhoto ? (
                      <div className="relative">
                        <div className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg">
                          <Camera className="h-8 w-8 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{packagePhoto.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(packagePhoto.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removePhoto}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-sm font-medium mb-2">Add Package Photo</p>
                        <p className="text-xs text-muted-foreground mb-4">
                          Tap to take a photo or upload from gallery
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Add Photo
                        </Button>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                {/* Special Handling */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="special-handling" className="font-medium">
                      {t('intake.specialHandling')}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Fragile, refrigerated, or special instructions
                    </p>
                  </div>
                  <Switch
                    id="special-handling"
                    checked={formData.special_handling}
                    onCheckedChange={(checked) => handleInputChange('special_handling', checked)}
                  />
                </div>

                {/* Signature Required */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="signature-required" className="font-medium">
                      Signature Required
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Package requires signature for delivery
                    </p>
                  </div>
                  <Switch
                    id="signature-required"
                    checked={formData.requires_signature}
                    onCheckedChange={(checked) => handleInputChange('requires_signature', checked)}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Special instructions or notes..."
                    className="min-h-[80px]"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="mobile"
                  size="mobile"
                  className="w-full"
                  disabled={isLoading || customersLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" text="Processing..." />
                  ) : (
                    t('intake.saveAndNotify')
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}