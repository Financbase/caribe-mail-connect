import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Barcode,
  Plus,
  FileText,
  Truck
} from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { InventoryDashboard } from '@/components/inventory/InventoryDashboard';
import { InventoryItems } from '@/components/inventory/InventoryItems';
import { StockMovements } from '@/components/inventory/StockMovements';
import { PurchaseOrders } from '@/components/inventory/PurchaseOrders';
import { InventoryAnalytics } from '@/components/inventory/InventoryAnalytics';
import { VendorManagement } from '@/components/inventory/VendorManagement';

interface InventoryProps {
  onNavigate: (page: string) => void;
}

function Inventory({ onNavigate }: InventoryProps) {
  const { language } = useLanguage();
  const { lowStockItems, lowStockLoading } = useInventory();
  const [activeTab, setActiveTab] = useState('dashboard');

  const isSpanish = language === 'es';

  const tabs = [
    {
      id: 'dashboard',
      label: isSpanish ? 'Panel' : 'Dashboard',
      icon: Package,
      component: InventoryDashboard
    },
    {
      id: 'items',
      label: isSpanish ? 'Artículos' : 'Items',
      icon: Package,
      component: InventoryItems
    },
    {
      id: 'movements',
      label: isSpanish ? 'Movimientos' : 'Movements',
      icon: TrendingUp,
      component: StockMovements
    },
    {
      id: 'purchase-orders',
      label: isSpanish ? 'Órdenes de Compra' : 'Purchase Orders',
      icon: FileText,
      component: PurchaseOrders
    },
    {
      id: 'vendors',
      label: isSpanish ? 'Proveedores' : 'Vendors',
      icon: Truck,
      component: VendorManagement
    },
    {
      id: 'analytics',
      label: isSpanish ? 'Análisis' : 'Analytics',
      icon: TrendingUp,
      component: InventoryAnalytics
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || InventoryDashboard;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isSpanish ? 'Gestión de Inventario' : 'Inventory Management'}
          </h1>
          <p className="text-muted-foreground">
            {isSpanish 
              ? 'Gestione suministros, niveles de stock y órdenes de compra'
              : 'Manage supplies, stock levels, and purchase orders'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Barcode className="h-4 w-4 mr-2" />
            {isSpanish ? 'Escanear' : 'Scan'}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {isSpanish ? 'Nuevo Artículo' : 'New Item'}
          </Button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {!lowStockLoading && lowStockItems.length > 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <span className="font-medium">
              {isSpanish ? 'Alerta de Stock Bajo:' : 'Low Stock Alert:'}
            </span>{' '}
            {lowStockItems.length} {isSpanish ? 'artículos necesitan reabastecimiento' : 'items need restocking'}
            <Button variant="link" className="h-auto p-0 ml-2 text-amber-800" size="sm">
              {isSpanish ? 'Ver detalles' : 'View details'}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <ActiveComponent />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default Inventory;