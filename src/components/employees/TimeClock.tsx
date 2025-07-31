import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Play, 
  Pause, 
  Square, 
  Coffee, 
  Users, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle
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
import { Textarea } from '@/components/ui/textarea';

interface TimeClockEntry {
  id: string;
  employee_id: string;
  clock_in: string;
  clock_out?: string;
  break_start?: string;
  break_end?: string;
  total_hours?: number;
  break_hours?: number;
  notes?: string;
  location: string;
  status: 'active' | 'on_break' | 'completed';
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

interface TimeClockProps {
  employees: Employee[];
  timeEntries: TimeClockEntry[];
  onClockIn: (employeeId: string, location: string, notes?: string) => void;
  onClockOut: (entryId: string, notes?: string) => void;
  onBreakStart: (entryId: string) => void;
  onBreakEnd: (entryId: string) => void;
  className?: string;
}

export const TimeClock: React.FC<TimeClockProps> = ({
  employees,
  timeEntries,
  onClockIn,
  onClockOut,
  onBreakStart,
  onBreakEnd,
  className = ''
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isClockInDialogOpen, setIsClockInDialogOpen] = useState(false);
  const [isClockOutDialogOpen, setIsClockOutDialogOpen] = useState(false);
  const [clockOutEntry, setClockOutEntry] = useState<TimeClockEntry | null>(null);
  const [clockInData, setClockInData] = useState({
    location: '',
    notes: ''
  });
  const [clockOutNotes, setClockOutNotes] = useState('');

  // Get active entries
  const getActiveEntries = () => {
    return timeEntries.filter(entry => 
      entry.status === 'active' || entry.status === 'on_break'
    );
  };

  // Get employee's active entry
  const getEmployeeActiveEntry = (employeeId: string) => {
    return timeEntries.find(entry => 
      entry.employee_id === employeeId && 
      (entry.status === 'active' || entry.status === 'on_break')
    );
  };

  // Get employee's today entries
  const getEmployeeTodayEntries = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return timeEntries.filter(entry => {
      const entryDate = new Date(entry.clock_in).toISOString().split('T')[0];
      return entry.employee_id === employeeId && entryDate === today;
    });
  };

  // Calculate total hours for today
  const getEmployeeTodayHours = (employeeId: string) => {
    const todayEntries = getEmployeeTodayEntries(employeeId);
    return todayEntries.reduce((total, entry) => {
      if (entry.total_hours) {
        return total + entry.total_hours;
      }
      return total;
    }, 0);
  };

