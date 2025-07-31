export type DeviceType = 'barcode_scanner' | 'tablet' | 'printer' | 'vehicle' | 'smartphone' | 'laptop' | 'radio' | 'gps_tracker';

export type DeviceStatus = 'active' | 'inactive' | 'maintenance' | 'retired' | 'lost' | 'repair';

export type BatteryLevel = 'critical' | 'low' | 'medium' | 'high' | 'charging' | 'full';

export type MaintenanceType = 'scheduled' | 'preventive' | 'corrective' | 'emergency' | 'upgrade';

export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';

export type AssetCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';

export type CheckInOutStatus = 'checked_in' | 'checked_out' | 'overdue_return' | 'lost';

export type PrinterType = 'label' | 'receipt' | 'document' | 'thermal' | 'inkjet' | 'laser';

export type PrintJobStatus = 'queued' | 'printing' | 'completed' | 'failed' | 'cancelled';

export type VehicleType = 'van' | 'truck' | 'car' | 'motorcycle' | 'bicycle';

export type FuelType = 'gasoline' | 'diesel' | 'electric' | 'hybrid';

export interface Device {
  id: string;
  type: DeviceType;
  name: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  assetTag: string;
  status: DeviceStatus;
  location: DeviceLocation;
  assignedTo?: {
    userId: string;
    userName: string;
    employeeId: string;
    assignedAt: string;
  };
  purchaseInfo: {
    purchaseDate: string;
    cost: number;
    currency: string;
    vendor: string;
    warrantyExpiry?: string;
  };
  specifications: Record<string, any>;
  lastSeen?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceLocation {
  type: 'facility' | 'vehicle' | 'employee' | 'warehouse' | 'external';
  name: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  building?: string;
  floor?: string;
  room?: string;
  updatedAt: string;
}

export interface MobileDevice extends Device {
  type: 'tablet' | 'smartphone';
  health: {
    batteryLevel: BatteryLevel;
    batteryPercentage: number;
    batteryHealth: number; // 0-100%
    storageUsed: number; // GB
    storageTotal: number; // GB
    memoryUsage: number; // %
    cpuUsage: number; // %
    temperature: number; // Celsius
    signalStrength: number; // dBm
    lastHealthCheck: string;
  };
  software: {
    osVersion: string;
    appVersion: string;
    securityPatchLevel?: string;
    installedApps: InstalledApp[];
    pendingUpdates: PendingUpdate[];
  };
  connectivity: {
    wifiConnected: boolean;
    cellularConnected: boolean;
    bluetoothEnabled: boolean;
    gpsEnabled: boolean;
    lastConnected: string;
  };
  security: {
    isEncrypted: boolean;
    screenLockEnabled: boolean;
    remoteWipeCapable: boolean;
    mdmEnrolled: boolean;
    complianceStatus: 'compliant' | 'non_compliant' | 'unknown';
    lastSecurityScan: string;
  };
}

export interface InstalledApp {
  name: string;
  version: string;
  packageId: string;
  installDate: string;
  lastUsed?: string;
  size: number; // MB
  permissions: string[];
}

export interface PendingUpdate {
  type: 'os' | 'app' | 'security';
  name: string;
  currentVersion: string;
  targetVersion: string;
  size: number; // MB
  priority: 'low' | 'medium' | 'high' | 'critical';
  releaseDate: string;
  description: string;
}

export interface BarcodeScanner extends Device {
  type: 'barcode_scanner';
  scannerSpecs: {
    supportedFormats: string[];
    scanRange: string;
    batteryLife: string; // hours
    connectivity: ('bluetooth' | 'usb' | 'wifi')[];
    isWireless: boolean;
  };
  performance: {
    scansPerDay: number;
    accuracyRate: number; // percentage
    lastCalibration: string;
    totalScans: number;
  };
}

export interface Printer extends Device {
  type: 'printer';
  printerType: PrinterType;
  capabilities: {
    maxWidth: number; // mm
    maxLength: number; // mm
    resolution: string; // DPI
    printSpeed: string; // labels/receipts per minute
    connectivity: ('ethernet' | 'wifi' | 'usb' | 'bluetooth')[];
    duplexSupport: boolean;
    colorSupport: boolean;
  };
  supplies: {
    labels?: PrinterSupply;
    ink?: PrinterSupply;
    toner?: PrinterSupply;
    ribbon?: PrinterSupply;
  };
  printQueue: PrintJob[];
  performance: {
    totalPrints: number;
    printsToday: number;
    averageJobTime: number; // seconds
    errorRate: number; // percentage
    lastMaintenance: string;
  };
}

export interface PrinterSupply {
  type: string;
  currentLevel: number; // percentage
  lowThreshold: number; // percentage
  criticalThreshold: number; // percentage
  lastReplaced: string;
  estimatedDaysRemaining: number;
  partNumber: string;
  vendor: string;
  cost: number;
}

export interface PrintJob {
  id: string;
  printerId: string;
  userId: string;
  userName: string;
  jobName: string;
  status: PrintJobStatus;
  pages: number;
  copies: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  submittedAt: string;
  startedAt?: string;
  completedAt?: string;
  estimatedDuration?: number; // seconds
  errorMessage?: string;
  cost?: number;
}

export interface Vehicle extends Device {
  type: 'vehicle';
  vehicleType: VehicleType;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    vin: string;
    licensePlate: string;
    color: string;
    fuelType: FuelType;
    capacity: {
      passengers: number;
      cargo: number; // cubic feet
      weight: number; // lbs
    };
  };
  tracking: {
    currentLocation?: {
      latitude: number;
      longitude: number;
      address: string;
      timestamp: string;
    };
    odometer: number; // miles
    fuelLevel?: number; // percentage
    engineHours?: number;
    lastGpsUpdate: string;
  };
  driver?: {
    userId: string;
    userName: string;
    licenseNumber: string;
    assignedAt: string;
  };
  route?: {
    routeId: string;
    routeName: string;
    startTime: string;
    estimatedEndTime: string;
    stops: RouteStop[];
    completedStops: number;
    totalStops: number;
  };
  performance: {
    fuelEfficiency: number; // MPG
    averageSpeed: number; // MPH
    utilizationRate: number; // percentage
    totalMiles: number;
    totalTrips: number;
  };
}

