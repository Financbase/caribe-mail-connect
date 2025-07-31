export type MarketplaceType = 'amazon' | 'ebay' | 'shopify' | 'etsy' | 'walmart' | 'facebook' | 'mercadolibre';

export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'syncing' | 'pending';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

export type ShippingCarrier = 'usps' | 'ups' | 'fedex' | 'dhl' | 'prmcms' | 'local';

export type LabelFormat = 'pdf' | 'png' | 'zpl' | 'epl';

export type ShippingService = 'standard' | 'express' | 'overnight' | 'international' | 'economy';

export type ReturnReason = 'defective' | 'wrong_item' | 'not_as_described' | 'changed_mind' | 'damaged' | 'other';

export type AutomationType = 'order_import' | 'status_sync' | 'label_print' | 'notification' | 'inventory_sync';

export interface MarketplaceIntegration {
  id: string;
  marketplace: MarketplaceType;
  status: IntegrationStatus;
  accountName: string;
  accountId: string;
  apiKey?: string;
  secretKey?: string;
  storeUrl?: string;
  lastSync: string;
  nextSync?: string;
  orderCount: number;
  monthlyVolume: number;
  errorCount: number;
  config: {
    autoImportOrders: boolean;
    autoStatusSync: boolean;
    autoPrintLabels: boolean;
    notifications: boolean;
    inventorySync: boolean;
  };
  rateLimits: {
    requests: number;
    remaining: number;
    resetTime: string;
  };
  webhooks: MarketplaceWebhook[];
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceWebhook {
  id: string;
  marketplaceId: string;
  url: string;
  events: string[];
  isActive: boolean;
  lastTriggered?: string;
  failureCount: number;
  createdAt: string;
}

export interface MarketplaceOrder {
  id: string;
  marketplaceOrderId: string;
  marketplace: MarketplaceType;
  integrationId: string;
  status: OrderStatus;
  orderNumber: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
    address: Address;
  };
  items: OrderItem[];
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    currency: string;
  };
  shipping: {
    service: ShippingService;
    carrier?: ShippingCarrier;
    trackingNumber?: string;
    estimatedDelivery?: string;
    shippingCost: number;
  };
  fulfillment?: {
    packageId?: string;
    shippedAt?: string;
    deliveredAt?: string;
    labelGenerated: boolean;
    labelUrl?: string;
  };
  notes?: string;
  tags: string[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  orderDate: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'in' | 'cm';
  };
  imageUrl?: string;
  marketplaceItemId: string;
}

export interface Address {
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isResidential: boolean;
}

export interface ShippingLabel {
  id: string;
  orderId: string;
  packageId?: string;
  carrier: ShippingCarrier;
  service: ShippingService;
  trackingNumber: string;
  labelUrl: string;
  format: LabelFormat;
  cost: number;
  currency: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
    unit: 'in' | 'cm';
    weightUnit: 'lb' | 'kg';
  };
  fromAddress: Address;
  toAddress: Address;
  insurance?: {
    value: number;
    cost: number;
  };
  createdAt: string;
  voidedAt?: string;
}

export interface PackageConsolidation {
  id: string;
  orderIds: string[];
  suggestedCarrier: ShippingCarrier;
  suggestedService: ShippingService;
  estimatedCost: number;
  estimatedSavings: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  items: OrderItem[];
  destination: Address;
  priority: 'low' | 'normal' | 'high';
  createdAt: string;
  status: 'suggested' | 'accepted' | 'rejected' | 'processed';
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  marketplaceReturnId?: string;
  reason: ReturnReason;
  reasonDetails?: string;
  items: {
    itemId: string;
    quantity: number;
    condition: 'unopened' | 'opened' | 'damaged' | 'defective';
  }[];
  returnAddress: Address;
  status: 'requested' | 'approved' | 'denied' | 'received' | 'processed' | 'refunded';
  refundAmount?: number;
  restockFee?: number;
  returnLabel?: {
    url: string;
    trackingNumber: string;
    cost: number;
  };
  photos?: string[];
  customerNotes?: string;
  internalNotes?: string;
  requestedAt: string;
  processedAt?: string;
}

export interface CustomsForm {
  id: string;
  orderId: string;
  formType: 'cn22' | 'cn23' | 'commercial_invoice';
  items: {
    description: string;
    quantity: number;
    value: number;
    weight: number;
    countryOfOrigin: string;
    hsCode?: string;
  }[];
  totals: {
    totalValue: number;
    totalWeight: number;
    currency: string;
  };
  purpose: 'gift' | 'commercial' | 'sample' | 'return' | 'other';
  signer: string;
  signatureDate: string;
  documentUrl?: string;
  createdAt: string;
}

