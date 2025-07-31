import { useState, useEffect } from 'react';

interface PowerStatus {
  id: string;
  location: string;
  main_power: 'online' | 'offline' | 'unstable';
  generator_status: 'running' | 'standby' | 'maintenance' | 'offline';
  battery_backup: number; // percentage
  fuel_level: number; // percentage
  runtime_hours: number;
  last_maintenance: string;
  next_maintenance: string;
  critical_systems: string[];
  outage_prediction: 'low' | 'medium' | 'high';
  last_outage: string;
  outage_duration: number; // minutes
}

interface EnvironmentalSensor {
  id: string;
  location: string;
  type: 'temperature' | 'humidity' | 'air_quality' | 'lighting';
  current_value: number;
  unit: string;
  threshold_min: number;
  threshold_max: number;
  status: 'normal' | 'warning' | 'critical';
  last_reading: string;
  trend: 'stable' | 'increasing' | 'decreasing';
}

interface MaintenanceSchedule {
  id: string;
  asset_id: string;
  asset_name: string;
  asset_type: 'generator' | 'hvac' | 'security' | 'electrical' | 'plumbing';
  maintenance_type: 'preventive' | 'corrective' | 'emergency';
  scheduled_date: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  assigned_vendor: string;
  estimated_cost: number;
  actual_cost?: number;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  department: string;
  is_primary: boolean;
  availability: '24/7' | 'business_hours' | 'on_call';
}

interface HurricanePreparedness {
  id: string;
  location: string;
  hurricane_zone: 'A' | 'B' | 'C' | 'D';
  evacuation_route: string;
  emergency_supplies: string[];
  backup_communication: string[];
  fuel_reserves: number; // gallons
  water_reserves: number; // gallons
  last_drill: string;
  next_drill: string;
  readiness_score: number; // 0-100
}

// Mock data for demonstration
const mockPowerStatus: PowerStatus[] = [
  {
    id: '1',
    location: 'San Juan Main',
    main_power: 'online',
    generator_status: 'standby',
    battery_backup: 95,
    fuel_level: 85,
    runtime_hours: 120,
    last_maintenance: '2024-01-15',
    next_maintenance: '2024-04-15',
    critical_systems: ['Server Room', 'Security System', 'Emergency Lighting'],
    outage_prediction: 'low',
    last_outage: '2024-02-10',
    outage_duration: 45
  },
  {
    id: '2',
    location: 'Bayamón Branch',
    main_power: 'unstable',
    generator_status: 'running',
    battery_backup: 60,
    fuel_level: 45,
    runtime_hours: 8,
    last_maintenance: '2024-01-20',
    next_maintenance: '2024-04-20',
    critical_systems: ['POS System', 'Security Cameras'],
    outage_prediction: 'high',
    last_outage: '2024-03-01',
    outage_duration: 120
  }
];

const mockEnvironmentalSensors: EnvironmentalSensor[] = [
  {
    id: '1',
    location: 'Server Room',
    type: 'temperature',
    current_value: 22.5,
    unit: '°C',
    threshold_min: 18,
    threshold_max: 25,
    status: 'normal',
    last_reading: '2024-03-15T10:30:00Z',
    trend: 'stable'
  },
  {
    id: '2',
    location: 'Server Room',
    type: 'humidity',
    current_value: 45,
    unit: '%',
    threshold_min: 30,
    threshold_max: 60,
    status: 'normal',
    last_reading: '2024-03-15T10:30:00Z',
    trend: 'stable'
  },
  {
    id: '3',
    location: 'Main Office',
    type: 'temperature',
    current_value: 28.5,
    unit: '°C',
    threshold_min: 20,
    threshold_max: 26,
    status: 'warning',
    last_reading: '2024-03-15T10:30:00Z',
    trend: 'increasing'
  }
];

const mockMaintenanceSchedule: MaintenanceSchedule[] = [
  {
    id: '1',
    asset_id: 'GEN-001',
    asset_name: 'Main Generator',
    asset_type: 'generator',
    maintenance_type: 'preventive',
    scheduled_date: '2024-04-15',
    status: 'scheduled',
    assigned_vendor: 'Power Systems PR',
    estimated_cost: 2500,
    description: 'Annual generator maintenance and fuel system inspection',
    priority: 'high'
  },
  {
    id: '2',
    asset_id: 'HVAC-001',
    asset_name: 'Central AC Unit',
    asset_type: 'hvac',
    maintenance_type: 'preventive',
    scheduled_date: '2024-03-20',
    status: 'overdue',
    assigned_vendor: 'Climate Control Solutions',
    estimated_cost: 800,
    description: 'Filter replacement and system inspection',
    priority: 'medium'
  }
];

const mockEmergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'Carlos Rodríguez',
    role: 'Facility Manager',
    phone: '+1-787-555-0101',
    email: 'carlos.rodriguez@prmcms.com',
    department: 'Facilities',
    is_primary: true,
    availability: '24/7'
  },
  {
    id: '2',
    name: 'María González',
    role: 'IT Director',
    phone: '+1-787-555-0102',
    email: 'maria.gonzalez@prmcms.com',
    department: 'IT',
    is_primary: false,
    availability: 'business_hours'
  }
];