  // Format duration
  const formatDuration = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  // Format time
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get current time
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Calculate elapsed time
  const getElapsedTime = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return formatDuration(diffHours);
  };

  // Get employee initials
  const getEmployeeInitials = (employee: Employee) => {
    return `${employee.first_name.charAt(0)}${employee.last_name.charAt(0)}`.toUpperCase();
  };

  // Handle clock in
  const handleClockIn = () => {
    if (selectedEmployee) {
      onClockIn(selectedEmployee.id, clockInData.location, clockInData.notes);
      setClockInData({ location: '', notes: '' });
      setIsClockInDialogOpen(false);
      setSelectedEmployee(null);
    }
  };

  // Handle clock out
  const handleClockOut = () => {
    if (clockOutEntry) {
      onClockOut(clockOutEntry.id, clockOutNotes);
      setClockOutNotes('');
      setIsClockOutDialogOpen(false);
      setClockOutEntry(null);
    }
  };

  // Handle break start
  const handleBreakStart = (entry: TimeClockEntry) => {
    onBreakStart(entry.id);
  };

  // Handle break end
  const handleBreakEnd = (entry: TimeClockEntry) => {
    onBreakEnd(entry.id);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'on_break':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">On Break</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Time Clock</h2>
          <p className="text-gray-600">Manage employee time tracking and breaks</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono text-gray-900">{getCurrentTime()}</div>
          <div className="text-sm text-gray-500">Current Time</div>
        </div>
      </div>

      {/* Active Employees */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Active Employees</span>
            <Badge variant="secondary">{getActiveEntries().length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getActiveEntries().map(entry => {
              const employee = employees.find(emp => emp.id === entry.employee_id);
              if (!employee) return null;

              return (
                <Card key={entry.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.photo_url} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {getEmployeeInitials(employee)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {employee.first_name} {employee.last_name}
                          </h3>
                          <p className="text-sm text-gray-600">{employee.position}</p>
                          <p className="text-xs text-gray-500">{entry.location}</p>
                        </div>
                      </div>
                      {getStatusBadge(entry.status)}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Clock In:</span>
                        <span className="text-sm font-medium">{formatTime(entry.clock_in)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Elapsed:</span>
                        <span className="text-sm font-medium text-green-600">
                          {getElapsedTime(entry.clock_in)}
                        </span>
                      </div>
                      {entry.break_start && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Break Start:</span>
                          <span className="text-sm font-medium">{formatTime(entry.break_start)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {entry.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBreakStart(entry)}
                          className="flex-1"
                        >
                          <Coffee className="h-4 w-4 mr-1" />
                          Start Break
                        </Button>
                      )}
                      {entry.status === 'on_break' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBreakEnd(entry)}
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          End Break
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setClockOutEntry(entry);
                          setIsClockOutDialogOpen(true);
                        }}
                        className="flex-1"
                      >
                        <Square className="h-4 w-4 mr-1" />
                        Clock Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {getActiveEntries().length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No active employees</p>
              <p className="text-sm">Employees will appear here when they clock in</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee Directory */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map(employee => {
              const activeEntry = getEmployeeActiveEntry(employee.id);
              const todayHours = getEmployeeTodayHours(employee.id);
              const isClockedIn = !!activeEntry;

              return (
                <Card 
                  key={employee.id} 
                  className={`cursor-pointer transition-colors ${
                    isClockedIn ? 'border-green-200 bg-green-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    if (!isClockedIn) {
                      setSelectedEmployee(employee);
                      setIsClockInDialogOpen(true);
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={employee.photo_url} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {getEmployeeInitials(employee)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {employee.first_name} {employee.last_name}
                        </h3>
                        <p className="text-sm text-gray-600">{employee.position}</p>
                        <p className="text-xs text-gray-500">{employee.department}</p>
                      </div>
                      {isClockedIn ? (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600">Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <span className="text-xs text-gray-500">Available</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Today's Hours:</span>
                        <span className="text-sm font-medium">{formatDuration(todayHours)}</span>
                      </div>
                      
                      {todayHours > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Progress to 8h</span>
                            <span>{Math.round((todayHours / 8) * 100)}%</span>
                          </div>
                          <Progress value={Math.min((todayHours / 8) * 100, 100)} className="h-1" />
                        </div>
                      )}
                    </div>

                    {!isClockedIn && (
                      <Button 
                        size="sm" 
                        className="w-full mt-3"
                        disabled={employee.status !== 'active'}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Clock In
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Clock In Dialog */}
      <Dialog open={isClockInDialogOpen} onOpenChange={setIsClockInDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Clock In - {selectedEmployee?.first_name} {selectedEmployee?.last_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <input
                id="location"
                type="text"
                value={clockInData.location}
                onChange={(e) => setClockInData({...clockInData, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., San Juan Hub, Bayamón Station"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={clockInData.notes}
                onChange={(e) => setClockInData({...clockInData, notes: e.target.value})}
                placeholder="Any notes about this shift..."
                className="resize-none"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsClockInDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleClockIn}
                disabled={!clockInData.location.trim()}
              >
                <Play className="h-4 w-4 mr-2" />
                Clock In
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clock Out Dialog */}
      <Dialog open={isClockOutDialogOpen} onOpenChange={setIsClockOutDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Clock Out</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {clockOutEntry && (
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="text-sm text-gray-600">
                  <strong>Employee:</strong> {employees.find(emp => emp.id === clockOutEntry.employee_id)?.first_name} {employees.find(emp => emp.id === clockOutEntry.employee_id)?.last_name}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Clock In:</strong> {formatTime(clockOutEntry.clock_in)}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Total Time:</strong> {getElapsedTime(clockOutEntry.clock_in)}
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="clock-out-notes">End of Shift Notes (Optional)</Label>
              <Textarea
                id="clock-out-notes"
                value={clockOutNotes}
                onChange={(e) => setClockOutNotes(e.target.value)}
                placeholder="Any notes about the completed shift..."
                className="resize-none"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsClockOutDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleClockOut}>
                <Square className="h-4 w-4 mr-2" />
                Clock Out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 