import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useInventory } from '@/hooks/useInventory';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocations } from '@/hooks/useLocations';

interface MovementFormProps {
  onClose: () => void;
}

export function MovementForm({ onClose }: MovementFormProps) {
  const { language } = useLanguage();
  const { inventoryItems, recordMovement, isRecordingMovement } = useInventory();
  const { locations } = useLocations();
  const isSpanish = language === 'es';

  const [formData, setFormData] = useState({
    item_id: '',
    location_id: '',
    movement_type: 'adjustment',
    quantity_change: 0,
    unit_cost: '',
    reason_code: '',
    notes: '',
  });

  const movementTypes = [
    { value: 'receipt', label: isSpanish ? 'Recepción' : 'Receipt' },
    { value: 'usage', label: isSpanish ? 'Uso' : 'Usage' },
    { value: 'adjustment', label: isSpanish ? 'Ajuste' : 'Adjustment' },
    { value: 'transfer_in', label: isSpanish ? 'Transferencia Entrada' : 'Transfer In' },
    { value: 'transfer_out', label: isSpanish ? 'Transferencia Salida' : 'Transfer Out' },
    { value: 'count', label: isSpanish ? 'Conteo Físico' : 'Physical Count' },
  ];

  const reasonCodes = [
    { value: 'damage', label: isSpanish ? 'Daño' : 'Damage' },
    { value: 'expired', label: isSpanish ? 'Expirado' : 'Expired' },
    { value: 'lost', label: isSpanish ? 'Perdido' : 'Lost' },
    { value: 'found', label: isSpanish ? 'Encontrado' : 'Found' },
    { value: 'correction', label: isSpanish ? 'Corrección' : 'Correction' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const movementData = {
      ...formData,
      unit_cost: formData.unit_cost ? parseFloat(formData.unit_cost) : undefined,
      reason_code: formData.reason_code || undefined,
      notes: formData.notes || undefined,
    };

    recordMovement(movementData);
    onClose();
  };

  const selectedItem = inventoryItems.find(item => item.id === formData.item_id);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="item_id">
              {isSpanish ? 'Artículo' : 'Item'} *
            </Label>
            <Select value={formData.item_id} onValueChange={(value) => setFormData({ ...formData, item_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder={isSpanish ? 'Seleccionar artículo' : 'Select item'} />
              </SelectTrigger>
              <SelectContent>
                {inventoryItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.sku}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location_id">
              {isSpanish ? 'Ubicación' : 'Location'} *
            </Label>
            <Select value={formData.location_id} onValueChange={(value) => setFormData({ ...formData, location_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder={isSpanish ? 'Seleccionar ubicación' : 'Select location'} />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="movement_type">
              {isSpanish ? 'Tipo de Movimiento' : 'Movement Type'} *
            </Label>
            <Select value={formData.movement_type} onValueChange={(value) => setFormData({ ...formData, movement_type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {movementTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="quantity_change">
              {isSpanish ? 'Cambio de Cantidad' : 'Quantity Change'} *
            </Label>
            <Input
              id="quantity_change"
              type="number"
              value={formData.quantity_change}
              onChange={(e) => setFormData({ ...formData, quantity_change: parseInt(e.target.value) || 0 })}
              placeholder={isSpanish ? 'Positivo para aumento, negativo para reducción' : 'Positive for increase, negative for decrease'}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {selectedItem && (
                <>
                  {isSpanish ? 'Unidad:' : 'Unit:'} {selectedItem.unit_of_measure}
                </>
              )}
            </p>
          </div>

          <div>
            <Label htmlFor="unit_cost">
              {isSpanish ? 'Costo Unitario' : 'Unit Cost'} ($)
            </Label>
            <Input
              id="unit_cost"
              type="number"
              min="0"
              step="0.01"
              value={formData.unit_cost}
              onChange={(e) => setFormData({ ...formData, unit_cost: e.target.value })}
              placeholder={isSpanish ? 'Opcional' : 'Optional'}
            />
          </div>

          {formData.movement_type === 'adjustment' && (
            <div>
              <Label htmlFor="reason_code">
                {isSpanish ? 'Razón del Ajuste' : 'Adjustment Reason'}
              </Label>
              <Select value={formData.reason_code} onValueChange={(value) => setFormData({ ...formData, reason_code: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={isSpanish ? 'Seleccionar razón' : 'Select reason'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    {isSpanish ? 'Ninguna' : 'None'}
                  </SelectItem>
                  {reasonCodes.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
          placeholder={isSpanish ? 'Notas adicionales sobre el movimiento' : 'Additional notes about the movement'}
          rows={3}
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          {isSpanish ? 'Cancelar' : 'Cancel'}
        </Button>
        <Button type="submit" disabled={isRecordingMovement || !formData.item_id || !formData.location_id}>
          {isRecordingMovement ? (
            isSpanish ? 'Registrando...' : 'Recording...'
          ) : (
            isSpanish ? 'Registrar Movimiento' : 'Record Movement'
          )}
        </Button>
      </div>
    </form>
  );
}