export interface APICredentials {
  id: string;
  marketplace: MarketplaceType;
  name: string;
  apiKey: string;
  secretKey?: string;
  accessToken?: string;
  refreshToken?: string;
  environment: 'sandbox' | 'production';
  scopes: string[];
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  lastUsed?: string;
}

export interface RateLimit {
  endpoint: string;
  limit: number;
  remaining: number;
  resetTime: string;
  cost: number;
}

export interface APIError {
  id: string;
  marketplace: MarketplaceType;
  endpoint: string;
  method: string;
  statusCode: number;
  errorCode?: string;
  message: string;
  requestBody?: string;
  responseBody?: string;
  timestamp: string;
  resolved: boolean;
  retryCount: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  type: AutomationType;
  marketplace?: MarketplaceType;
  isActive: boolean;
  trigger: {
    event: string;
    conditions: Record<string, any>;
  };
  actions: {
    type: string;
    parameters: Record<string, any>;
  }[];
  schedule?: {
    frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
    time?: string;
    timezone: string;
  };
  lastExecution?: string;
  executionCount: number;
  errorCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SellerAnalytics {
  overview: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    totalShippingCost: number;
    profitMargin: number;
  };
  marketplaceBreakdown: {
    marketplace: MarketplaceType;
    orderCount: number;
    revenue: number;
    averageOrderValue: number;
    shippingCost: number;
    returnRate: number;
  }[];
  shippingAnalytics: {
    carrier: ShippingCarrier;
    orderCount: number;
    totalCost: number;
    averageCost: number;
    onTimeDeliveryRate: number;
    lostPackageRate: number;
  }[];
  performanceMetrics: {
    date: string;
    orderCount: number;
    revenue: number;
    shippingCost: number;
    averageProcessingTime: number;
    onTimeShipmentRate: number;
  }[];
  topProducts: {
    sku: string;
    name: string;
    orderCount: number;
    revenue: number;
    returnRate: number;
  }[];
  customerInsights: {
    totalCustomers: number;
    repeatCustomerRate: number;
    averageLifetimeValue: number;
    topLocations: {
      location: string;
      orderCount: number;
      revenue: number;
    }[];
  };
}

export interface ShippingRate {
  carrier: ShippingCarrier;
  service: ShippingService;
  cost: number;
  currency: string;
  estimatedDelivery: string;
  transitTime: string;
  features: string[];
  insurance?: {
    available: boolean;
    cost: number;
    maxValue: number;
  };
}

export interface InventorySync {
  id: string;
  marketplace: MarketplaceType;
  sku: string;
  marketplaceSku: string;
  currentStock: number;
  marketplaceStock: number;
  lastSync: string;
  syncStatus: 'in_sync' | 'out_of_sync' | 'error';
  errorMessage?: string;
  autoSync: boolean;
}

export interface MarketplaceFilters {
  marketplaces?: MarketplaceType[];
  statuses?: IntegrationStatus[];
  orderStatuses?: OrderStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  carriers?: ShippingCarrier[];
  priority?: ('low' | 'normal' | 'high' | 'urgent')[];
  searchQuery?: string;
}

export interface BulkOperation {
  id: string;
  type: 'label_generation' | 'status_update' | 'inventory_sync' | 'order_import';
  orderIds: string[];
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: {
    total: number;
    processed: number;
    succeeded: number;
    failed: number;
  };
  results?: {
    itemId: string;
    status: 'success' | 'error';
    message?: string;
    data?: any;
  }[];
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  estimatedDuration?: number;
}

export interface MarketplaceTemplate {
  id: string;
  marketplace: MarketplaceType;
  name: string;
  type: 'listing' | 'message' | 'return_policy' | 'shipping_policy';
  content: string;
  variables: string[];
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

// Marketplace credentials types
export interface MarketplaceCredentials {
  apiKey: string;
  secretKey?: string;
  accessToken?: string;
  refreshToken?: string;
  environment: 'sandbox' | 'production';
  scopes?: string[];
  additionalData?: Record<string, unknown>;
}

// Shipping label generation options
export interface ShippingLabelOptions {
  carrier: ShippingCarrier;
  service: ShippingService;
  format: LabelFormat;
  insurance?: {
    value: number;
    cost?: number;
  };
  signature?: boolean;
  saturdayDelivery?: boolean;
  residentialDelivery?: boolean;
  specialInstructions?: string;
  customsValue?: number;
  customsCurrency?: string;
  packageType?: 'package' | 'envelope' | 'tube' | 'pallet';
  dimensions?: {
    length: number;
    width: number;
    height: number;
    weight: number;
    unit: 'in' | 'cm';
    weightUnit: 'lb' | 'kg';
  };
} 