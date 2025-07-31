import {
  Country,
  Currency,
  ShippingZone,
  InternationalPackage,
  ProhibitedItem,
  RestrictedItem,
  WorldMapData,
  InternationalAnalytics
} from '@/types/international';

// Caribbean and Latin American Countries
export const countries: Country[] = [
  {
    code: 'PR',
    name: 'Puerto Rico',
    flag: '🇵🇷',
    currency: 'USD',
    currencySymbol: '$',
    timezone: 'America/Puerto_Rico',
    customsOffice: 'San Juan Customs',
    importDutyRate: 0.06,
    vatRate: 0.115,
    restrictedItems: ['Firearms', 'Ammunition', 'Prescription Drugs'],
    prohibitedItems: ['Illegal Drugs', 'Counterfeit Goods', 'Endangered Species'],
    requiredDocuments: ['Commercial Invoice', 'Packing List'],
    transitTime: { express: 1, standard: 3, economy: 7 },
    shippingZones: []
  },
  {
    code: 'DO',
    name: 'Dominican Republic',
    flag: '🇩🇴',
    currency: 'DOP',
    currencySymbol: 'RD$',
    timezone: 'America/Santo_Domingo',
    customsOffice: 'Santo Domingo Customs',
    importDutyRate: 0.20,
    vatRate: 0.18,
    restrictedItems: ['Electronics', 'Textiles', 'Agricultural Products'],
    prohibitedItems: ['Weapons', 'Drugs', 'Pornography'],
    requiredDocuments: ['Commercial Invoice', 'Certificate of Origin'],
    transitTime: { express: 2, standard: 5, economy: 10 },
    shippingZones: []
  },
  {
    code: 'JM',
    name: 'Jamaica',
    flag: '🇯🇲',
    currency: 'JMD',
    currencySymbol: 'J$',
    timezone: 'America/Jamaica',
    customsOffice: 'Kingston Customs',
    importDutyRate: 0.15,
    vatRate: 0.125,
    restrictedItems: ['Food Items', 'Medicines', 'Electronics'],
    prohibitedItems: ['Firearms', 'Illegal Substances', 'Counterfeit Items'],
    requiredDocuments: ['Commercial Invoice', 'Import License'],
    transitTime: { express: 2, standard: 6, economy: 12 },
    shippingZones: []
  },
  {
    code: 'TT',
    name: 'Trinidad and Tobago',
    flag: '🇹🇹',
    currency: 'TTD',
    currencySymbol: 'TT$',
    timezone: 'America/Port_of_Spain',
    customsOffice: 'Port of Spain Customs',
    importDutyRate: 0.25,
    vatRate: 0.125,
    restrictedItems: ['Petroleum Products', 'Chemicals', 'Machinery'],
    prohibitedItems: ['Explosives', 'Radioactive Materials', 'Illegal Drugs'],
    requiredDocuments: ['Commercial Invoice', 'Import Permit'],
    transitTime: { express: 3, standard: 7, economy: 14 },
    shippingZones: []
  },
  {
    code: 'BB',
    name: 'Barbados',
    flag: '🇧🇧',
    currency: 'BBD',
    currencySymbol: 'Bds$',
    timezone: 'America/Barbados',
    customsOffice: 'Bridgetown Customs',
    importDutyRate: 0.20,
    vatRate: 0.175,
    restrictedItems: ['Agricultural Products', 'Textiles', 'Electronics'],
    prohibitedItems: ['Weapons', 'Illegal Substances', 'Counterfeit Goods'],
    requiredDocuments: ['Commercial Invoice', 'Import License'],
    transitTime: { express: 2, standard: 5, economy: 10 },
    shippingZones: []
  },
  {
    code: 'MX',
    name: 'Mexico',
    flag: '🇲🇽',
    currency: 'MXN',
    currencySymbol: '$',
    timezone: 'America/Mexico_City',
    customsOffice: 'Mexico City Customs',
    importDutyRate: 0.16,
    vatRate: 0.16,
    restrictedItems: ['Electronics', 'Automobiles', 'Agricultural Products'],
    prohibitedItems: ['Firearms', 'Illegal Drugs', 'Endangered Species'],
    requiredDocuments: ['Commercial Invoice', 'Certificate of Origin', 'Import Permit'],
    transitTime: { express: 2, standard: 5, economy: 10 },
    shippingZones: []
  },
  {
    code: 'CO',
    name: 'Colombia',
    flag: '🇨🇴',
    currency: 'COP',
    currencySymbol: '$',
    timezone: 'America/Bogota',
    customsOffice: 'Bogota Customs',
    importDutyRate: 0.15,
    vatRate: 0.19,
    restrictedItems: ['Textiles', 'Electronics', 'Machinery'],
    prohibitedItems: ['Weapons', 'Illegal Drugs', 'Counterfeit Items'],
    requiredDocuments: ['Commercial Invoice', 'Import License'],
    transitTime: { express: 3, standard: 7, economy: 14 },
    shippingZones: []
  },
  {
    code: 'BR',
    name: 'Brazil',
    flag: '🇧🇷',
    currency: 'BRL',
    currencySymbol: 'R$',
    timezone: 'America/Sao_Paulo',
    customsOffice: 'Sao Paulo Customs',
    importDutyRate: 0.20,
    vatRate: 0.17,
    restrictedItems: ['Electronics', 'Automobiles', 'Agricultural Products'],
    prohibitedItems: ['Firearms', 'Illegal Drugs', 'Endangered Species'],
    requiredDocuments: ['Commercial Invoice', 'Import License', 'Certificate of Origin'],
    transitTime: { express: 3, standard: 8, economy: 15 },
    shippingZones: []
  },
  {
    code: 'AR',
    name: 'Argentina',
    flag: '🇦🇷',
    currency: 'ARS',
    currencySymbol: '$',
    timezone: 'America/Argentina/Buenos_Aires',
    customsOffice: 'Buenos Aires Customs',
    importDutyRate: 0.25,
    vatRate: 0.21,
    restrictedItems: ['Electronics', 'Textiles', 'Agricultural Products'],
    prohibitedItems: ['Weapons', 'Illegal Drugs', 'Counterfeit Items'],
    requiredDocuments: ['Commercial Invoice', 'Import Permit'],
    transitTime: { express: 4, standard: 9, economy: 18 },
    shippingZones: []
  },
  {
    code: 'CL',
    name: 'Chile',
    flag: '🇨🇱',
    currency: 'CLP',
    currencySymbol: '$',
    timezone: 'America/Santiago',
    customsOffice: 'Santiago Customs',
    importDutyRate: 0.06,
    vatRate: 0.19,
    restrictedItems: ['Electronics', 'Machinery', 'Agricultural Products'],
    prohibitedItems: ['Firearms', 'Illegal Drugs', 'Endangered Species'],
    requiredDocuments: ['Commercial Invoice', 'Import License'],
    transitTime: { express: 3, standard: 7, economy: 14 },
    shippingZones: []
  }
];

