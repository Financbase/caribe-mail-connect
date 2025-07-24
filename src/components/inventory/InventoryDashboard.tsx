import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Package2,
  ShoppingCart,
  Truck,
  BarChart3
} from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { formatCurrency } from '@/lib/utils';

export function InventoryDashboard() {
  const { language } = useLanguage();
  const { 
    inventoryItems, 
    inventoryStock, 
    lowStockItems, 
    recentMovements,
    purchaseOrders,
    stockLoading,
    itemsLoading 
  } = useInventory();
  
  const isSpanish = language === 'es';

  if (stockLoading || itemsLoading) {
    return <LoadingSpinner />;
  }

  // Calculate dashboard metrics
  const totalItems = inventoryItems.length;
  const totalValue = inventoryStock.reduce((sum, stock) => {
    const item = inventoryItems.find(item => item.id === stock.item_id);
    return sum + (stock.quantity_on_hand * (item?.standard_cost || 0));
  }, 0);

  const lowStockCount = lowStockItems.length;
  const pendingOrders = purchaseOrders.filter(po => po.status === 'sent' || po.status === 'acknowledged').length;

  const recentUsage = recentMovements
    .filter(movement => movement.movement_type === 'usage' && 
            new Date(movement.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .reduce((sum, movement) => sum + Math.abs(movement.quantity_change), 0);

  // Category breakdown
  const categoryStats = inventoryItems.reduce((acc, item) => {
    const category = item.category;
    const stock = inventoryStock.find(s => s.item_id === item.id);
    const value = (stock?.quantity_on_hand || 0) * item.standard_cost;
    
    if (!acc[category]) {
      acc[category] = { count: 0, value: 0, items: 0 };
    }
    acc[category].count += stock?.quantity_on_hand || 0;
    acc[category].value += value;
    acc[category].items += 1;
    
    return acc;
  }, {} as Record<string, { count: number; value: number; items: number }>);

  const categoryNames = {
    shipping_supplies: isSpanish ? 'Suministros de Envío' : 'Shipping Supplies',
    office_supplies: isSpanish ? 'Suministros de Oficina' : 'Office Supplies',
    cleaning_supplies: isSpanish ? 'Suministros de Limpieza' : 'Cleaning Supplies',
    safety_equipment: isSpanish ? 'Equipo de Seguridad' : 'Safety Equipment',
    labels: isSpanish ? 'Etiquetas' : 'Labels'
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isSpanish ? 'Total de Artículos' : 'Total Items'}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              {isSpanish ? 'Artículos únicos en catálogo' : 'Unique items in catalog'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isSpanish ? 'Valor del Inventario' : 'Inventory Value'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              {isSpanish ? 'Valor total del stock' : 'Total stock value'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isSpanish ? 'Stock Bajo' : 'Low Stock'}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">
              {isSpanish ? 'Artículos necesitan reabastecimiento' : 'Items need restocking'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isSpanish ? 'Órdenes Pendientes' : 'Pending Orders'}
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              {isSpanish ? 'Órdenes de compra activas' : 'Active purchase orders'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package2 className="h-5 w-5" />
              {isSpanish ? 'Inventario por Categoría' : 'Inventory by Category'}
            </CardTitle>
            <CardDescription>
              {isSpanish ? 'Distribución de stock por tipo de suministro' : 'Stock distribution by supply type'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(categoryStats).map(([category, stats]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {categoryNames[category as keyof typeof categoryNames] || category}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stats.items} {isSpanish ? 'tipos' : 'types'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>{stats.count} {isSpanish ? 'unidades' : 'units'}</span>
                  <span className="font-medium">{formatCurrency(stats.value)}</span>
                </div>
                <Progress 
                  value={(stats.value / totalValue) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {isSpanish ? 'Actividad Reciente' : 'Recent Activity'}
            </CardTitle>
            <CardDescription>
              {isSpanish ? 'Últimos movimientos de inventario' : 'Latest inventory movements'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMovements.slice(0, 5).map((movement) => (
                <div key={movement.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      movement.movement_type === 'receipt' ? 'bg-green-500' :
                      movement.movement_type === 'usage' ? 'bg-blue-500' :
                      movement.movement_type === 'adjustment' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">
                        {movement.inventory_items.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {movement.locations.name} • {
                          isSpanish ? 
                          new Date(movement.created_at).toLocaleDateString('es-ES') :
                          new Date(movement.created_at).toLocaleDateString()
                        }
                      </p>
                    </div>
                  </div>
                  <Badge variant={movement.quantity_change > 0 ? 'default' : 'secondary'}>
                    {movement.quantity_change > 0 ? '+' : ''}{movement.quantity_change}
                  </Badge>
                </div>
              ))}
              {recentMovements.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {isSpanish ? 'No hay movimientos recientes' : 'No recent movements'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Items */}
      {lowStockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {isSpanish ? 'Artículos con Stock Bajo' : 'Low Stock Items'}
            </CardTitle>
            <CardDescription>
              {isSpanish ? 'Artículos que necesitan reabastecimiento inmediato' : 'Items requiring immediate restocking'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.slice(0, 5).map((stock) => (
                <div key={stock.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <div>
                      <p className="font-medium">{stock.inventory_items.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {stock.inventory_items.sku} • {stock.locations.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-amber-600">
                      {stock.quantity_available} {isSpanish ? 'disponibles' : 'available'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isSpanish ? 'Mín:' : 'Min:'} {stock.inventory_items.reorder_point}
                    </p>
                  </div>
                </div>
              ))}
              {lowStockItems.length > 5 && (
                <Button variant="outline" className="w-full">
                  {isSpanish ? `Ver todos (${lowStockItems.length})` : `View all (${lowStockItems.length})`}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}