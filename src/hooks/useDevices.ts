import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import {
  Device,
  MobileDevice,
  BarcodeScanner,
  Printer,
  Vehicle,
  MaintenanceRecord,
  AssetCheckInOut,
  DeviceAlert,
  DeviceAnalytics,
  RemoteAction,
  DeviceFilters,
  FuelRecord,
  PrintJob,
  DeviceType,
  DeviceStatus,
  BatteryLevel,
  MaintenanceStatus
} from '@/types/devices';

interface DevicesHookResult {
  // Core device management
  devices: Device[];
  devicesLoading: boolean;
  
  // Mobile devices
  mobileDevices: MobileDevice[];
  
  // Specialized devices
  scanners: BarcodeScanner[];
  printers: Printer[];
  vehicles: Vehicle[];
  
  // Maintenance
  maintenanceRecords: MaintenanceRecord[];
  upcomingMaintenance: MaintenanceRecord[];
  
  // Asset tracking
  checkInOutHistory: AssetCheckInOut[];
  
  // Alerts and monitoring
  alerts: DeviceAlert[];
  criticalAlerts: DeviceAlert[];
  
  // Analytics
  analytics: DeviceAnalytics | null;
  analyticsLoading: boolean;
  
  // Print management
  printJobs: PrintJob[];
  printQueue: PrintJob[];
  
  // Fleet management
  fuelRecords: FuelRecord[];
  
  // Remote actions
  remoteActions: RemoteAction[];
  
  // Device operations
  addDevice: (device: Partial<Device>) => Promise<void>;
  updateDevice: (deviceId: string, updates: Partial<Device>) => Promise<void>;
  deleteDevice: (deviceId: string) => Promise<void>;
  assignDevice: (deviceId: string, userId: string) => Promise<void>;
  unassignDevice: (deviceId: string) => Promise<void>;
  
  // Asset operations
  checkOutDevice: (deviceId: string, userId: string, expectedReturn?: string) => Promise<void>;
  checkInDevice: (deviceId: string, condition: string, notes?: string) => Promise<void>;
  
  // Maintenance operations
  scheduleMaintenance: (maintenance: Partial<MaintenanceRecord>) => Promise<void>;
  updateMaintenanceStatus: (maintenanceId: string, status: MaintenanceStatus) => Promise<void>;
  
  // Remote device actions
  executeRemoteAction: (deviceId: string, action: string, parameters?: any) => Promise<void>;
  
  // Printer operations
  submitPrintJob: (printJob: Partial<PrintJob>) => Promise<void>;
  cancelPrintJob: (jobId: string) => Promise<void>;
  
  // Vehicle operations
  updateVehicleLocation: (vehicleId: string, location: any) => Promise<void>;
  addFuelRecord: (fuelRecord: Partial<FuelRecord>) => Promise<void>;
  
  // Alert management
  acknowledgeAlert: (alertId: string) => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
  
  // Utility functions
  applyFilters: (filters: DeviceFilters) => void;
  clearFilters: () => void;
  
  // Error state
  error: string | null;
}

