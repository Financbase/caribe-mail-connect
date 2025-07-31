import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Truck,
  Users,
  MapPin,
  Star,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Calendar,
  Target,
  Award,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SellerAnalytics as SellerAnalyticsType, MarketplaceType, ShippingCarrier } from '@/types/marketplace';

interface SellerAnalyticsProps {
  analytics: SellerAnalyticsType | null;
  loading: boolean;
}

const marketplaceColors: Record<MarketplaceType, string> = {
  amazon: 'bg-orange-100 text-orange-800',
  ebay: 'bg-blue-100 text-blue-800',
  shopify: 'bg-green-100 text-green-800',
  etsy: 'bg-orange-200 text-orange-900',
  walmart: 'bg-blue-200 text-blue-900',
  facebook: 'bg-blue-300 text-blue-900',
  mercadolibre: 'bg-yellow-100 text-yellow-800'
};

const carrierColors: Record<ShippingCarrier, string> = {
  usps: 'bg-blue-100 text-blue-800',
  ups: 'bg-orange-100 text-orange-800',
  fedex: 'bg-purple-100 text-purple-800',
  dhl: 'bg-yellow-100 text-yellow-800',
  prmcms: 'bg-green-100 text-green-800',
  local: 'bg-gray-100 text-gray-800'
};

export function SellerAnalytics({ analytics, loading }: SellerAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedTab, setSelectedTab] = useState('overview');

  if (loading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return (value * 100).toFixed(1) + '%';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Seller Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive performance metrics across all marketplaces
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{analytics.overview.totalOrders.toLocaleString()}</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.overview.totalRevenue)}</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.3%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.overview.averageOrderValue)}</p>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -2.1%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Shipping Costs</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.overview.totalShippingCost)}</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -5.7%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <p className="text-2xl font-bold">{formatPercent(analytics.overview.profitMargin)}</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +1.2%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marketplace Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Marketplace Performance</CardTitle>
          <CardDescription>
            Revenue and order breakdown by marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Marketplace</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Avg Order Value</TableHead>
                <TableHead>Shipping Cost</TableHead>
                <TableHead>Return Rate</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.marketplaceBreakdown.map((marketplace) => (
                <TableRow key={marketplace.marketplace}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge className={cn("text-xs", marketplaceColors[marketplace.marketplace])}>
                        {marketplace.marketplace.charAt(0).toUpperCase() + marketplace.marketplace.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium">{marketplace.orderCount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {((marketplace.orderCount / analytics.overview.totalOrders) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium">{formatCurrency(marketplace.revenue)}</p>
                      <p className="text-xs text-muted-foreground">
                        {((marketplace.revenue / analytics.overview.totalRevenue) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className="font-medium">{formatCurrency(marketplace.averageOrderValue)}</span>
                  </TableCell>
                  
                  <TableCell>
                    <span className="font-medium">{formatCurrency(marketplace.shippingCost)}</span>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        "text-sm font-medium",
                        marketplace.returnRate < 0.05 ? 'text-green-600' :
                        marketplace.returnRate < 0.10 ? 'text-yellow-600' :
                        'text-red-600'
                      )}>
                        {formatPercent(marketplace.returnRate)}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={(marketplace.revenue / analytics.marketplaceBreakdown[0].revenue) * 100} 
                        className="w-16" 
                      />
                      <Star className="h-3 w-3 text-yellow-500" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Shipping Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Performance</CardTitle>
          <CardDescription>
            Carrier performance metrics and cost analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Carrier</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Avg Cost</TableHead>
                <TableHead>On-Time Rate</TableHead>
                <TableHead>Lost Package Rate</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.shippingAnalytics.map((carrier) => (
                <TableRow key={carrier.carrier}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge className={cn("text-xs", carrierColors[carrier.carrier])}>
                        {carrier.carrier.toUpperCase()}
                      </Badge>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className="font-medium">{carrier.orderCount.toLocaleString()}</span>
                  </TableCell>
                  
                  <TableCell>
                    <span className="font-medium">{formatCurrency(carrier.totalCost)}</span>
                  </TableCell>
                  
                  <TableCell>
                    <span className="font-medium">{formatCurrency(carrier.averageCost)}</span>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        "text-sm font-medium",
                        carrier.onTimeDeliveryRate >= 0.95 ? 'text-green-600' :
                        carrier.onTimeDeliveryRate >= 0.90 ? 'text-yellow-600' :
                        'text-red-600'
                      )}>
                        {formatPercent(carrier.onTimeDeliveryRate)}
                      </span>
                      <Progress value={carrier.onTimeDeliveryRate * 100} className="w-16" />
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className={cn(
                      "text-sm font-medium",
                      carrier.lostPackageRate <= 0.001 ? 'text-green-600' :
                      carrier.lostPackageRate <= 0.005 ? 'text-yellow-600' :
                      'text-red-600'
                    )}>
                      {formatPercent(carrier.lostPackageRate)}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "h-3 w-3",
                            i < Math.round(carrier.onTimeDeliveryRate * 5) ? 'text-yellow-500' : 'text-gray-300'
                          )} 
                        />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
          <CardDescription>
            Best-selling products by order volume and revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Return Rate</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.topProducts.map((product) => (
                <TableRow key={product.sku}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className="font-medium">{product.orderCount.toLocaleString()}</span>
                  </TableCell>
                  
                  <TableCell>
                    <span className="font-medium">{formatCurrency(product.revenue)}</span>
                  </TableCell>
                  
                  <TableCell>
                    <span className={cn(
                      "text-sm font-medium",
                      product.returnRate < 0.03 ? 'text-green-600' :
                      product.returnRate < 0.07 ? 'text-yellow-600' :
                      'text-red-600'
                    )}>
                      {formatPercent(product.returnRate)}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={(product.revenue / analytics.topProducts[0].revenue) * 100} 
                        className="w-20" 
                      />
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
            <CardDescription>
              Key customer metrics and behavior patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Total Customers</span>
                </div>
                <span className="font-bold">{analytics.customerInsights.totalCustomers.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Repeat Customer Rate</span>
                </div>
                <span className="font-bold">{formatPercent(analytics.customerInsights.repeatCustomerRate)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Avg Lifetime Value</span>
                </div>
                <span className="font-bold">{formatCurrency(analytics.customerInsights.averageLifetimeValue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
            <CardDescription>
              Highest performing customer locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.customerInsights.topLocations.map((location, index) => (
                <div key={location.location} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-medium w-4">#{index + 1}</span>
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span className="text-sm">{location.location}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(location.revenue)}</p>
                    <p className="text-xs text-muted-foreground">{location.orderCount} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>
            30-day performance metrics and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/20">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Performance chart visualization</p>
              <p className="text-xs text-muted-foreground">
                Interactive charts showing orders, revenue, and shipping costs over time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 