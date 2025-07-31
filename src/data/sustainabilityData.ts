import {
  CarbonFootprint,
  GreenInitiative,
  RecyclingMetrics,
  EnergyConsumption,
  SustainabilityScore,
  EcoFriendlyPackaging,
  CarbonOffsetProgram,
  ElectricVehicle,
  ConsolidatedShipping,
  PaperlessInitiative,
  PackageReuseProgram,
  RecyclingLocation,
  MaterialTracking,
  WasteAudit,
  ReductionGoal,
  SolarPanel,
  EnergyUsageTrend,
  EfficiencyImprovement,
  GreenCertification,
  LocalInitiative,
  EnvironmentalEducation,
  PartnerProgram,
  CustomerParticipation,
  ImpactReport,
  TreePlanting,
  TreePlantingCounter,
  GreenBadge,
  EnvironmentalVisualization,
  SustainabilityDashboard
} from '@/types/sustainability';

// Carbon Footprint Data
export const mockCarbonFootprint: CarbonFootprint[] = [
  {
    id: 'cf-001',
    date: '2024-01-15',
    source: 'shipping',
    value: 1250,
    unit: 'kg',
    description: 'Delivery vehicle emissions for January',
    offset: 800,
    netFootprint: 450
  },
  {
    id: 'cf-002',
    date: '2024-01-15',
    source: 'facility',
    value: 890,
    unit: 'kg',
    description: 'Office and warehouse energy consumption',
    offset: 600,
    netFootprint: 290
  },
  {
    id: 'cf-003',
    date: '2024-01-15',
    source: 'packaging',
    value: 320,
    unit: 'kg',
    description: 'Packaging materials production and disposal',
    offset: 200,
    netFootprint: 120
  },
  {
    id: 'cf-004',
    date: '2024-01-15',
    source: 'total',
    value: 2460,
    unit: 'kg',
    description: 'Total carbon footprint for January',
    offset: 1600,
    netFootprint: 860
  }
];

// Green Initiatives Data
export const mockGreenInitiatives: GreenInitiative[] = [
  {
    id: 'gi-001',
    name: 'Solar Panel Installation',
    description: 'Install solar panels on warehouse roof to generate renewable energy',
    category: 'energy',
    status: 'in-progress',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    budget: 50000,
    spent: 35000,
    impact: {
      carbonReduction: 12000,
      costSavings: 8000,
      wasteReduction: 0,
      energySavings: 15000
    },
    participants: ['Facility Manager', 'Energy Team', 'Solar Installer'],
    milestones: [
      {
        id: 'mil-001',
        title: 'Site Assessment',
        description: 'Complete site assessment and design',
        dueDate: '2024-01-15',
        completed: true,
        completionDate: '2024-01-12'
      },
      {
        id: 'mil-002',
        title: 'Installation',
        description: 'Install solar panels and inverters',
        dueDate: '2024-02-28',
        completed: false
      },
      {
        id: 'mil-003',
        title: 'Grid Connection',
        description: 'Connect to grid and start generation',
        dueDate: '2024-03-31',
        completed: false
      }
    ]
  },
  {
    id: 'gi-002',
    name: 'Electric Vehicle Fleet',
    description: 'Replace diesel delivery vehicles with electric alternatives',
    category: 'transportation',
    status: 'planned',
    startDate: '2024-04-01',
    endDate: '2024-12-31',
    budget: 150000,
    spent: 0,
    impact: {
      carbonReduction: 25000,
      costSavings: 12000,
      wasteReduction: 0,
      energySavings: 0
    },
    participants: ['Fleet Manager', 'Operations Team'],
    milestones: [
      {
        id: 'mil-004',
        title: 'Vehicle Selection',
        description: 'Select appropriate electric vehicles',
        dueDate: '2024-04-30',
        completed: false
      },
      {
        id: 'mil-005',
        title: 'Charging Infrastructure',
        description: 'Install charging stations',
        dueDate: '2024-06-30',
        completed: false
      }
    ]
  },
  {
    id: 'gi-003',
    name: 'Zero Waste Program',
    description: 'Implement comprehensive recycling and waste reduction program',
    category: 'waste',
    status: 'completed',
    startDate: '2023-06-01',
    endDate: '2023-12-31',
    budget: 15000,
    spent: 14200,
    impact: {
      carbonReduction: 8000,
      costSavings: 5000,
      wasteReduction: 12000,
      energySavings: 2000
    },
    participants: ['All Staff', 'Waste Management Team'],
    milestones: [
      {
        id: 'mil-006',
        title: 'Waste Audit',
        description: 'Complete initial waste audit',
        dueDate: '2023-06-15',
        completed: true,
        completionDate: '2023-06-12'
      },
      {
        id: 'mil-007',
        title: 'Recycling Bins',
        description: 'Install recycling bins throughout facility',
        dueDate: '2023-07-31',
        completed: true,
        completionDate: '2023-07-28'
      },
      {
        id: 'mil-008',
        title: 'Staff Training',
        description: 'Train all staff on waste separation',
        dueDate: '2023-08-31',
        completed: true,
        completionDate: '2023-08-25'
      }
    ]
  }
];

