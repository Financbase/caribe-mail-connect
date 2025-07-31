import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  Plus,
  MessageSquare,
  FileText,
  Link,
  Target,
  TrendingUp,
  Activity,
  Settings,
  Eye,
  Edit,
  Trash2,
  Share2,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { CollaborationWorkflow, WorkflowTask, WorkflowMilestone } from '@/types/partners';

interface CollaborationWorkflowProps {
  workflows: CollaborationWorkflow[];
  onWorkflowSelect?: (workflow: CollaborationWorkflow) => void;
  onTaskUpdate?: (workflowId: string, taskId: string, updates: Partial<WorkflowTask>) => void;
}

export default function CollaborationWorkflowComponent({
  workflows,
  onWorkflowSelect,
  onTaskUpdate
}: CollaborationWorkflowProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<CollaborationWorkflow | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'timeline'>('kanban');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (workflow: CollaborationWorkflow) => {
    const totalTasks = workflow.tasks.length;
    const completedTasks = workflow.tasks.filter(task => task.status === 'completed').length;
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  const renderKanbanView = () => {
    const columns = [
      { id: 'pending', title: 'Pending', color: 'bg-yellow-50' },
      { id: 'in-progress', title: 'In Progress', color: 'bg-blue-50' },
      { id: 'completed', title: 'Completed', color: 'bg-green-50' },
      { id: 'blocked', title: 'Blocked', color: 'bg-red-50' }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div key={column.id} className={`${column.color} rounded-lg p-4`}>
            <h3 className="font-semibold text-gray-700 mb-4">{column.title}</h3>
            <div className="space-y-3">
              {selectedWorkflow?.tasks
                .filter(task => task.status === column.id)
                .map((task) => (
                  <div key={task.id} className="bg-white rounded-lg p-3 shadow-sm border">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span>{task.assignee}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTimelineView = () => {
    if (!selectedWorkflow) return null;

    const allItems = [
      ...selectedWorkflow.milestones.map(m => ({ ...m, type: 'milestone' as const })),
      ...selectedWorkflow.tasks.map(t => ({ ...t, type: 'task' as const }))
    ].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    return (
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div className="space-y-6">
          {allItems.map((item, index) => (
            <div key={item.id} className="relative flex items-start">
              <div className="absolute left-2 top-2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
              <div className="ml-8 bg-white rounded-lg p-4 shadow-sm border flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {item.type === 'milestone' ? (
                      <Target className="h-4 w-4 text-blue-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    <h4 className="font-medium">{item.title}</h4>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(item.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
                {item.type === 'task' && (
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                    <span>Assignee: {item.assignee}</span>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Collaboration Workflows</h2>
          <p className="text-gray-600">Manage joint projects and collaborative processes</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('kanban')}
          >
            Kanban
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('timeline')}
          >
            Timeline
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Workflow Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows.map((workflow) => (
          <Card 
            key={workflow.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedWorkflow?.id === workflow.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => {
              setSelectedWorkflow(workflow);
              onWorkflowSelect?.(workflow);
            }}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{workflow.title}</CardTitle>
                <Badge className={getStatusColor(workflow.status)}>
                  {workflow.status}
                </Badge>
              </div>
              <CardDescription>{workflow.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{calculateProgress(workflow).toFixed(0)}%</span>
                </div>
                <Progress value={calculateProgress(workflow)} className="w-full" />
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{workflow.participants.length} participants</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>{workflow.tasks.filter(t => t.status === 'completed').length}/{workflow.tasks.length} tasks</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Start: {new Date(workflow.startDate).toLocaleDateString()}</span>
                  {workflow.endDate && (
                    <span>End: {new Date(workflow.endDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Workflow Details */}
      {selectedWorkflow && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedWorkflow.title}</CardTitle>
                <CardDescription>{selectedWorkflow.description}</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Participants */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Participants</h3>
              <div className="flex flex-wrap gap-2">
                {selectedWorkflow.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{participant.name}</p>
                      <p className="text-xs text-gray-600">{participant.role}</p>
                    </div>
                    <Badge className={participant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {participant.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Content */}
            {viewMode === 'kanban' && renderKanbanView()}
            {viewMode === 'timeline' && renderTimelineView()}
            {viewMode === 'list' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Tasks</h3>
                {selectedWorkflow.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className={`h-5 w-5 ${
                          task.status === 'completed' ? 'text-green-500' : 'text-gray-400'
                        }`} />
                        <span className="font-medium">{task.title}</span>
                      </div>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{task.assignee}</span>
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      <Badge className={getTaskStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 