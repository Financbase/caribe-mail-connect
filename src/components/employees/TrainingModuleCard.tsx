import React from 'react';
import { 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Users, 
  Download, 
  Play,
  FileText,
  Clock,
  CheckSquare,
  Star
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { TrainingModule } from '@/hooks/useEmployeeManagement';

interface TrainingModuleCardProps {
  module: TrainingModule;
  stats?: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
  };
  onViewDetails?: (module: TrainingModule) => void;
  onEdit?: (module: TrainingModule) => void;
  onAssign?: (module: TrainingModule) => void;
  onExport?: (module: TrainingModule) => void;
  className?: string;
}

export const TrainingModuleCard: React.FC<TrainingModuleCardProps> = ({
  module,
  stats,
  onViewDetails,
  onEdit,
  onAssign,
  onExport,
  className = ''
}) => {
  // Get difficulty badge color
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge variant="default" className="bg-green-100 text-green-800">Beginner</Badge>;
      case 'intermediate':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Intermediate</Badge>;
      case 'advanced':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Advanced</Badge>;
      default:
        return <Badge variant="secondary">{difficulty}</Badge>;
    }
  };

  // Get module type icon
  const getModuleIcon = () => {
    if (module.video_url) {
      return <Play className="h-5 w-5 text-blue-600" />;
    }
    return <FileText className="h-5 w-5 text-gray-600" />;
  };

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getModuleIcon()}
            <h3 className="font-semibold text-gray-900 line-clamp-2">
              {module.title}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onViewDetails && (
                <DropdownMenuItem onClick={() => onViewDetails(module)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(module)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Module
                </DropdownMenuItem>
              )}
              {onAssign && (
                <DropdownMenuItem onClick={() => onAssign(module)}>
                  <Users className="w-4 h-4 mr-2" />
                  Assign to Employees
                </DropdownMenuItem>
              )}
              {onExport && (
                <DropdownMenuItem onClick={() => onExport(module)}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Progress
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {module.description || 'No description available'}
        </p>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Category:</span>
            <Badge variant="outline">{module.category}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Level:</span>
            {getDifficultyBadge(module.difficulty_level)}
          </div>
          {module.estimated_duration && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Duration:</span>
              <span className="text-sm flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {module.estimated_duration} min
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status:</span>
            <Badge variant={module.is_active ? "default" : "secondary"}>
              {module.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Content Indicators */}
        <div className="flex items-center space-x-4 mb-3 text-xs text-gray-500">
          {module.video_url && (
            <div className="flex items-center">
              <Play className="h-3 w-3 mr-1" />
              Video
            </div>
          )}
          {module.document_url && (
            <div className="flex items-center">
              <FileText className="h-3 w-3 mr-1" />
              Document
            </div>
          )}
          {module.quiz_questions && module.quiz_questions.length > 0 && (
            <div className="flex items-center">
              <CheckSquare className="h-3 w-3 mr-1" />
              Quiz ({module.quiz_questions.length})
            </div>
          )}
        </div>

        {/* Required Positions */}
        {module.required_for_positions && module.required_for_positions.length > 0 && (
          <div className="mb-3">
            <span className="text-xs text-gray-600">Required for:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {module.required_for_positions.map((position, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {position}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Progress Stats */}
        {stats && (
          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-600">
                {stats.completed}/{stats.total} completed
              </span>
            </div>
            <Progress 
              value={getCompletionPercentage()} 
              className="h-2"
            />
            <div className="grid grid-cols-3 gap-2 mt-2 text-center text-xs">
              <div>
                <div className="font-medium text-green-600">{stats.completed}</div>
                <div className="text-gray-500">Completed</div>
              </div>
              <div>
                <div className="font-medium text-blue-600">{stats.inProgress}</div>
                <div className="text-gray-500">In Progress</div>
              </div>
              <div>
                <div className="font-medium text-gray-600">{stats.notStarted}</div>
                <div className="text-gray-500">Not Started</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          {onViewDetails && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails(module)}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
          )}
          {onAssign && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAssign(module)}
              className="flex-1"
            >
              <Users className="w-4 h-4 mr-2" />
              Assign
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 