import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  Star, 
  Calendar, 
  Award, 
  Target,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Trophy
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
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PerformanceMetric {
  id: string;
  employee_id: string;
  metric_type: 'packages_processed' | 'customer_satisfaction' | 'attendance' | 'training_completion' | 'efficiency';
  value: number;
  target: number;
  period: 'daily' | 'weekly' | 'monthly';
  date: string;
  notes?: string;
  created_at: string;
}

interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'vacation' | 'sick';
  clock_in?: string;
  clock_out?: string;
  total_hours?: number;
  notes?: string;
  created_at: string;
}

interface EmployeeRecognition {
  id: string;
  employee_id: string;
  recognition_type: 'excellence' | 'improvement' | 'milestone' | 'teamwork' | 'innovation';
  title: string;
  description: string;
  points: number;
  awarded_by: string;
  awarded_date: string;
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
}

interface PerformanceTrackerProps {
  employees: Employee[];
  performanceMetrics: PerformanceMetric[];
  attendanceRecords: AttendanceRecord[];
  recognitions: EmployeeRecognition[];
  onAddMetric: (metric: Omit<PerformanceMetric, 'id' | 'created_at'>) => void;
  onAddRecognition: (recognition: Omit<EmployeeRecognition, 'id' | 'created_at'>) => void;
  onUpdateAttendance: (id: string, record: Partial<AttendanceRecord>) => void;
  className?: string;
}