// Recycling Metrics Data
export const mockRecyclingMetrics: RecyclingMetrics[] = [
  {
    id: 'rm-001',
    date: '2024-01-15',
    material: 'paper',
    quantity: 850,
    unit: 'kg',
    location: 'Main Office',
    value: 425,
    carbonOffset: 1700
  },
  {
    id: 'rm-002',
    date: '2024-01-15',
    material: 'cardboard',
    quantity: 1200,
    unit: 'kg',
    location: 'Warehouse',
    value: 600,
    carbonOffset: 2400
  },
  {
    id: 'rm-003',
    date: '2024-01-15',
    material: 'plastic',
    quantity: 320,
    unit: 'kg',
    location: 'All Locations',
    value: 160,
    carbonOffset: 640
  },
  {
    id: 'rm-004',
    date: '2024-01-15',
    material: 'metal',
    quantity: 180,
    unit: 'kg',
    location: 'Warehouse',
    value: 270,
    carbonOffset: 720
  }
];

// Energy Consumption Data
export const mockEnergyConsumption: EnergyConsumption[] = [
  {
    id: 'ec-001',
    date: '2024-01-15',
    source: 'electricity',
    consumption: 8500,
    cost: 1700,
    carbonFootprint: 4250,
    efficiency: 85,
    peakUsage: 12000,
    offPeakUsage: 5000
  },
  {
    id: 'ec-002',
    date: '2024-01-15',
    source: 'solar',
    consumption: 2500,
    cost: 0,
    carbonFootprint: 0,
    efficiency: 92,
    peakUsage: 3000,
    offPeakUsage: 2000
  },
  {
    id: 'ec-003',
    date: '2024-01-15',
    source: 'total',
    consumption: 11000,
    cost: 1700,
    carbonFootprint: 4250,
    efficiency: 87,
    peakUsage: 15000,
    offPeakUsage: 7000
  }
];

// Sustainability Score Data
export const mockSustainabilityScore: SustainabilityScore = {
  id: 'ss-001',
  date: '2024-01-15',
  overallScore: 78,
  categories: {
    energy: 82,
    waste: 75,
    transportation: 70,
    packaging: 85,
    community: 80
  },
  improvements: [
    'Increase electric vehicle adoption',
    'Implement more renewable energy sources',
    'Expand community outreach programs'
  ],
  certifications: ['ISO 14001', 'LEED Silver', 'Green Business Certified'],
  nextReviewDate: '2024-04-15'
};

// Eco-Friendly Packaging Data
export const mockEcoFriendlyPackaging: EcoFriendlyPackaging[] = [
  {
    id: 'efp-001',
    name: 'Biodegradable Bubble Wrap',
    type: 'biodegradable',
    material: 'Cornstarch-based',
    cost: 2.50,
    carbonFootprint: 0.1,
    availability: true,
    supplier: 'EcoPack Solutions',
    certifications: ['ASTM D6400', 'EN 13432'],
    usageCount: 1500
  },
  {
    id: 'efp-002',
    name: 'Recycled Cardboard Boxes',
    type: 'recycled',
    material: '100% Post-consumer recycled cardboard',
    cost: 1.80,
    carbonFootprint: 0.05,
    availability: true,
    supplier: 'GreenBox Co.',
    certifications: ['FSC Recycled', 'SFI'],
    usageCount: 3000
  },
  {
    id: 'efp-003',
    name: 'Reusable Shipping Containers',
    type: 'reusable',
    material: 'Reinforced plastic',
    cost: 15.00,
    carbonFootprint: 0.8,
    availability: true,
    supplier: 'ReuseTech',
    certifications: ['FDA Approved', 'Food Safe'],
    usageCount: 200
  }
];