export interface RouteStop {
  id: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  estimatedArrival: string;
  actualArrival?: string;
  status: 'pending' | 'en_route' | 'arrived' | 'completed' | 'skipped';
  packages: number;
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  deviceId: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  title: string;
  description: string;
  scheduledDate: string;
  startedAt?: string;
  completedAt?: string;
  estimatedDuration: number; // hours
  actualDuration?: number; // hours
  technician?: {
    userId: string;
    userName: string;
    company: string;
  };
  parts: MaintenancePart[];
  labor: {
    hours: number;
    rate: number; // per hour
    cost: number;
  };
  totalCost: number;
  currency: string;
  notes?: string;
  attachments: MaintenanceAttachment[];
  nextMaintenanceDue?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenancePart {
  partNumber: string;
  name: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  vendor: string;
  warrantyPeriod?: string;
}

export interface MaintenanceAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface AssetCheckInOut {
  id: string;
  deviceId: string;
  userId: string;
  userName: string;
  action: 'check_in' | 'check_out';
  timestamp: string;
  location: DeviceLocation;
  condition: AssetCondition;
  notes?: string;
  photos?: string[];
  expectedReturn?: string;
  actualReturn?: string;
  status: CheckInOutStatus;
}

export interface DeviceAlert {
  id: string;
  deviceId: string;
  deviceName: string;
  type: 'battery_low' | 'maintenance_due' | 'offline' | 'security_breach' | 'supply_low' | 'error' | 'overdue_return';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface DeviceGroup {
  id: string;
  name: string;
  description: string;
  type: 'location' | 'department' | 'function' | 'project';
  deviceIds: string[];
  policies: DevicePolicy[];
  createdAt: string;
  updatedAt: string;
}

export interface DevicePolicy {
  id: string;
  name: string;
  description: string;
  type: 'security' | 'usage' | 'maintenance' | 'compliance';
  rules: PolicyRule[];
  applicableDeviceTypes: DeviceType[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyRule {
  id: string;
  condition: string;
  action: string;
  parameters: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface DeviceAnalytics {
  overview: {
    totalDevices: number;
    activeDevices: number;
    maintenanceDevices: number;
    retiredDevices: number;
    totalValue: number;
    utilizationRate: number;
  };
  deviceBreakdown: {
    type: DeviceType;
    count: number;
    activeCount: number;
    totalValue: number;
    averageAge: number; // months
    utilizationRate: number;
  }[];
  batteryHealth: {
    deviceId: string;
    deviceName: string;
    batteryLevel: BatteryLevel;
    batteryPercentage: number;
    batteryHealth: number;
    estimatedLifeRemaining: number; // days
  }[];
  maintenanceSchedule: {
    deviceId: string;
    deviceName: string;
    nextMaintenance: string;
    maintenanceType: MaintenanceType;
    daysUntilDue: number;
    estimatedCost: number;
  }[];
  costAnalysis: {
    date: string;
    purchaseCost: number;
    maintenanceCost: number;
    operationalCost: number;
    totalCost: number;
  }[];
  performanceMetrics: {
    deviceType: DeviceType;
    uptime: number; // percentage
    utilizationRate: number; // percentage
    errorRate: number; // percentage
    maintenanceFrequency: number; // times per year
    totalCostOfOwnership: number;
  }[];
  alerts: {
    total: number;
    critical: number;
    unresolved: number;
    categories: {
      type: string;
      count: number;
    }[];
  };
}

export interface RemoteAction {
  id: string;
  deviceId: string;
  action: 'locate' | 'lock' | 'wipe' | 'restart' | 'update' | 'backup' | 'install_app' | 'uninstall_app';
  parameters?: Record<string, any>;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  initiatedBy: string;
  initiatedAt: string;
  completedAt?: string;
  result?: string;
  errorMessage?: string;
}

export interface DeviceFilters {
  types?: DeviceType[];
  statuses?: DeviceStatus[];
  locations?: string[];
  assignees?: string[];
  batteryLevels?: BatteryLevel[];
  maintenanceStatus?: MaintenanceStatus[];
  searchQuery?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  date: string;
  odometer: number;
  gallons: number;
  costPerGallon: number;
  totalCost: number;
  fuelType: FuelType;
  station: string;
  location: string;
  driverId?: string;
  driverName?: string;
  receiptUrl?: string;
  notes?: string;
}

export interface DriverAssignment {
  id: string;
  vehicleId: string;
  driverId: string;
  driverName: string;
  licenseNumber: string;
  licenseExpiry: string;
  assignedAt: string;
  unassignedAt?: string;
  isPrimary: boolean;
  restrictions?: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface DeviceUsageReport {
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  reportPeriod: {
    start: string;
    end: string;
  };
  usage: {
    totalHours: number;
    activeHours: number;
    utilizationRate: number;
    peakUsageTime: string;
    lowUsageTime: string;
  };
  performance: {
    uptime: number;
    errorCount: number;
    maintenanceEvents: number;
    batteryCycles?: number;
  };
  costs: {
    operationalCost: number;
    maintenanceCost: number;
    energyCost: number;
    totalCost: number;
  };
  recommendations: string[];
}

export interface InventoryLocation {
  id: string;
  name: string;
  type: 'warehouse' | 'office' | 'vehicle' | 'external' | 'maintenance';
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  capacity: {
    maxDevices: number;
    currentDevices: number;
  };
  contactPerson?: {
    name: string;
    phone: string;
    email: string;
  };
  accessHours: string;
  securityLevel: 'low' | 'medium' | 'high' | 'restricted';
  createdAt: string;
  updatedAt: string;
} 