import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Users,
  Bug,
  TestTube
} from 'lucide-react';
import { useQA } from '@/hooks/useQA';

export const QADashboardOverview = () => {
  const { 
    healthMetrics, 
    failedProcesses, 
    errorReports, 
    performanceMetrics,
    userFeedback,
    testRuns,
    healthReports
  } = useQA();

  // Calculate overview metrics
  const criticalHealthMetrics = healthMetrics.filter(m => m.status === 'critical').length;
  const warningHealthMetrics = healthMetrics.filter(m => m.status === 'warning').length;
  const openFailedProcesses = failedProcesses.filter(p => p.status === 'open').length;
  const openErrorReports = errorReports.filter(r => r.status === 'open').length;
  const pendingFeedback = userFeedback.filter(f => f.status === 'open').length;
  
  const latestHealthReport = healthReports[0];
  const currentHealthScore = latestHealthReport?.overall_health_score || 0;
  
  const recentTestRuns = testRuns.slice(0, 5);
  const passedTests = recentTestRuns.reduce((acc, run) => acc + run.passed_tests, 0);
  const totalTests = recentTestRuns.reduce((acc, run) => acc + run.total_tests, 0);
  const testPassRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  // Calculate average response time from performance metrics
  const recentResponseTimes = performanceMetrics
    .filter(m => m.metric_type === 'api_response' && m.response_time_ms)
    .slice(0, 50);
  const avgResponseTime = recentResponseTimes.length > 0 
    ? recentResponseTimes.reduce((acc, m) => acc + (m.response_time_ms || 0), 0) / recentResponseTimes.length 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" aria-label="QA overview cards">
      {/* System Health Score */}
      <Card tabIndex={0} aria-label={`System Health ${currentHealthScore.toFixed(1)} percent`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Health</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currentHealthScore.toFixed(1)}%
          </div>
          <Progress value={currentHealthScore} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {currentHealthScore >= 90 ? 'Excellent' : 
             currentHealthScore >= 80 ? 'Good' : 
             currentHealthScore >= 70 ? 'Fair' : 'Poor'}
          </p>
        </CardContent>
      </Card>

      {/* Critical Issues */}
      <Card tabIndex={0} aria-label={`Critical issues ${criticalHealthMetrics + openFailedProcesses}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {criticalHealthMetrics + openFailedProcesses}
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant="destructive" className="text-xs">
              {criticalHealthMetrics} Health
            </Badge>
            <Badge variant="destructive" className="text-xs">
              {openFailedProcesses} Process
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Test Success Rate */}
      <Card tabIndex={0} aria-label={`Test success rate ${testPassRate.toFixed(1)} percent`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Test Success Rate</CardTitle>
          <TestTube className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {testPassRate.toFixed(1)}%
          </div>
          <Progress value={testPassRate} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {passedTests}/{totalTests} tests passed
          </p>
        </CardContent>
      </Card>

      {/* Response Time */}
      <Card tabIndex={0} aria-label={`Average response time ${avgResponseTime.toFixed(0)} milliseconds`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {avgResponseTime.toFixed(0)}ms
          </div>
          <div className="flex items-center gap-1 mt-2">
            {avgResponseTime < 200 ? (
              <TrendingDown className="h-3 w-3 text-success" />
            ) : (
              <TrendingUp className="h-3 w-3 text-warning" />
            )}
            <p className="text-xs text-muted-foreground">
              {avgResponseTime < 200 ? 'Excellent' : 
               avgResponseTime < 500 ? 'Good' : 'Needs improvement'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Open Error Reports */}
      <Card tabIndex={0} aria-label={`Open error reports ${openErrorReports}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Error Reports</CardTitle>
          <Bug className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{openErrorReports}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Awaiting triage and resolution
          </p>
        </CardContent>
      </Card>

      {/* Warning Issues */}
      <Card tabIndex={0} aria-label={`Warning issues ${warningHealthMetrics}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Warning Issues</CardTitle>
          <AlertTriangle className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">
            {warningHealthMetrics}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Require monitoring
          </p>
        </CardContent>
      </Card>

      {/* User Feedback */}
      <Card tabIndex={0} aria-label={`Pending feedback ${pendingFeedback}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Feedback</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingFeedback}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Awaiting review and response
          </p>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card tabIndex={0} aria-label={`System status ${criticalHealthMetrics > 0 ? 'Critical' : warningHealthMetrics > 0 ? 'Warning' : 'Healthy'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
          {criticalHealthMetrics > 0 ? (
            <XCircle className="h-4 w-4 text-destructive" />
          ) : warningHealthMetrics > 0 ? (
            <AlertTriangle className="h-4 w-4 text-warning" />
          ) : (
            <CheckCircle className="h-4 w-4 text-success" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {criticalHealthMetrics > 0 ? 'Critical' : 
             warningHealthMetrics > 0 ? 'Warning' : 'Healthy'}
          </div>
          <Badge 
            variant={criticalHealthMetrics > 0 ? 'destructive' : 
                    warningHealthMetrics > 0 ? 'secondary' : 'default'}
            className="mt-2"
          >
            {criticalHealthMetrics > 0 ? 'Needs attention' : 
             warningHealthMetrics > 0 ? 'Monitor closely' : 'All systems operational'}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};