// Carbon Offset Programs Data
export const mockCarbonOffsetPrograms: CarbonOffsetProgram[] = [
  {
    id: 'cop-001',
    name: 'Puerto Rico Reforestation Project',
    provider: 'CarbonFund.org',
    projectType: 'reforestation',
    costPerTon: 25,
    totalOffset: 5000,
    certificates: [
      {
        id: 'cert-001',
        date: '2024-01-15',
        amount: 5000,
        cost: 125,
        certificateUrl: 'https://carbonfund.org/certificates/PR-001',
        verificationStatus: 'verified'
      }
    ],
    status: 'active'
  },
  {
    id: 'cop-002',
    name: 'Caribbean Wind Energy',
    provider: 'ClimatePartner',
    projectType: 'renewable-energy',
    costPerTon: 30,
    totalOffset: 3000,
    certificates: [
      {
        id: 'cert-002',
        date: '2024-01-10',
        amount: 3000,
        cost: 90,
        certificateUrl: 'https://climatepartner.com/certificates/CW-001',
        verificationStatus: 'verified'
      }
    ],
    status: 'active'
  }
];

// Electric Vehicles Data
export const mockElectricVehicles: ElectricVehicle[] = [
  {
    id: 'ev-001',
    vehicleId: 'EV-001',
    type: 'delivery-van',
    model: 'Ford E-Transit',
    batteryCapacity: 68,
    range: 200,
    currentCharge: 85,
    location: 'San Juan Warehouse',
    status: 'available',
    carbonSaved: 2500,
    mileage: 15000
  },
  {
    id: 'ev-002',
    vehicleId: 'EV-002',
    type: 'scooter',
    model: 'Segway Ninebot',
    batteryCapacity: 5.2,
    range: 45,
    currentCharge: 60,
    location: 'Bayamón Office',
    status: 'in-use',
    carbonSaved: 800,
    mileage: 5000
  },
  {
    id: 'ev-003',
    vehicleId: 'EV-003',
    type: 'bicycle',
    model: 'Electric Cargo Bike',
    batteryCapacity: 0.5,
    range: 80,
    currentCharge: 90,
    location: 'Caguas Facility',
    status: 'charging',
    carbonSaved: 1200,
    mileage: 8000
  }
];

// Consolidated Shipping Data
export const mockConsolidatedShipping: ConsolidatedShipping[] = [
  {
    id: 'cs-001',
    routeId: 'RT-001',
    packages: 45,
    totalWeight: 850,
    distance: 120,
    carbonSaved: 180,
    costSavings: 450,
    date: '2024-01-15',
    status: 'delivered'
  },
  {
    id: 'cs-002',
    routeId: 'RT-002',
    packages: 32,
    totalWeight: 620,
    distance: 95,
    carbonSaved: 140,
    costSavings: 320,
    date: '2024-01-14',
    status: 'in-transit'
  }
];

// Paperless Initiatives Data
export const mockPaperlessInitiatives: PaperlessInitiative[] = [
  {
    id: 'pi-001',
    name: 'Digital Invoice System',
    documentsProcessed: 2500,
    paperSaved: 125,
    carbonSaved: 625,
    costSavings: 2500,
    implementationDate: '2023-03-01',
    status: 'active'
  },
  {
    id: 'pi-002',
    name: 'Electronic Signatures',
    documentsProcessed: 1800,
    paperSaved: 90,
    carbonSaved: 450,
    costSavings: 1800,
    implementationDate: '2023-06-01',
    status: 'active'
  }
];

