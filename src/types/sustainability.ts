// Sustainability and Environmental Impact Types

export interface CarbonFootprint {
  id: string;
  date: string;
  source: 'shipping' | 'facility' | 'vehicles' | 'packaging' | 'total';
  value: number; // in kg CO2
  unit: 'kg' | 'tons';
  description: string;
  offset?: number;
  netFootprint: number;
}

export interface GreenInitiative {
  id: string;
  name: string;
  description: string;
  category: 'energy' | 'waste' | 'transportation' | 'packaging' | 'community';
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  impact: {
    carbonReduction: number; // kg CO2
    costSavings: number;
    wasteReduction: number; // kg
    energySavings: number; // kWh
  };
  participants: string[];
  milestones: InitiativeMilestone[];
}

export interface InitiativeMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  completionDate?: string;
}

export interface RecyclingMetrics {
  id: string;
  date: string;
  material: 'paper' | 'plastic' | 'cardboard' | 'metal' | 'glass' | 'electronics';
  quantity: number;
  unit: 'kg' | 'tons' | 'pieces';
  location: string;
  value: number; // monetary value
  carbonOffset: number; // kg CO2 saved
}

export interface EnergyConsumption {
  id: string;
  date: string;
  source: 'electricity' | 'solar' | 'generator' | 'total';
  consumption: number; // kWh
  cost: number;
  carbonFootprint: number; // kg CO2
  efficiency: number; // percentage
  peakUsage: number;
  offPeakUsage: number;
}

export interface SustainabilityScore {
  id: string;
  date: string;
  overallScore: number; // 0-100
  categories: {
    energy: number;
    waste: number;
    transportation: number;
    packaging: number;
    community: number;
  };
  improvements: string[];
  certifications: string[];
  nextReviewDate: string;
}

// Green Shipping Types
export interface EcoFriendlyPackaging {
  id: string;
  name: string;
  type: 'biodegradable' | 'recycled' | 'reusable' | 'minimal';
  material: string;
  cost: number;
  carbonFootprint: number; // kg CO2 per unit
  availability: boolean;
  supplier: string;
  certifications: string[];
  usageCount: number;
}

export interface CarbonOffsetProgram {
  id: string;
  name: string;
  provider: string;
  projectType: 'reforestation' | 'renewable-energy' | 'ocean-conservation' | 'community';
  costPerTon: number;
  totalOffset: number; // kg CO2
  certificates: CarbonOffsetCertificate[];
  status: 'active' | 'inactive' | 'pending';
}

export interface CarbonOffsetCertificate {
  id: string;
  date: string;
  amount: number; // kg CO2
  cost: number;
  certificateUrl: string;
  verificationStatus: 'verified' | 'pending' | 'expired';
}

export interface ElectricVehicle {
  id: string;
  vehicleId: string;
  type: 'delivery-van' | 'scooter' | 'bicycle' | 'truck';
  model: string;
  batteryCapacity: number; // kWh
  range: number; // km
  currentCharge: number; // percentage
  location: string;
  status: 'available' | 'in-use' | 'charging' | 'maintenance';
  carbonSaved: number; // kg CO2
  mileage: number; // km
}

export interface ConsolidatedShipping {
  id: string;
  routeId: string;
  packages: number;
  totalWeight: number; // kg
  distance: number; // km
  carbonSaved: number; // kg CO2 vs individual shipments
  costSavings: number;
  date: string;
  status: 'scheduled' | 'in-transit' | 'delivered';
}

export interface PaperlessInitiative {
  id: string;
  name: string;
  documentsProcessed: number;
  paperSaved: number; // kg
  carbonSaved: number; // kg CO2
  costSavings: number;
  implementationDate: string;
  status: 'active' | 'planned' | 'completed';
}

// Waste Reduction Types
export interface PackageReuseProgram {
  id: string;
  packageId: string;
  originalUse: string;
  reuseCount: number;
  currentUse: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  carbonSaved: number; // kg CO2
  costSavings: number;
  lastUsed: string;
  status: 'available' | 'in-use' | 'retired';
}

export interface RecyclingLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  materials: string[];
  hours: string;
  contact: string;
  distance: number; // km from facility
  rating: number; // 1-5 stars
}

export interface MaterialTracking {
  id: string;
  material: string;
  quantity: number;
  unit: string;
  source: string;
  destination: string;
  date: string;
  carbonFootprint: number; // kg CO2
  recycled: boolean;
  recycledPercentage: number;
}

export interface WasteAudit {
  id: string;
  date: string;
  location: string;
  wasteTypes: {
    type: string;
    quantity: number;
    unit: string;
    disposalMethod: string;
    carbonFootprint: number;
  }[];
  totalWaste: number;
  totalCarbonFootprint: number;
  recommendations: string[];
  nextAuditDate: string;
}

export interface ReductionGoal {
  id: string;
  category: 'waste' | 'energy' | 'carbon' | 'water';
  target: number;
  current: number;
  unit: string;
  deadline: string;
  progress: number; // percentage
  status: 'on-track' | 'behind' | 'completed' | 'at-risk';
}

