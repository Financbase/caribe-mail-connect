import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Award, 
  Users, 
  Plus, 
  Search, 
  Filter,
  FileText,
  Video,
  CheckSquare
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
import { Progress } from '@/components/ui/progress';
import { useEmployeeManagement } from '@/hooks/useEmployeeManagement';
import { TrainingModule, EmployeeTraining, Employee } from '@/hooks/useEmployeeManagement';
import { TrainingModuleCard } from '@/components/employees/TrainingModuleCard';

interface TrainingProps {
  onNavigate: (route: string) => void;
}

export const Training: React.FC<TrainingProps> = ({ onNavigate }) => {
  const {
    employees,
    trainingModules,
    employeeTraining,
    loading,
    error,
    fetchEmployees,
    fetchTrainingModules,
    fetchEmployeeTraining
  } = useEmployeeManagement();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState('modules');

  // Filter modules based on search and filters
  const filteredModules = trainingModules.filter(module => {
    const matchesSearch = 
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || module.category === filterCategory;
    const matchesDifficulty = !filterDifficulty || module.difficulty_level === filterDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Get unique categories for filter
  const categories = [...new Set(trainingModules.map(module => module.category))];

  // Get employee training progress for a specific module
  const getEmployeeModuleProgress = (employeeId: string, moduleId: string) => {
    return employeeTraining.find(training => 
      training.employee_id === employeeId && training.module_id === moduleId
    );
  };

  // Get all training progress for an employee
  const getEmployeeAllTraining = (employeeId: string) => {
    return employeeTraining.filter(training => training.employee_id === employeeId);
  };

  // Calculate overall training completion for an employee
  const getEmployeeTrainingCompletion = (employeeId: string) => {
    const employeeTrainingData = getEmployeeAllTraining(employeeId);
    if (employeeTrainingData.length === 0) return 0;
    
    const completed = employeeTrainingData.filter(training => training.status === 'completed').length;
    return Math.round((completed / employeeTrainingData.length) * 100);
  };

  // Get module completion statistics
  const getModuleStats = (moduleId: string) => {
    const moduleTraining = employeeTraining.filter(training => training.module_id === moduleId);
    const total = moduleTraining.length;
    const completed = moduleTraining.filter(training => training.status === 'completed').length;
    const inProgress = moduleTraining.filter(training => training.status === 'in_progress').length;
    const notStarted = moduleTraining.filter(training => training.status === 'not_started').length;
    
    return { total, completed, inProgress, notStarted };
  };



  useEffect(() => {
    fetchEmployees();
    fetchTrainingModules();
    fetchEmployeeTraining();
  }, [fetchEmployees, fetchTrainingModules, fetchEmployeeTraining]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading training data...</p>
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
            onClick={() => fetchTrainingModules()}
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
          <h1 className="text-3xl font-bold text-gray-900">Training & Development</h1>
          <p className="text-gray-600 mt-1">Manage employee training, certifications, and skill development</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onNavigate('employees')}>
            <Users className="w-4 h-4 mr-2" />
            Employees
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Module
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Modules</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainingModules.length}</div>
            <p className="text-xs text-muted-foreground">
              {trainingModules.filter(module => module.is_active).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(employeeTraining.map(training => training.employee_id)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              {employeeTraining.filter(training => training.status === 'completed').length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employeeTraining.length > 0 
                ? Math.round((employeeTraining.filter(training => training.status === 'completed').length / employeeTraining.length) * 100)
                : 0
              }%
            </div>
            <p className="text-xs text-muted-foreground">
              {employeeTraining.filter(training => training.status === 'completed').length} of {employeeTraining.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employeeTraining.filter(training => 
                training.status === 'completed' && training.quiz_score && training.quiz_score >= 80
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              With 80%+ quiz scores
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modules">Training Modules</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        {/* Training Modules Tab */}
        <TabsContent value="modules" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search training modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Training Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModules.map((module) => {
              const stats = getModuleStats(module.id);
              return (
                <TrainingModuleCard
                  key={module.id}
                  module={module}
                  stats={stats}
                  onViewDetails={setSelectedModule}
                  onEdit={(module) => console.log('Edit module:', module)}
                  onAssign={(module) => console.log('Assign module:', module)}
                  onExport={(module) => console.log('Export module:', module)}
                />
              );
            })}
          </div>
        </TabsContent>

        {/* Progress Tracking Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Training Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => {
                  const trainingData = getEmployeeAllTraining(employee.id);
                  const completion = getEmployeeTrainingCompletion(employee.id);
                  
                  return (
                    <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.photo_url} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">
                            {employee.first_name} {employee.last_name}
                          </h4>
                          <p className="text-sm text-gray-600">{employee.position}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{completion}% Complete</div>
                          <div className="text-xs text-gray-500">
                            {trainingData.filter(t => t.status === 'completed').length} of {trainingData.length} modules
                          </div>
                        </div>
                        <Progress value={completion} className="w-24 h-2" />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedEmployee(employee)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onboarding Tab */}
        <TabsContent value="onboarding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Checklists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Onboarding checklist system coming soon</p>
                <p className="text-sm">Customizable checklists for new employee onboarding</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Certifications & Awards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Certification tracking system coming soon</p>
                <p className="text-sm">Track employee certifications, expiry dates, and renewal reminders</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Module Details Dialog */}
      <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Training Module Details</DialogTitle>
          </DialogHeader>
          {selectedModule && (
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {selectedModule.video_url ? (
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Video className="h-8 w-8 text-blue-600" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-8 w-8 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{selectedModule.title}</h3>
                  <p className="text-gray-600 mb-3">{selectedModule.description}</p>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">{selectedModule.category}</Badge>
                    {getDifficultyBadge(selectedModule.difficulty_level)}
                    {selectedModule.estimated_duration && (
                      <span className="text-sm text-gray-600 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {selectedModule.estimated_duration} minutes
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Module Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Category:</span> {selectedModule.category}</p>
                    <p><span className="text-gray-600">Difficulty:</span> {selectedModule.difficulty_level}</p>
                    <p><span className="text-gray-600">Duration:</span> {selectedModule.estimated_duration || 'N/A'} minutes</p>
                    <p><span className="text-gray-600">Status:</span> {selectedModule.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Required For</h4>
                  <div className="space-y-1">
                    {selectedModule.required_for_positions && selectedModule.required_for_positions.length > 0 ? (
                      selectedModule.required_for_positions.map((position, index) => (
                        <Badge key={index} variant="secondary" className="mr-1 mb-1">
                          {position}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No specific positions required</p>
                    )}
                  </div>
                </div>
              </div>

              {selectedModule.video_url && (
                <div>
                  <h4 className="font-medium mb-2">Video Content</h4>
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <Play className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Video tutorial available</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Watch Video
                    </Button>
                  </div>
                </div>
              )}

              {selectedModule.quiz_questions && selectedModule.quiz_questions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Quiz</h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckSquare className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Quiz included</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedModule.quiz_questions.length} questions to test knowledge
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button>
                  <Users className="w-4 h-4 mr-2" />
                  Assign to Employees
                </Button>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Module
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Progress
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Employee Training Details Dialog */}
      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Employee Training Progress</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedEmployee.photo_url} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {selectedEmployee.first_name.charAt(0)}{selectedEmployee.last_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedEmployee.first_name} {selectedEmployee.last_name}
                  </h3>
                  <p className="text-gray-600">{selectedEmployee.position}</p>
                  <p className="text-sm text-gray-500">{selectedEmployee.department}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Training Progress</h4>
                {getEmployeeAllTraining(selectedEmployee.id).map((training) => {
                  const module = trainingModules.find(m => m.id === training.module_id);
                  if (!module) return null;

                  return (
                    <div key={training.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {module.video_url ? (
                          <Video className="h-5 w-5 text-blue-600" />
                        ) : (
                          <FileText className="h-5 w-5 text-gray-600" />
                        )}
                        <div>
                          <h5 className="font-medium">{module.title}</h5>
                          <p className="text-sm text-gray-600">{module.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(training.status)}
                        {training.quiz_score && (
                          <div className="text-sm">
                            <span className="text-gray-600">Score:</span>
                            <span className={`font-medium ml-1 ${
                              training.quiz_score >= 80 ? 'text-green-600' : 
                              training.quiz_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {training.quiz_score}%
                            </span>
                          </div>
                        )}
                        {training.attempts > 0 && (
                          <div className="text-sm text-gray-600">
                            {training.attempts} attempt{training.attempts > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <Button onClick={() => onNavigate('employees')}>
                  <Users className="w-4 h-4 mr-2" />
                  View Employee Details
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Progress Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 