export const PerformanceTracker: React.FC<PerformanceTrackerProps> = ({
  employees,
  performanceMetrics,
  attendanceRecords,
  recognitions,
  onAddMetric,
  onAddRecognition,
  onUpdateAttendance,
  className = ''
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isMetricDialogOpen, setIsMetricDialogOpen] = useState(false);
  const [isRecognitionDialogOpen, setIsRecognitionDialogOpen] = useState(false);
  const [newMetric, setNewMetric] = useState({
    employee_id: '',
    metric_type: 'packages_processed' as const,
    value: 0,
    target: 0,
    period: 'daily' as const,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [newRecognition, setNewRecognition] = useState({
    employee_id: '',
    recognition_type: 'excellence' as const,
    title: '',
    description: '',
    points: 0,
    awarded_by: '',
    awarded_date: new Date().toISOString().split('T')[0]
  });

  // Get employee metrics
  const getEmployeeMetrics = (employeeId: string) => {
    return performanceMetrics.filter(metric => metric.employee_id === employeeId);
  };

  // Get employee attendance
  const getEmployeeAttendance = (employeeId: string) => {
    return attendanceRecords.filter(record => record.employee_id === employeeId);
  };

  // Get employee recognitions
  const getEmployeeRecognitions = (employeeId: string) => {
    return recognitions.filter(recognition => recognition.employee_id === employeeId);
  };

  // Calculate performance score
  const calculatePerformanceScore = (employeeId: string) => {
    const metrics = getEmployeeMetrics(employeeId);
    if (metrics.length === 0) return 0;

    const totalScore = metrics.reduce((sum, metric) => {
      const percentage = (metric.value / metric.target) * 100;
      return sum + Math.min(percentage, 100);
    }, 0);

    return Math.round(totalScore / metrics.length);
  };

  // Get attendance percentage
  const getAttendancePercentage = (employeeId: string) => {
    const attendance = getEmployeeAttendance(employeeId);
    if (attendance.length === 0) return 100;

    const presentDays = attendance.filter(record => 
      record.status === 'present' || record.status === 'half_day'
    ).length;

    return Math.round((presentDays / attendance.length) * 100);
  };

  // Get total recognition points
  const getTotalRecognitionPoints = (employeeId: string) => {
    const employeeRecognitions = getEmployeeRecognitions(employeeId);
    return employeeRecognitions.reduce((sum, recognition) => sum + recognition.points, 0);
  };

  // Get employee initials
  const getEmployeeInitials = (employee: Employee) => {
    return `${employee.first_name.charAt(0)}${employee.last_name.charAt(0)}`.toUpperCase();
  };

  // Get metric type label
  const getMetricTypeLabel = (type: string) => {
    switch (type) {
      case 'packages_processed':
        return 'Packages Processed';
      case 'customer_satisfaction':
        return 'Customer Satisfaction';
      case 'attendance':
        return 'Attendance';
      case 'training_completion':
        return 'Training Completion';
      case 'efficiency':
        return 'Efficiency';
      default:
        return type;
    }
  };

  // Get recognition type label
  const getRecognitionTypeLabel = (type: string) => {
    switch (type) {
      case 'excellence':
        return 'Excellence';
      case 'improvement':
        return 'Improvement';
      case 'milestone':
        return 'Milestone';
      case 'teamwork':
        return 'Teamwork';
      case 'innovation':
        return 'Innovation';
      default:
        return type;
    }
  };

  // Get recognition type color
  const getRecognitionTypeColor = (type: string) => {
    switch (type) {
      case 'excellence':
        return 'bg-yellow-100 text-yellow-800';
      case 'improvement':
        return 'bg-green-100 text-green-800';
      case 'milestone':
        return 'bg-blue-100 text-blue-800';
      case 'teamwork':
        return 'bg-purple-100 text-purple-800';
      case 'innovation':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle add metric
  const handleAddMetric = () => {
    onAddMetric(newMetric);
    setNewMetric({
      employee_id: '',
      metric_type: 'packages_processed',
      value: 0,
      target: 0,
      period: 'daily',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsMetricDialogOpen(false);
  };

  // Handle add recognition
  const handleAddRecognition = () => {
    onAddRecognition(newRecognition);
    setNewRecognition({
      employee_id: '',
      recognition_type: 'excellence',
      title: '',
      description: '',
      points: 0,
      awarded_by: '',
      awarded_date: new Date().toISOString().split('T')[0]
    });
    setIsRecognitionDialogOpen(false);
  };

  // Get performance level
  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 80) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 70) return { level: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' };
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Tracker</h2>
          <p className="text-gray-600">Monitor employee performance, attendance, and recognition</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isMetricDialogOpen} onOpenChange={setIsMetricDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <BarChart3 className="h-4 w-4 mr-2" />
                Add Metric
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Performance Metric</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="metric-employee">Employee</Label>
                  <Select value={newMetric.employee_id} onValueChange={(value) => setNewMetric({...newMetric, employee_id: value})}>
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
                  <Label htmlFor="metric-type">Metric Type</Label>
                  <Select value={newMetric.metric_type} onValueChange={(value: string) => setNewMetric({...newMetric, metric_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="packages_processed">Packages Processed</SelectItem>
                      <SelectItem value="customer_satisfaction">Customer Satisfaction</SelectItem>
                      <SelectItem value="attendance">Attendance</SelectItem>
                      <SelectItem value="training_completion">Training Completion</SelectItem>
                      <SelectItem value="efficiency">Efficiency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="metric-value">Value</Label>
                    <Input
                      id="metric-value"
                      type="number"
                      value={newMetric.value}
                      onChange={(e) => setNewMetric({...newMetric, value: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="metric-target">Target</Label>
                    <Input
                      id="metric-target"
                      type="number"
                      value={newMetric.target}
                      onChange={(e) => setNewMetric({...newMetric, target: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="metric-period">Period</Label>
                  <Select value={newMetric.period} onValueChange={(value: string) => setNewMetric({...newMetric, period: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="metric-date">Date</Label>
                  <Input
                    id="metric-date"
                    type="date"
                    value={newMetric.date}
                    onChange={(e) => setNewMetric({...newMetric, date: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="metric-notes">Notes</Label>
                  <Textarea
                    id="metric-notes"
                    value={newMetric.notes}
                    onChange={(e) => setNewMetric({...newMetric, notes: e.target.value})}
                    placeholder="Additional notes about this metric..."
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsMetricDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMetric}>
                    Add Metric
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isRecognitionDialogOpen} onOpenChange={setIsRecognitionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Award className="h-4 w-4 mr-2" />
                Give Recognition
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Give Employee Recognition</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recognition-employee">Employee</Label>
                  <Select value={newRecognition.employee_id} onValueChange={(value) => setNewRecognition({...newRecognition, employee_id: value})}>
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
                  <Label htmlFor="recognition-type">Recognition Type</Label>
                  <Select value={newRecognition.recognition_type} onValueChange={(value: string) => setNewRecognition({...newRecognition, recognition_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellence">Excellence</SelectItem>
                      <SelectItem value="improvement">Improvement</SelectItem>
                      <SelectItem value="milestone">Milestone</SelectItem>
                      <SelectItem value="teamwork">Teamwork</SelectItem>
                      <SelectItem value="innovation">Innovation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="recognition-title">Title</Label>
                  <Input
                    id="recognition-title"
                    value={newRecognition.title}
                    onChange={(e) => setNewRecognition({...newRecognition, title: e.target.value})}
                    placeholder="e.g., Outstanding Performance"
                  />
                </div>
                
                <div>
                  <Label htmlFor="recognition-description">Description</Label>
                  <Textarea
                    id="recognition-description"
                    value={newRecognition.description}
                    onChange={(e) => setNewRecognition({...newRecognition, description: e.target.value})}
                    placeholder="Describe the achievement..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="recognition-points">Points</Label>
                  <Input
                    id="recognition-points"
                    type="number"
                    value={newRecognition.points}
                    onChange={(e) => setNewRecognition({...newRecognition, points: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="recognition-awarded-by">Awarded By</Label>
                  <Input
                    id="recognition-awarded-by"
                    value={newRecognition.awarded_by}
                    onChange={(e) => setNewRecognition({...newRecognition, awarded_by: e.target.value})}
                    placeholder="Manager name"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsRecognitionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddRecognition}>
                    Award Recognition
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(employee => {
          const performanceScore = calculatePerformanceScore(employee.id);
          const attendancePercentage = getAttendancePercentage(employee.id);
          const totalPoints = getTotalRecognitionPoints(employee.id);
          const performanceLevel = getPerformanceLevel(performanceScore);

          return (
            <Card key={employee.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
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
              <CardContent className="space-y-4">
                {/* Performance Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Performance Score</span>
                    <Badge className={performanceLevel.bg + ' ' + performanceLevel.color}>
                      {performanceScore}%
                    </Badge>
                  </div>
                  <Progress value={performanceScore} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">{performanceLevel.level}</p>
                </div>

                {/* Attendance */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Attendance</span>
                    <span className="text-sm font-medium">{attendancePercentage}%</span>
                  </div>
                  <Progress value={attendancePercentage} className="h-2" />
                </div>

                {/* Recognition Points */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Recognition Points</span>
                  <div className="flex items-center space-x-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{totalPoints}</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setNewMetric({
                        ...newMetric,
                        employee_id: employee.id
                      });
                      setIsMetricDialogOpen(true);
                    }}
                  >
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Add Metric
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setNewRecognition({
                        ...newRecognition,
                        employee_id: employee.id
                      });
                      setIsRecognitionDialogOpen(true);
                    }}
                  >
                    <Award className="h-3 w-3 mr-1" />
                    Recognize
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Recognitions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Recent Recognitions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recognitions.slice(0, 5).map(recognition => {
              const employee = employees.find(emp => emp.id === recognition.employee_id);
              if (!employee) return null;

              return (
                <div key={recognition.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={employee.photo_url} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                      {getEmployeeInitials(employee)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={getRecognitionTypeColor(recognition.recognition_type)}>
                        {getRecognitionTypeLabel(recognition.recognition_type)}
                      </Badge>
                      <span className="text-sm font-medium">{recognition.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{recognition.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Awarded by {recognition.awarded_by}</span>
                      <div className="flex items-center space-x-1">
                        <Trophy className="h-3 w-3 text-yellow-500" />
                        <span>{recognition.points} points</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {recognitions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No recognitions yet</p>
                <p className="text-sm">Start recognizing employee achievements</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 