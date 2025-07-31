import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLanguage } from './LanguageContext';

interface EmergencyState {
  isActive: boolean;
  level: 'normal' | 'watch' | 'warning' | 'critical';
  type: 'hurricane' | 'flood' | 'power' | 'security' | 'medical' | 'none';
  message: string;
  startTime?: string;
  endTime?: string;
  affectedAreas: string[];
  evacuationMode: boolean;
  staffPresent: number;
  totalStaff: number;
  criticalPackages: number;
  systemStatus: 'operational' | 'degraded' | 'critical';
  communications: 'active' | 'limited' | 'down';
  powerStatus: 'normal' | 'backup' | 'critical';
}

interface EmergencyContextType {
  emergencyState: EmergencyState;
  activateEmergency: (level: EmergencyState['level'], type: EmergencyState['type'], message: string) => void;
  deactivateEmergency: () => void;
  setEvacuationMode: (mode: boolean) => void;
  updateStaffCount: (present: number, total: number) => void;
  updateSystemStatus: (status: EmergencyState['systemStatus']) => void;
  updateCommunications: (status: EmergencyState['communications']) => void;
  updatePowerStatus: (status: EmergencyState['powerStatus']) => void;
  updateCriticalPackages: (count: number) => void;
  addAffectedArea: (area: string) => void;
  removeAffectedArea: (area: string) => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

interface EmergencyProviderProps {
  children: ReactNode;
}

export const EmergencyProvider: React.FC<EmergencyProviderProps> = ({ children }) => {
  const { language } = useLanguage();
  
  const [emergencyState, setEmergencyState] = useState<EmergencyState>({
    isActive: false,
    level: 'normal',
    type: 'none',
    message: language === 'es' ? 'Estado normal - Sin emergencias activas' : 'Normal status - No active emergencies',
    affectedAreas: [],
    evacuationMode: false,
    staffPresent: 12,
    totalStaff: 15,
    criticalPackages: 3,
    systemStatus: 'operational',
    communications: 'active',
    powerStatus: 'normal'
  });

  // Update message when language changes
  useEffect(() => {
    if (!emergencyState.isActive) {
      setEmergencyState(prev => ({
        ...prev,
        message: language === 'es' ? 'Estado normal - Sin emergencias activas' : 'Normal status - No active emergencies'
      }));
    }
  }, [language, emergencyState.isActive]);

  const activateEmergency = (
    level: EmergencyState['level'], 
    type: EmergencyState['type'], 
    message: string
  ) => {
    setEmergencyState(prev => ({
      ...prev,
      isActive: true,
      level,
      type,
      message,
      startTime: new Date().toISOString()
    }));
  };

  const deactivateEmergency = () => {
    setEmergencyState(prev => ({
      ...prev,
      isActive: false,
      level: 'normal',
      type: 'none',
      message: language === 'es' ? 'Estado normal - Sin emergencias activas' : 'Normal status - No active emergencies',
      endTime: new Date().toISOString(),
      evacuationMode: false,
      affectedAreas: []
    }));
  };

  const setEvacuationMode = (mode: boolean) => {
    setEmergencyState(prev => ({
      ...prev,
      evacuationMode: mode
    }));
  };

  const updateStaffCount = (present: number, total: number) => {
    setEmergencyState(prev => ({
      ...prev,
      staffPresent: present,
      totalStaff: total
    }));
  };

  const updateSystemStatus = (status: EmergencyState['systemStatus']) => {
    setEmergencyState(prev => ({
      ...prev,
      systemStatus: status
    }));
  };

  const updateCommunications = (status: EmergencyState['communications']) => {
    setEmergencyState(prev => ({
      ...prev,
      communications: status
    }));
  };

  const updatePowerStatus = (status: EmergencyState['powerStatus']) => {
    setEmergencyState(prev => ({
      ...prev,
      powerStatus: status
    }));
  };

  const updateCriticalPackages = (count: number) => {
    setEmergencyState(prev => ({
      ...prev,
      criticalPackages: count
    }));
  };

  const addAffectedArea = (area: string) => {
    setEmergencyState(prev => ({
      ...prev,
      affectedAreas: [...prev.affectedAreas, area]
    }));
  };

  const removeAffectedArea = (area: string) => {
    setEmergencyState(prev => ({
      ...prev,
      affectedAreas: prev.affectedAreas.filter(a => a !== area)
    }));
  };

  const value: EmergencyContextType = {
    emergencyState,
    activateEmergency,
    deactivateEmergency,
    setEvacuationMode,
    updateStaffCount,
    updateSystemStatus,
    updateCommunications,
    updatePowerStatus,
    updateCriticalPackages,
    addAffectedArea,
    removeAffectedArea
  };

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = (): EmergencyContextType => {
  const context = useContext(EmergencyContext);
  if (context === undefined) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
}; 