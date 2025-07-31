import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Clock, 
  Calculator, 
  Download, 
  Upload, 
  FileText,
  TrendingUp,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PayrollRecord {
  id: string;
  employee_id: string;
  pay_period_start: string;
  pay_period_end: string;
  regular_hours: number;
  overtime_hours: number;
  regular_rate: number;
  overtime_rate: number;
  gross_pay: number;
  deductions: number;
  net_pay: number;
  commission_amount?: number;
  tips_amount?: number;
  bonus_amount?: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface TipDistribution {
  id: string;
  employee_id: string;
  date: string;
  amount: number;
  service_type: string;
  distribution_method: 'equal' | 'performance_based' | 'seniority_based';
  notes?: string;
  created_at: string;
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  position: string;
  department: string;
  photo_url?: string;
  status: string;
  hourly_rate?: number;
}

interface PayrollManagerProps {
  employees: Employee[];
  payrollRecords: PayrollRecord[];
  tipDistributions: TipDistribution[];
  onCalculatePayroll: (employeeId: string, startDate: string, endDate: string) => void;
  onApprovePayroll: (recordId: string) => void;
  onExportPayroll: (recordId: string) => void;
  onDistributeTips: (distribution: Omit<TipDistribution, 'id' | 'created_at'>) => void;
  className?: string;
}

export const PayrollManager: React.FC<PayrollManagerProps> = ({
  employees,
  payrollRecords,
  tipDistributions,
  onCalculatePayroll,
  onApprovePayroll,
  onExportPayroll,
  onDistributeTips,
  className = ''
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [isCalculateDialogOpen, setIsCalculateDialogOpen] = useState(false);
  const [isTipsDialogOpen, setIsTipsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [calculationData, setCalculationData] = useState({
    employee_id: '',
    start_date: '',
    end_date: ''
  });
  const [tipsData, setTipsData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    service_type: '',
    distribution_method: 'equal' as const,
    notes: ''
  });

  // Get current pay period
  const getCurrentPayPeriod = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      start: startOfWeek.toISOString().split('T')[0],
      end: endOfWeek.toISOString().split('T')[0]
    };
  };

  // Get payroll records for period
  const getPayrollRecordsForPeriod = (period: string) => {
    const { start, end } = getCurrentPayPeriod();
    
    return payrollRecords.filter(record => {
      if (period === 'current') {
        return record.pay_period_start >= start && record.pay_period_end <= end;
      } else if (period === 'previous') {
        const prevStart = new Date(start);
        prevStart.setDate(prevStart.getDate() - 7);
        const prevEnd = new Date(end);
        prevEnd.setDate(prevEnd.getDate() - 7);
        return record.pay_period_start >= prevStart.toISOString().split('T')[0] && 
               record.pay_period_end <= prevEnd.toISOString().split('T')[0];
      }
      return true;
    });
  };

  // Get employee's payroll record
  const getEmployeePayrollRecord = (employeeId: string) => {
    const { start, end } = getCurrentPayPeriod();
    return payrollRecords.find(record => 
      record.employee_id === employeeId && 
      record.pay_period_start >= start && 
      record.pay_period_end <= end
    );
  };

  // Get employee's tips for period
  const getEmployeeTipsForPeriod = (employeeId: string, startDate: string, endDate: string) => {
    return tipDistributions.filter(tip => 
      tip.employee_id === employeeId && 
      tip.date >= startDate && 
      tip.date <= endDate
    );
  };

  // Calculate total tips for period
  const getTotalTipsForPeriod = (startDate: string, endDate: string) => {
    return tipDistributions
      .filter(tip => tip.date >= startDate && tip.date <= endDate)
      .reduce((sum, tip) => sum + tip.amount, 0);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Get employee initials
  const getEmployeeInitials = (employee: Employee) => {
    return `${employee.first_name.charAt(0)}${employee.last_name.charAt(0)}`.toUpperCase();
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Approved</Badge>;
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Handle calculate payroll
  const handleCalculatePayroll = () => {
    onCalculatePayroll(calculationData.employee_id, calculationData.start_date, calculationData.end_date);
    setCalculationData({
      employee_id: '',
      start_date: '',
      end_date: ''
    });
    setIsCalculateDialogOpen(false);
  };

  // Handle distribute tips
  const handleDistributeTips = () => {
    onDistributeTips(tipsData);
    setTipsData({
      employee_id: '',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      service_type: '',
      distribution_method: 'equal',
      notes: ''
    });
    setIsTipsDialogOpen(false);
  };

  const currentPeriod = getCurrentPayPeriod();
  const periodRecords = getPayrollRecordsForPeriod(selectedPeriod);
  const totalTips = getTotalTipsForPeriod(currentPeriod.start, currentPeriod.end);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payroll Manager</h2>
          <p className="text-gray-600">Calculate and manage employee payroll, overtime, and tips</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isCalculateDialogOpen} onOpenChange={setIsCalculateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Payroll
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Calculate Payroll</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="calc-employee">Employee</Label>
                  <Select value={calculationData.employee_id} onValueChange={(value) => setCalculationData({...calculationData, employee_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.first_name} {employee.last_name} - {employee.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="calc-start-date">Start Date</Label>
                  <Input
                    id="calc-start-date"
                    type="date"
                    value={calculationData.start_date}
                    onChange={(e) => setCalculationData({...calculationData, start_date: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="calc-end-date">End Date</Label>
                  <Input
                    id="calc-end-date"
                    type="date"
                    value={calculationData.end_date}
                    onChange={(e) => setCalculationData({...calculationData, end_date: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCalculateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCalculatePayroll}
                    disabled={!calculationData.employee_id || !calculationData.start_date || !calculationData.end_date}
                  >
                    Calculate
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isTipsDialogOpen} onOpenChange={setIsTipsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Distribute Tips
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Distribute Tips</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tips-employee">Employee</Label>
                  <Select value={tipsData.employee_id} onValueChange={(value) => setTipsData({...tipsData, employee_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.first_name} {employee.last_name} - {employee.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tips-date">Date</Label>
                  <Input
                    id="tips-date"
                    type="date"
                    value={tipsData.date}
                    onChange={(e) => setTipsData({...tipsData, date: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tips-amount">Amount</Label>
                  <Input
                    id="tips-amount"
                    type="number"
                    step="0.01"
                    value={tipsData.amount}
                    onChange={(e) => setTipsData({...tipsData, amount: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tips-service">Service Type</Label>
                  <Input
                    id="tips-service"
                    value={tipsData.service_type}
                    onChange={(e) => setTipsData({...tipsData, service_type: e.target.value})}
                    placeholder="e.g., Premium Delivery, Customer Service"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tips-method">Distribution Method</Label>
                  <Select value={tipsData.distribution_method} onValueChange={(value: string) => setTipsData({...tipsData, distribution_method: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equal">Equal Distribution</SelectItem>
                      <SelectItem value="performance_based">Performance Based</SelectItem>
                      <SelectItem value="seniority_based">Seniority Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tips-notes">Notes</Label>
                  <Textarea
                    id="tips-notes"
                    value={tipsData.notes}
                    onChange={(e) => setTipsData({...tipsData, notes: e.target.value})}
                    placeholder="Optional notes about this tip distribution..."
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsTipsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleDistributeTips}
                    disabled={!tipsData.employee_id || tipsData.amount <= 0}
                  >
                    Distribute Tips
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">Pay Period:</span>
        </div>
        
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Week</SelectItem>
            <SelectItem value="previous">Previous Week</SelectItem>
            <SelectItem value="all">All Periods</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="text-sm text-gray-600">
          {selectedPeriod === 'current' && `${currentPeriod.start} - ${currentPeriod.end}`}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Employees</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payroll</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(periodRecords.reduce((sum, record) => sum + record.gross_pay, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Overtime Hours</p>
                <p className="text-2xl font-bold">
                  {periodRecords.reduce((sum, record) => sum + record.overtime_hours, 0).toFixed(1)}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tips</p>
                <p className="text-2xl font-bold">{formatCurrency(totalTips)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Regular Hours</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Gross Pay</TableHead>
                <TableHead>Net Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periodRecords.map(record => {
                const employee = employees.find(emp => emp.id === record.employee_id);
                if (!employee) return null;

                return (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={employee.photo_url} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                            {getEmployeeInitials(employee)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{employee.first_name} {employee.last_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(record.pay_period_start).toLocaleDateString()}</div>
                        <div className="text-gray-500">to {new Date(record.pay_period_end).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>{record.regular_hours}h</TableCell>
                    <TableCell>{record.overtime_hours}h</TableCell>
                    <TableCell className="font-medium">{formatCurrency(record.gross_pay)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(record.net_pay)}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {record.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onApprovePayroll(record.id)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onExportPayroll(record.id)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {periodRecords.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No payroll records for this period</p>
              <p className="text-sm">Calculate payroll to see records here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee Payroll Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map(employee => {
          const payrollRecord = getEmployeePayrollRecord(employee.id);
          const employeeTips = getEmployeeTipsForPeriod(employee.id, currentPeriod.start, currentPeriod.end);
          const totalEmployeeTips = employeeTips.reduce((sum, tip) => sum + tip.amount, 0);

          return (
            <Card key={employee.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={employee.photo_url} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getEmployeeInitials(employee)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{employee.first_name} {employee.last_name}</CardTitle>
                    <p className="text-sm text-gray-600">{employee.position}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {payrollRecord ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Regular Hours:</span>
                        <span className="text-sm font-medium">{payrollRecord.regular_hours}h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Overtime:</span>
                        <span className="text-sm font-medium">{payrollRecord.overtime_hours}h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Gross Pay:</span>
                        <span className="text-sm font-medium">{formatCurrency(payrollRecord.gross_pay)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Net Pay:</span>
                        <span className="text-sm font-medium">{formatCurrency(payrollRecord.net_pay)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tips:</span>
                        <span className="text-sm font-medium">{formatCurrency(totalEmployeeTips)}</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      {getStatusBadge(payrollRecord.status)}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Calculator className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No payroll calculated</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        setCalculationData({
                          employee_id: employee.id,
                          start_date: currentPeriod.start,
                          end_date: currentPeriod.end
                        });
                        setIsCalculateDialogOpen(true);
                      }}
                    >
                      Calculate Payroll
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}; 