// Mock data generators
const generateMockDevices = (): Device[] => [
  {
    id: 'device-scanner-001',
    type: 'barcode_scanner',
    name: 'Handheld Scanner #001',
    model: 'Symbol DS4308',
    manufacturer: 'Zebra',
    serialNumber: 'ZB001234567',
    assetTag: 'PRMCMS-SCAN-001',
    status: 'active',
    location: {
      type: 'facility',
      name: 'San Juan Distribution Center',
      address: '123 Industrial Ave, San Juan, PR 00901',
      building: 'Warehouse A',
      floor: '1',
      room: 'Shipping Dept',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    assignedTo: {
      userId: 'user-001',
      userName: 'Carlos Rodríguez',
      employeeId: 'EMP-001',
      assignedAt: '2024-01-10T09:00:00Z'
    },
    purchaseInfo: {
      purchaseDate: '2023-06-15T00:00:00Z',
      cost: 299.99,
      currency: 'USD',
      vendor: 'Zebra Technologies',
      warrantyExpiry: '2026-06-15T00:00:00Z'
    },
    specifications: {
      scanFormats: ['Code 128', 'UPC/EAN', 'QR Code', 'Data Matrix'],
      connectivity: ['USB', 'Bluetooth'],
      batteryLife: '12 hours',
      scanRange: '0-24 inches'
    },
    lastSeen: '2024-01-15T10:25:00Z',
    createdAt: '2023-06-15T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'device-tablet-001',
    type: 'tablet',
    name: 'Driver Tablet #001',
    model: 'iPad Air (5th generation)',
    manufacturer: 'Apple',
    serialNumber: 'DMQX2LL/A',
    assetTag: 'PRMCMS-TAB-001',
    status: 'active',
    location: {
      type: 'vehicle',
      name: 'Delivery Van #003',
      updatedAt: '2024-01-15T10:20:00Z'
    },
    assignedTo: {
      userId: 'user-002',
      userName: 'María González',
      employeeId: 'EMP-002',
      assignedAt: '2024-01-12T08:00:00Z'
    },
    purchaseInfo: {
      purchaseDate: '2023-08-20T00:00:00Z',
      cost: 749.99,
      currency: 'USD',
      vendor: 'Apple Inc.',
      warrantyExpiry: '2024-08-20T00:00:00Z'
    },
    specifications: {
      screenSize: '10.9 inches',
      storage: '256GB',
      connectivity: ['WiFi', 'Cellular', 'Bluetooth'],
      camera: '12MP',
      operatingSystem: 'iPadOS 17.2'
    },
    lastSeen: '2024-01-15T10:18:00Z',
    createdAt: '2023-08-20T00:00:00Z',
    updatedAt: '2024-01-15T10:20:00Z'
  },
  {
    id: 'device-printer-001',
    type: 'printer',
    name: 'Label Printer Station 1',
    model: 'Zebra ZD620',
    manufacturer: 'Zebra',
    serialNumber: 'ZD620001234',
    assetTag: 'PRMCMS-PRT-001',
    status: 'active',
    location: {
      type: 'facility',
      name: 'San Juan Distribution Center',
      address: '123 Industrial Ave, San Juan, PR 00901',
      building: 'Warehouse A',
      floor: '1',
      room: 'Packing Station 1',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    purchaseInfo: {
      purchaseDate: '2023-05-10T00:00:00Z',
      cost: 459.99,
      currency: 'USD',
      vendor: 'Zebra Technologies',
      warrantyExpiry: '2025-05-10T00:00:00Z'
    },
    specifications: {
      printTechnology: 'Thermal Transfer',
      maxWidth: '104mm',
      resolution: '300 dpi',
      connectivity: ['Ethernet', 'USB', 'WiFi'],
      printSpeed: '8 ips'
    },
    lastSeen: '2024-01-15T10:30:00Z',
    createdAt: '2023-05-10T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'device-vehicle-001',
    type: 'vehicle',
    name: 'Delivery Van #003',
    model: 'Transit 250',
    manufacturer: 'Ford',
    serialNumber: '1FTBR2CV7LKA12345',
    assetTag: 'PRMCMS-VAN-003',
    status: 'active',
    location: {
      type: 'external',
      name: 'Route 15 - Bayamón',
      address: 'Carr. 167, Bayamón, PR 00956',
      coordinates: {
        latitude: 18.4655,
        longitude: -66.1057
      },
      updatedAt: '2024-01-15T10:30:00Z'
    },
    assignedTo: {
      userId: 'user-002',
      userName: 'María González',
      employeeId: 'EMP-002',
      assignedAt: '2024-01-12T07:00:00Z'
    },
    purchaseInfo: {
      purchaseDate: '2023-03-15T00:00:00Z',
      cost: 42999.99,
      currency: 'USD',
      vendor: 'Ford Commercial Vehicles PR',
      warrantyExpiry: '2026-03-15T00:00:00Z'
    },
    specifications: {
      year: 2023,
      vin: '1FTBR2CV7LKA12345',
      licensePlate: 'GVP-789',
      fuelType: 'gasoline',
      cargoCapacity: '246 cubic feet',
      maxPayload: '4650 lbs'
    },
    lastSeen: '2024-01-15T10:28:00Z',
    createdAt: '2023-03-15T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  }
];

const generateMockMobileDevices = (): MobileDevice[] => [
  {
    id: 'device-tablet-001',
    type: 'tablet',
    name: 'Driver Tablet #001',
    model: 'iPad Air (5th generation)',
    manufacturer: 'Apple',
    serialNumber: 'DMQX2LL/A',
    assetTag: 'PRMCMS-TAB-001',
    status: 'active',
    location: {
      type: 'vehicle',
      name: 'Delivery Van #003',
      updatedAt: '2024-01-15T10:20:00Z'
    },
    assignedTo: {
      userId: 'user-002',
      userName: 'María González',
      employeeId: 'EMP-002',
      assignedAt: '2024-01-12T08:00:00Z'
    },
    purchaseInfo: {
      purchaseDate: '2023-08-20T00:00:00Z',
      cost: 749.99,
      currency: 'USD',
      vendor: 'Apple Inc.',
      warrantyExpiry: '2024-08-20T00:00:00Z'
    },
    specifications: {
      screenSize: '10.9 inches',
      storage: '256GB',
      connectivity: ['WiFi', 'Cellular', 'Bluetooth'],
      camera: '12MP',
      operatingSystem: 'iPadOS 17.2'
    },
    lastSeen: '2024-01-15T10:18:00Z',
    createdAt: '2023-08-20T00:00:00Z',
    updatedAt: '2024-01-15T10:20:00Z',
    health: {
      batteryLevel: 'high',
      batteryPercentage: 78,
      batteryHealth: 92,
      storageUsed: 89.5,
      storageTotal: 256,
      memoryUsage: 65,
      cpuUsage: 23,
      temperature: 32.5,
      signalStrength: -67,
      lastHealthCheck: '2024-01-15T10:15:00Z'
    },
    software: {
      osVersion: 'iPadOS 17.2.1',
      appVersion: 'PRMCMS Mobile 2.4.1',
      securityPatchLevel: '2024-01-08',
      installedApps: [
        {
          name: 'PRMCMS Mobile',
          version: '2.4.1',
          packageId: 'com.prmcms.mobile',
          installDate: '2023-08-20T00:00:00Z',
          lastUsed: '2024-01-15T10:00:00Z',
          size: 45.2,
          permissions: ['Camera', 'Location', 'Storage', 'Network']
        },
        {
          name: 'Scanner Pro',
          version: '8.1.2',
          packageId: 'com.scanner.pro',
          installDate: '2023-09-01T00:00:00Z',
          lastUsed: '2024-01-15T09:30:00Z',
          size: 12.8,
          permissions: ['Camera', 'Storage']
        }
      ],
      pendingUpdates: [
        {
          type: 'os',
          name: 'iPadOS 17.3',
          currentVersion: '17.2.1',
          targetVersion: '17.3',
          size: 2048,
          priority: 'medium',
          releaseDate: '2024-01-22T00:00:00Z',
          description: 'Security updates and bug fixes'
        }
      ]
    },
    connectivity: {
      wifiConnected: true,
      cellularConnected: true,
      bluetoothEnabled: true,
      gpsEnabled: true,
      lastConnected: '2024-01-15T10:18:00Z'
    },
    security: {
      isEncrypted: true,
      screenLockEnabled: true,
      remoteWipeCapable: true,
      mdmEnrolled: true,
      complianceStatus: 'compliant',
      lastSecurityScan: '2024-01-15T06:00:00Z'
    }
  }
];

const generateMockAnalytics = (): DeviceAnalytics => ({
  overview: {
    totalDevices: 156,
    activeDevices: 142,
    maintenanceDevices: 8,
    retiredDevices: 6,
    totalValue: 245780.50,
    utilizationRate: 0.87
  },
  deviceBreakdown: [
    {
      type: 'tablet',
      count: 45,
      activeCount: 42,
      totalValue: 67485.50,
      averageAge: 14,
      utilizationRate: 0.93
    },
    {
      type: 'barcode_scanner',
      count: 32,
      activeCount: 30,
      totalValue: 9597.68,
      averageAge: 8,
      utilizationRate: 0.94
    },
    {
      type: 'printer',
      count: 18,
      activeCount: 17,
      totalValue: 8279.82,
      averageAge: 11,
      utilizationRate: 0.89
    },
    {
      type: 'vehicle',
      count: 12,
      activeCount: 11,
      totalValue: 155999.88,
      averageAge: 18,
      utilizationRate: 0.92
    },
    {
      type: 'smartphone',
      count: 35,
      activeCount: 32,
      totalValue: 3149.65,
      averageAge: 22,
      utilizationRate: 0.91
    },
    {
      type: 'laptop',
      count: 8,
      activeCount: 6,
      totalValue: 7199.92,
      averageAge: 26,
      utilizationRate: 0.75
    },
    {
      type: 'radio',
      count: 4,
      activeCount: 3,
      totalValue: 1199.96,
      averageAge: 36,
      utilizationRate: 0.75
    },
    {
      type: 'gps_tracker',
      count: 2,
      activeCount: 1,
      totalValue: 599.99,
      averageAge: 12,
      utilizationRate: 0.50
    }
  ],
  batteryHealth: [
    {
      deviceId: 'device-tablet-001',
      deviceName: 'Driver Tablet #001',
      batteryLevel: 'high',
      batteryPercentage: 78,
      batteryHealth: 92,
      estimatedLifeRemaining: 340
    },
    {
      deviceId: 'device-tablet-002',
      deviceName: 'Driver Tablet #002',
      batteryLevel: 'medium',
      batteryPercentage: 54,
      batteryHealth: 85,
      estimatedLifeRemaining: 280
    },
    {
      deviceId: 'device-scanner-001',
      deviceName: 'Handheld Scanner #001',
      batteryLevel: 'critical',
      batteryPercentage: 12,
      batteryHealth: 78,
      estimatedLifeRemaining: 180
    }
  ],
  maintenanceSchedule: [
    {
      deviceId: 'device-vehicle-001',
      deviceName: 'Delivery Van #003',
      nextMaintenance: '2024-01-25T00:00:00Z',
      maintenanceType: 'scheduled',
      daysUntilDue: 10,
      estimatedCost: 350.00
    },
    {
      deviceId: 'device-printer-001',
      deviceName: 'Label Printer Station 1',
      nextMaintenance: '2024-02-01T00:00:00Z',
      maintenanceType: 'preventive',
      daysUntilDue: 17,
      estimatedCost: 125.00
    }
  ],
  costAnalysis: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    purchaseCost: Math.floor(Math.random() * 2000) + 500,
    maintenanceCost: Math.floor(Math.random() * 800) + 200,
    operationalCost: Math.floor(Math.random() * 500) + 100,
    totalCost: 0 // Will be calculated
  })).map(day => ({
    ...day,
    totalCost: day.purchaseCost + day.maintenanceCost + day.operationalCost
  })),
  performanceMetrics: [
    {
      deviceType: 'tablet',
      uptime: 0.97,
      utilizationRate: 0.93,
      errorRate: 0.02,
      maintenanceFrequency: 1.5,
      totalCostOfOwnership: 1249.99
    },
    {
      deviceType: 'barcode_scanner',
      uptime: 0.99,
      utilizationRate: 0.94,
      errorRate: 0.01,
      maintenanceFrequency: 0.8,
      totalCostOfOwnership: 399.99
    },
    {
      deviceType: 'printer',
      uptime: 0.95,
      utilizationRate: 0.89,
      errorRate: 0.05,
      maintenanceFrequency: 2.1,
      totalCostOfOwnership: 679.99
    },
    {
      deviceType: 'vehicle',
      uptime: 0.92,
      utilizationRate: 0.92,
      errorRate: 0.03,
      maintenanceFrequency: 4.5,
      totalCostOfOwnership: 52999.99
    }
  ],
  alerts: {
    total: 23,
    critical: 3,
    unresolved: 12,
    categories: [
      { type: 'battery_low', count: 8 },
      { type: 'maintenance_due', count: 5 },
      { type: 'offline', count: 3 },
      { type: 'supply_low', count: 4 },
      { type: 'error', count: 2 },
      { type: 'overdue_return', count: 1 }
    ]
  }
});

