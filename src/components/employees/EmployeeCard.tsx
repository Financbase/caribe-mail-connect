import React from 'react';
import { 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Calendar, 
  TrendingUp, 
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  UserX
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Employee } from '@/hooks/useEmployeeManagement';

interface EmployeeCardProps {
  employee: Employee;
  todayShifts?: number;
  performanceMetrics?: number;
  trainingCompletion?: number;
  onViewDetails?: (employee: Employee) => void;
  onEdit?: (employee: Employee) => void;
  onViewSchedule?: (employee: Employee) => void;
  onViewPerformance?: (employee: Employee) => void;
  onViewTraining?: (employee: Employee) => void;
  className?: string;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  todayShifts = 0,
  performanceMetrics = 0,
  trainingCompletion = 0,
  onViewDetails,
  onEdit,
  onViewSchedule,
  onViewPerformance,
  onViewTraining,
  className = ''
}) => {
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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive':
        return <UserX className="h-4 w-4 text-gray-400" />;
      case 'terminated':
        return <UserX className="h-4 w-4 text-red-600" />;
      case 'on_leave':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <UserX className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={employee.photo_url} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {getInitials(employee.first_name, employee.last_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">
                {employee.first_name} {employee.last_name}
              </h3>
              <p className="text-sm text-gray-600">{employee.position}</p>
              <p className="text-xs text-gray-500">{employee.department}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onViewDetails && (
                <DropdownMenuItem onClick={() => onViewDetails(employee)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(employee)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {onViewSchedule && (
                <DropdownMenuItem onClick={() => onViewSchedule(employee)}>
                  <Calendar className="w-4 h-4 mr-2" />
                  View Schedule
                </DropdownMenuItem>
              )}
              {onViewPerformance && (
                <DropdownMenuItem onClick={() => onViewPerformance(employee)}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Performance
                </DropdownMenuItem>
              )}
              {onViewTraining && (
                <DropdownMenuItem onClick={() => onViewTraining(employee)}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Training
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status:</span>
            <div className="flex items-center space-x-1">
              {getStatusIcon(employee.status)}
              {getStatusBadge(employee.status)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Employee ID:</span>
            <span className="text-sm font-mono">{employee.employee_id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Hire Date:</span>
            <span className="text-sm">
              {new Date(employee.hire_date).toLocaleDateString()}
            </span>
          </div>
          {employee.hourly_rate && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Hourly Rate:</span>
              <span className="text-sm font-medium">${employee.hourly_rate}</span>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-sm font-medium text-gray-900 flex items-center justify-center">
                <Clock className="h-3 w-3 mr-1" />
                {todayShifts}
              </div>
              <div className="text-xs text-gray-500">Today's Shifts</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 flex items-center justify-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {performanceMetrics}
              </div>
              <div className="text-xs text-gray-500">Metrics</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 flex items-center justify-center">
                <BookOpen className="h-3 w-3 mr-1" />
                {trainingCompletion}%
              </div>
              <div className="text-xs text-gray-500">Training</div>
            </div>
          </div>
          
          {/* Training Progress Bar */}
          {trainingCompletion > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Training Progress</span>
                <span>{trainingCompletion}%</span>
              </div>
              <Progress value={trainingCompletion} className="h-1" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 