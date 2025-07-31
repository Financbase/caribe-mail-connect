import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Shift {
  id: string;
  employee_id: string;
  date: string;
  start_time: string;
  end_time: string;
  break_start?: string;
  break_end?: string;
  position: string;
  location: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  position: string;
  department: string;
  photo_url?: string;
  status: string;
}

interface ShiftSchedulerProps {
  employees: Employee[];
  shifts: Shift[];
  onShiftCreate: (shift: Omit<Shift, 'id' | 'created_at' | 'updated_at'>) => void;
  onShiftUpdate: (id: string, shift: Partial<Shift>) => void;
  onShiftDelete: (id: string) => void;
  className?: string;
}

export const ShiftScheduler: React.FC<ShiftSchedulerProps> = ({
  employees,
  shifts,
  onShiftCreate,
  onShiftUpdate,
  onShiftDelete,
  className = ''
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [newShift, setNewShift] = useState({
    employee_id: '',
    date: '',
    start_time: '',
    end_time: '',
    break_start: '',
    break_end: '',
    position: '',
    location: '',
    notes: ''
  });

  // Get week dates
  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      dates.push(day);
    }
    return dates;
  };

  // Get month dates
  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const dates = [];
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const dates = viewMode === 'week' ? getWeekDates(currentDate) : getMonthDates(currentDate);

  // Get shifts for a specific date
  const getShiftsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      const shiftDateStr = shiftDate.toISOString().split('T')[0];
      return shiftDateStr === dateStr;
    });
  };

  // Get employee name
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown';
  };

  // Get employee initials
  const getEmployeeInitials = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return '?';
    return `${employee.first_name.charAt(0)}${employee.last_name.charAt(0)}`.toUpperCase();
  };

  // Get employee photo
  const getEmployeePhoto = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.photo_url;
  };

  // Format time
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get shift status badge
  const getShiftStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Scheduled</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-green-100 text-green-800">In Progress</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Navigate to previous period
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate to next period
  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Handle create shift
  const handleCreateShift = () => {
    onShiftCreate({
      ...newShift,
      status: 'scheduled'
    });
    setNewShift({
      employee_id: '',
      date: '',
      start_time: '',
      end_time: '',
      break_start: '',
      break_end: '',
      position: '',
      location: '',
      notes: ''
    });
    setIsCreateDialogOpen(false);
  };

  // Handle edit shift
  const handleEditShift = () => {
    if (editingShift) {
      onShiftUpdate(editingShift.id, {
        ...newShift,
        status: editingShift.status
      });
      setEditingShift(null);
      setIsEditDialogOpen(false);
    }
  };

  // Open edit dialog
  const openEditDialog = (shift: Shift) => {
    setEditingShift(shift);
    setNewShift({
      employee_id: shift.employee_id,
      date: shift.date,
      start_time: shift.start_time,
      end_time: shift.end_time,
      break_start: shift.break_start || '',
      break_end: shift.break_end || '',
      position: shift.position,
      location: shift.location,
      notes: shift.notes || ''
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Shift Scheduler</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-lg font-medium">
            {viewMode === 'week' 
              ? `${dates[0].toLocaleDateString()} - ${dates[6].toLocaleDateString()}`
              : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            }
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={viewMode} onValueChange={(value: 'week' | 'month') => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Shift
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Shift</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employee">Employee</Label>
                  <Select value={newShift.employee_id} onValueChange={(value) => setNewShift({...newShift, employee_id: value})}>
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
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newShift.date}
                    onChange={(e) => setNewShift({...newShift, date: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={newShift.start_time}
                      onChange={(e) => setNewShift({...newShift, start_time: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_time">End Time</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={newShift.end_time}
                      onChange={(e) => setNewShift({...newShift, end_time: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={newShift.position}
                    onChange={(e) => setNewShift({...newShift, position: e.target.value})}
                    placeholder="e.g., Driver, Sorter, Customer Service"
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newShift.location}
                    onChange={(e) => setNewShift({...newShift, location: e.target.value})}
                    placeholder="e.g., San Juan Hub, Bayamón Station"
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newShift.notes}
                    onChange={(e) => setNewShift({...newShift, notes: e.target.value})}
                    placeholder="Optional notes about this shift"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateShift}>
                    Create Shift
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        
        <Select value={filterPosition} onValueChange={setFilterPosition}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            <SelectItem value="driver">Driver</SelectItem>
            <SelectItem value="sorter">Sorter</SelectItem>
            <SelectItem value="customer_service">Customer Service</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterLocation} onValueChange={setFilterLocation}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="san_juan">San Juan Hub</SelectItem>
            <SelectItem value="bayamon">Bayamón Station</SelectItem>
            <SelectItem value="caguas">Caguas Station</SelectItem>
            <SelectItem value="ponce">Ponce Station</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Body */}
        <div className="grid grid-cols-7">
          {dates.map((date, index) => {
            const dayShifts = getShiftsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            
            return (
              <div
                key={index}
                className={`min-h-32 border-r border-b p-2 ${
                  isToday ? 'bg-blue-50' : ''
                } ${
                  !isCurrentMonth ? 'bg-gray-50' : ''
                }`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isToday ? 'text-blue-600' : ''
                } ${
                  !isCurrentMonth ? 'text-gray-400' : ''
                }`}>
                  {date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayShifts.map(shift => (
                    <div
                      key={shift.id}
                      className="p-2 bg-blue-100 rounded text-xs cursor-pointer hover:bg-blue-200 transition-colors"
                      onClick={() => openEditDialog(shift)}
                    >
                      <div className="flex items-center space-x-1 mb-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={getEmployeePhoto(shift.employee_id)} />
                          <AvatarFallback className="text-xs">
                            {getEmployeeInitials(shift.employee_id)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium truncate">
                          {getEmployeeName(shift.employee_id)}
                        </span>
                      </div>
                      <div className="text-gray-600">
                        {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                      </div>
                      <div className="text-gray-500 truncate">
                        {shift.position}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Shift Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Shift</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-employee">Employee</Label>
              <Select value={newShift.employee_id} onValueChange={(value) => setNewShift({...newShift, employee_id: value})}>
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
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={newShift.date}
                onChange={(e) => setNewShift({...newShift, date: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-start_time">Start Time</Label>
                <Input
                  id="edit-start_time"
                  type="time"
                  value={newShift.start_time}
                  onChange={(e) => setNewShift({...newShift, start_time: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-end_time">End Time</Label>
                <Input
                  id="edit-end_time"
                  type="time"
                  value={newShift.end_time}
                  onChange={(e) => setNewShift({...newShift, end_time: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-position">Position</Label>
              <Input
                id="edit-position"
                value={newShift.position}
                onChange={(e) => setNewShift({...newShift, position: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={newShift.location}
                onChange={(e) => setNewShift({...newShift, location: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={newShift.notes}
                onChange={(e) => setNewShift({...newShift, notes: e.target.value})}
              />
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="destructive"
                onClick={() => {
                  if (editingShift) {
                    onShiftDelete(editingShift.id);
                    setIsEditDialogOpen(false);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditShift}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 