// Package Reuse Program Data
export const mockPackageReuseProgram: PackageReuseProgram[] = [
  {
    id: 'prp-001',
    packageId: 'PKG-001',
    originalUse: 'Electronics shipment',
    reuseCount: 3,
    currentUse: 'Clothing shipment',
    condition: 'good',
    carbonSaved: 2.5,
    costSavings: 8.50,
    lastUsed: '2024-01-15',
    status: 'in-use'
  },
  {
    id: 'prp-002',
    packageId: 'PKG-002',
    originalUse: 'Book shipment',
    reuseCount: 5,
    currentUse: 'Available for reuse',
    condition: 'fair',
    carbonSaved: 4.0,
    costSavings: 12.00,
    lastUsed: '2024-01-10',
    status: 'available'
  }
];

// Recycling Locations Data
export const mockRecyclingLocations: RecyclingLocation[] = [
  {
    id: 'rl-001',
    name: 'San Juan Recycling Center',
    address: 'Calle San Francisco 123, San Juan, PR 00901',
    coordinates: { lat: 18.4655, lng: -66.1057 },
    materials: ['paper', 'cardboard', 'plastic', 'metal', 'glass'],
    hours: 'Mon-Fri 8AM-6PM, Sat 9AM-3PM',
    contact: '(787) 555-0123',
    distance: 2.5,
    rating: 4.5
  },
  {
    id: 'rl-002',
    name: 'Bayamón Eco-Depot',
    address: 'Ave. Central 456, Bayamón, PR 00961',
    coordinates: { lat: 18.3985, lng: -66.1617 },
    materials: ['electronics', 'batteries', 'paper', 'plastic'],
    hours: 'Mon-Sat 7AM-7PM',
    contact: '(787) 555-0456',
    distance: 8.2,
    rating: 4.8
  }
];

// Material Tracking Data
export const mockMaterialTracking: MaterialTracking[] = [
  {
    id: 'mt-001',
    material: 'Cardboard',
    quantity: 1200,
    unit: 'kg',
    source: 'Warehouse operations',
    destination: 'San Juan Recycling Center',
    date: '2024-01-15',
    carbonFootprint: 60,
    recycled: true,
    recycledPercentage: 100
  },
  {
    id: 'mt-002',
    material: 'Plastic packaging',
    quantity: 320,
    unit: 'kg',
    source: 'Package processing',
    destination: 'Bayamón Eco-Depot',
    date: '2024-01-14',
    carbonFootprint: 160,
    recycled: true,
    recycledPercentage: 95
  }
];

// Waste Audit Data
export const mockWasteAudit: WasteAudit[] = [
  {
    id: 'wa-001',
    date: '2024-01-15',
    location: 'Main Facility',
    wasteTypes: [
      {
        type: 'General waste',
        quantity: 150,
        unit: 'kg',
        disposalMethod: 'Landfill',
        carbonFootprint: 300
      },
      {
        type: 'Recyclables',
        quantity: 450,
        unit: 'kg',
        disposalMethod: 'Recycling',
        carbonFootprint: 90
      }
    ],
    totalWaste: 600,
    totalCarbonFootprint: 390,
    recommendations: [
      'Increase composting program',
      'Reduce single-use plastics',
      'Improve waste separation training'
    ],
    nextAuditDate: '2024-04-15'
  }
];

// Reduction Goals Data
export const mockReductionGoals: ReductionGoal[] = [
  {
    id: 'rg-001',
    category: 'carbon',
    target: 10000,
    current: 8600,
    unit: 'kg CO2',
    deadline: '2024-12-31',
    progress: 86,
    status: 'on-track'
  },
  {
    id: 'rg-002',
    category: 'waste',
    target: 5000,
    current: 4200,
    unit: 'kg',
    deadline: '2024-12-31',
    progress: 84,
    status: 'on-track'
  },
  {
    id: 'rg-003',
    category: 'energy',
    target: 20000,
    current: 15000,
    unit: 'kWh',
    deadline: '2024-12-31',
    progress: 75,
    status: 'behind'
  }
];

// Solar Panels Data
export const mockSolarPanels: SolarPanel[] = [
  {
    id: 'sp-001',
    location: 'Warehouse Roof',
    capacity: 50,
    currentOutput: 42,
    efficiency: 84,
    installationDate: '2023-09-15',
    lastMaintenance: '2024-01-01',
    nextMaintenance: '2024-04-01',
    totalEnergyGenerated: 15000,
    carbonOffset: 7500,
    costSavings: 3000
  },
  {
    id: 'sp-002',
    location: 'Office Building',
    capacity: 25,
    currentOutput: 21,
    efficiency: 84,
    installationDate: '2023-11-01',
    lastMaintenance: '2024-01-01',
    nextMaintenance: '2024-04-01',
    totalEnergyGenerated: 8000,
    carbonOffset: 4000,
    costSavings: 1600
  }
];

