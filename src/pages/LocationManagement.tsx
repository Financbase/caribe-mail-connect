import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Plus, 
  Edit, 
  Users, 
  Settings,
  ArrowLeft 
} from 'lucide-react';
import { useLocations, type LocationFormData } from '@/hooks/useLocations';
import { toast } from '@/hooks/use-toast';

interface Location {
  id: string;
  name: string;
  code: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone?: string;
  email?: string;
  is_primary: boolean;
  status: string;
  operating_hours?: Record<string, { open?: string; close?: string; closed?: boolean }>;
  services_offered?: string[];
  pricing_tier?: string;
  notes?: string;
}

interface LocationManagementProps {
  onNavigate: (page: string) => void;
}

export default function LocationManagement({ onNavigate }: LocationManagementProps) {
  const { locations, createLocation, updateLocation, loading } = useLocations();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<LocationFormData>({
    name: '',
    code: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: 'PR',
    zip_code: '',
    country: 'US',
    phone: '',
    email: '',
    is_primary: false,
    status: 'active',
    operating_hours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '18:00' },
      saturday: { open: '09:00', close: '14:00' },
      sunday: { closed: true }
    },
    services_offered: [],
    pricing_tier: 'standard',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: 'PR',
      zip_code: '',
      country: 'US',
      phone: '',
      email: '',
      is_primary: false,
      status: 'active',
      operating_hours: {
        monday: { open: '08:00', close: '18:00' },
        tuesday: { open: '08:00', close: '18:00' },
        wednesday: { open: '08:00', close: '18:00' },
        thursday: { open: '08:00', close: '18:00' },
        friday: { open: '08:00', close: '18:00' },
        saturday: { open: '09:00', close: '14:00' },
        sunday: { closed: true }
      },
      services_offered: [],
      pricing_tier: 'standard',
      notes: ''
    });
  };

  const handleEdit = (location: Location) => {
    setFormData({
      name: location.name,
      code: location.code,
      address_line1: location.address_line1,
      address_line2: location.address_line2 || '',
      city: location.city,
      state: location.state,
      zip_code: location.zip_code,
      country: location.country,
      phone: location.phone || '',
      email: location.email || '',
      is_primary: location.is_primary,
      status: location.status,
      operating_hours: location.operating_hours || {},
      services_offered: location.services_offered || [],
      pricing_tier: location.pricing_tier || 'standard',
      notes: location.notes || ''
    });
    setSelectedLocation(location.id);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedLocation) {
        await updateLocation(selectedLocation, formData);
        toast({
          title: "Location Updated",
          description: "Location has been updated successfully."
        });
      } else {
        await createLocation(formData);
        toast({
          title: "Location Created",
          description: "New location has been added successfully."
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      setIsEditing(false);
      setSelectedLocation(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save location.",
        variant: "destructive"
      });
    }
  };

  const updateFormData = (field: string, value: string | boolean | string[] | Record<string, unknown>) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatOperatingHours = (hours: Record<string, { open?: string; close?: string; closed?: boolean }>) => {
    if (!hours) return 'Not set';
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const today = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]; // Adjust for Sunday = 0
    const todayHours = hours[today];
    
    if (todayHours?.closed) return 'Closed today';
    if (todayHours?.open && todayHours?.close) {
      return `Today: ${todayHours.open} - ${todayHours.close}`;
    }
    
    return 'Hours not set';
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Location Management</h1>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsEditing(false); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Location' : 'Add New Location'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="hours">Operating Hours</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Location Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="code">Location Code *</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => updateFormData('code', e.target.value.toUpperCase())}
                        placeholder="SJ01"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address_line1">Address Line 1 *</Label>
                      <Input
                        id="address_line1"
                        value={formData.address_line1}
                        onChange={(e) => updateFormData('address_line1', e.target.value)}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address_line2">Address Line 2</Label>
                      <Input
                        id="address_line2"
                        value={formData.address_line2}
                        onChange={(e) => updateFormData('address_line2', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateFormData('city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip_code">ZIP Code *</Label>
                      <Input
                        id="zip_code"
                        value={formData.zip_code}
                        onChange={(e) => updateFormData('zip_code', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_primary"
                        checked={formData.is_primary}
                        onCheckedChange={(checked) => updateFormData('is_primary', checked)}
                      />
                      <Label htmlFor="is_primary">Primary Location</Label>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="hours" className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p>Operating hours configuration coming soon</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="services" className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p>Services configuration coming soon</p>
                  </div>
                </TabsContent>
              </Tabs>
              
              <Separator />
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update Location' : 'Create Location'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <Card key={location.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-primary" />
                  <span>{location.name}</span>
                  {location.is_primary && <Star className="h-4 w-4 text-yellow-500" />}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(location)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{location.code}</Badge>
                <Badge 
                  variant={location.status === 'active' ? 'default' : 'secondary'}
                >
                  {location.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  <p>{location.address_line1}</p>
                  {location.address_line2 && <p>{location.address_line2}</p>}
                  <p>{location.city}, {location.state} {location.zip_code}</p>
                </div>
              </div>
              
              {location.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{location.phone}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{formatOperatingHours(location.operating_hours)}</span>
              </div>
              
              {location.services_offered && location.services_offered.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {location.services_offered.slice(0, 3).map((service) => (
                    <Badge key={service} variant="outline" className="text-xs">
                      {service.replace('_', ' ')}
                    </Badge>
                  ))}
                  {location.services_offered.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{location.services_offered.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {locations.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No locations found</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first location</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>
      )}
    </div>
  );
}