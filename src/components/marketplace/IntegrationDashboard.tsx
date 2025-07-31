import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Package,
  Truck,
  Eye,
  Download,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Tag,
  Printer,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMarketplace } from '@/hooks/useMarketplace';
import {
  MarketplaceIntegration,
  MarketplaceOrder,
  OrderStatus,
  MarketplaceType
} from '@/types/marketplace';

interface IntegrationDashboardProps {
  integrations: MarketplaceIntegration[];
  orders: MarketplaceOrder[];
  loading: boolean;
}

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-green-100 text-green-800',
  delivered: 'bg-green-200 text-green-900',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-orange-100 text-orange-800'
};

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock className="h-3 w-3" />,
  confirmed: <CheckCircle className="h-3 w-3" />,
  shipped: <Truck className="h-3 w-3" />,
  delivered: <CheckCircle className="h-3 w-3" />,
  cancelled: <AlertTriangle className="h-3 w-3" />,
  returned: <RefreshCw className="h-3 w-3" />
};

const marketplaceColors: Record<MarketplaceType, string> = {
  amazon: 'bg-orange-100 text-orange-800',
  ebay: 'bg-blue-100 text-blue-800',
  shopify: 'bg-green-100 text-green-800',
  etsy: 'bg-orange-200 text-orange-900',
  walmart: 'bg-blue-200 text-blue-900',
  facebook: 'bg-blue-300 text-blue-900',
  mercadolibre: 'bg-yellow-100 text-yellow-800'
};

export function IntegrationDashboard({ integrations, orders, loading }: IntegrationDashboardProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [marketplaceFilter, setMarketplaceFilter] = useState<MarketplaceType | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<MarketplaceOrder | null>(null);

  const { generateLabel, generateBulkLabels, updateOrderStatus } = useMarketplace();

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerInfo.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesMarketplace = marketplaceFilter === 'all' || order.marketplace === marketplaceFilter;
    
    return matchesSearch && matchesStatus && matchesMarketplace;
  });

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleGenerateLabel = async (orderId: string) => {
    try {
      await generateLabel(orderId, {
        carrier: 'usps',
        service: 'standard'
      });
    } catch (error) {
      console.error('Failed to generate label:', error);
    }
  };

  const handleBulkLabelGeneration = async () => {
    if (selectedOrders.length === 0) return;
    
    try {
      await generateBulkLabels(selectedOrders);
      setSelectedOrders([]);
    } catch (error) {
      console.error('Failed to generate bulk labels:', error);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Shipped</p>
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.status === 'shipped' || o.status === 'delivered').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(orders.reduce((sum, o) => sum + o.totals.total, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Manage orders from all connected marketplaces
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedOrders.length > 0 && (
                <Button onClick={handleBulkLabelGeneration}>
                  <Printer className="h-4 w-4 mr-2" />
                  Generate {selectedOrders.length} Labels
                </Button>
              )}
              
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>

            <Select value={marketplaceFilter} onValueChange={(value) => setMarketplaceFilter(value as any)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                <SelectItem value="amazon">Amazon</SelectItem>
                <SelectItem value="ebay">eBay</SelectItem>
                <SelectItem value="shopify">Shopify</SelectItem>
                <SelectItem value="mercadolibre">MercadoLibre</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Marketplace</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.marketplaceOrderId}</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customerInfo.name}</p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{order.customerInfo.address.city}, {order.customerInfo.address.state}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={cn("text-xs", marketplaceColors[order.marketplace])}>
                      {order.marketplace.charAt(0).toUpperCase() + order.marketplace.slice(1)}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={cn("text-xs", statusColors[order.status])}>
                      <div className="flex items-center space-x-1">
                        {statusIcons[order.status]}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.items.length} items</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items[0]?.name}
                        {order.items.length > 1 && ` +${order.items.length - 1} more`}
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium">{formatCurrency(order.totals.total)}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.totals.currency}
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(order.orderDate)}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
                            <DialogDescription>
                              Complete order information and management options
                            </DialogDescription>
                          </DialogHeader>
                          {selectedOrder && <OrderDetailsModal order={selectedOrder} />}
                        </DialogContent>
                      </Dialog>
                      
                      {!order.fulfillment?.labelGenerated && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleGenerateLabel(order.id)}
                        >
                          <Printer className="h-3 w-3" />
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No orders found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OrderDetailsModal({ order }: { order: MarketplaceOrder }) {
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Order Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Order Number</Label>
          <p className="text-sm">{order.orderNumber}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Marketplace Order ID</Label>
          <p className="text-sm">{order.marketplaceOrderId}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Status</Label>
          <Badge className={cn("text-xs", statusColors[order.status])}>
            {order.status}
          </Badge>
        </div>
        <div>
          <Label className="text-sm font-medium">Order Date</Label>
          <p className="text-sm">{new Date(order.orderDate).toLocaleString()}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Customer Information</Label>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">{order.customerInfo.name}</p>
            <p>{order.customerInfo.email}</p>
            {order.customerInfo.phone && <p>{order.customerInfo.phone}</p>}
          </div>
          <div>
            <p>{order.customerInfo.address.address1}</p>
            {order.customerInfo.address.address2 && <p>{order.customerInfo.address.address2}</p>}
            <p>{order.customerInfo.address.city}, {order.customerInfo.address.state} {order.customerInfo.address.postalCode}</p>
            <p>{order.customerInfo.address.country}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Order Items</Label>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded object-cover" />
                )}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(item.unitPrice)} each</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Order Totals</Label>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(order.totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{formatCurrency(order.totals.shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>{formatCurrency(order.totals.tax)}</span>
          </div>
          <div className="flex justify-between font-medium text-base border-t pt-2">
            <span>Total:</span>
            <span>{formatCurrency(order.totals.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      {order.shipping.trackingNumber && (
        <div>
          <Label className="text-sm font-medium mb-2 block">Shipping Information</Label>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="font-medium">Carrier:</span> {order.shipping.carrier?.toUpperCase()}</p>
              <p><span className="font-medium">Service:</span> {order.shipping.service}</p>
            </div>
            <div>
              <p><span className="font-medium">Tracking:</span> {order.shipping.trackingNumber}</p>
              {order.shipping.estimatedDelivery && (
                <p><span className="font-medium">Estimated:</span> {new Date(order.shipping.estimatedDelivery).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 