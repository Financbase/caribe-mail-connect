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
  FileText,
  Search,
  Plus,
  Eye,
  Edit,
  Filter,
  Download,
  Truck
} from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { formatCurrency } from '@/lib/utils';

export function PurchaseOrders() {
  const { language } = useLanguage();
  const { purchaseOrders, poLoading } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const isSpanish = language === 'es';

  if (poLoading) {
    return <LoadingSpinner />;
  }

  // Filter purchase orders based on search and status
  const filteredOrders = purchaseOrders.filter(po => {
    const matchesSearch = po.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.vendors.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (po.notes?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'all' || po.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const statuses = [
    { value: 'all', label: isSpanish ? 'Todos los Estados' : 'All Statuses' },
    { value: 'draft', label: isSpanish ? 'Borrador' : 'Draft' },
    { value: 'sent', label: isSpanish ? 'Enviado' : 'Sent' },
    { value: 'acknowledged', label: isSpanish ? 'Reconocido' : 'Acknowledged' },
    { value: 'received', label: isSpanish ? 'Recibido' : 'Received' },
    { value: 'cancelled', label: isSpanish ? 'Cancelado' : 'Cancelled' },
  ];

  const getStatusLabel = (status: string) => {
    return statuses.find(s => s.value === status)?.label || status;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'sent':
        return 'default';
      case 'acknowledged':
        return 'outline';
      case 'received':
        return 'default';
      case 'cancelled':
        return 'destructive';
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
            {isSpanish ? 'Órdenes de Compra' : 'Purchase Orders'}
          </h2>
          <p className="text-muted-foreground">
            {isSpanish ? 'Gestione órdenes de compra y recepciones' : 'Manage purchase orders and receipts'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {isSpanish ? 'Exportar' : 'Export'}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {isSpanish ? 'Nueva Orden' : 'New Order'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isSpanish ? 'Crear Orden de Compra' : 'Create Purchase Order'}
                </DialogTitle>
                <DialogDescription>
                  {isSpanish ? 'Cree una nueva orden de compra para reabastecer inventario' : 'Create a new purchase order to restock inventory'}
                </DialogDescription>
              </DialogHeader>
              <div className="p-4 text-center text-muted-foreground">
                {isSpanish ? 'Formulario de orden de compra próximamente...' : 'Purchase order form coming soon...'}
              </div>
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
                  placeholder={isSpanish ? 'Buscar por número de orden, proveedor o notas...' : 'Search by order number, vendor, or notes...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                aria-label={isSpanish ? 'Filtrar por estado' : 'Filter by status'}
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isSpanish ? 'Lista de Órdenes' : 'Order List'}
          </CardTitle>
          <CardDescription>
            {filteredOrders.length} {isSpanish ? 'órdenes encontradas' : 'orders found'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <VirtualizedTable
              ariaLabel={isSpanish ? 'Lista de Órdenes' : 'Order List'}
              rows={filteredOrders}
              rowHeight={64}
              empty={(
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">
                    {isSpanish ? 'No se encontraron órdenes' : 'No orders found'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isSpanish ? 'Intente ajustar los filtros de búsqueda' : 'Try adjusting your search filters'}
                  </p>
                </div>
              )}
              columns={[
                { id: 'po', header: isSpanish ? 'Número de Orden' : 'Order Number', width: '12rem', cell: (po: any) => (
                  <span className="font-mono text-sm">{po.po_number}</span>
                ) },
                { id: 'vendor', header: isSpanish ? 'Proveedor' : 'Vendor', width: '1fr', cell: (po: any) => (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    {po.vendors.name}
                  </div>
                ) },
                { id: 'date', header: isSpanish ? 'Fecha' : 'Date', width: '10rem', cell: (po: any) => (
                  isSpanish ? new Date(po.order_date).toLocaleDateString('es-ES') : new Date(po.order_date).toLocaleDateString()
                ) },
                { id: 'status', header: isSpanish ? 'Estado' : 'Status', width: '10rem', cell: (po: any) => (
                  <Badge variant={getStatusBadgeVariant(po.status)}>{getStatusLabel(po.status)}</Badge>
                ) },
                { id: 'total', header: isSpanish ? 'Total' : 'Total', width: '10rem', align: 'right', cell: (po: any) => (
                  <span className="font-medium">{formatCurrency(po.total_amount)}</span>
                ) },
                { id: 'expected', header: isSpanish ? 'Entrega Esperada' : 'Expected Delivery', width: '12rem', cell: (po: any) => (
                  po.expected_delivery_date ? (
                    isSpanish ? new Date(po.expected_delivery_date).toLocaleDateString('es-ES') : new Date(po.expected_delivery_date).toLocaleDateString()
                  ) : (
                    <span className="text-muted-foreground">{isSpanish ? 'No especificada' : 'Not specified'}</span>
                  )
                ) },
                { id: 'actions', header: isSpanish ? 'Acciones' : 'Actions', width: '8rem', align: 'right', cell: (po: any) => (
                  <div className="flex items-center justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            {isSpanish ? 'Orden de Compra' : 'Purchase Order'} - {po.po_number}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* PO Details */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground">{isSpanish ? 'Proveedor' : 'Vendor'}</h4>
                              <p>{po.vendors.name}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground">{isSpanish ? 'Ubicación' : 'Location'}</h4>
                              <p>{po.locations.name}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground">{isSpanish ? 'Fecha de Orden' : 'Order Date'}</h4>
                              <p>{new Date(po.order_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground">{isSpanish ? 'Estado' : 'Status'}</h4>
                              <Badge variant={getStatusBadgeVariant(po.status)}>{getStatusLabel(po.status)}</Badge>
                            </div>
                          </div>
                          {/* Items (kept static table within modal) */}
                          {po.purchase_order_items && po.purchase_order_items.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-3">{isSpanish ? 'Artículos' : 'Items'}</h4>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>{isSpanish ? 'Artículo' : 'Item'}</TableHead>
                                    <TableHead className="text-right">{isSpanish ? 'Pedido' : 'Ordered'}</TableHead>
                                    <TableHead className="text-right">{isSpanish ? 'Recibido' : 'Received'}</TableHead>
                                    <TableHead className="text-right">{isSpanish ? 'Precio' : 'Price'}</TableHead>
                                    <TableHead className="text-right">{isSpanish ? 'Total' : 'Total'}</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {po.purchase_order_items.map((item: any) => (
                                    <TableRow key={item.id}>
                                      <TableCell>
                                        <div>
                                          <p className="font-medium">{item.inventory_items.name}</p>
                                          <p className="text-sm text-muted-foreground">{item.inventory_items.sku}</p>
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-right">{item.quantity_ordered}</TableCell>
                                      <TableCell className="text-right">{item.quantity_received}</TableCell>
                                      <TableCell className="text-right">{formatCurrency(item.unit_cost)}</TableCell>
                                      <TableCell className="text-right">{formatCurrency(item.line_total)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                          {/* Totals */}
                          <div className="border-t pt-4">
                            <div className="flex justify-end">
                              <div className="w-64 space-y-2">
                                <div className="flex justify-between"><span>{isSpanish ? 'Subtotal:' : 'Subtotal:'}</span><span>{formatCurrency(po.subtotal)}</span></div>
                                <div className="flex justify-between"><span>{isSpanish ? 'Impuesto:' : 'Tax:'}</span><span>{formatCurrency(po.tax_amount)}</span></div>
                                <div className="flex justify-between"><span>{isSpanish ? 'Envío:' : 'Shipping:'}</span><span>{formatCurrency(po.shipping_cost)}</span></div>
                                <div className="flex justify-between font-medium text-lg border-t pt-2"><span>{isSpanish ? 'Total:' : 'Total:'}</span><span>{formatCurrency(po.total_amount)}</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                  </div>
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