const generateMockAlerts = (): DeviceAlert[] => [
  {
    id: 'alert-001',
    deviceId: 'device-scanner-001',
    deviceName: 'Handheld Scanner #001',
    type: 'battery_low',
    priority: 'high',
    title: 'Low Battery Warning',
    message: 'Battery level is at 12%. Please charge device immediately.',
    acknowledged: false,
    resolved: false,
    createdAt: '2024-01-15T10:15:00Z',
    metadata: {
      batteryPercentage: 12,
      batteryHealth: 78
    }
  },
  {
    id: 'alert-002',
    deviceId: 'device-vehicle-001',
    deviceName: 'Delivery Van #003',
    type: 'maintenance_due',
    priority: 'medium',
    title: 'Scheduled Maintenance Due',
    message: 'Vehicle maintenance is due in 10 days (Jan 25, 2024).',
    acknowledged: true,
    acknowledgedBy: 'admin-001',
    acknowledgedAt: '2024-01-15T08:30:00Z',
    resolved: false,
    createdAt: '2024-01-15T08:00:00Z',
    metadata: {
      maintenanceType: 'scheduled',
      dueDate: '2024-01-25T00:00:00Z',
      estimatedCost: 350.00
    }
  },
  {
    id: 'alert-003',
    deviceId: 'device-printer-001',
    deviceName: 'Label Printer Station 1',
    type: 'supply_low',
    priority: 'medium',
    title: 'Label Supply Low',
    message: 'Label roll is at 15%. Order replacement supplies.',
    acknowledged: false,
    resolved: false,
    createdAt: '2024-01-15T09:45:00Z',
    metadata: {
      supplyType: 'labels',
      currentLevel: 15,
      criticalThreshold: 10
    }
  }
];