const mockHurricanePreparedness: HurricanePreparedness[] = [
  {
    id: '1',
    location: 'San Juan Main',
    hurricane_zone: 'A',
    evacuation_route: 'Route 26 to Emergency Shelter',
    emergency_supplies: ['Water', 'Non-perishable food', 'First aid kit', 'Flashlights', 'Batteries'],
    backup_communication: ['Satellite phone', 'Radio', 'Emergency hotline'],
    fuel_reserves: 500,
    water_reserves: 1000,
    last_drill: '2024-02-15',
    next_drill: '2024-05-15',
    readiness_score: 85
  }
];

export function useFacility() {
  const [powerStatus, setPowerStatus] = useState<PowerStatus[]>([]);
  const [environmentalSensors, setEnvironmentalSensors] = useState<EnvironmentalSensor[]>([]);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState<MaintenanceSchedule[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [hurricanePreparedness, setHurricanePreparedness] = useState<HurricanePreparedness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilityData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setPowerStatus(mockPowerStatus);
        setEnvironmentalSensors(mockEnvironmentalSensors);
        setMaintenanceSchedule(mockMaintenanceSchedule);
        setEmergencyContacts(mockEmergencyContacts);
        setHurricanePreparedness(mockHurricanePreparedness);
      } catch (error) {
        console.error('Error fetching facility data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilityData();
  }, []);

  const updatePowerStatus = async (id: string, updates: Partial<PowerStatus>) => {
    setPowerStatus(prev => prev.map(status => 
      status.id === id ? { ...status, ...updates } : status
    ));
  };

  const getCriticalPowerIssues = () => {
    return powerStatus.filter(status => 
      status.main_power === 'offline' || 
      status.generator_status === 'offline' ||
      status.battery_backup < 20 ||
      status.fuel_level < 30
    );
  };

  const getOutagePredictions = () => {
    return powerStatus.filter(status => status.outage_prediction === 'high');
  };

  const updateSensorReading = async (id: string, reading: Partial<EnvironmentalSensor>) => {
    setEnvironmentalSensors(prev => prev.map(sensor => 
      sensor.id === id ? { ...sensor, ...reading } : sensor
    ));
  };

  const getCriticalAlerts = () => {
    return environmentalSensors.filter(sensor => sensor.status === 'critical');
  };

  const getWarningAlerts = () => {
    return environmentalSensors.filter(sensor => sensor.status === 'warning');
  };

  const addMaintenanceTask = async (task: Omit<MaintenanceSchedule, 'id'>) => {
    const newTask = {
      ...task,
      id: Date.now().toString()
    };
    setMaintenanceSchedule(prev => [...prev, newTask]);
  };

  const updateMaintenanceStatus = async (id: string, status: MaintenanceSchedule['status']) => {
    setMaintenanceSchedule(prev => prev.map(task => 
      task.id === id ? { ...task, status } : task
    ));
  };

  const getOverdueMaintenance = () => {
    return maintenanceSchedule.filter(task => task.status === 'overdue');
  };

  const getUpcomingMaintenance = (days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);
    return maintenanceSchedule.filter(task => 
      new Date(task.scheduled_date) <= cutoffDate && task.status === 'scheduled'
    );
  };

  const addEmergencyContact = async (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact = {
      ...contact,
      id: Date.now().toString()
    };
    setEmergencyContacts(prev => [...prev, newContact]);
  };

  const getPrimaryContacts = () => {
    return emergencyContacts.filter(contact => contact.is_primary);
  };

  const getContactsByAvailability = (availability: EmergencyContact['availability']) => {
    return emergencyContacts.filter(contact => contact.availability === availability);
  };

  const updateHurricaneReadiness = async (id: string, updates: Partial<HurricanePreparedness>) => {
    setHurricanePreparedness(prev => prev.map(prep => 
      prep.id === id ? { ...prep, ...updates } : prep
    ));
  };

  const getLowReadinessLocations = () => {
    return hurricanePreparedness.filter(prep => prep.readiness_score < 70);
  };

  const getUpcomingDrills = (days: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);
    return hurricanePreparedness.filter(prep => 
      new Date(prep.next_drill) <= cutoffDate
    );
  };

  return {
    powerStatus,
    environmentalSensors,
    maintenanceSchedule,
    emergencyContacts,
    hurricanePreparedness,
    loading,
    updatePowerStatus,
    getCriticalPowerIssues,
    getOutagePredictions,
    updateSensorReading,
    getCriticalAlerts,
    getWarningAlerts,
    addMaintenanceTask,
    updateMaintenanceStatus,
    getOverdueMaintenance,
    getUpcomingMaintenance,
    addEmergencyContact,
    getPrimaryContacts,
    getContactsByAvailability,
    updateHurricaneReadiness,
    getLowReadinessLocations,
    getUpcomingDrills
  };
} 