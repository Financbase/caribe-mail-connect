import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { VirtualizedTable } from '@/components/ui/virtualized-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Package,
  Search,
  Plus,
  Edit,
  Barcode,
  Filter,
  Download
} from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ItemForm } from '@/components/inventory/ItemForm';
import { formatCurrency } from '@/lib/utils';

export function InventoryItems() {
  const { language } = useLanguage();
  const { inventoryItems, inventoryStock, itemsLoading } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const isSpanish = language === 'es';

  if (itemsLoading) {
    return <LoadingSpinner />;
  }

  // Filter items based on search and category
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: isSpanish ? 'Todas las Categorías' : 'All Categories' },
    { value: 'shipping_supplies', label: isSpanish ? 'Suministros de Envío' : 'Shipping Supplies' },
    { value: 'office_supplies', label: isSpanish ? 'Suministros de Oficina' : 'Office Supplies' },
    { value: 'cleaning_supplies', label: isSpanish ? 'Suministros de Limpieza' : 'Cleaning Supplies' },
    { value: 'safety_equipment', label: isSpanish ? 'Equipo de Seguridad' : 'Safety Equipment' },
    { value: 'labels', label: isSpanish ? 'Etiquetas' : 'Labels' },
  ];

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  const getStockForItem = (itemId: string) => {
    return inventoryStock.filter(stock => stock.item_id === itemId);
  };

  const getTotalStock = (itemId: string) => {
    return getStockForItem(itemId).reduce((sum, stock) => sum + stock.quantity_available, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {isSpanish ? 'Artículos de Inventario' : 'Inventory Items'}
          </h2>
          <p className="text-muted-foreground">
            {isSpanish ? 'Gestione el catálogo de suministros y materiales' : 'Manage supply and material catalog'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {isSpanish ? 'Exportar' : 'Export'}
          </Button>
          <Button variant="outline" size="sm">
            <Barcode className="h-4 w-4 mr-2" />
            {isSpanish ? 'Escanear' : 'Scan'}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {isSpanish ? 'Nuevo Artículo' : 'New Item'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {isSpanish ? 'Crear Nuevo Artículo' : 'Create New Item'}
                </DialogTitle>
                <DialogDescription>
                  {isSpanish ? 'Agregue un nuevo artículo al catálogo de inventario' : 'Add a new item to the inventory catalog'}
                </DialogDescription>
              </DialogHeader>
              <ItemForm onClose={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isSpanish ? 'Buscar por nombre, SKU o descripción...' : 'Search by name, SKU, or description...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                aria-label={isSpanish ? 'Filtrar por categoría' : 'Filter by category'}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {isSpanish ? 'Catálogo de Artículos' : 'Item Catalog'}
          </CardTitle>
          <CardDescription>
            {filteredItems.length} {isSpanish ? 'artículos encontrados' : 'items found'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <VirtualizedTable
              ariaLabel={isSpanish ? 'Catálogo de Artículos' : 'Item Catalog'}
              rows={filteredItems}
              rowHeight={64}
              empty={(
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">
                    {isSpanish ? 'No se encontraron artículos' : 'No items found'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isSpanish ? 'Intente ajustar los filtros de búsqueda' : 'Try adjusting your search filters'}
                  </p>
                </div>
              )}
              columns={[
                { id: 'sku', header: isSpanish ? 'SKU' : 'SKU', width: '10rem', cell: (item: any) => (
                  <span className="font-mono text-sm">{item.sku}</span>
                ) },
                { id: 'name', header: isSpanish ? 'Nombre' : 'Name', width: '1fr', cell: (item: any) => (
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                ) },
                { id: 'category', header: isSpanish ? 'Categoría' : 'Category', width: '12rem', cell: (item: any) => (
                  <Badge variant="outline">{getCategoryLabel(item.category)}</Badge>
                ) },
                { id: 'stock', header: isSpanish ? 'Stock Total' : 'Total Stock', width: '10rem', align: 'right', cell: (item: any) => {
                  const totalStock = getTotalStock(item.id);
                  const isLowStock = totalStock <= item.reorder_point;
                  return (
                    <div className="flex items-center gap-2 justify-end">
                      <span className={isLowStock ? 'text-amber-600 font-medium' : ''}>{totalStock}</span>
                          {isLowStock && (
                        <Badge variant="destructive" className="text-xs">{isSpanish ? 'Bajo' : 'Low'}</Badge>
                          )}
                        </div>
                  );
                } },
                { id: 'unit', header: isSpanish ? 'Unidad' : 'Unit', width: '8rem', cell: (item: any) => item.unit_of_measure },
                { id: 'cost', header: isSpanish ? 'Costo Estándar' : 'Standard Cost', width: '12rem', align: 'right', cell: (item: any) => formatCurrency(item.standard_cost) },
                { id: 'status', header: isSpanish ? 'Estado' : 'Status', width: '10rem', cell: (item: any) => (
                        <Badge variant={item.is_active ? 'default' : 'secondary'}>
                    {item.is_active ? (isSpanish ? 'Activo' : 'Active') : (isSpanish ? 'Inactivo' : 'Inactive')}
                        </Badge>
                ) },
                { id: 'actions', header: isSpanish ? 'Acciones' : 'Actions', width: '8rem', align: 'right', cell: (item: any) => (
                  <div className="flex items-center justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" data-focusable="true" aria-label={isSpanish ? 'Editar artículo' : 'Edit item'}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  {isSpanish ? 'Editar Artículo' : 'Edit Item'}
                                </DialogTitle>
                                <DialogDescription>
                                  {isSpanish ? 'Actualice la información del artículo' : 'Update item information'}
                                </DialogDescription>
                              </DialogHeader>
                              <ItemForm item={item} onClose={() => setEditingItem(null)} />
                            </DialogContent>
                          </Dialog>
                        </div>
                ) },
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}