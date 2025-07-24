import { useState, useRef } from 'react';
import { ArrowLeft, Camera, Scan, Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MobileHeader } from '@/components/MobileHeader';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockCustomers } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

interface PackageIntakeProps {
  onNavigate: (page: string) => void;
}

export default function PackageIntake({ onNavigate }: PackageIntakeProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showScanSuccess, setShowScanSuccess] = useState(false);
  const [packagePhoto, setPackagePhoto] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    trackingNumber: '',
    carrier: '',
    customerId: '',
    packageSize: '',
    specialHandling: false,
  });

  const carriers = ['UPS', 'FedEx', 'USPS', 'DHL', 'Other'];
  const packageSizes = [
    { value: 'Small', label: t('intake.small') },
    { value: 'Medium', label: t('intake.medium') },
    { value: 'Large', label: t('intake.large') },
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Save to localStorage (offline persistence)
    const savedPackages = JSON.parse(localStorage.getItem('prmcms-packages') || '[]');
    const newPackage = {
      id: `PKG${Date.now()}`,
      ...formData,
      receivedAt: new Date().toISOString(),
      status: 'Received',
    };
    
    savedPackages.push(newPackage);
    localStorage.setItem('prmcms-packages', JSON.stringify(savedPackages));

    toast({
      title: t('common.success'),
      description: 'Package received and customer notified',
    });

    // Reset form
    setFormData({
      trackingNumber: '',
      carrier: '',
      customerId: '',
      packageSize: '',
      specialHandling: false,
    });

    setIsLoading(false);
  };

  const simulateBarcodeScan = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      // Simulate barcode scan with random tracking number
      const trackingNumbers = [
        '1Z999AA1234567890',
        '7749912345678901', 
        '9400111202555555551',
        '1234567890123456'
      ];
      const randomTracking = trackingNumbers[Math.floor(Math.random() * trackingNumbers.length)];
      handleInputChange('trackingNumber', randomTracking);
      
      setIsScanning(false);
      setShowScanSuccess(true);
      
      toast({
        title: 'Barcode Scanned',
        description: `Tracking: ${randomTracking}`,
      });

      // Hide success animation after 1 second
      setTimeout(() => setShowScanSuccess(false), 1000);
    }, 2000);
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
      <MobileHeader title={t('intake.title')} showLogout />
      
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
            <CardContent className="p-6">
              {!isScanning && !showScanSuccess ? (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-20 h-20 bg-gradient-ocean rounded-2xl flex items-center justify-center">
                    <Camera className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{t('intake.scanBarcode')}</h3>
                    <p className="text-sm text-muted-foreground">
                      Position barcode within the frame
                    </p>
                  </div>
                  <Button
                    variant="tropical"
                    size="mobile"
                    onClick={simulateBarcodeScan}
                    className="w-full"
                  >
                    <Scan className="h-5 w-5 mr-2" />
                    Scan Barcode
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  {/* Camera Mockup */}
                  <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg relative overflow-hidden border-4 border-primary/20">
                    {/* Camera grid overlay */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                    
                    {/* Scanning frame */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-64 h-32 border-2 rounded-lg relative ${
                        showScanSuccess ? 'border-green-400' : 'border-primary'
                      }`}>
                        {/* Corner indicators */}
                        <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-primary"></div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-primary"></div>
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-primary"></div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-primary"></div>
                        
                        {/* Scanning line animation */}
                        {isScanning && (
                          <div className="absolute top-0 left-0 w-full h-0.5 bg-green-400 shadow-[0_0_10px_#4ade80] animate-bounce"></div>
                        )}
                        
                        {/* Success pulse animation */}
                        {showScanSuccess && (
                          <div className="absolute inset-0 bg-green-400/20 rounded animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    
                    {/* Status text */}
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <p className="text-white font-medium">
                        {isScanning ? 'Scanning...' : showScanSuccess ? 'Success!' : 'Ready to scan'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Cancel button during scanning */}
                  {isScanning && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsScanning(false)}
                      className="absolute top-2 right-2 bg-background/80"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
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
                    value={formData.trackingNumber}
                    onChange={(e) => handleInputChange('trackingNumber', e.target.value)}
                    placeholder="1Z999AA1234567890"
                    className="h-12"
                    required
                  />
                </div>

                {/* Carrier */}
                <div className="space-y-2">
                  <Label>{t('intake.carrier')}</Label>
                  <Select
                    value={formData.carrier}
                    onValueChange={(value) => handleInputChange('carrier', value)}
                    required
                  >
                    <SelectTrigger className="h-12">
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
                </div>

                {/* Customer */}
                <div className="space-y-2">
                  <Label>{t('intake.customer')}</Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={(value) => handleInputChange('customerId', value)}
                    required
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCustomers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} - {customer.mailboxNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Package Size */}
                <div className="space-y-2">
                  <Label>{t('intake.packageSize')}</Label>
                  <Select
                    value={formData.packageSize}
                    onValueChange={(value) => handleInputChange('packageSize', value)}
                    required
                  >
                    <SelectTrigger className="h-12">
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
                    checked={formData.specialHandling}
                    onCheckedChange={(checked) => handleInputChange('specialHandling', checked)}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="mobile"
                  size="mobile"
                  className="w-full"
                  disabled={isLoading}
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