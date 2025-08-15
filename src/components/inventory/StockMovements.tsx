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
  TrendingUp,
  Search,
  Plus,
  Package,
  ArrowUpDown,
  Barcode,
  Filter
} from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MovementForm } from '@/components/inventory/MovementForm';

export function StockMovements() {
  const { language } = useLanguage();
  const { recentMovements, movementsLoading } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const isSpanish = language === 'es';

  if (movementsLoading) {
    return <LoadingSpinner />;
  }

  // Filter movements based on search and type
  const filteredMovements = recentMovements.filter(movement => {
    const matchesSearch = movement.inventory_items.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.inventory_items.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (movement.notes?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || movement.movement_type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const movementTypes = [
    { value: 'all', label: isSpanish ? 'Todos los Tipos' : 'All Types' },
    { value: 'receipt', label: isSpanish ? 'Recepción' : 'Receipt' },
    { value: 'usage', label: isSpanish ? 'Uso' : 'Usage' },
    { value: 'adjustment', label: isSpanish ? 'Ajuste' : 'Adjustment' },
    { value: 'transfer_in', label: isSpanish ? 'Transferencia Entrada' : 'Transfer In' },
    { value: 'transfer_out', label: isSpanish ? 'Transferencia Salida' : 'Transfer Out' },
    { value: 'count', label: isSpanish ? 'Conteo' : 'Count' },
  ];

  const getMovementTypeLabel = (type: string) => {
    return movementTypes.find(t => t.value === type)?.label || type;
  };

  const getMovementBadgeVariant = (type: string) => {
    switch (type) {
      case 'receipt':
      case 'transfer_in':
        return 'default';
      case 'usage':
      case 'transfer_out':
        return 'secondary';
      case 'adjustment':
        return 'destructive';
      case 'count':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {isSpanish ? 'Movimientos de Stock' : 'Stock Movements'}
          </h2>
          <p className="text-muted-foreground">
            {isSpanish ? 'Registre y rastree todos los movimientos de inventario' : 'Record and track all inventory movements'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Barcode className="h-4 w-4 mr-2" />
            {isSpanish ? 'Escanear' : 'Scan'}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {isSpanish ? 'Nuevo Movimiento' : 'New Movement'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {isSpanish ? 'Registrar Movimiento' : 'Record Movement'}
                </DialogTitle>
                <DialogDescription>
                  {isSpanish ? 'Registre un nuevo movimiento de inventario' : 'Record a new inventory movement'}
                </DialogDescription>
              </DialogHeader>
              <MovementForm onClose={() => setIsCreateDialogOpen(false)} />
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
                  placeholder={isSpanish ? 'Buscar por artículo, SKU o notas...' : 'Search by item, SKU, or notes...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                aria-label={isSpanish ? 'Filtrar por tipo de movimiento' : 'Filter by movement type'}
              >
                {movementTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movements Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {isSpanish ? 'Historial de Movimientos' : 'Movement History'}
          </CardTitle>
          <CardDescription>
            {filteredMovements.length} {isSpanish ? 'movimientos encontrados' : 'movements found'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <VirtualizedTable
              ariaLabel={isSpanish ? 'Historial de Movimientos' : 'Movement History'}
              rows={filteredMovements}
              rowHeight={64}
              empty={(
              <div className="text-center py-8">
                <ArrowUpDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">
                  {isSpanish ? 'No se encontraron movimientos' : 'No movements found'}
                </h3>
                <p className="text-muted-foreground">
                  {isSpanish ? 'Intente ajustar los filtros de búsqueda' : 'Try adjusting your search filters'}
                </p>
              </div>
            )}
              columns={[
                { id: 'date', header: isSpanish ? 'Fecha' : 'Date', width: '12rem', cell: (m: any) => (
                  <div className="text-sm">
                    {isSpanish ? new Date(m.created_at).toLocaleDateString('es-ES') : new Date(m.created_at).toLocaleDateString()}
                    <br />
                    <span className="text-muted-foreground text-xs">
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ) },
                { id: 'item', header: isSpanish ? 'Artículo' : 'Item', width: '1fr', cell: (m: any) => (
                  <div>
                    <p className="font-medium">{m.inventory_items.name}</p>
                    <p className="text-sm text-muted-foreground">{m.inventory_items.sku}</p>
                  </div>
                ) },
                { id: 'location', header: isSpanish ? 'Ubicación' : 'Location', width: '12rem', cell: (m: any) => m.locations.name },
                { id: 'type', header: isSpanish ? 'Tipo' : 'Type', width: '10rem', cell: (m: any) => (
                  <Badge variant={getMovementBadgeVariant(m.movement_type)}>{getMovementTypeLabel(m.movement_type)}</Badge>
                ) },
                { id: 'qty', header: isSpanish ? 'Cantidad' : 'Quantity', width: '10rem', align: 'right', cell: (m: any) => (
                  <span className={`font-medium ${m.quantity_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {m.quantity_change > 0 ? '+' : ''}{m.quantity_change}
                  </span>
                ) },
                { id: 'ref', header: isSpanish ? 'Referencia' : 'Reference', width: '14rem', cell: (m: any) => (
                  m.reference_type && m.reference_id ? (
                    <div className="text-sm">
                      <span className="capitalize">{m.reference_type}</span>
                      <br />
                      <span className="text-muted-foreground text-xs">
                        {m.reference_id.substring(0, 8)}...
                      </span>
                    </div>
                  ) : null
                ) },
                { id: 'notes', header: isSpanish ? 'Notas' : 'Notes', width: '1fr', cell: (m: any) => (
                  m.notes ? <p className="text-sm text-muted-foreground max-w-xs truncate">{m.notes}</p> : null
                ) },
              ]}
            />
            
            {null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}