// Energy Usage Trends Data
export const mockEnergyUsageTrends: EnergyUsageTrend[] = [
  {
    id: 'eut-001',
    period: 'monthly',
    date: '2024-01',
    consumption: 11000,
    cost: 2200,
    carbonFootprint: 5500,
    efficiency: 87,
    peakDemand: 75,
    renewablePercentage: 23
  },
  {
    id: 'eut-002',
    period: 'monthly',
    date: '2023-12',
    consumption: 12000,
    cost: 2400,
    carbonFootprint: 6000,
    efficiency: 85,
    peakDemand: 80,
    renewablePercentage: 20
  }
];

// Efficiency Improvements Data
export const mockEfficiencyImprovements: EfficiencyImprovement[] = [
  {
    id: 'ei-001',
    name: 'LED Lighting Upgrade',
    description: 'Replace all fluorescent lights with LED fixtures',
    category: 'lighting',
    implementationDate: '2023-08-01',
    cost: 15000,
    savings: {
      energy: 3000,
      cost: 600,
      carbon: 1500
    },
    paybackPeriod: 25,
    status: 'completed'
  },
  {
    id: 'ei-002',
    name: 'Smart HVAC System',
    description: 'Install smart thermostats and energy management system',
    category: 'hvac',
    implementationDate: '2024-02-01',
    cost: 25000,
    savings: {
      energy: 5000,
      cost: 1000,
      carbon: 2500
    },
    paybackPeriod: 25,
    status: 'in-progress'
  }
];

// Green Certifications Data
export const mockGreenCertifications: GreenCertification[] = [
  {
    id: 'gc-001',
    name: 'ISO 14001 Environmental Management',
    issuer: 'ISO',
    level: 'gold',
    issueDate: '2023-06-01',
    expiryDate: '2026-06-01',
    requirements: ['Environmental policy', 'Impact assessment', 'Compliance monitoring'],
    status: 'active',
    score: 92
  },
  {
    id: 'gc-002',
    name: 'LEED Silver Certification',
    issuer: 'USGBC',
    level: 'silver',
    issueDate: '2023-09-01',
    expiryDate: '2028-09-01',
    requirements: ['Energy efficiency', 'Water conservation', 'Sustainable materials'],
    status: 'active',
    score: 68
  }
];

// Local Initiatives Data
export const mockLocalInitiatives: LocalInitiative[] = [
  {
    id: 'li-001',
    name: 'Beach Cleanup Program',
    description: 'Monthly beach cleanup events in collaboration with local communities',
    category: 'cleanup',
    location: 'Various beaches in Puerto Rico',
    startDate: '2023-03-01',
    endDate: '2024-12-31',
    participants: 150,
    impact: {
      peopleReached: 500,
      carbonSaved: 2000,
      wasteCollected: 5000,
      treesPlanted: 0
    },
    budget: 8000,
    status: 'active',
    photos: ['beach-cleanup-1.jpg', 'beach-cleanup-2.jpg']
  },
  {
    id: 'li-002',
    name: 'Urban Garden Project',
    description: 'Create community gardens in urban areas',
    category: 'conservation',
    location: 'San Juan, Bayamón, Caguas',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    participants: 75,
    impact: {
      peopleReached: 300,
      carbonSaved: 1500,
      wasteCollected: 0,
      treesPlanted: 200
    },
    budget: 12000,
    status: 'active',
    photos: ['garden-1.jpg', 'garden-2.jpg']
  }
];

