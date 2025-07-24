import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  AlertTriangle,
  Calendar,
  Download
} from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { formatCurrency } from '@/lib/utils';

export function InventoryAnalytics() {
  const { language } = useLanguage();
  const { 
    inventoryItems, 
    inventoryStock, 
    recentMovements,
    purchaseOrders,
    stockLoading,
    itemsLoading 
  } = useInventory();
  
  const isSpanish = language === 'es';

  if (stockLoading || itemsLoading) {
    return <LoadingSpinner />;
  }

  // Calculate analytics metrics
  const totalValue = inventoryStock.reduce((sum, stock) => {
    const item = inventoryItems.find(item => item.id === stock.item_id);
    return sum + (stock.quantity_on_hand * (item?.standard_cost || 0));
  }, 0);

  const movementsThisWeek = recentMovements.filter(movement => 
    new Date(movement.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );

  const usageThisWeek = movementsThisWeek
    .filter(movement => movement.movement_type === 'usage')
    .reduce((sum, movement) => sum + Math.abs(movement.quantity_change), 0);

  const receiptsThisWeek = movementsThisWeek
    .filter(movement => movement.movement_type === 'receipt')
    .reduce((sum, movement) => sum + movement.quantity_change, 0);

  // Top used items
  const itemUsage = recentMovements
    .filter(movement => movement.movement_type === 'usage')
    .reduce((acc, movement) => {
      const itemId = movement.item_id;
      acc[itemId] = (acc[itemId] || 0) + Math.abs(movement.quantity_change);
      return acc;
    }, {} as Record<string, number>);

  const topUsedItems = Object.entries(itemUsage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([itemId, usage]) => ({
      item: inventoryItems.find(item => item.id === itemId),
      usage
    }))
    .filter(({ item }) => item);

  // Category value distribution
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

  // Purchase order analytics
  const pendingOrderValue = purchaseOrders
    .filter(po => po.status === 'sent' || po.status === 'acknowledged')
    .reduce((sum, po) => sum + po.total_amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {isSpanish ? 'Análisis de Inventario' : 'Inventory Analytics'}
          </h2>
          <p className="text-muted-foreground">
            {isSpanish ? 'Métricas y tendencias de inventario' : 'Inventory metrics and trends'}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          {isSpanish ? 'Exportar Reporte' : 'Export Report'}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isSpanish ? 'Valor Total' : 'Total Value'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              {isSpanish ? 'Valor total del inventario' : 'Total inventory value'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isSpanish ? 'Uso Semanal' : 'Weekly Usage'}
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              {isSpanish ? 'Unidades usadas esta semana' : 'Units used this week'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isSpanish ? 'Recibos Semanales' : 'Weekly Receipts'}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receiptsThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              {isSpanish ? 'Unidades recibidas esta semana' : 'Units received this week'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isSpanish ? 'Órdenes Pendientes' : 'Pending Orders'}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pendingOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              {isSpanish ? 'Valor de órdenes pendientes' : 'Pending order value'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {isSpanish ? 'Distribución por Categoría' : 'Category Distribution'}
            </CardTitle>
            <CardDescription>
              {isSpanish ? 'Valor del inventario por categoría' : 'Inventory value by category'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(categoryStats)
              .sort(([, a], [, b]) => b.value - a.value)
              .map(([category, stats]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {categoryNames[category as keyof typeof categoryNames] || category}
                    </span>
                    <span className="text-sm font-medium">{formatCurrency(stats.value)}</span>
                  </div>
                  <Progress 
                    value={(stats.value / totalValue) * 100} 
                    className="h-2"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{stats.items} {isSpanish ? 'tipos' : 'types'}</span>
                    <span>{stats.count} {isSpanish ? 'unidades' : 'units'}</span>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Top Used Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {isSpanish ? 'Artículos Más Usados' : 'Most Used Items'}
            </CardTitle>
            <CardDescription>
              {isSpanish ? 'Artículos con mayor consumo reciente' : 'Items with highest recent consumption'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUsedItems.map(({ item, usage }, index) => (
                <div key={item!.id} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item!.name}</p>
                    <p className="text-xs text-muted-foreground">{item!.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{usage}</p>
                    <p className="text-xs text-muted-foreground">
                      {isSpanish ? 'unidades' : 'units'}
                    </p>
                  </div>
                </div>
              ))}
              {topUsedItems.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {isSpanish ? 'No hay datos de uso disponibles' : 'No usage data available'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Movement Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {isSpanish ? 'Tendencias de Movimiento' : 'Movement Trends'}
          </CardTitle>
          <CardDescription>
            {isSpanish ? 'Análisis de movimientos de inventario por día' : 'Daily inventory movement analysis'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium">
              {isSpanish ? 'Gráficos de Tendencias' : 'Trend Charts'}
            </h3>
            <p>
              {isSpanish ? 'Visualizaciones de datos próximamente...' : 'Data visualizations coming soon...'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}