import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Crown, Star } from 'lucide-react';
import { useCustomers, type CustomerFormData } from '@/hooks/useCustomers';
import { toast } from '@/hooks/use-toast';

interface CustomerFormProps {
  onClose: () => void;
  customerId?: string;
  initialData?: Partial<CustomerFormData>;
}

export function CustomerForm({ onClose, customerId, initialData }: CustomerFormProps) {
  const { createCustomer, updateCustomer } = useCustomers();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<CustomerFormData & {
    act_60_status?: boolean;
    act_60_decree_number?: string;
    act_60_expiration_date?: string;
    priority_notification?: boolean;
    express_handling?: boolean;
    special_pricing_tier?: string;
  }>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    business_name: '',
    mailbox_number: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: 'PR',
    zip_code: '',
    country: 'US',
    customer_type: 'individual',
    notes: '',
    act_60_status: false,
    act_60_decree_number: '',
    act_60_expiration_date: '',
    priority_notification: false,
    express_handling: false,
    special_pricing_tier: '',
    ...initialData,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (customerId) {
        await updateCustomer(customerId, formData);
        toast({
          title: "Customer Updated",
          description: "Customer information has been updated successfully."
        });
      } else {
        await createCustomer(formData);
        toast({
          title: "Customer Created",
          description: "New customer has been added successfully."
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save customer information.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>{customerId ? 'Edit Customer' : 'Add New Customer'}</span>
          {formData.act_60_status && <Crown className="h-5 w-5 text-yellow-600" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => updateFormData('first_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => updateFormData('last_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
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
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => updateFormData('business_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="mailbox_number">Mailbox Number *</Label>
              <Input
                id="mailbox_number"
                value={formData.mailbox_number}
                onChange={(e) => updateFormData('mailbox_number', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Address Information */}
          <Separator />
          <h3 className="text-lg font-semibold">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="state">State</Label>
              <Select value={formData.state} onValueChange={(value) => updateFormData('state', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PR">Puerto Rico</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                </SelectContent>
              </Select>
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
              <Label htmlFor="customer_type">Customer Type</Label>
              <Select value={formData.customer_type} onValueChange={(value) => updateFormData('customer_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Act 60 Information */}
          <Separator />
          <div className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-semibold">Act 60 Premium Status</h3>
          </div>
          
          <div className="space-y-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2">
              <Switch
                id="act_60_status"
                checked={formData.act_60_status}
                onCheckedChange={(checked) => updateFormData('act_60_status', checked)}
              />
              <Label htmlFor="act_60_status" className="font-medium">Act 60 Decree Holder</Label>
            </div>

            {formData.act_60_status && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-down">
                <div>
                  <Label htmlFor="act_60_decree_number">Decree Number</Label>
                  <Input
                    id="act_60_decree_number"
                    value={formData.act_60_decree_number}
                    onChange={(e) => updateFormData('act_60_decree_number', e.target.value)}
                    placeholder="ACT60-2024-001"
                  />
                </div>
                <div>
                  <Label htmlFor="act_60_expiration_date">Expiration Date</Label>
                  <Input
                    id="act_60_expiration_date"
                    type="date"
                    value={formData.act_60_expiration_date}
                    onChange={(e) => updateFormData('act_60_expiration_date', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="special_pricing_tier">Special Pricing Tier</Label>
                  <Select value={formData.special_pricing_tier} onValueChange={(value) => updateFormData('special_pricing_tier', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="priority_notification"
                      checked={formData.priority_notification}
                      onCheckedChange={(checked) => updateFormData('priority_notification', checked)}
                    />
                    <Label htmlFor="priority_notification">24/7 Priority Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="express_handling"
                      checked={formData.express_handling}
                      onCheckedChange={(checked) => updateFormData('express_handling', checked)}
                    />
                    <Label htmlFor="express_handling">Express Package Handling</Label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
              placeholder="Additional customer notes..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (customerId ? 'Update Customer' : 'Create Customer')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}