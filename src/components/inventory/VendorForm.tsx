import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useInventory, type Vendor } from '@/hooks/useInventory';
import { useLanguage } from '@/contexts/LanguageContext';
import { AriaInput } from '@/components/ui/aria-components';

interface VendorFormProps {
  vendor?: Vendor;
  onClose: () => void;
}

export function VendorForm({ vendor, onClose }: VendorFormProps) {
  const { language } = useLanguage();
  const { createVendor, isCreatingVendor } = useInventory();
  const isSpanish = language === 'es';
  const isEditing = !!vendor;

  const [formData, setFormData] = useState({
    name: vendor?.name || '',
    contact_person: vendor?.contact_person || '',
    email: vendor?.email || '',
    phone: vendor?.phone || '',
    address_line1: vendor?.address_line1 || '',
    address_line2: vendor?.address_line2 || '',
    city: vendor?.city || '',
    state: vendor?.state || 'PR',
    zip_code: vendor?.zip_code || '',
    country: vendor?.country || 'US',
    payment_terms: vendor?.payment_terms || 30,
    preferred_payment_method: vendor?.preferred_payment_method || '',
    tax_id: vendor?.tax_id || '',
    notes: vendor?.notes || '',
    is_active: vendor?.is_active ?? true,
  });

  const states = [
    { value: 'PR', label: isSpanish ? 'Puerto Rico' : 'Puerto Rico' },
    { value: 'FL', label: isSpanish ? 'Florida' : 'Florida' },
    { value: 'NY', label: isSpanish ? 'Nueva York' : 'New York' },
    { value: 'TX', label: isSpanish ? 'Texas' : 'Texas' },
    { value: 'CA', label: isSpanish ? 'California' : 'California' },
  ];

  const paymentMethods = [
    { value: 'check', label: isSpanish ? 'Cheque' : 'Check' },
    { value: 'ach', label: isSpanish ? 'ACH/Transferencia' : 'ACH/Wire Transfer' },
    { value: 'credit_card', label: isSpanish ? 'Tarjeta de Crédito' : 'Credit Card' },
    { value: 'cash', label: isSpanish ? 'Efectivo' : 'Cash' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      contact_person: formData.contact_person || null,
      email: formData.email || null,
      phone: formData.phone || null,
      address_line1: formData.address_line1 || null,
      address_line2: formData.address_line2 || null,
      city: formData.city || null,
      zip_code: formData.zip_code || null,
      preferred_payment_method: formData.preferred_payment_method || null,
      tax_id: formData.tax_id || null,
      notes: formData.notes || null,
    };

    if (isEditing) {
      // Update vendor logic would go here
      console.log('Update vendor:', data);
    } else {
      createVendor(data);
    }
    
    onClose();
  };

  const isLoading = isCreatingVendor;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 cq-form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 form-grid-2">
        {/* Left Column - Basic Information */}
        <div className="space-y-4">
          <AriaInput
            label={`${isSpanish ? 'Nombre de la Empresa' : 'Company Name'} *`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: (e.target as HTMLInputElement).value })}
            placeholder={isSpanish ? 'Nombre del proveedor' : 'Vendor name'}
            required
          />

          <AriaInput
            label={isSpanish ? 'Persona de Contacto' : 'Contact Person'}
            value={formData.contact_person}
            onChange={(e) => setFormData({ ...formData, contact_person: (e.target as HTMLInputElement).value })}
            placeholder={isSpanish ? 'Nombre del contacto principal' : 'Primary contact name'}
          />

          <AriaInput
            label={isSpanish ? 'Correo Electrónico' : 'Email'}
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: (e.target as HTMLInputElement).value })}
            placeholder={isSpanish ? 'correo@proveedor.com' : 'email@vendor.com'}
          />

          <AriaInput
            label={isSpanish ? 'Teléfono' : 'Phone'}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: (e.target as HTMLInputElement).value })}
            placeholder={isSpanish ? '787-555-0123' : '787-555-0123'}
          />

          <AriaInput
            label={isSpanish ? 'ID Fiscal/Tax ID' : 'Tax ID'}
            value={formData.tax_id}
            onChange={(e) => setFormData({ ...formData, tax_id: (e.target as HTMLInputElement).value })}
            placeholder={isSpanish ? 'Número de identificación fiscal' : 'Tax identification number'}
          />
        </div>

        {/* Right Column - Address & Payment */}
        <div className="space-y-4">
          <AriaInput
            label={isSpanish ? 'Dirección Línea 1' : 'Address Line 1'}
            value={formData.address_line1}
            onChange={(e) => setFormData({ ...formData, address_line1: (e.target as HTMLInputElement).value })}
            placeholder={isSpanish ? 'Dirección principal' : 'Street address'}
          />

          <AriaInput
            label={isSpanish ? 'Dirección Línea 2' : 'Address Line 2'}
            value={formData.address_line2}
            onChange={(e) => setFormData({ ...formData, address_line2: (e.target as HTMLInputElement).value })}
            placeholder={isSpanish ? 'Apartamento, suite, etc.' : 'Apartment, suite, etc.'}
          />

          <div className="grid grid-cols-2 gap-3 form-grid-2">
              <AriaInput
                label={isSpanish ? 'Ciudad' : 'City'}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: (e.target as HTMLInputElement).value })}
                placeholder={isSpanish ? 'Ciudad' : 'City'}
              />

            <div>
              <Label htmlFor="state">
                {isSpanish ? 'Estado' : 'State'}
              </Label>
              <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <AriaInput
            label={isSpanish ? 'Código Postal' : 'ZIP Code'}
            value={formData.zip_code}
            onChange={(e) => setFormData({ ...formData, zip_code: (e.target as HTMLInputElement).value })}
            placeholder="00918"
          />

          <div className="grid grid-cols-2 gap-3 form-grid-2">
            <AriaInput
              label={isSpanish ? 'Términos de Pago (días)' : 'Payment Terms (days)'}
              type="number"
              min={0}
              value={formData.payment_terms as unknown as string}
              onChange={(e) => setFormData({ ...formData, payment_terms: parseInt((e.target as HTMLInputElement).value) || 30 })}
            />

            <div>
              <Label htmlFor="preferred_payment_method">
                {isSpanish ? 'Método de Pago' : 'Payment Method'}
              </Label>
              <Select value={formData.preferred_payment_method} onValueChange={(value) => setFormData({ ...formData, preferred_payment_method: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={isSpanish ? 'Seleccionar' : 'Select'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    {isSpanish ? 'No especificado' : 'Not specified'}
                  </SelectItem>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">
          {isSpanish ? 'Notas' : 'Notes'}
        </Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder={isSpanish ? 'Notas adicionales sobre el proveedor' : 'Additional notes about the vendor'}
          rows={3}
        />
      </div>

      {/* Status Switch */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          <Label htmlFor="is_active">
            {isSpanish ? 'Proveedor Activo' : 'Active Vendor'}
          </Label>
          <p className="text-xs text-muted-foreground">
            {isSpanish ? 'El proveedor está disponible para órdenes de compra' : 'Vendor is available for purchase orders'}
          </p>
        </div>
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          {isSpanish ? 'Cancelar' : 'Cancel'}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            isSpanish ? 'Guardando...' : 'Saving...'
          ) : isEditing ? (
            isSpanish ? 'Actualizar Proveedor' : 'Update Vendor'
          ) : (
            isSpanish ? 'Crear Proveedor' : 'Create Vendor'
          )}
        </Button>
      </div>
    </form>
  );
}