import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendChart } from '@/components/ui/TrendChart';
import { 
  UserCheck, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Users,
  Target,
  BarChart3,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Send,
  Bell,
  Gift
} from 'lucide-react';
import { useMysteryShopper } from '@/hooks/useMysteryShopper';

export const MysteryShopperProgram = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { 
    mysteryShopperEvaluations, 
    scoringRubrics, 
    evaluationReports, 
    trendAnalysis,
    rewardSystem,
    createEvaluation,
    updateEvaluation,
    generateReport,
    isCreatingEvaluation,
    isUpdatingEvaluation
  } = useMysteryShopper();

  // Calculate metrics
  const totalEvaluations = mysteryShopperEvaluations.length;
  const completedEvaluations = mysteryShopperEvaluations.filter(e => e.status === 'completed').length;
  const pendingEvaluations = mysteryShopperEvaluations.filter(e => e.status === 'pending').length;
  const inProgressEvaluations = mysteryShopperEvaluations.filter(e => e.status === 'in_progress').length;
  
  const averageScore = mysteryShopperEvaluations.length > 0 
    ? mysteryShopperEvaluations.reduce((acc, e) => acc + (e.overall_score || 0), 0) / mysteryShopperEvaluations.length 
    : 0;

  const filteredEvaluations = selectedStatus === 'all' 
    ? mysteryShopperEvaluations 
    : mysteryShopperEvaluations.filter(e => e.status === selectedStatus);

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Evaluations</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvaluations}</div>
            <p className="text-xs text-muted-foreground">
              Mystery shopper evaluations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}/100</div>
            <Progress value={averageScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Overall performance score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedEvaluations}</div>
            <p className="text-xs text-muted-foreground">
              Evaluations completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingEvaluations}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mystery Shopper Program Sections */}
      <Tabs defaultValue="evaluations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
          <TabsTrigger value="rubrics">Scoring Rubrics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="rewards">Reward System</TabsTrigger>
        </TabsList>

        <TabsContent value="evaluations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Secret Evaluation Scheduling */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Secret Evaluation Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mysteryShopperEvaluations.slice(0, 5).map((evaluation, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Evaluation #{evaluation.evaluation_id}</h4>
                        <Badge variant={
                          evaluation.status === 'completed' ? 'default' : 
                          evaluation.status === 'in_progress' ? 'secondary' : 'outline'
                        }>
                          {evaluation.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Location:</span>
                          <span className="font-medium">{evaluation.location_name}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Scheduled Date:</span>
                          <span className="font-medium">
                            {new Date(evaluation.scheduled_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Mystery Shopper:</span>
                          <span className="font-medium">{evaluation.shopper_name}</span>
                        </div>
                        {evaluation.overall_score && (
                          <div className="flex justify-between text-xs">
                            <span>Score:</span>
                            <span className="font-medium">{evaluation.overall_score}/100</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        {evaluation.status === 'pending' && (
                          <Button size="sm" variant="outline">
                            <Send className="h-3 w-3 mr-1" />
                            Send Reminder
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Evaluation Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Evaluation Status Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { status: 'Completed', count: completedEvaluations, color: 'bg-green-500' },
                    { status: 'In Progress', count: inProgressEvaluations, color: 'bg-blue-500' },
                    { status: 'Pending', count: pendingEvaluations, color: 'bg-yellow-500' },
                    { status: 'Cancelled', count: mysteryShopperEvaluations.filter(e => e.status === 'cancelled').length, color: 'bg-red-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-sm">{item.status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.count}</span>
                        <Progress 
                          value={totalEvaluations > 0 ? (item.count / totalEvaluations) * 100 : 0} 
                          className="w-20 h-2" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rubrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scoring Rubrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Scoring Rubrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scoringRubrics.map((rubric, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{rubric.category}</h4>
                        <Badge variant="outline">{rubric.max_score} points</Badge>
                      </div>
                      <div className="space-y-2">
                        {rubric.criteria.map((criterion, cIndex) => (
                          <div key={cIndex} className="flex items-center justify-between text-xs">
                            <span>{criterion.description}</span>
                            <span className="font-medium">{criterion.points} pts</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rubric Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Rubric Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: 'Customer Service', avgScore: 87, trend: 'up' },
                    { category: 'Package Handling', avgScore: 92, trend: 'up' },
                    { category: 'Communication', avgScore: 84, trend: 'stable' },
                    { category: 'Professionalism', avgScore: 89, trend: 'up' },
                    { category: 'Problem Resolution', avgScore: 81, trend: 'down' }
                  ].map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{category.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{category.avgScore}/100</span>
                        {category.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : category.trend === 'down' ? (
                          <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
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

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Report Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Report Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {evaluationReports.slice(0, 5).map((report, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{report.report_title}</h4>
                        <Badge variant={report.status === 'published' ? 'default' : 'outline'}>
                          {report.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Generated:</span>
                          <span className="font-medium">
                            {new Date(report.generated_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Evaluations:</span>
                          <span className="font-medium">{report.evaluation_count}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Average Score:</span>
                          <span className="font-medium">{report.average_score}/100</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Report Generation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Generate New Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Report Type</label>
                    <select className="w-full p-2 border rounded-md text-sm">
                      <option>Monthly Summary</option>
                      <option>Location Performance</option>
                      <option>Trend Analysis</option>
                      <option>Comparative Report</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Range</label>
                    <div className="flex gap-2">
                      <input type="date" className="flex-1 p-2 border rounded-md text-sm" />
                      <input type="date" className="flex-1 p-2 border rounded-md text-sm" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Locations</label>
                    <select className="w-full p-2 border rounded-md text-sm">
                      <option>All Locations</option>
                      <option>San Juan</option>
                      <option>Bayamón</option>
                      <option>Caguas</option>
                    </select>
                  </div>
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrendChart
                  data={trendAnalysis.map(trend => ({
                    name: trend.metric,
                    value: parseFloat(trend.current_value),
                    previous: parseFloat(trend.previous_value)
                  }))}
                  type="line"
                  dataKeys={['value', 'previous']}
                  colors={['#0B5394', '#FF6B35']}
                  height={200}
                />
              </CardContent>
            </Card>

            {/* Location Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Location Performance Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrendChart
                  data={[
                    { name: 'San Juan', value: 89 },
                    { name: 'Bayamón', value: 87 },
                    { name: 'Caguas', value: 92 },
                    { name: 'Ponce', value: 85 },
                    { name: 'Mayagüez', value: 88 }
                  ]}
                  type="bar"
                  dataKeys={['value']}
                  height={200}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Reward System */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Reward System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rewardSystem.map((reward, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{reward.reward_name}</h4>
                        <Badge variant={reward.status === 'active' ? 'default' : 'outline'}>
                          {reward.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Type:</span>
                          <span className="font-medium">{reward.reward_type}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Value:</span>
                          <span className="font-medium">${reward.reward_value}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Criteria:</span>
                          <span className="font-medium">{reward.criteria}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Recipients:</span>
                          <span className="font-medium">{reward.recipient_count}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Gift className="h-3 w-3 mr-1" />
                          Award
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Incentives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Performance Incentives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { level: 'Gold', score: '95-100', reward: '$500 bonus', recipients: 3 },
                    { level: 'Silver', score: '90-94', reward: '$250 bonus', recipients: 8 },
                    { level: 'Bronze', score: '85-89', reward: '$100 bonus', recipients: 15 },
                    { level: 'Recognition', score: '80-84', reward: 'Certificate', recipients: 25 }
                  ].map((level, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          level.level === 'Gold' ? 'bg-yellow-500' :
                          level.level === 'Silver' ? 'bg-gray-400' :
                          level.level === 'Bronze' ? 'bg-orange-600' : 'bg-blue-500'
                        }`} />
                        <span className="text-sm font-medium">{level.level}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">{level.score}</div>
                        <div className="text-xs text-muted-foreground">{level.reward}</div>
                        <div className="text-xs text-muted-foreground">{level.recipients} recipients</div>
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
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Evaluation
          </Button>
        </div>
      </div>
    </div>
  );
}; 