// Currencies with exchange rates
export const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 1.00, lastUpdated: '2024-01-15T10:00:00Z' },
  { code: 'DOP', name: 'Dominican Peso', symbol: 'RD$', exchangeRate: 58.50, lastUpdated: '2024-01-15T10:00:00Z' },
  { code: 'JMD', name: 'Jamaican Dollar', symbol: 'J$', exchangeRate: 155.20, lastUpdated: '2024-01-15T10:00:00Z' },
  { code: 'TTD', name: 'Trinidad and Tobago Dollar', symbol: 'TT$', exchangeRate: 6.78, lastUpdated: '2024-01-15T10:00:00Z' },
  { code: 'BBD', name: 'Barbadian Dollar', symbol: 'Bds$', exchangeRate: 2.00, lastUpdated: '2024-01-15T10:00:00Z' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', exchangeRate: 17.25, lastUpdated: '2024-01-15T10:00:00Z' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', exchangeRate: 3950.00, lastUpdated: '2024-01-15T10:00:00Z' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', exchangeRate: 4.95, lastUpdated: '2024-01-15T10:00:00Z' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', exchangeRate: 850.00, lastUpdated: '2024-01-15T10:00:00Z' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', exchangeRate: 920.00, lastUpdated: '2024-01-15T10:00:00Z' }
];

// Shipping Zones
export const shippingZones: ShippingZone[] = [
  {
    id: 'caribbean',
    name: 'Caribbean Islands',
    countries: ['PR', 'DO', 'JM', 'TT', 'BB'],
    baseRate: 25.00,
    weightMultiplier: 2.50,
    transitTime: 5
  },
  {
    id: 'central-america',
    name: 'Central America',
    countries: ['MX'],
    baseRate: 35.00,
    weightMultiplier: 3.00,
    transitTime: 7
  },
  {
    id: 'south-america-north',
    name: 'Northern South America',
    countries: ['CO'],
    baseRate: 45.00,
    weightMultiplier: 3.50,
    transitTime: 10
  },
  {
    id: 'south-america-south',
    name: 'Southern South America',
    countries: ['BR', 'AR', 'CL'],
    baseRate: 55.00,
    weightMultiplier: 4.00,
    transitTime: 12
  }
];

