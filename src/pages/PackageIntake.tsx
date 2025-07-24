import { useState } from 'react';
import { ArrowLeft, Camera, Scan } from 'lucide-react';
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
    // Simulate barcode scan with random tracking number
    const trackingNumbers = [
      '1Z999AA1234567890',
      '7749912345678901', 
      '9400111202555555551',
      '1234567890123456'
    ];
    const randomTracking = trackingNumbers[Math.floor(Math.random() * trackingNumbers.length)];
    handleInputChange('trackingNumber', randomTracking);
    
    toast({
      title: 'Barcode Scanned',
      description: `Tracking: ${randomTracking}`,
    });
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
                  Simulate Scan
                </Button>
              </div>
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