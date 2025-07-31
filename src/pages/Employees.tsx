import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Plus, 
  Search, 
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useEmployeeManagement } from '@/hooks/useEmployeeManagement';
import { Employee, Shift, PerformanceMetric } from '@/hooks/useEmployeeManagement';
import { EmployeeCard } from '@/components/employees/EmployeeCard';
import { ShiftScheduler } from '@/components/employees/ShiftScheduler';
import { TimeClock } from '@/components/employees/TimeClock';
import { PerformanceTracker } from '@/components/employees/PerformanceTracker';
import { PayrollManager } from '@/components/employees/PayrollManager';

interface EmployeesProps {
  onNavigate: (route: string) => void;
}

export const Employees: React.FC<EmployeesProps> = ({ onNavigate }) => {
  const {
    employees,
    shifts,
    performanceMetrics,
    employeeTraining,
    timeClockEntries,
    attendanceRecords,
    employeeRecognitions,
    payrollRecords,
    tipDistributions,
    loading,
    error,
    fetchEmployees,
    fetchShifts,
    fetchPerformanceMetrics,
    fetchEmployeeTraining,
    fetchTimeClockEntries,
    fetchAttendanceRecords,
    fetchEmployeeRecognitions,
    fetchPayrollRecords,
    fetchTipDistributions,
    createShift,
    updateShift,
    deleteShift,
    clockIn,
    clockOut,
    startBreak,
    endBreak,
    addPerformanceMetric,
    addRecognition,
    updateAttendance,
    calculatePayroll,
    approvePayroll,
    exportPayroll,
    distributeTips
  } = useEmployeeManagement();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState('directory');

  // Get unique departments from employees
  const departments = useMemo(() => 
    [...new Set(employees.map(emp => emp.department))].filter(Boolean), 
    [employees]
  );

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !filterDepartment || employee.department === filterDepartment;
    const matchesStatus = !filterStatus || employee.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });



  // Get employee performance data
  const getEmployeePerformance = (employeeId: string) => {
    return performanceMetrics.filter(metric => metric.employee_id === employeeId);
  };

  // Get employee training progress
  const getEmployeeTraining = (employeeId: string) => {
    return employeeTraining.filter(training => training.employee_id === employeeId);
  };

  // Get employee shifts for today
  const getTodayShifts = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return shifts.filter(shift => 
      shift.employee_id === employeeId && 
      shift.shift_date === today
    );
  };

  // Calculate training completion percentage
  const getTrainingCompletion = (employeeId: string) => {
    const employeeTrainingData = getEmployeeTraining(employeeId);
    if (employeeTrainingData.length === 0) return 0;
    
    const completed = employeeTrainingData.filter(training => training.status === 'completed').length;
    return Math.round((completed / employeeTrainingData.length) * 100);
  };

  // Get employee initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'terminated':
        return <Badge variant="destructive">Terminated</Badge>;
      case 'on_leave':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">On Leave</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };



  useEffect(() => {
    fetchEmployees();
    fetchShifts();
    fetchPerformanceMetrics();
    fetchEmployeeTraining();
    fetchTimeClockEntries();
    fetchAttendanceRecords();
    fetchEmployeeRecognitions();
    fetchPayrollRecords();
    fetchTipDistributions();
  }, [
    fetchEmployees, 
    fetchShifts, 
    fetchPerformanceMetrics, 
    fetchEmployeeTraining,
    fetchTimeClockEntries,
    fetchAttendanceRecords,
    fetchEmployeeRecognitions,
    fetchPayrollRecords,
    fetchTipDistributions
  ]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading employee data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => fetchEmployees()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600 mt-1">Manage staff, schedules, and performance</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onNavigate('training')}>
            <BookOpen className="w-4 h-4 mr-2" />
            Training
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">
              {employees.filter(emp => emp.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Shifts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shifts.filter(shift => 
                shift.shift_date === new Date().toISOString().split('T')[0]
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {shifts.filter(shift => 
                shift.shift_date === new Date().toISOString().split('T')[0] && 
                shift.status === 'in_progress'
              ).length} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceMetrics.length > 0 
                ? Math.round(performanceMetrics.reduce((sum, metric) => sum + metric.value, 0) / performanceMetrics.length)
                : 0
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {performanceMetrics.length} metrics
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employeeTraining.length > 0 
                ? Math.round((employeeTraining.filter(t => t.status === 'completed').length / employeeTraining.length) * 100)
                : 0
              }%
            </div>
            <p className="text-xs text-muted-foreground">
              {employeeTraining.filter(t => t.status === 'completed').length} completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="directory">Staff Directory</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="timeclock">Time Clock</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>

        {/* Staff Directory Tab */}
        <TabsContent value="directory" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Employee Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                todayShifts={getTodayShifts(employee.id).length}
                performanceMetrics={getEmployeePerformance(employee.id).length}
                trainingCompletion={getTrainingCompletion(employee.id)}
                onViewDetails={setSelectedEmployee}
                onEdit={(employee) => console.log('Edit employee:', employee)}
                onViewSchedule={(employee) => console.log('View schedule:', employee)}
                onViewPerformance={(employee) => console.log('View performance:', employee)}
                onViewTraining={(employee) => onNavigate('training')}
              />
            ))}
          </div>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <ShiftScheduler
            employees={employees}
            shifts={shifts}
            onShiftCreate={createShift}
            onShiftUpdate={updateShift}
            onShiftDelete={deleteShift}
          />
        </TabsContent>

        {/* Time Clock Tab */}
        <TabsContent value="timeclock" className="space-y-4">
          <TimeClock
            employees={employees}
            timeEntries={timeClockEntries}
            onClockIn={clockIn}
            onClockOut={clockOut}
            onBreakStart={startBreak}
            onBreakEnd={endBreak}
          />
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <PerformanceTracker
            employees={employees}
            performanceMetrics={performanceMetrics}
            attendanceRecords={attendanceRecords}
            recognitions={employeeRecognitions}
            onAddMetric={addPerformanceMetric}
            onAddRecognition={addRecognition}
            onUpdateAttendance={updateAttendance}
          />
        </TabsContent>

        {/* Payroll Tab */}
        <TabsContent value="payroll" className="space-y-4">
          <PayrollManager
            employees={employees}
            payrollRecords={payrollRecords}
            tipDistributions={tipDistributions}
            onCalculatePayroll={calculatePayroll}
            onApprovePayroll={approvePayroll}
            onExportPayroll={exportPayroll}
            onDistributeTips={distributeTips}
          />
        </TabsContent>
      </Tabs>

      {/* Employee Details Dialog */}
      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedEmployee.photo_url} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                    {getInitials(selectedEmployee.first_name, selectedEmployee.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedEmployee.first_name} {selectedEmployee.last_name}
                  </h3>
                  <p className="text-gray-600">{selectedEmployee.position}</p>
                  <p className="text-sm text-gray-500">{selectedEmployee.department}</p>
                  {getStatusBadge(selectedEmployee.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Email:</span> {selectedEmployee.email}</p>
                    <p><span className="text-gray-600">Phone:</span> {selectedEmployee.phone || 'N/A'}</p>
                    <p><span className="text-gray-600">Employee ID:</span> {selectedEmployee.employee_id}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Employment Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Hire Date:</span> {new Date(selectedEmployee.hire_date).toLocaleDateString()}</p>
                    <p><span className="text-gray-600">Hourly Rate:</span> ${selectedEmployee.hourly_rate || 'N/A'}</p>
                    <p><span className="text-gray-600">Commission:</span> {selectedEmployee.commission_rate ? `${(selectedEmployee.commission_rate * 100).toFixed(1)}%` : 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onNavigate('training')}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Training
                </Button>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Schedule
                </Button>
                <Button variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Performance
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 