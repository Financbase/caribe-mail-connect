// International Shipping Types for PRMCMS

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  customsOffice: string;
  importDutyRate: number;
  vatRate: number;
  restrictedItems: string[];
  prohibitedItems: string[];
  requiredDocuments: string[];
  transitTime: {
    express: number; // days
    standard: number; // days
    economy: number; // days
  };
  shippingZones: ShippingZone[];
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  lastUpdated: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  baseRate: number;
  weightMultiplier: number;
  transitTime: number;
}

export interface InternationalPackage {
  id: string;
  trackingNumber: string;
  customerId: string;
  customerName: string;
  originCountry: string;
  destinationCountry: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  declaredValue: number;
  declaredCurrency: string;
  contents: PackageItem[];
  customsForms: CustomsForm[];
  status: InternationalPackageStatus;
  carrier: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  customsClearanceStatus: CustomsClearanceStatus;
  transitUpdates: TransitUpdate[];
  createdAt: string;
  updatedAt: string;
}

export interface PackageItem {
  id: string;
  description: string;
  quantity: number;
  unitValue: number;
  weight: number;
  hsCode?: string;
  originCountry: string;
}

export interface CustomsForm {
  id: string;
  type: 'CN22' | 'CN23' | 'CommercialInvoice' | 'ExportDeclaration';
  formNumber: string;
  packageId: string;
  data: Record<string, any>;
  isSigned: boolean;
  signedAt?: string;
  signedBy?: string;
  createdAt: string;
}

export interface TransitUpdate {
  id: string;
  packageId: string;
  location: string;
  status: string;
  description: string;
  timestamp: string;
  timezone: string;
}

export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  lastUpdated: string;
}

export interface InternationalRate {
  originCountry: string;
  destinationCountry: string;
  weight: number;
  service: 'express' | 'standard' | 'economy';
  baseRate: number;
  fuelSurcharge: number;
  customsFees: number;
  totalRate: number;
  currency: string;
  transitTime: number;
}

export interface ProhibitedItem {
  id: string;
  name: string;
  category: string;
  description: string;
  countries: string[];
  restrictions: string;
}

export interface RestrictedItem {
  id: string;
  name: string;
  category: string;
  description: string;
  countries: string[];
  requirements: string[];
  permits: string[];
}

export interface CustomsRequirement {
  countryCode: string;
  documentType: string;
  required: boolean;
  description: string;
  template?: string;
  fields: CustomField[];
}

export interface CustomField {
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  required: boolean;
  label: string;
  placeholder?: string;
  options?: string[];
  validation?: string;
}

export interface InternationalAddress {
  id: string;
  customerId: string;
  type: 'origin' | 'destination';
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  isDefault: boolean;
}

export interface MultiCurrencyPricing {
  baseCurrency: string;
  prices: {
    [currency: string]: number;
  };
  lastUpdated: string;
}

export interface InternationalPayment {
  id: string;
  packageId: string;
  amount: number;
  currency: string;
  method: 'credit_card' | 'bank_transfer' | 'paypal' | 'crypto';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: string;
  completedAt?: string;
}

export type InternationalPackageStatus = 
  | 'pending'
  | 'in_transit'
  | 'customs_clearance'
  | 'out_for_delivery'
  | 'delivered'
  | 'returned'
  | 'lost'
  | 'damaged';

export type CustomsClearanceStatus = 
  | 'pending'
  | 'in_progress'
  | 'cleared'
  | 'held'
  | 'rejected'
  | 'requires_documentation';

export interface WorldMapData {
  countries: {
    [countryCode: string]: {
      name: string;
      coordinates: [number, number];
      shippingZone: string;
      activeShipments: number;
    };
  };
  shippingZones: {
    [zoneId: string]: {
      name: string;
      color: string;
      countries: string[];
    };
  };
}

export interface InternationalAnalytics {
  totalShipments: number;
  activeShipments: number;
  deliveredThisMonth: number;
  averageTransitTime: number;
  customsClearanceRate: number;
  topDestinations: {
    country: string;
    shipments: number;
    revenue: number;
  }[];
  revenueByCurrency: {
    currency: string;
    amount: number;
  }[];
  commonIssues: {
    issue: string;
    count: number;
    percentage: number;
  }[];
} 