// Environmental Education Data
export const mockEnvironmentalEducation: EnvironmentalEducation[] = [
  {
    id: 'ee-001',
    title: 'Sustainable Business Practices Workshop',
    type: 'workshop',
    audience: 'employees',
    date: '2024-01-10',
    participants: 45,
    topics: ['Carbon footprint reduction', 'Waste management', 'Energy efficiency'],
    materials: ['Presentation slides', 'Handouts', 'Action plan templates'],
    feedback: {
      rating: 4.6,
      comments: ['Very informative', 'Practical tips', 'Well organized']
    },
    impact: {
      knowledgeIncrease: 85,
      behaviorChange: 70,
      carbonSaved: 500
    }
  },
  {
    id: 'ee-002',
    title: 'Green Shipping Awareness Campaign',
    type: 'campaign',
    audience: 'customers',
    date: '2024-01-01',
    participants: 200,
    topics: ['Eco-friendly packaging', 'Carbon offset options', 'Sustainable delivery'],
    materials: ['Email campaign', 'Social media posts', 'Website content'],
    feedback: {
      rating: 4.2,
      comments: ['Good information', 'Easy to understand', 'Appreciate the effort']
    },
    impact: {
      knowledgeIncrease: 60,
      behaviorChange: 45,
      carbonSaved: 800
    }
  }
];

// Partner Programs Data
export const mockPartnerPrograms: PartnerProgram[] = [
  {
    id: 'pp-001',
    partnerName: 'EcoPack Solutions',
    programType: 'packaging',
    description: 'Collaboration on sustainable packaging solutions',
    startDate: '2023-07-01',
    status: 'active',
    impact: {
      carbonSaved: 3000,
      costSavings: 1500,
      participants: 25
    },
    commitments: ['Provide eco-friendly packaging', 'Share best practices', 'Joint marketing'],
    achievements: ['Reduced packaging waste by 40%', 'Launched 3 new eco-products']
  },
  {
    id: 'pp-002',
    partnerName: 'Green Energy Co.',
    programType: 'energy',
    description: 'Renewable energy partnership for facilities',
    startDate: '2023-09-01',
    status: 'active',
    impact: {
      carbonSaved: 5000,
      costSavings: 2000,
      participants: 15
    },
    commitments: ['Install solar panels', 'Energy audits', 'Efficiency consulting'],
    achievements: ['Installed 75kW solar capacity', 'Reduced energy costs by 25%']
  }
];

// Customer Participation Data
export const mockCustomerParticipation: CustomerParticipation[] = [
  {
    id: 'cp-001',
    customerId: 'CUST-001',
    program: 'Green Shipping Program',
    participationDate: '2024-01-01',
    actions: [
      {
        action: 'Chose eco-friendly packaging',
        impact: 2.5,
        date: '2024-01-15'
      },
      {
        action: 'Opted for carbon offset',
        impact: 5.0,
        date: '2024-01-15'
      }
    ],
    totalImpact: 7.5,
    rewards: ['Green Shipping Badge', '5% discount on next order'],
    status: 'active'
  },
  {
    id: 'cp-002',
    customerId: 'CUST-002',
    program: 'Package Reuse Program',
    participationDate: '2023-12-01',
    actions: [
      {
        action: 'Returned package for reuse',
        impact: 1.5,
        date: '2024-01-10'
      }
    ],
    totalImpact: 1.5,
    rewards: ['Reuse Champion Badge'],
    status: 'active'
  }
];

// Impact Report Data
export const mockImpactReport: ImpactReport = {
  id: 'ir-001',
  period: 'Q4 2023',
  date: '2024-01-15',
  summary: {
    totalCarbonSaved: 25000,
    totalWasteReduced: 15000,
    totalEnergySaved: 30000,
    totalCostSavings: 25000,
    treesPlanted: 500,
    peopleReached: 2000
  },
  highlights: [
    'Achieved 25% reduction in carbon footprint',
    'Launched electric vehicle pilot program',
    'Completed solar panel installation',
    'Reached 500 trees planted milestone'
  ],
  challenges: [
    'Supply chain delays for electric vehicles',
    'Limited recycling infrastructure in some areas',
    'Staff training needs for new systems'
  ],
  nextPeriodGoals: [
    'Expand electric vehicle fleet to 10 vehicles',
    'Achieve 30% renewable energy usage',
    'Launch community education program',
    'Implement advanced waste tracking system'
  ],
  stakeholders: ['Employees', 'Customers', 'Partners', 'Local Communities', 'Regulators']
};

