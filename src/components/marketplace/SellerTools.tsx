import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Package,
  Truck,
  Globe,
  DollarSign,
  Weight,
  Ruler,
  FileText,
  Download,
  Upload,
  Search,
  Plus,
  Minus,
  Calculator,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Printer,
  Send,
  Combine,
  Scale
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMarketplace } from '@/hooks/useMarketplace';
import { MarketplaceOrder, ShippingRate, ShippingCarrier, ShippingService } from '@/types/marketplace';

interface SellerToolsProps {
  orders: MarketplaceOrder[];
  loading: boolean;
}

const carrierIcons: Record<ShippingCarrier, React.ReactNode> = {
  usps: <Truck className="h-4 w-4 text-blue-600" />,
  ups: <Truck className="h-4 w-4 text-orange-600" />,
  fedex: <Truck className="h-4 w-4 text-purple-600" />,
  dhl: <Truck className="h-4 w-4 text-yellow-600" />,
  prmcms: <Truck className="h-4 w-4 text-green-600" />,
  local: <Truck className="h-4 w-4 text-gray-600" />
};

export function SellerTools({ orders, loading }: SellerToolsProps) {
  const [activeTab, setActiveTab] = useState('bulk-shipping');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [ratesLoading, setRatesLoading] = useState(false);

  const { generateBulkLabels, getShippingRates, suggestConsolidation } = useMarketplace();

  // Filter orders that are ready for shipping
  const shippableOrders = orders.filter(order => 
    order.status === 'confirmed' && !order.fulfillment?.labelGenerated
  );

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const handleGetRates = async () => {
    if (selectedOrders.length === 0) return;
    
    setRatesLoading(true);
    try {
      // Get rates for the first selected order as example
      const rates = await getShippingRates(selectedOrders[0]);
      setShippingRates(rates);
    } catch (error) {
      console.error('Failed to get shipping rates:', error);
    } finally {
      setRatesLoading(false);
    }
  };

  const calculateTotalWeight = () => {
    return selectedOrders.reduce((total, orderId) => {
      const order = orders.find(o => o.id === orderId);
      return total + (order?.items.reduce((sum, item) => sum + (item.weight || 0) * item.quantity, 0) || 0);
    }, 0);
  };

  const calculateTotalValue = () => {
    return selectedOrders.reduce((total, orderId) => {
      const order = orders.find(o => o.id === orderId);
      return total + (order?.totals.total || 0);
    }, 0);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Seller Tools</h2>
          <p className="text-muted-foreground">
            Bulk shipping, consolidation, and international shipping tools
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Orders
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Labels
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bulk-shipping">Bulk Shipping</TabsTrigger>
          <TabsTrigger value="consolidation">Package Consolidation</TabsTrigger>
          <TabsTrigger value="international">International Shipping</TabsTrigger>
          <TabsTrigger value="rate-shopping">Rate Shopping</TabsTrigger>
        </TabsList>

        <TabsContent value="bulk-shipping" className="space-y-6">
          <BulkShippingPanel 
            orders={shippableOrders}
            selectedOrders={selectedOrders}
            onSelectOrder={handleSelectOrder}
            onGenerateBulkLabels={generateBulkLabels}
          />
        </TabsContent>

        <TabsContent value="consolidation" className="space-y-6">
          <ConsolidationPanel 
            orders={shippableOrders}
            selectedOrders={selectedOrders}
            onSelectOrder={handleSelectOrder}
            onSuggestConsolidation={suggestConsolidation}
          />
        </TabsContent>

        <TabsContent value="international" className="space-y-6">
          <InternationalShippingPanel 
            orders={shippableOrders}
            selectedOrders={selectedOrders}
          />
        </TabsContent>

        <TabsContent value="rate-shopping" className="space-y-6">
          <RateShoppingPanel 
            orders={shippableOrders}
            selectedOrders={selectedOrders}
            onSelectOrder={handleSelectOrder}
            onGetRates={handleGetRates}
            rates={shippingRates}
            ratesLoading={ratesLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BulkShippingPanel({ 
  orders, 
  selectedOrders, 
  onSelectOrder, 
  onGenerateBulkLabels 
}: {
  orders: MarketplaceOrder[];
  selectedOrders: string[];
  onSelectOrder: (orderId: string, checked: boolean) => void;
  onGenerateBulkLabels: (orderIds: string[]) => Promise<any>;
}) {
  const [carrier, setCarrier] = useState<ShippingCarrier>('usps');
  const [service, setService] = useState<ShippingService>('standard');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateLabels = async () => {
    if (selectedOrders.length === 0) return;
    
    setIsGenerating(true);
    try {
      await onGenerateBulkLabels(selectedOrders);
    } catch (error) {
      console.error('Failed to generate bulk labels:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bulk Options */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Shipping Options</CardTitle>
          <CardDescription>
            Configure shipping settings for bulk label generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="carrier">Carrier</Label>
              <Select value={carrier} onValueChange={(value) => setCarrier(value as ShippingCarrier)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usps">USPS</SelectItem>
                  <SelectItem value="ups">UPS</SelectItem>
                  <SelectItem value="fedex">FedEx</SelectItem>
                  <SelectItem value="dhl">DHL</SelectItem>
                  <SelectItem value="prmcms">PRMCMS Local</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="service">Service Level</Label>
              <Select value={service} onValueChange={(value) => setService(value as ShippingService)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="overnight">Overnight</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={handleGenerateLabels}
                disabled={selectedOrders.length === 0 || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Printer className="h-4 w-4 mr-2" />
                )}
                Generate {selectedOrders.length} Labels
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Orders for Bulk Processing</CardTitle>
          <CardDescription>
            Choose orders to generate shipping labels for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onCheckedChange={(checked) => {
                      orders.forEach(order => onSelectOrder(order.id, checked as boolean));
                    }}
                  />
                </TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Destination</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={(checked) => onSelectOrder(order.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.marketplace}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.customerInfo.name}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>
                    {order.items.reduce((sum, item) => sum + (item.weight || 0) * item.quantity, 0).toFixed(1)} lbs
                  </TableCell>
                  <TableCell>${order.totals.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{order.customerInfo.address.city}, {order.customerInfo.address.state}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ConsolidationPanel({ 
  orders, 
  selectedOrders, 
  onSelectOrder, 
  onSuggestConsolidation 
}: {
  orders: MarketplaceOrder[];
  selectedOrders: string[];
  onSelectOrder: (orderId: string, checked: boolean) => void;
  onSuggestConsolidation: (orderIds: string[]) => Promise<any>;
}) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (selectedOrders.length < 2) return;
    
    setIsAnalyzing(true);
    try {
      const suggestion = await onSuggestConsolidation(selectedOrders);
      setSuggestions([suggestion]);
    } catch (error) {
      console.error('Failed to analyze consolidation:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const estimatedSavings = selectedOrders.length * 3.50; // Mock calculation

  return (
    <div className="space-y-6">
      {/* Consolidation Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Package Consolidation Analysis</CardTitle>
          <CardDescription>
            Combine multiple orders to reduce shipping costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{selectedOrders.length}</div>
              <div className="text-sm text-muted-foreground">Selected Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {selectedOrders.reduce((total, orderId) => {
                  const order = orders.find(o => o.id === orderId);
                  return total + (order?.items.reduce((sum, item) => sum + (item.weight || 0) * item.quantity, 0) || 0);
                }, 0).toFixed(1)} lbs
              </div>
              <div className="text-sm text-muted-foreground">Total Weight</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${selectedOrders.reduce((total, orderId) => {
                  const order = orders.find(o => o.id === orderId);
                  return total + (order?.totals.total || 0);
                }, 0).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">${estimatedSavings.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Est. Savings</div>
            </div>
          </div>
          
          <Button 
            onClick={handleAnalyze}
            disabled={selectedOrders.length < 2 || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <Clock className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Calculator className="h-4 w-4 mr-2" />
            )}
            Analyze Consolidation Options
          </Button>
        </CardContent>
      </Card>

      {/* Consolidation Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Consolidation Suggestions</CardTitle>
            <CardDescription>
              Recommended package combinations based on destination and weight
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-green-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Combine className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Recommended Consolidation</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">35% savings</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Package Count:</span>
                    <span className="ml-2 font-medium">2 packages</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Cost:</span>
                    <span className="ml-2 font-medium">$18.50</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Savings:</span>
                    <span className="ml-2 font-medium text-green-600">$9.75</span>
                  </div>
                </div>
                
                <Button className="mt-3" size="sm">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Apply Consolidation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Selection for Consolidation */}
      <Card>
        <CardHeader>
          <CardTitle>Select Orders for Consolidation</CardTitle>
          <CardDescription>
            Choose orders going to the same or nearby destinations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onCheckedChange={(checked) => {
                      orders.forEach(order => onSelectOrder(order.id, checked as boolean));
                    }}
                  />
                </TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Dimensions</TableHead>
                <TableHead>Compatibility</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={(checked) => onSelectOrder(order.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.items.length} items</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.customerInfo.name}</TableCell>
                  <TableCell>
                    <div>
                      <p>{order.customerInfo.address.city}, {order.customerInfo.address.state}</p>
                      <p className="text-xs text-muted-foreground">{order.customerInfo.address.postalCode}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Weight className="h-3 w-3" />
                      <span>
                        {order.items.reduce((sum, item) => sum + (item.weight || 0) * item.quantity, 0).toFixed(1)} lbs
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Ruler className="h-3 w-3" />
                      <span className="text-xs">
                        {order.items[0]?.dimensions ? 
                          `${order.items[0].dimensions.length}"×${order.items[0].dimensions.width}"×${order.items[0].dimensions.height}"` : 
                          'N/A'
                        }
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800 text-xs">High</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function InternationalShippingPanel({ 
  orders, 
  selectedOrders 
}: {
  orders: MarketplaceOrder[];
  selectedOrders: string[];
}) {
  const [customsForm, setCustomsForm] = useState<any>(null);

  return (
    <div className="space-y-6">
      {/* International Shipping Overview */}
      <Card>
        <CardHeader>
          <CardTitle>International Shipping Tools</CardTitle>
          <CardDescription>
            Manage customs documentation and international shipping requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-24 flex-col">
              <FileText className="h-8 w-8 mb-2" />
              <span>Generate Customs Forms</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col">
              <Globe className="h-8 w-8 mb-2" />
              <span>Calculate Duties</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col">
              <Download className="h-8 w-8 mb-2" />
              <span>Export Documentation</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customs Declaration */}
      <Card>
        <CardHeader>
          <CardTitle>Customs Declaration Generator</CardTitle>
          <CardDescription>
            Generate required customs forms for international shipments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="form-type">Form Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select form type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cn22">CN22 (Small packets)</SelectItem>
                    <SelectItem value="cn23">CN23 (Parcels)</SelectItem>
                    <SelectItem value="commercial">Commercial Invoice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="shipment-purpose">Shipment Purpose</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gift">Gift</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="sample">Sample</SelectItem>
                    <SelectItem value="return">Return</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">International Shipping Requirements</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Accurate customs declarations required for all international shipments</li>
                <li>• Commercial value must be declared for all items</li>
                <li>• Restricted items may require additional documentation</li>
                <li>• Duties and taxes are the responsibility of the recipient</li>
              </ul>
            </div>
            
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Generate Customs Form
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RateShoppingPanel({ 
  orders, 
  selectedOrders, 
  onSelectOrder, 
  onGetRates, 
  rates, 
  ratesLoading 
}: {
  orders: MarketplaceOrder[];
  selectedOrders: string[];
  onSelectOrder: (orderId: string, checked: boolean) => void;
  onGetRates: () => void;
  rates: ShippingRate[];
  ratesLoading: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Rate Shopping */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Rate Comparison</CardTitle>
          <CardDescription>
            Compare rates across multiple carriers to find the best shipping options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <Button 
              onClick={onGetRates}
              disabled={selectedOrders.length === 0 || ratesLoading}
            >
              {ratesLoading ? (
                <Clock className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Get Shipping Rates
            </Button>
            
            <div className="text-sm text-muted-foreground">
              Select orders below to compare shipping rates
            </div>
          </div>

          {rates.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Available Shipping Options</h3>
              {rates.map((rate, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center space-x-3">
                    {carrierIcons[rate.carrier]}
                    <div>
                      <p className="font-medium capitalize">{rate.carrier} {rate.service}</p>
                      <p className="text-sm text-muted-foreground">
                        Delivery: {new Date(rate.estimatedDelivery).toLocaleDateString()} • {rate.transitTime}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {rate.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold">${rate.cost.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{rate.currency}</p>
                    {rate.insurance && (
                      <p className="text-xs text-muted-foreground">
                        +${rate.insurance.cost} insurance
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Selection for Rate Shopping */}
      <Card>
        <CardHeader>
          <CardTitle>Select Orders for Rate Comparison</CardTitle>
          <CardDescription>
            Choose orders to get shipping rate quotes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onCheckedChange={(checked) => {
                      orders.forEach(order => onSelectOrder(order.id, checked as boolean));
                    }}
                  />
                </TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.slice(0, 10).map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={(checked) => onSelectOrder(order.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.marketplace}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{order.customerInfo.address.city}, {order.customerInfo.address.state}</p>
                      <p className="text-xs text-muted-foreground">{order.customerInfo.address.postalCode}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.items.reduce((sum, item) => sum + (item.weight || 0) * item.quantity, 0).toFixed(1)} lbs
                  </TableCell>
                  <TableCell>${order.totals.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "text-xs",
                      order.priority === 'high' ? 'bg-red-100 text-red-800' :
                      order.priority === 'urgent' ? 'bg-red-200 text-red-900' :
                      'bg-gray-100 text-gray-800'
                    )}>
                      {order.priority}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 