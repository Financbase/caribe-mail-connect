import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Types for employee management
export interface Employee {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  photo_url?: string;
  date_of_birth?: string;
  hire_date: string;
  position: string;
  department: string;
  location_id?: string;
  supervisor_id?: string;
  hourly_rate?: number;
  salary?: number;
  commission_rate?: number;
  status: 'active' | 'inactive' | 'terminated' | 'on_leave';
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  created_at: string;
  updated_at: string;
}

export interface Shift {
  id: string;
  employee_id: string;
  location_id?: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  break_start?: string;
  break_end?: string;
  shift_type: 'regular' | 'overtime' | 'holiday' | 'weekend' | 'night';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  clock_in_time?: string;
  clock_out_time?: string;
  total_hours?: number;
  overtime_hours?: number;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ShiftSwap {
  id: string;
  requester_id: string;
  recipient_id: string;
  requester_shift_id: string;
  recipient_shift_id: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  requested_at: string;
  responded_at?: string;
  responded_by?: string;
}

export interface TimeClockEntry {
  id: string;
  employee_id: string;
  shift_id?: string;
  entry_type: 'clock_in' | 'clock_out' | 'break_start' | 'break_end';
  timestamp: string;
  location_id?: string;
  device_id?: string;
  notes?: string;
}

export interface PerformanceMetric {
  id: string;
  employee_id: string;
  metric_date: string;
  metric_type: 'packages_processed' | 'customer_satisfaction' | 'attendance' | 'training_completion' | 'efficiency_score';
  value: number;
  target_value?: number;
  unit?: string;
  notes?: string;
  recorded_by?: string;
  created_at: string;
}

export interface CustomerSatisfaction {
  id: string;
  employee_id: string;
  customer_id: string;
  rating: number;
  feedback?: string;
  interaction_date: string;
  service_type?: string;
  created_at: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  description?: string;
  category: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration?: number;
  video_url?: string;
  document_url?: string;
  quiz_questions?: any[];
  required_for_positions?: string[];
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeTraining {
  id: string;
  employee_id: string;
  module_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
  quiz_score?: number;
  attempts: number;
  notes?: string;
  assigned_by?: string;
  assigned_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  employee_id: string;
  certification_name: string;
  issuing_organization?: string;
  certification_number?: string;
  issue_date: string;
  expiry_date?: string;
  status: 'active' | 'expired' | 'revoked';
  document_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RecognitionReward {
  id: string;
  employee_id: string;
  type: 'recognition' | 'bonus' | 'award' | 'promotion';
  title: string;
  description?: string;
  amount?: number;
  awarded_at: string;
  awarded_by?: string;
  reason?: string;
  is_public: boolean;
}

export interface PayrollPeriod {
  id: string;
  period_name: string;
  start_date: string;
  end_date: string;
  status: 'open' | 'processing' | 'closed' | 'paid';
  total_hours?: number;
  total_overtime?: number;
  total_commission?: number;
  total_tips?: number;
  created_at: string;
  updated_at: string;
}

export interface EmployeePayroll {
  id: string;
  employee_id: string;
  payroll_period_id: string;
  regular_hours: number;
  overtime_hours: number;
  regular_pay: number;
  overtime_pay: number;
  commission_pay: number;
  tips: number;
  deductions: number;
  net_pay: number;
  status: 'pending' | 'approved' | 'paid';
  processed_by?: string;
  processed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TipDistribution {
  id: string;
  employee_id: string;
  payroll_period_id: string;
  tip_amount: number;
  distribution_method: 'equal' | 'performance_based' | 'hours_based';
  distribution_factor: number;
  service_date?: string;
  customer_id?: string;
  notes?: string;
  created_at: string;
}

export interface OnboardingChecklist {
  id: string;
  employee_id: string;
  checklist_item: string;
  category: string;
  is_completed: boolean;
  completed_at?: string;
  completed_by?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeWithDetails extends Employee {
  shifts?: Shift[];
  performance?: PerformanceMetric[];
  training?: EmployeeTraining[];
  certifications?: Certification[];
  payroll?: EmployeePayroll[];
}

export const useEmployeeManagement = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shiftSwaps, setShiftSwaps] = useState<ShiftSwap[]>([]);
  const [timeClockEntries, setTimeClockEntries] = useState<TimeClockEntry[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [customerSatisfaction, setCustomerSatisfaction] = useState<CustomerSatisfaction[]>([]);
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([]);
  const [employeeTraining, setEmployeeTraining] = useState<EmployeeTraining[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [recognitionRewards, setRecognitionRewards] = useState<RecognitionReward[]>([]);
  const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriod[]>([]);
  const [employeePayroll, setEmployeePayroll] = useState<EmployeePayroll[]>([]);
  const [tipDistributions, setTipDistributions] = useState<TipDistribution[]>([]);
  const [onboardingChecklists, setOnboardingChecklists] = useState<OnboardingChecklist[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('last_name', { ascending: true });

      if (error) throw error;
      setEmployees(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch shifts
  const fetchShifts = useCallback(async (employeeId?: string, startDate?: string, endDate?: string) => {
    try {
      let query = supabase.from('shifts').select('*');
      
      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      if (startDate && endDate) {
        query = query.gte('shift_date', startDate).lte('shift_date', endDate);
      }
      
      const { data, error } = await query.order('shift_date', { ascending: false });
      
      if (error) throw error;
      setShifts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch shifts');
    }
  }, []);

  // Fetch performance metrics
  const fetchPerformanceMetrics = useCallback(async (employeeId?: string) => {
    try {
      let query = supabase.from('performance_metrics').select('*');
      
      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      const { data, error } = await query.order('metric_date', { ascending: false });
      
      if (error) throw error;
      setPerformanceMetrics(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch performance metrics');
    }
  }, []);

  // Fetch training modules
  const fetchTrainingModules = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('training_modules')
        .select('*')
        .eq('is_active', true)
        .order('title', { ascending: true });

      if (error) throw error;
      setTrainingModules(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch training modules');
    }
  }, []);

  // Fetch employee training progress
  const fetchEmployeeTraining = useCallback(async (employeeId?: string) => {
    try {
      let query = supabase
        .from('employee_training')
        .select(`
          *,
          training_modules (
            title,
            description,
            category,
            difficulty_level,
            estimated_duration
          )
        `);
      
      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      const { data, error } = await query.order('assigned_at', { ascending: false });
      
      if (error) throw error;
      setEmployeeTraining(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employee training');
    }
  }, []);

  // Fetch payroll periods
  const fetchPayrollPeriods = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('payroll_periods')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setPayrollPeriods(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payroll periods');
    }
  }, []);

  // Fetch employee payroll
  const fetchEmployeePayroll = useCallback(async (employeeId?: string, periodId?: string) => {
    try {
      let query = supabase.from('employee_payroll').select('*');
      
      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      if (periodId) {
        query = query.eq('payroll_period_id', periodId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setEmployeePayroll(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employee payroll');
    }
  }, []);

  // Clock in/out functionality
  const clockIn = useCallback(async (employeeId: string, locationId?: string) => {
    try {
      const { data, error } = await supabase
        .from('time_clock_entries')
        .insert({
          employee_id: employeeId,
          entry_type: 'clock_in',
          location_id: locationId,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      // Update or create shift record
      const today = new Date().toISOString().split('T')[0];
      const { data: existingShift } = await supabase
        .from('shifts')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('shift_date', today)
        .single();

      if (existingShift) {
        await supabase
          .from('shifts')
          .update({ 
            status: 'in_progress',
            clock_in_time: new Date().toISOString()
          })
          .eq('id', existingShift.id);
      } else {
        // Create a new shift record
        await supabase
          .from('shifts')
          .insert({
            employee_id: employeeId,
            location_id: locationId,
            shift_date: today,
            start_time: '09:00:00',
            end_time: '17:00:00',
            status: 'in_progress',
            clock_in_time: new Date().toISOString()
          });
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clock in');
      throw err;
    }
  }, []);

  const clockOut = useCallback(async (employeeId: string) => {
    try {
      const { data, error } = await supabase
        .from('time_clock_entries')
        .insert({
          employee_id: employeeId,
          entry_type: 'clock_out',
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      // Update shift record
      const today = new Date().toISOString().split('T')[0];
      const { data: shift } = await supabase
        .from('shifts')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('shift_date', today)
        .single();

      if (shift) {
        await supabase
          .from('shifts')
          .update({ 
            status: 'completed',
            clock_out_time: new Date().toISOString()
          })
          .eq('id', shift.id);
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clock out');
      throw err;
    }
  }, []);

  // Create shift
  const createShift = useCallback(async (shiftData: Partial<Shift>) => {
    try {
      const { data, error } = await supabase
        .from('shifts')
        .insert(shiftData)
        .select()
        .single();

      if (error) throw error;
      setShifts(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create shift');
      throw err;
    }
  }, []);

  // Update shift
  const updateShift = useCallback(async (shiftId: string, updates: Partial<Shift>) => {
    try {
      const { data, error } = await supabase
        .from('shifts')
        .update(updates)
        .eq('id', shiftId)
        .select()
        .single();

      if (error) throw error;
      setShifts(prev => prev.map(shift => shift.id === shiftId ? data : shift));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update shift');
      throw err;
    }
  }, []);

  // Delete shift
  const deleteShift = useCallback(async (shiftId: string) => {
    try {
      const { error } = await supabase
        .from('shifts')
        .delete()
        .eq('id', shiftId);

      if (error) throw error;
      setShifts(prev => prev.filter(shift => shift.id !== shiftId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete shift');
      throw err;
    }
  }, []);

  // Request shift swap
  const requestShiftSwap = useCallback(async (swapData: Partial<ShiftSwap>) => {
    try {
      const { data, error } = await supabase
        .from('shift_swaps')
        .insert(swapData)
        .select()
        .single();

      if (error) throw error;
      setShiftSwaps(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request shift swap');
      throw err;
    }
  }, []);

  // Assign training module
  const assignTraining = useCallback(async (assignmentData: Partial<EmployeeTraining>) => {
    try {
      const { data, error } = await supabase
        .from('employee_training')
        .insert(assignmentData)
        .select()
        .single();

      if (error) throw error;
      setEmployeeTraining(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign training');
      throw err;
    }
  }, []);

  // Update training progress
  const updateTrainingProgress = useCallback(async (trainingId: string, updates: Partial<EmployeeTraining>) => {
    try {
      const { data, error } = await supabase
        .from('employee_training')
        .update(updates)
        .eq('id', trainingId)
        .select()
        .single();

      if (error) throw error;
      setEmployeeTraining(prev => prev.map(training => training.id === trainingId ? data : training));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update training progress');
      throw err;
    }
  }, []);

  // Add performance metric
  const addPerformanceMetric = useCallback(async (metricData: Partial<PerformanceMetric>) => {
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .insert(metricData)
        .select()
        .single();

      if (error) throw error;
      setPerformanceMetrics(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add performance metric');
      throw err;
    }
  }, []);

  // Calculate employee performance score
  const calculatePerformanceScore = useCallback(async (employeeId: string, startDate: string, endDate: string) => {
    try {
      const { data, error } = await supabase.rpc('calculate_performance_score', {
        p_employee_id: employeeId,
        p_start_date: startDate,
        p_end_date: endDate
      });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate performance score');
      throw err;
    }
  }, []);

  // Fetch time clock entries
  const fetchTimeClockEntries = useCallback(async (employeeId?: string) => {
    try {
      let query = supabase.from('time_clock_entries').select('*');
      
      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      const { data, error } = await query.order('timestamp', { ascending: false });
      
      if (error) throw error;
      setTimeClockEntries(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch time clock entries');
    }
  }, []);

  // Fetch attendance records
  const fetchAttendanceRecords = useCallback(async (employeeId?: string) => {
    try {
      let query = supabase.from('attendance_records').select('*');
      
      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      const { data, error } = await query.order('date', { ascending: false });
      
      if (error) throw error;
      setAttendanceRecords(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance records');
    }
  }, []);

  // Fetch employee recognitions
  const fetchEmployeeRecognitions = useCallback(async (employeeId?: string) => {
    try {
      let query = supabase.from('employee_recognition').select('*');
      
      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      const { data, error } = await query.order('awarded_at', { ascending: false });
      
      if (error) throw error;
      setRecognitionRewards(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employee recognitions');
    }
  }, []);

  // Fetch payroll records
  const fetchPayrollRecords = useCallback(async (employeeId?: string) => {
    try {
      let query = supabase.from('employee_payroll').select('*');
      
      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setEmployeePayroll(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payroll records');
    }
  }, []);

  // Fetch tip distributions
  const fetchTipDistributions = useCallback(async (employeeId?: string) => {
    try {
      let query = supabase.from('tip_distributions').select('*');
      
      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setTipDistributions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tip distributions');
    }
  }, []);

  // Add recognition
  const addRecognition = useCallback(async (recognition: Omit<RecognitionReward, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('employee_recognition')
        .insert({
          ...recognition,
          awarded_by: user?.id
        });

      if (error) throw error;
      await fetchEmployeeRecognitions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add recognition');
    }
  }, [user, fetchEmployeeRecognitions]);

  // Update attendance
  const updateAttendance = useCallback(async (employeeId: string, date: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .upsert({
          employee_id: employeeId,
          date,
          status,
          updated_by: user?.id
        });

      if (error) throw error;
      await fetchAttendanceRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update attendance');
    }
  }, [user, fetchAttendanceRecords]);

  // Calculate payroll
  const calculatePayroll = useCallback(async (employeeId: string, periodId: string) => {
    try {
      const { data, error } = await supabase.rpc('calculate_shift_hours', {
        p_employee_id: employeeId,
        p_start_date: periodId
      });

      if (error) throw error;
      await fetchPayrollRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate payroll');
    }
  }, [fetchPayrollRecords]);

  // Approve payroll
  const approvePayroll = useCallback(async (payrollId: string) => {
    try {
      const { data, error } = await supabase
        .from('employee_payroll')
        .update({
          status: 'approved',
          processed_by: user?.id,
          processed_at: new Date().toISOString()
        })
        .eq('id', payrollId);

      if (error) throw error;
      await fetchPayrollRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve payroll');
    }
  }, [user, fetchPayrollRecords]);

  // Export payroll
  const exportPayroll = useCallback(async (periodId: string) => {
    try {
      const { data, error } = await supabase
        .from('employee_payroll')
        .select('*')
        .eq('payroll_period_id', periodId);

      if (error) throw error;
      
      // In a real implementation, this would generate and download a file
      console.log('Exporting payroll data:', data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export payroll');
    }
  }, []);

  // Distribute tips
  const distributeTips = useCallback(async (distribution: Omit<TipDistribution, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tip_distributions')
        .insert(distribution);

      if (error) throw error;
      await fetchTipDistributions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to distribute tips');
    }
  }, [fetchTipDistributions]);

  // Get employee with full details
  const getEmployeeWithDetails = useCallback(async (employeeId: string): Promise<EmployeeWithDetails | null> => {
    try {
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .single();

      if (employeeError) throw employeeError;

      // Fetch related data
      const [shiftsData, performanceData, trainingData, certificationsData, payrollData] = await Promise.all([
        supabase.from('shifts').select('*').eq('employee_id', employeeId).order('shift_date', { ascending: false }),
        supabase.from('performance_metrics').select('*').eq('employee_id', employeeId).order('metric_date', { ascending: false }),
        supabase.from('employee_training').select('*').eq('employee_id', employeeId).order('assigned_at', { ascending: false }),
        supabase.from('certifications').select('*').eq('employee_id', employeeId).order('issue_date', { ascending: false }),
        supabase.from('employee_payroll').select('*').eq('employee_id', employeeId).order('created_at', { ascending: false })
      ]);

      return {
        ...employee,
        shifts: shiftsData.data || [],
        performance: performanceData.data || [],
        training: trainingData.data || [],
        certifications: certificationsData.data || [],
        payroll: payrollData.data || []
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employee details');
      return null;
    }
  }, []);

  // Initialize data
  useEffect(() => {
    if (user) {
      fetchEmployees();
      fetchTrainingModules();
      fetchPayrollPeriods();
    }
  }, [user, fetchEmployees, fetchTrainingModules, fetchPayrollPeriods]);

  return {
    // State
    employees,
    shifts,
    shiftSwaps,
    timeClockEntries,
    performanceMetrics,
    customerSatisfaction,
    trainingModules,
    employeeTraining,
    certifications,
    recognitionRewards,
    payrollPeriods,
    employeePayroll,
    tipDistributions,
    onboardingChecklists,
    attendanceRecords,
    loading,
    error,

    // Actions
    fetchEmployees,
    fetchShifts,
    fetchPerformanceMetrics,
    fetchTrainingModules,
    fetchEmployeeTraining,
    fetchPayrollPeriods,
    fetchEmployeePayroll,
    fetchTimeClockEntries,
    fetchAttendanceRecords,
    fetchEmployeeRecognitions,
    fetchPayrollRecords,
    fetchTipDistributions,
    clockIn,
    clockOut,
    startBreak,
    endBreak,
    createShift,
    updateShift,
    deleteShift,
    requestShiftSwap,
    assignTraining,
    updateTrainingProgress,
    addPerformanceMetric,
    addRecognition,
    updateAttendance,
    calculatePayroll,
    approvePayroll,
    exportPayroll,
    distributeTips,
    calculatePerformanceScore,
    getEmployeeWithDetails,

    // Utility functions
    clearError: () => setError(null)
  };
}; 