// Sample International Packages
export const internationalPackages: InternationalPackage[] = [
  {
    id: 'INT001',
    trackingNumber: 'INT123456789PR',
    customerId: '1',
    customerName: 'María González Rodríguez',
    originCountry: 'PR',
    destinationCountry: 'DO',
    weight: 2.5,
    dimensions: { length: 30, width: 20, height: 15 },
    declaredValue: 150.00,
    declaredCurrency: 'USD',
    contents: [
      {
        id: 'item1',
        description: 'Electronics - Smartphone',
        quantity: 1,
        unitValue: 150.00,
        weight: 2.5,
        hsCode: '8517.12.00',
        originCountry: 'PR'
      }
    ],
    customsForms: [
      {
        id: 'form1',
        type: 'CN22',
        formNumber: 'CN22-2024-001',
        packageId: 'INT001',
        data: {
          senderName: 'María González Rodríguez',
          senderAddress: 'Calle Luna 123, San Juan, PR 00901',
          recipientName: 'Carlos Santos',
          recipientAddress: 'Calle Principal 456, Santo Domingo, DO',
          description: 'Electronics - Smartphone',
          value: 150.00,
          weight: 2.5
        },
        isSigned: true,
        signedAt: '2024-01-15T09:30:00Z',
        signedBy: 'María González Rodríguez',
        createdAt: '2024-01-15T09:00:00Z'
      }
    ],
    status: 'in_transit',
    carrier: 'DHL',
    estimatedDelivery: '2024-01-20T17:00:00Z',
    customsClearanceStatus: 'cleared',
    transitUpdates: [
      {
        id: 'update1',
        packageId: 'INT001',
        location: 'San Juan, PR',
        status: 'Package picked up',
        description: 'Package collected from sender',
        timestamp: '2024-01-15T10:00:00Z',
        timezone: 'America/Puerto_Rico'
      },
      {
        id: 'update2',
        packageId: 'INT001',
        location: 'Miami, FL',
        status: 'In transit',
        description: 'Package arrived at sorting facility',
        timestamp: '2024-01-16T14:30:00Z',
        timezone: 'America/New_York'
      },
      {
        id: 'update3',
        packageId: 'INT001',
        location: 'Santo Domingo, DO',
        status: 'Customs cleared',
        description: 'Package cleared customs',
        timestamp: '2024-01-17T11:15:00Z',
        timezone: 'America/Santo_Domingo'
      }
    ],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-17T11:15:00Z'
  },
  {
    id: 'INT002',
    trackingNumber: 'INT987654321PR',
    customerId: '2',
    customerName: 'Carlos Rivera Santos',
    originCountry: 'PR',
    destinationCountry: 'MX',
    weight: 5.0,
    dimensions: { length: 40, width: 30, height: 25 },
    declaredValue: 300.00,
    declaredCurrency: 'USD',
    contents: [
      {
        id: 'item2',
        description: 'Clothing - Designer Items',
        quantity: 3,
        unitValue: 100.00,
        weight: 5.0,
        hsCode: '6204.43.00',
        originCountry: 'PR'
      }
    ],
    customsForms: [
      {
        id: 'form2',
        type: 'CommercialInvoice',
        formNumber: 'CI-2024-002',
        packageId: 'INT002',
        data: {
          sellerName: 'Carlos Rivera Santos',
          sellerAddress: 'Ave. Ponce de León 456, Santurce, PR 00907',
          buyerName: 'Ana Rodriguez',
          buyerAddress: 'Av. Insurgentes 123, Mexico City, MX',
          items: [
            {
              description: 'Designer Shirt',
              quantity: 2,
              unitPrice: 80.00,
              totalPrice: 160.00
            },
            {
              description: 'Designer Pants',
              quantity: 1,
              unitPrice: 140.00,
              totalPrice: 140.00
            }
          ],
          totalValue: 300.00
        },
        isSigned: true,
        signedAt: '2024-01-16T14:00:00Z',
        signedBy: 'Carlos Rivera Santos',
        createdAt: '2024-01-16T13:30:00Z'
      }
    ],
    status: 'customs_clearance',
    carrier: 'FedEx',
    estimatedDelivery: '2024-01-23T17:00:00Z',
    customsClearanceStatus: 'in_progress',
    transitUpdates: [
      {
        id: 'update4',
        packageId: 'INT002',
        location: 'San Juan, PR',
        status: 'Package picked up',
        description: 'Package collected from sender',
        timestamp: '2024-01-16T15:00:00Z',
        timezone: 'America/Puerto_Rico'
      },
      {
        id: 'update5',
        packageId: 'INT002',
        location: 'Mexico City, MX',
        status: 'Customs processing',
        description: 'Package arrived at customs',
        timestamp: '2024-01-18T10:00:00Z',
        timezone: 'America/Mexico_City'
      }
    ],
    createdAt: '2024-01-16T13:30:00Z',
    updatedAt: '2024-01-18T10:00:00Z'
  }
];

