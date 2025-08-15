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
import { useInventory, type InventoryItem } from '@/hooks/useInventory';
import { useLanguage } from '@/contexts/LanguageContext';
import { AriaInput } from '@/components/ui/aria-components';

interface ItemFormProps {
  item?: InventoryItem;
  onClose: () => void;
}

export function ItemForm({ item, onClose }: ItemFormProps) {
  const { language } = useLanguage();
  const { createItem, updateItem, vendors, isCreatingItem, isUpdatingItem } = useInventory();
  const isSpanish = language === 'es';
  const isEditing = !!item;

  const [formData, setFormData] = useState({
    sku: item?.sku || '',
    name: item?.name || '',
    description: item?.description || '',
    category: item?.category || 'shipping_supplies',
    unit_of_measure: item?.unit_of_measure || 'each',
    barcode: item?.barcode || '',
    min_stock_level: item?.min_stock_level || 0,
    max_stock_level: item?.max_stock_level || null,
    reorder_point: item?.reorder_point || 0,
    preferred_vendor_id: item?.preferred_vendor_id || '',
    standard_cost: item?.standard_cost || 0,
    is_active: item?.is_active ?? true,
    is_consumable: item?.is_consumable ?? true,
  });

  const categories = [
    { value: 'shipping_supplies', label: isSpanish ? 'Suministros de Envío' : 'Shipping Supplies' },
    { value: 'office_supplies', label: isSpanish ? 'Suministros de Oficina' : 'Office Supplies' },
    { value: 'cleaning_supplies', label: isSpanish ? 'Suministros de Limpieza' : 'Cleaning Supplies' },
    { value: 'safety_equipment', label: isSpanish ? 'Equipo de Seguridad' : 'Safety Equipment' },
    { value: 'labels', label: isSpanish ? 'Etiquetas' : 'Labels' },
  ];

  const units = [
    { value: 'each', label: isSpanish ? 'Unidad' : 'Each' },
    { value: 'box', label: isSpanish ? 'Caja' : 'Box' },
    { value: 'pack', label: isSpanish ? 'Paquete' : 'Pack' },
    { value: 'roll', label: isSpanish ? 'Rollo' : 'Roll' },
    { value: 'sheet', label: isSpanish ? 'Hoja' : 'Sheet' },
    { value: 'bottle', label: isSpanish ? 'Botella' : 'Bottle' },
    { value: 'case', label: isSpanish ? 'Estuche' : 'Case' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      preferred_vendor_id: formData.preferred_vendor_id || null,
      max_stock_level: formData.max_stock_level || null,
    };

    if (isEditing) {
      updateItem({ id: item.id, ...data });
    } else {
      createItem(data);
    }
    
    onClose();
  };

  const isLoading = isCreatingItem || isUpdatingItem;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 cq-form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 form-grid-2">
        {/* Basic Information */}
        <div className="space-y-4">
          <AriaInput
            label={`${isSpanish ? 'SKU' : 'SKU'} *`}
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: (e.target as HTMLInputElement).value })}
            placeholder={isSpanish ? 'Ej: BOX-SM-001' : 'e.g., BOX-SM-001'}
            required
            disabled={isEditing}
          />

          <AriaInput
            label={`${isSpanish ? 'Nombre' : 'Name'} *`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: (e.target as HTMLInputElement).value })}
            placeholder={isSpanish ? 'Nombre del artículo' : 'Item name'}
            required
          />

          <div>
            <Label htmlFor="description">
              {isSpanish ? 'Descripción' : 'Description'}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={isSpanish ? 'Descripción detallada del artículo' : 'Detailed item description'}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">
              {isSpanish ? 'Categoría' : 'Category'} *
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="unit_of_measure">
              {isSpanish ? 'Unidad de Medida' : 'Unit of Measure'} *
            </Label>
            <Select value={formData.unit_of_measure} onValueChange={(value) => setFormData({ ...formData, unit_of_measure: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AriaInput
            label={isSpanish ? 'Código de Barras' : 'Barcode'}
            value={formData.barcode}
            onChange={(e) => setFormData({ ...formData, barcode: (e.target as HTMLInputElement).value })}
            placeholder={isSpanish ? 'Código de barras opcional' : 'Optional barcode'}
          />
        </div>

        {/* Inventory Settings */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 form-grid-2">
            <AriaInput
              label={isSpanish ? 'Stock Mínimo' : 'Min Stock Level'}
              type="number"
              min={0}
              value={formData.min_stock_level as unknown as string}
              onChange={(e) => setFormData({ ...formData, min_stock_level: parseInt((e.target as HTMLInputElement).value) || 0 })}
            />

            <AriaInput
              label={isSpanish ? 'Stock Máximo' : 'Max Stock Level'}
              type="number"
              min={0}
              value={(formData.max_stock_level ?? '').toString()}
              onChange={(e) => setFormData({ ...formData, max_stock_level: parseInt((e.target as HTMLInputElement).value) || null })}
              placeholder={isSpanish ? 'Opcional' : 'Optional'}
            />
          </div>

          <AriaInput
            label={isSpanish ? 'Punto de Reorden' : 'Reorder Point'}
            type="number"
            min={0}
            value={formData.reorder_point as unknown as string}
            onChange={(e) => setFormData({ ...formData, reorder_point: parseInt((e.target as HTMLInputElement).value) || 0 })}
          />
          <p className="text-xs text-muted-foreground mt-1">
              {isSpanish ? 'Nivel en el que se genera alerta de stock bajo' : 'Level at which low stock alert is triggered'}
          </p>
          </div>

          <AriaInput
            label={`${isSpanish ? 'Costo Estándar' : 'Standard Cost'} ($)`}
            type="number"
            min={0}
            step={0.01 as unknown as number}
            value={formData.standard_cost as unknown as string}
            onChange={(e) => setFormData({ ...formData, standard_cost: parseFloat((e.target as HTMLInputElement).value) || 0 })}
          />

          <div>
            <Label htmlFor="preferred_vendor_id">
              {isSpanish ? 'Proveedor Preferido' : 'Preferred Vendor'}
            </Label>
            <Select value={formData.preferred_vendor_id} onValueChange={(value) => setFormData({ ...formData, preferred_vendor_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder={isSpanish ? 'Seleccionar proveedor' : 'Select vendor'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {isSpanish ? 'Ninguno' : 'None'}
                </SelectItem>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Switches */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="is_active">
                  {isSpanish ? 'Activo' : 'Active'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {isSpanish ? 'El artículo está disponible para uso' : 'Item is available for use'}
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="is_consumable">
                  {isSpanish ? 'Consumible' : 'Consumable'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {isSpanish ? 'Se deduce automáticamente al crear paquetes' : 'Auto-deducted when creating packages'}
                </p>
              </div>
              <Switch
                id="is_consumable"
                checked={formData.is_consumable}
                onCheckedChange={(checked) => setFormData({ ...formData, is_consumable: checked })}
              />
            </div>
          </div>
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
            isSpanish ? 'Actualizar Artículo' : 'Update Item'
          ) : (
            isSpanish ? 'Crear Artículo' : 'Create Item'
          )}
        </Button>
      </div>
    </form>
  );
}