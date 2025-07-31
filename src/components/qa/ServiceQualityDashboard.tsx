import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendChart } from '@/components/ui/TrendChart';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  Star,
  MessageSquare,
  Target,
  Award,
  Activity,
  Zap,
  Shield,
  FileText,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useServiceQuality } from '@/hooks/useServiceQuality';

export const ServiceQualityDashboard = () => {
  const { 
    serviceMetrics, 
    customerComplaints, 
    complianceScores, 
    improvementInitiatives,
    qualityTrends,
    errorRates,
    customerSatisfaction
  } = useServiceQuality();

  // Calculate key metrics
  const overallQualityScore = serviceMetrics.overall_score || 0;
  const complaintResolutionRate = serviceMetrics.complaint_resolution_rate || 0;
  const averageResponseTime = serviceMetrics.avg_response_time_minutes || 0;
  const customerSatisfactionScore = customerSatisfaction.overall_score || 0;
  
  const recentComplaints = customerComplaints.slice(0, 5);
  const openComplaints = customerComplaints.filter(c => c.status === 'open').length;
  const resolvedComplaints = customerComplaints.filter(c => c.status === 'resolved').length;
  
  const activeInitiatives = improvementInitiatives.filter(i => i.status === 'active');
  const completedInitiatives = improvementInitiatives.filter(i => i.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Quality Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallQualityScore.toFixed(1)}%
            </div>
            <Progress value={overallQualityScore} className="mt-2" />
            <div className="flex items-center gap-1 mt-2">
              {overallQualityScore >= 90 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <p className="text-xs text-muted-foreground">
                {overallQualityScore >= 90 ? 'Excellent' : 
                 overallQualityScore >= 80 ? 'Good' : 
                 overallQualityScore >= 70 ? 'Fair' : 'Needs Improvement'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customerSatisfactionScore.toFixed(1)}/5.0
            </div>
            <div className="flex items-center gap-1 mt-2">
              {customerSatisfactionScore >= 4.5 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <p className="text-xs text-muted-foreground">
                {customerSatisfactionScore >= 4.5 ? 'Excellent' : 
                 customerSatisfactionScore >= 4.0 ? 'Good' : 
                 customerSatisfactionScore >= 3.5 ? 'Fair' : 'Poor'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complaint Resolution</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complaintResolutionRate.toFixed(1)}%
            </div>
            <Progress value={complaintResolutionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {resolvedComplaints}/{customerComplaints.length} complaints resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageResponseTime.toFixed(0)} min
            </div>
            <div className="flex items-center gap-1 mt-2">
              {averageResponseTime <= 30 ? (
                <TrendingDown className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingUp className="h-3 w-3 text-red-600" />
              )}
              <p className="text-xs text-muted-foreground">
                {averageResponseTime <= 30 ? 'Excellent' : 
                 averageResponseTime <= 60 ? 'Good' : 
                 averageResponseTime <= 120 ? 'Fair' : 'Needs Improvement'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Quality Trends</TabsTrigger>
          <TabsTrigger value="complaints">Complaints Analysis</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Scores</TabsTrigger>
          <TabsTrigger value="initiatives">Improvement Initiatives</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quality Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quality Metrics Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrendChart
                  data={qualityTrends.map(trend => ({
                    name: trend.metric,
                    value: parseFloat(trend.current_value),
                    change: parseFloat(trend.change_percentage)
                  }))}
                  type="line"
                  dataKeys={['value']}
                  height={200}
                />
              </CardContent>
            </Card>

            {/* Error Rate Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Error Rate Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrendChart
                  data={errorRates.map(error => ({
                    name: error.category,
                    value: error.rate
                  }))}
                  type="bar"
                  dataKeys={['value']}
                  height={200}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="complaints" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Complaints */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent Customer Complaints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentComplaints.map((complaint, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{complaint.title}</h4>
                        <Badge variant={complaint.priority === 'high' ? 'destructive' : 'secondary'}>
                          {complaint.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{complaint.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </span>
                        <Badge variant={complaint.status === 'resolved' ? 'default' : 'outline'}>
                          {complaint.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Complaint Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Complaint Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Service Quality', 'Package Handling', 'Communication', 'Billing Issues', 'Technical Problems'].map((category, index) => {
                    const count = customerComplaints.filter(c => c.category === category).length;
                    const percentage = customerComplaints.length > 0 ? (count / customerComplaints.length) * 100 : 0;
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Process Compliance Scores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceScores.map((score, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{score.process}</p>
                        <p className="text-xs text-muted-foreground">{score.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{score.score}%</p>
                        <Progress value={score.score} className="w-20 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compliance Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Compliance Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: '2024-01-15', event: 'USPS CMRA Audit', status: 'Passed' },
                    { date: '2024-02-01', event: 'Safety Inspection', status: 'Passed' },
                    { date: '2024-03-15', event: 'Quality Certification', status: 'Pending' },
                    { date: '2024-04-01', event: 'Annual Review', status: 'Scheduled' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.event}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                      <Badge variant={item.status === 'Passed' ? 'default' : 'outline'}>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="initiatives" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Initiatives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Active Improvement Initiatives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeInitiatives.map((initiative, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{initiative.title}</h4>
                        <Badge variant="outline">{initiative.priority}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{initiative.description}</p>
                      <div className="flex items-center justify-between">
                        <Progress value={initiative.progress} className="flex-1 mr-2" />
                        <span className="text-xs font-medium">{initiative.progress}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {new Date(initiative.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Completed Initiatives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recently Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedInitiatives.slice(0, 5).map((initiative, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{initiative.title}</h4>
                        <Badge variant="default">Completed</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{initiative.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Completed: {new Date(initiative.completed_date).toLocaleDateString()}
                        </span>
                        <span className="text-xs font-medium text-green-600">
                          +{initiative.impact_score}% improvement
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 