// Prohibited Items Database
export const prohibitedItems: ProhibitedItem[] = [
  {
    id: 'proh1',
    name: 'Illegal Drugs',
    category: 'Controlled Substances',
    description: 'Any illegal drugs or controlled substances',
    countries: ['PR', 'DO', 'JM', 'TT', 'BB', 'MX', 'CO', 'BR', 'AR', 'CL'],
    restrictions: 'Completely prohibited in all countries'
  },
  {
    id: 'proh2',
    name: 'Firearms and Ammunition',
    category: 'Weapons',
    description: 'Guns, rifles, ammunition, and related items',
    countries: ['PR', 'DO', 'JM', 'TT', 'BB', 'MX', 'CO', 'BR', 'AR', 'CL'],
    restrictions: 'Requires special permits and licenses'
  },
  {
    id: 'proh3',
    name: 'Counterfeit Goods',
    category: 'Intellectual Property',
    description: 'Fake designer items, counterfeit electronics',
    countries: ['PR', 'DO', 'JM', 'TT', 'BB', 'MX', 'CO', 'BR', 'AR', 'CL'],
    restrictions: 'Illegal in all countries'
  },
  {
    id: 'proh4',
    name: 'Endangered Species',
    category: 'Wildlife',
    description: 'Products made from endangered animals',
    countries: ['PR', 'DO', 'JM', 'TT', 'BB', 'MX', 'CO', 'BR', 'AR', 'CL'],
    restrictions: 'Protected by international treaties'
  },
  {
    id: 'proh5',
    name: 'Radioactive Materials',
    category: 'Hazardous Materials',
    description: 'Radioactive substances and materials',
    countries: ['PR', 'DO', 'JM', 'TT', 'BB', 'MX', 'CO', 'BR', 'AR', 'CL'],
    restrictions: 'Requires special handling and permits'
  }
];

// Restricted Items Database
export const restrictedItems: RestrictedItem[] = [
  {
    id: 'rest1',
    name: 'Prescription Medications',
    category: 'Pharmaceuticals',
    description: 'Prescription drugs and medications',
    countries: ['PR', 'DO', 'JM', 'TT', 'BB', 'MX', 'CO', 'BR', 'AR', 'CL'],
    requirements: ['Prescription from licensed doctor', 'Import permit', 'Customs declaration'],
    permits: ['Pharmaceutical Import License', 'Medical Certificate']
  },
  {
    id: 'rest2',
    name: 'Electronics',
    category: 'Technology',
    description: 'Computers, phones, tablets, and other electronics',
    countries: ['DO', 'JM', 'TT', 'BB', 'MX', 'CO', 'BR', 'AR', 'CL'],
    requirements: ['Commercial invoice', 'Certificate of origin', 'Safety certification'],
    permits: ['Electronics Import Permit', 'Safety Certification']
  },
  {
    id: 'rest3',
    name: 'Agricultural Products',
    category: 'Food and Agriculture',
    description: 'Fresh fruits, vegetables, seeds, and plants',
    countries: ['PR', 'DO', 'JM', 'TT', 'BB', 'MX', 'CO', 'BR', 'AR', 'CL'],
    requirements: ['Phytosanitary certificate', 'Import permit', 'Inspection certificate'],
    permits: ['Agricultural Import Permit', 'Phytosanitary Certificate']
  },
  {
    id: 'rest4',
    name: 'Textiles and Clothing',
    category: 'Apparel',
    description: 'Clothing, fabrics, and textile products',
    countries: ['DO', 'JM', 'TT', 'BB', 'MX', 'CO', 'BR', 'AR', 'CL'],
    requirements: ['Commercial invoice', 'Certificate of origin', 'Fiber content declaration'],
    permits: ['Textile Import Permit', 'Fiber Content Certificate']
  },
  {
    id: 'rest5',
    name: 'Machinery and Equipment',
    category: 'Industrial',
    description: 'Industrial machinery and equipment',
    countries: ['DO', 'JM', 'TT', 'BB', 'MX', 'CO', 'BR', 'AR', 'CL'],
    requirements: ['Commercial invoice', 'Technical specifications', 'Safety certification'],
    permits: ['Machinery Import Permit', 'Safety Certification']
  }
];