export function useDevices(): DevicesHookResult {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State management
  const [devices, setDevices] = useState<Device[]>([]);
  const [mobileDevices, setMobileDevices] = useState<MobileDevice[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [checkInOutHistory, setCheckInOutHistory] = useState<AssetCheckInOut[]>([]);
  const [alerts, setAlerts] = useState<DeviceAlert[]>([]);
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [remoteActions, setRemoteActions] = useState<RemoteAction[]>([]);
  const [activeFilters, setActiveFilters] = useState<DeviceFilters>({});
  const [error, setError] = useState<string | null>(null);

  // Real-time monitoring intervals
  const monitoringInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize mock data
  useEffect(() => {
    if (user) {
      setDevices(generateMockDevices());
      setMobileDevices(generateMockMobileDevices());
      setAlerts(generateMockAlerts());
      
      // Start real-time monitoring simulation
      monitoringInterval.current = setInterval(() => {
        // Simulate battery level changes
        setMobileDevices(prev => prev.map(device => {
          if (Math.random() > 0.8) {
            const batteryChange = (Math.random() - 0.5) * 10;
            const newPercentage = Math.max(0, Math.min(100, device.health.batteryPercentage + batteryChange));
            
            let newBatteryLevel: BatteryLevel = 'medium';
            if (newPercentage >= 80) newBatteryLevel = 'high';
            else if (newPercentage >= 60) newBatteryLevel = 'medium';
            else if (newPercentage >= 20) newBatteryLevel = 'low';
            else newBatteryLevel = 'critical';

            return {
              ...device,
              health: {
                ...device.health,
                batteryPercentage: newPercentage,
                batteryLevel: newBatteryLevel,
                lastHealthCheck: new Date().toISOString()
              },
              lastSeen: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          }
          return device;
        }));

        // Simulate device status changes
        setDevices(prev => prev.map(device => {
          if (Math.random() > 0.95) {
            return {
              ...device,
              lastSeen: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          }
          return device;
        }));

        // Generate new alerts occasionally
        if (Math.random() > 0.98) {
          const alertTypes = ['battery_low', 'supply_low', 'offline', 'error'];
          const priorities = ['low', 'medium', 'high', 'critical'];
          const deviceIds = devices.map(d => d.id);
          
          if (deviceIds.length > 0) {
            const newAlert: DeviceAlert = {
              id: `alert-${Date.now()}`,
              deviceId: deviceIds[Math.floor(Math.random() * deviceIds.length)],
              deviceName: devices.find(d => d.id === deviceIds[0])?.name || 'Unknown Device',
              type: alertTypes[Math.floor(Math.random() * alertTypes.length)] as any,
              priority: priorities[Math.floor(Math.random() * priorities.length)] as any,
              title: 'System Alert',
              message: 'Automated monitoring detected an issue requiring attention.',
              acknowledged: false,
              resolved: false,
              createdAt: new Date().toISOString()
            };
            
            setAlerts(prev => [newAlert, ...prev.slice(0, 19)]); // Keep latest 20 alerts
          }
        }
      }, 10000); // Update every 10 seconds
    }

    return () => {
      if (monitoringInterval.current) {
        clearInterval(monitoringInterval.current);
      }
    };
  }, [user, devices]);

  // Analytics query
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['device-analytics'],
    queryFn: async (): Promise<DeviceAnalytics> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return generateMockAnalytics();
    },
    enabled: !!user
  });

  // Computed values
  const scanners = devices.filter(d => d.type === 'barcode_scanner') as BarcodeScanner[];
  const printers = devices.filter(d => d.type === 'printer') as Printer[];
  const vehicles = devices.filter(d => d.type === 'vehicle') as Vehicle[];
  const upcomingMaintenance = maintenanceRecords.filter(m => 
    m.status === 'scheduled' && new Date(m.scheduledDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  const criticalAlerts = alerts.filter(a => a.priority === 'critical' && !a.resolved);
  const printQueue = printJobs.filter(j => j.status === 'queued' || j.status === 'printing');

  // Device operations
  const addDevice = useCallback(async (device: Partial<Device>) => {
    const newDevice: Device = {
      id: `device-${Date.now()}`,
      type: device.type || 'tablet',
      name: device.name || 'New Device',
      model: device.model || '',
      manufacturer: device.manufacturer || '',
      serialNumber: device.serialNumber || '',
      assetTag: device.assetTag || `PRMCMS-${Date.now()}`,
      status: device.status || 'active',
      location: device.location || {
        type: 'facility',
        name: 'Main Office',
        updatedAt: new Date().toISOString()
      },
      purchaseInfo: device.purchaseInfo || {
        purchaseDate: new Date().toISOString(),
        cost: 0,
        currency: 'USD',
        vendor: ''
      },
      specifications: device.specifications || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setDevices(prev => [...prev, newDevice]);
    toast({
      title: 'Device added',
      description: `${newDevice.name} has been added to inventory.`,
    });
  }, [toast]);

  const updateDevice = useCallback(async (deviceId: string, updates: Partial<Device>) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, ...updates, updatedAt: new Date().toISOString() }
        : device
    ));
    toast({
      title: 'Device updated',
      description: 'Device information has been updated successfully.',
    });
  }, [toast]);

  const deleteDevice = useCallback(async (deviceId: string) => {
    setDevices(prev => prev.filter(device => device.id !== deviceId));
    toast({
      title: 'Device removed',
      description: 'Device has been removed from inventory.',
    });
  }, [toast]);

  const assignDevice = useCallback(async (deviceId: string, userId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { 
            ...device, 
            assignedTo: {
              userId,
              userName: 'Employee Name',
              employeeId: `EMP-${userId}`,
              assignedAt: new Date().toISOString()
            },
            updatedAt: new Date().toISOString()
          }
        : device
    ));
    toast({
      title: 'Device assigned',
      description: 'Device has been assigned successfully.',
    });
  }, [toast]);

  const unassignDevice = useCallback(async (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { 
            ...device, 
            assignedTo: undefined,
            updatedAt: new Date().toISOString()
          }
        : device
    ));
    toast({
      title: 'Device unassigned',
      description: 'Device has been unassigned successfully.',
    });
  }, [toast]);

  // Asset operations
  const checkOutDevice = useCallback(async (deviceId: string, userId: string, expectedReturn?: string) => {
    const checkOut: AssetCheckInOut = {
      id: `checkout-${Date.now()}`,
      deviceId,
      userId,
      userName: 'Employee Name',
      action: 'check_out',
      timestamp: new Date().toISOString(),
      location: {
        type: 'facility',
        name: 'Main Office',
        updatedAt: new Date().toISOString()
      },
      condition: 'good',
      expectedReturn,
      status: 'checked_out'
    };

    setCheckInOutHistory(prev => [checkOut, ...prev]);
    await assignDevice(deviceId, userId);
    
    toast({
      title: 'Device checked out',
      description: 'Device has been checked out successfully.',
    });
  }, [assignDevice, toast]);

  const checkInDevice = useCallback(async (deviceId: string, condition: string, notes?: string) => {
    const checkIn: AssetCheckInOut = {
      id: `checkin-${Date.now()}`,
      deviceId,
      userId: 'current-user',
      userName: 'Current User',
      action: 'check_in',
      timestamp: new Date().toISOString(),
      location: {
        type: 'facility',
        name: 'Main Office',
        updatedAt: new Date().toISOString()
      },
      condition: condition as any,
      notes,
      actualReturn: new Date().toISOString(),
      status: 'checked_in'
    };

    setCheckInOutHistory(prev => [checkIn, ...prev]);
    await unassignDevice(deviceId);
    
    toast({
      title: 'Device checked in',
      description: 'Device has been checked in successfully.',
    });
  }, [unassignDevice, toast]);

  // Maintenance operations
  const scheduleMaintenance = useCallback(async (maintenance: Partial<MaintenanceRecord>) => {
    const newMaintenance: MaintenanceRecord = {
      id: `maintenance-${Date.now()}`,
      deviceId: maintenance.deviceId || '',
      type: maintenance.type || 'scheduled',
      status: 'scheduled',
      title: maintenance.title || 'Scheduled Maintenance',
      description: maintenance.description || '',
      scheduledDate: maintenance.scheduledDate || new Date().toISOString(),
      estimatedDuration: maintenance.estimatedDuration || 2,
      parts: maintenance.parts || [],
      labor: maintenance.labor || { hours: 1, rate: 75, cost: 75 },
      totalCost: maintenance.totalCost || 75,
      currency: 'USD',
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMaintenanceRecords(prev => [...prev, newMaintenance]);
    toast({
      title: 'Maintenance scheduled',
      description: 'Maintenance has been scheduled successfully.',
    });
  }, [toast]);

  const updateMaintenanceStatus = useCallback(async (maintenanceId: string, status: MaintenanceStatus) => {
    setMaintenanceRecords(prev => prev.map(record => 
      record.id === maintenanceId 
        ? { ...record, status, updatedAt: new Date().toISOString() }
        : record
    ));
    toast({
      title: 'Maintenance updated',
      description: `Maintenance status updated to ${status}.`,
    });
  }, [toast]);

  // Remote device actions
  const executeRemoteAction = useCallback(async (deviceId: string, action: string, parameters?: any) => {
    const remoteAction: RemoteAction = {
      id: `action-${Date.now()}`,
      deviceId,
      action: action as any,
      parameters,
      status: 'pending',
      initiatedBy: 'current-user',
      initiatedAt: new Date().toISOString()
    };

    setRemoteActions(prev => [remoteAction, ...prev]);
    
    // Simulate action execution
    setTimeout(() => {
      setRemoteActions(prev => prev.map(a => 
        a.id === remoteAction.id 
          ? { ...a, status: 'completed', completedAt: new Date().toISOString() }
          : a
      ));
    }, 3000);

    toast({
      title: 'Remote action initiated',
      description: `${action} command sent to device.`,
    });
  }, [toast]);

  // Printer operations
  const submitPrintJob = useCallback(async (printJob: Partial<PrintJob>) => {
    const newJob: PrintJob = {
      id: `job-${Date.now()}`,
      printerId: printJob.printerId || '',
      userId: 'current-user',
      userName: 'Current User',
      jobName: printJob.jobName || 'Print Job',
      status: 'queued',
      pages: printJob.pages || 1,
      copies: printJob.copies || 1,
      priority: printJob.priority || 'normal',
      submittedAt: new Date().toISOString()
    };

    setPrintJobs(prev => [newJob, ...prev]);
    toast({
      title: 'Print job submitted',
      description: 'Print job has been added to the queue.',
    });
  }, [toast]);

  const cancelPrintJob = useCallback(async (jobId: string) => {
    setPrintJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'cancelled' } : job
    ));
    toast({
      title: 'Print job cancelled',
      description: 'Print job has been cancelled.',
    });
  }, [toast]);

  // Vehicle operations
  const updateVehicleLocation = useCallback(async (vehicleId: string, location: any) => {
    setDevices(prev => prev.map(device => 
      device.id === vehicleId 
        ? { 
            ...device, 
            location: { ...location, updatedAt: new Date().toISOString() },
            lastSeen: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        : device
    ));
  }, []);

  const addFuelRecord = useCallback(async (fuelRecord: Partial<FuelRecord>) => {
    const newRecord: FuelRecord = {
      id: `fuel-${Date.now()}`,
      vehicleId: fuelRecord.vehicleId || '',
      date: fuelRecord.date || new Date().toISOString(),
      odometer: fuelRecord.odometer || 0,
      gallons: fuelRecord.gallons || 0,
      costPerGallon: fuelRecord.costPerGallon || 0,
      totalCost: fuelRecord.totalCost || 0,
      fuelType: fuelRecord.fuelType || 'gasoline',
      station: fuelRecord.station || '',
      location: fuelRecord.location || '',
      driverId: fuelRecord.driverId,
      driverName: fuelRecord.driverName,
      notes: fuelRecord.notes
    };

    setFuelRecords(prev => [newRecord, ...prev]);
    toast({
      title: 'Fuel record added',
      description: 'Fuel record has been logged successfully.',
    });
  }, [toast]);

  // Alert management
  const acknowledgeAlert = useCallback(async (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            acknowledged: true,
            acknowledgedBy: 'current-user',
            acknowledgedAt: new Date().toISOString()
          }
        : alert
    ));
  }, []);

  const resolveAlert = useCallback(async (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            resolved: true,
            resolvedBy: 'current-user',
            resolvedAt: new Date().toISOString()
          }
        : alert
    ));
    toast({
      title: 'Alert resolved',
      description: 'Alert has been marked as resolved.',
    });
  }, [toast]);

  // Utility functions
  const applyFilters = useCallback((filters: DeviceFilters) => {
    setActiveFilters(filters);
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  // Filter devices based on active filters
  const filteredDevices = devices.filter(device => {
    if (activeFilters.types && !activeFilters.types.includes(device.type)) return false;
    if (activeFilters.statuses && !activeFilters.statuses.includes(device.status)) return false;
    if (activeFilters.searchQuery) {
      const query = activeFilters.searchQuery.toLowerCase();
      return device.name.toLowerCase().includes(query) ||
             device.model.toLowerCase().includes(query) ||
             device.assetTag.toLowerCase().includes(query) ||
             device.serialNumber.toLowerCase().includes(query);
    }
    return true;
  });

  return {
    devices: filteredDevices,
    devicesLoading: false,
    mobileDevices,
    scanners,
    printers,
    vehicles,
    maintenanceRecords,
    upcomingMaintenance,
    checkInOutHistory,
    alerts,
    criticalAlerts,
    analytics: analytics || null,
    analyticsLoading,
    printJobs,
    printQueue,
    fuelRecords,
    remoteActions,
    addDevice,
    updateDevice,
    deleteDevice,
    assignDevice,
    unassignDevice,
    checkOutDevice,
    checkInDevice,
    scheduleMaintenance,
    updateMaintenanceStatus,
    executeRemoteAction,
    submitPrintJob,
    cancelPrintJob,
    updateVehicleLocation,
    addFuelRecord,
    acknowledgeAlert,
    resolveAlert,
    applyFilters,
    clearFilters,
    error
  };
} 