// Energy Management Types
export interface SolarPanel {
  id: string;
  location: string;
  capacity: number; // kW
  currentOutput: number; // kW
  efficiency: number; // percentage
  installationDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  totalEnergyGenerated: number; // kWh
  carbonOffset: number; // kg CO2
  costSavings: number;
}

export interface EnergyUsageTrend {
  id: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: string;
  consumption: number; // kWh
  cost: number;
  carbonFootprint: number; // kg CO2
  efficiency: number; // percentage
  peakDemand: number; // kW
  renewablePercentage: number;
}

export interface EfficiencyImprovement {
  id: string;
  name: string;
  description: string;
  category: 'lighting' | 'hvac' | 'equipment' | 'building' | 'process';
  implementationDate: string;
  cost: number;
  savings: {
    energy: number; // kWh
    cost: number;
    carbon: number; // kg CO2
  };
  paybackPeriod: number; // months
  status: 'planned' | 'in-progress' | 'completed';
}

export interface GreenCertification {
  id: string;
  name: string;
  issuer: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  issueDate: string;
  expiryDate: string;
  requirements: string[];
  status: 'active' | 'expired' | 'pending-renewal';
  score: number; // certification score
}

// Community Impact Types
export interface LocalInitiative {
  id: string;
  name: string;
  description: string;
  category: 'education' | 'cleanup' | 'conservation' | 'awareness';
  location: string;
  startDate: string;
  endDate?: string;
  participants: number;
  impact: {
    peopleReached: number;
    carbonSaved: number; // kg CO2
    wasteCollected: number; // kg
    treesPlanted: number;
  };
  budget: number;
  status: 'planned' | 'active' | 'completed';
  photos: string[];
}

export interface EnvironmentalEducation {
  id: string;
  title: string;
  type: 'workshop' | 'presentation' | 'training' | 'campaign';
  audience: 'employees' | 'customers' | 'community' | 'students';
  date: string;
  participants: number;
  topics: string[];
  materials: string[];
  feedback: {
    rating: number; // 1-5
    comments: string[];
  };
  impact: {
    knowledgeIncrease: number; // percentage
    behaviorChange: number; // percentage
    carbonSaved: number; // kg CO2
  };
}

export interface PartnerProgram {
  id: string;
  partnerName: string;
  programType: 'recycling' | 'energy' | 'transportation' | 'education';
  description: string;
  startDate: string;
  status: 'active' | 'completed' | 'planned';
  impact: {
    carbonSaved: number; // kg CO2
    costSavings: number;
    participants: number;
  };
  commitments: string[];
  achievements: string[];
}

export interface CustomerParticipation {
  id: string;
  customerId: string;
  program: string;
  participationDate: string;
  actions: {
    action: string;
    impact: number; // kg CO2 saved
    date: string;
  }[];
  totalImpact: number; // kg CO2
  rewards: string[];
  status: 'active' | 'inactive';
}

export interface ImpactReport {
  id: string;
  period: string;
  date: string;
  summary: {
    totalCarbonSaved: number; // kg CO2
    totalWasteReduced: number; // kg
    totalEnergySaved: number; // kWh
    totalCostSavings: number;
    treesPlanted: number;
    peopleReached: number;
  };
  highlights: string[];
  challenges: string[];
  nextPeriodGoals: string[];
  stakeholders: string[];
}

// Tree Planting Counter
export interface TreePlanting {
  id: string;
  date: string;
  location: string;
  species: string;
  quantity: number;
  carbonOffset: number; // kg CO2 over lifetime
  cost: number;
  status: 'planted' | 'growing' | 'mature';
  maintenanceRequired: boolean;
  nextMaintenanceDate?: string;
}

export interface TreePlantingCounter {
  totalPlanted: number;
  totalCarbonOffset: number; // kg CO2
  goal: number;
  progress: number; // percentage
  recentPlantings: TreePlanting[];
  locations: {
    location: string;
    count: number;
    carbonOffset: number;
  }[];
}

// Green Badges and Visualizations
export interface GreenBadge {
  id: string;
  name: string;
  description: string;
  category: 'achievement' | 'milestone' | 'certification';
  icon: string;
  earnedDate: string;
  criteria: string[];
  impact: number; // kg CO2 saved or other metric
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface EnvironmentalVisualization {
  id: string;
  type: 'chart' | 'gauge' | 'progress' | 'map' | 'timeline';
  title: string;
  data: any;
  config: {
    colors: string[];
    thresholds: number[];
    units: string;
  };
  lastUpdated: string;
}

// Main Sustainability Dashboard Data
export interface SustainabilityDashboard {
  carbonFootprint: CarbonFootprint[];
  greenInitiatives: GreenInitiative[];
  recyclingMetrics: RecyclingMetrics[];
  energyConsumption: EnergyConsumption[];
  sustainabilityScore: SustainabilityScore;
  treePlantingCounter: TreePlantingCounter;
  greenBadges: GreenBadge[];
  visualizations: EnvironmentalVisualization[];
} 