// World Map Data
export const worldMapData: WorldMapData = {
  countries: {
    'PR': {
      name: 'Puerto Rico',
      coordinates: [18.2208, -66.5901],
      shippingZone: 'caribbean',
      activeShipments: 15
    },
    'DO': {
      name: 'Dominican Republic',
      coordinates: [18.7357, -70.1627],
      shippingZone: 'caribbean',
      activeShipments: 8
    },
    'JM': {
      name: 'Jamaica',
      coordinates: [18.1096, -77.2975],
      shippingZone: 'caribbean',
      activeShipments: 5
    },
    'TT': {
      name: 'Trinidad and Tobago',
      coordinates: [10.6598, -61.5190],
      shippingZone: 'caribbean',
      activeShipments: 3
    },
    'BB': {
      name: 'Barbados',
      coordinates: [13.1939, -59.5432],
      shippingZone: 'caribbean',
      activeShipments: 2
    },
    'MX': {
      name: 'Mexico',
      coordinates: [23.6345, -102.5528],
      shippingZone: 'central-america',
      activeShipments: 12
    },
    'CO': {
      name: 'Colombia',
      coordinates: [4.5709, -74.2973],
      shippingZone: 'south-america-north',
      activeShipments: 7
    },
    'BR': {
      name: 'Brazil',
      coordinates: [-14.2350, -51.9253],
      shippingZone: 'south-america-south',
      activeShipments: 9
    },
    'AR': {
      name: 'Argentina',
      coordinates: [-38.4161, -63.6167],
      shippingZone: 'south-america-south',
      activeShipments: 4
    },
    'CL': {
      name: 'Chile',
      coordinates: [-35.6751, -71.5430],
      shippingZone: 'south-america-south',
      activeShipments: 6
    }
  },
  shippingZones: {
    'caribbean': {
      name: 'Caribbean Islands',
      color: '#3B82F6',
      countries: ['PR', 'DO', 'JM', 'TT', 'BB']
    },
    'central-america': {
      name: 'Central America',
      color: '#10B981',
      countries: ['MX']
    },
    'south-america-north': {
      name: 'Northern South America',
      color: '#F59E0B',
      countries: ['CO']
    },
    'south-america-south': {
      name: 'Southern South America',
      color: '#EF4444',
      countries: ['BR', 'AR', 'CL']
    }
  }
};

// International Analytics
export const internationalAnalytics: InternationalAnalytics = {
  totalShipments: 156,
  activeShipments: 23,
  deliveredThisMonth: 89,
  averageTransitTime: 6.5,
  customsClearanceRate: 0.94,
  topDestinations: [
    { country: 'Dominican Republic', shipments: 45, revenue: 6750.00 },
    { country: 'Mexico', shipments: 38, revenue: 5700.00 },
    { country: 'Colombia', shipments: 28, revenue: 4200.00 },
    { country: 'Brazil', shipments: 25, revenue: 3750.00 },
    { country: 'Jamaica', shipments: 20, revenue: 3000.00 }
  ],
  revenueByCurrency: [
    { currency: 'USD', amount: 23400.00 },
    { currency: 'DOP', amount: 1368900.00 },
    { currency: 'MXN', amount: 403500.00 },
    { currency: 'COP', amount: 92400000.00 },
    { currency: 'BRL', amount: 115830.00 }
  ],
  commonIssues: [
    { issue: 'Missing Documentation', count: 12, percentage: 7.7 },
    { issue: 'Customs Delays', count: 8, percentage: 5.1 },
    { issue: 'Address Validation', count: 6, percentage: 3.8 },
    { issue: 'Restricted Items', count: 4, percentage: 2.6 },
    { issue: 'Payment Issues', count: 3, percentage: 1.9 }
  ]
};

// Helper functions
export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};

export const getCurrencyByCode = (code: string): Currency | undefined => {
  return currencies.find(currency => currency.code === code);
};

export const getShippingZoneByCountry = (countryCode: string): ShippingZone | undefined => {
  return shippingZones.find(zone => zone.countries.includes(countryCode));
};

export const getPackagesByStatus = (status: string): InternationalPackage[] => {
  return internationalPackages.filter(pkg => pkg.status === status);
};

export const getPackagesByDestination = (countryCode: string): InternationalPackage[] => {
  return internationalPackages.filter(pkg => pkg.destinationCountry === countryCode);
}; 