// Tree Planting Data
export const mockTreePlantings: TreePlanting[] = [
  {
    id: 'tp-001',
    date: '2024-01-15',
    location: 'El Yunque National Forest',
    species: 'Tabonuco',
    quantity: 50,
    carbonOffset: 2500,
    cost: 1000,
    status: 'planted',
    maintenanceRequired: true,
    nextMaintenanceDate: '2024-04-15'
  },
  {
    id: 'tp-002',
    date: '2024-01-10',
    location: 'San Juan Urban Forest',
    species: 'Flamboyán',
    quantity: 30,
    carbonOffset: 1500,
    cost: 600,
    status: 'planted',
    maintenanceRequired: true,
    nextMaintenanceDate: '2024-04-10'
  },
  {
    id: 'tp-003',
    date: '2023-12-15',
    location: 'Bayamón Community Park',
    species: 'Ceiba',
    quantity: 25,
    carbonOffset: 1250,
    cost: 500,
    status: 'growing',
    maintenanceRequired: false
  }
];

// Tree Planting Counter Data
export const mockTreePlantingCounter: TreePlantingCounter = {
  totalPlanted: 500,
  totalCarbonOffset: 25000,
  goal: 1000,
  progress: 50,
  recentPlantings: mockTreePlantings,
  locations: [
    {
      location: 'El Yunque National Forest',
      count: 200,
      carbonOffset: 10000
    },
    {
      location: 'San Juan Urban Forest',
      count: 150,
      carbonOffset: 7500
    },
    {
      location: 'Bayamón Community Park',
      count: 100,
      carbonOffset: 5000
    },
    {
      location: 'Caguas Botanical Garden',
      count: 50,
      carbonOffset: 2500
    }
  ]
};

// Green Badges Data
export const mockGreenBadges: GreenBadge[] = [
  {
    id: 'gb-001',
    name: 'Carbon Neutral Champion',
    description: 'Achieved carbon neutral status for 3 consecutive months',
    category: 'achievement',
    icon: '🌱',
    earnedDate: '2024-01-15',
    criteria: ['Zero net carbon footprint', '3 months consecutive', 'Verified offsets'],
    impact: 5000,
    level: 'gold'
  },
  {
    id: 'gb-002',
    name: 'Waste Reduction Master',
    description: 'Reduced waste by 50% compared to baseline',
    category: 'milestone',
    icon: '♻️',
    earnedDate: '2023-12-01',
    criteria: ['50% waste reduction', '6 months sustained', 'Audit verified'],
    impact: 8000,
    level: 'silver'
  },
  {
    id: 'gb-003',
    name: 'Solar Pioneer',
    description: 'First to install solar panels in the region',
    category: 'achievement',
    icon: '☀️',
    earnedDate: '2023-09-15',
    criteria: ['Solar installation', 'Regional first', 'Performance verified'],
    impact: 15000,
    level: 'platinum'
  }
];

// Environmental Visualizations Data
export const mockEnvironmentalVisualizations: EnvironmentalVisualization[] = [
  {
    id: 'ev-001',
    type: 'chart',
    title: 'Carbon Footprint Trend',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Carbon Footprint (kg CO2)',
          data: [2460, 2200, 1980, 1850, 1720, 1600],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)'
        }
      ]
    },
    config: {
      colors: ['#10B981', '#059669', '#047857'],
      thresholds: [2000, 1500, 1000],
      units: 'kg CO2'
    },
    lastUpdated: '2024-01-15'
  },
  {
    id: 'ev-002',
    type: 'gauge',
    title: 'Sustainability Score',
    data: {
      value: 78,
      max: 100,
      thresholds: [60, 75, 90]
    },
    config: {
      colors: ['#EF4444', '#F59E0B', '#10B981'],
      thresholds: [60, 75, 90],
      units: 'points'
    },
    lastUpdated: '2024-01-15'
  }
];

// Main Sustainability Dashboard Data
export const mockSustainabilityDashboard: SustainabilityDashboard = {
  carbonFootprint: mockCarbonFootprint,
  greenInitiatives: mockGreenInitiatives,
  recyclingMetrics: mockRecyclingMetrics,
  energyConsumption: mockEnergyConsumption,
  sustainabilityScore: mockSustainabilityScore,
  treePlantingCounter: mockTreePlantingCounter,
  greenBadges: mockGreenBadges,
  visualizations: mockEnvironmentalVisualizations
}; 