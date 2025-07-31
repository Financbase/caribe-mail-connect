import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendChart } from '@/components/ui/TrendChart';
import { 
  Lightbulb, 
  TrendingUp, 
  FileText, 
  GraduationCap, 
  Share2,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  Users,
  Target,
  BarChart3,
  Award,
  MessageSquare,
  Calendar,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useContinuousImprovement } from '@/hooks/useContinuousImprovement';

export const ContinuousImprovement = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { 
    suggestions, 
    kaizenEvents, 
    processDocumentation, 
    trainingEffectiveness,
    bestPractices,
    createSuggestion,
    updateSuggestion,
    createKaizenEvent,
    isCreatingSuggestion,
    isUpdatingSuggestion
  } = useContinuousImprovement();

  // Calculate metrics
  const totalSuggestions = suggestions.length;
  const implementedSuggestions = suggestions.filter(s => s.status === 'implemented').length;
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending').length;
  const inProgressSuggestions = suggestions.filter(s => s.status === 'in_progress').length;
  
  const totalKaizenEvents = kaizenEvents.length;
  const completedKaizenEvents = kaizenEvents.filter(k => k.status === 'completed').length;
  const activeKaizenEvents = kaizenEvents.filter(k => k.status === 'active').length;

  const averageTrainingScore = trainingEffectiveness.length > 0 
    ? trainingEffectiveness.reduce((acc, t) => acc + (t.effectiveness_score || 0), 0) / trainingEffectiveness.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Suggestions</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuggestions}</div>
            <p className="text-xs text-muted-foreground">
              Improvement ideas submitted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Implementation Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSuggestions > 0 ? ((implementedSuggestions / totalSuggestions) * 100).toFixed(1) : 0}%
            </div>
            <Progress 
              value={totalSuggestions > 0 ? (implementedSuggestions / totalSuggestions) * 100 : 0} 
              className="mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-2">
              {implementedSuggestions}/{totalSuggestions} implemented
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Kaizen Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeKaizenEvents}</div>
            <p className="text-xs text-muted-foreground">
              Continuous improvement projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Effectiveness</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageTrainingScore.toFixed(1)}/100</div>
            <Progress value={averageTrainingScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Average training score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Continuous Improvement Sections */}
      <Tabs defaultValue="suggestions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="suggestions">Suggestion Box</TabsTrigger>
          <TabsTrigger value="kaizen">Kaizen Events</TabsTrigger>
          <TabsTrigger value="processes">Process Documentation</TabsTrigger>
          <TabsTrigger value="training">Training Effectiveness</TabsTrigger>
          <TabsTrigger value="practices">Best Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Suggestion Box System */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Suggestion Box System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestions.slice(0, 5).map((suggestion, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{suggestion.title}</h4>
                        <Badge variant={
                          suggestion.status === 'implemented' ? 'default' : 
                          suggestion.status === 'in_progress' ? 'secondary' : 'outline'
                        }>
                          {suggestion.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{suggestion.description}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Submitted by:</span>
                          <span className="font-medium">{suggestion.submitted_by}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Category:</span>
                          <span className="font-medium">{suggestion.category}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Impact Score:</span>
                          <span className="font-medium">{suggestion.impact_score}/10</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Votes:</span>
                          <span className="font-medium">{suggestion.vote_count}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        {suggestion.status === 'pending' && (
                          <Button size="sm" variant="outline">
                            <Star className="h-3 w-3 mr-1" />
                            Vote
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suggestion Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Suggestion Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: 'Process Improvement', count: 15, implemented: 8 },
                    { category: 'Technology', count: 12, implemented: 6 },
                    { category: 'Customer Service', count: 18, implemented: 12 },
                    { category: 'Safety', count: 8, implemented: 5 },
                    { category: 'Efficiency', count: 22, implemented: 14 }
                  ].map((cat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{cat.category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(cat.implemented / cat.count) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{cat.implemented}/{cat.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="kaizen" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kaizen Event Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Kaizen Event Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {kaizenEvents.slice(0, 5).map((event, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{event.event_name}</h4>
                        <Badge variant={
                          event.status === 'completed' ? 'default' : 
                          event.status === 'active' ? 'secondary' : 'outline'
                        }>
                          {event.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{event.description}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Team Lead:</span>
                          <span className="font-medium">{event.team_lead}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Start Date:</span>
                          <span className="font-medium">
                            {new Date(event.start_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Progress:</span>
                          <span className="font-medium">{event.progress}%</span>
                        </div>
                        {event.improvement_metric && (
                          <div className="flex justify-between text-xs">
                            <span>Improvement:</span>
                            <span className="font-medium">{event.improvement_metric}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        {event.status === 'active' && (
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3 mr-1" />
                            Update Progress
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Kaizen Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Kaizen Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Average Completion Time', value: '45 days', trend: 'down' },
                    { metric: 'Success Rate', value: '87%', trend: 'up' },
                    { metric: 'Cost Savings', value: '$12,500', trend: 'up' },
                    { metric: 'Team Participation', value: '92%', trend: 'stable' },
                    { metric: 'Implementation Rate', value: '78%', trend: 'up' }
                  ].map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{metric.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{metric.value}</span>
                        {metric.trend === 'up' ? (
                          <ArrowUpRight className="h-3 w-3 text-green-600" />
                        ) : metric.trend === 'down' ? (
                          <ArrowDownRight className="h-3 w-3 text-red-600" />
                        ) : (
                          <div className="h-3 w-3 text-gray-400">—</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="processes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Process Documentation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Process Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {processDocumentation.slice(0, 5).map((process, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{process.process_name}</h4>
                        <Badge variant={process.status === 'current' ? 'default' : 'outline'}>
                          {process.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{process.description}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Version:</span>
                          <span className="font-medium">{process.version}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Last Updated:</span>
                          <span className="font-medium">
                            {new Date(process.last_updated).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Owner:</span>
                          <span className="font-medium">{process.owner}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Review Status:</span>
                          <span className="font-medium">{process.review_status}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Documentation Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Documentation Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: 'Standard Operating Procedures', count: 45, updated: 38 },
                    { category: 'Work Instructions', count: 67, updated: 52 },
                    { category: 'Quality Manuals', count: 12, updated: 10 },
                    { category: 'Training Materials', count: 89, updated: 71 },
                    { category: 'Safety Procedures', count: 23, updated: 20 }
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{doc.category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(doc.updated / doc.count) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{doc.updated}/{doc.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Training Effectiveness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Training Effectiveness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingEffectiveness.slice(0, 5).map((training, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{training.training_name}</h4>
                        <Badge variant={training.effectiveness_score >= 80 ? 'default' : 'secondary'}>
                          {training.effectiveness_score}/100
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{training.description}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Instructor:</span>
                          <span className="font-medium">{training.instructor}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Completion Rate:</span>
                          <span className="font-medium">{training.completion_rate}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Participant Satisfaction:</span>
                          <span className="font-medium">{training.satisfaction_score}/5</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Knowledge Retention:</span>
                          <span className="font-medium">{training.knowledge_retention}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Report
                        </Button>
                        <Button size="sm" variant="outline">
                          <Star className="h-3 w-3 mr-1" />
                          Rate Training
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Training Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Training Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrendChart
                  data={[
                    { name: 'Jan', effectiveness: 85, satisfaction: 4.2, completion: 92 },
                    { name: 'Feb', effectiveness: 87, satisfaction: 4.3, completion: 89 },
                    { name: 'Mar', effectiveness: 89, satisfaction: 4.4, completion: 94 },
                    { name: 'Apr', effectiveness: 91, satisfaction: 4.5, completion: 91 },
                    { name: 'May', effectiveness: 88, satisfaction: 4.3, completion: 93 }
                  ]}
                  type="line"
                  dataKeys={['effectiveness', 'completion']}
                  colors={['#0B5394', '#2ECC71']}
                  height={200}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="practices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Best Practice Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Best Practice Sharing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bestPractices.slice(0, 5).map((practice, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{practice.practice_name}</h4>
                        <Badge variant="outline">{practice.category}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{practice.description}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Shared by:</span>
                          <span className="font-medium">{practice.shared_by}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Location:</span>
                          <span className="font-medium">{practice.location}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Success Rate:</span>
                          <span className="font-medium">{practice.success_rate}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Adopted by:</span>
                          <span className="font-medium">{practice.adopted_count} locations</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Practice Adoption Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Practice Adoption Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: 'Customer Service', adoption: 85, impact: 'High' },
                    { category: 'Process Efficiency', adoption: 72, impact: 'Medium' },
                    { category: 'Safety Procedures', adoption: 95, impact: 'High' },
                    { category: 'Technology Usage', adoption: 68, impact: 'Medium' },
                    { category: 'Quality Control', adoption: 88, impact: 'High' }
                  ].map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{category.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{category.adoption}%</span>
                        <Badge variant={category.impact === 'High' ? 'default' : 'secondary'} className="text-xs">
                          {category.impact}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Kaizen Event
          </Button>
          <Button>
            <Lightbulb className="h-4 w-4 mr-2" />
            Submit Suggestion
          </Button>
        </div>
      </div>
    </div>
  );
}; 