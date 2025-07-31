import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QADashboardOverview } from '@/components/qa/QADashboardOverview';
import { FailedProcessesTracker } from '@/components/qa/FailedProcessesTracker';
import { ErrorReportsManager } from '@/components/qa/ErrorReportsManager';
import { TestCaseManagement } from '@/components/qa/TestCaseManagement';
import { UserFeedbackManager } from '@/components/qa/UserFeedbackSystem';
import { PerformanceMonitoringDashboard } from '@/components/qa/PerformanceMonitoringDashboard';
import { ServiceQualityDashboard } from '@/components/qa/ServiceQualityDashboard';
import { QualityChecksManager } from '@/components/qa/QualityChecksManager';
import { MysteryShopperProgram } from '@/components/qa/MysteryShopperProgram';
import { ContinuousImprovement } from '@/components/qa/ContinuousImprovement';
import { ComplianceMonitoring } from '@/components/qa/ComplianceMonitoring';

const QA = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quality Assurance & Control</h1>
        <p className="text-muted-foreground">
          Comprehensive quality management system for service excellence and continuous improvement
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="service-quality">Service Quality</TabsTrigger>
          <TabsTrigger value="quality-checks">Quality Checks</TabsTrigger>
          <TabsTrigger value="mystery-shopper">Mystery Shopper</TabsTrigger>
          <TabsTrigger value="continuous-improvement">Continuous Improvement</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="processes">Failed Processes</TabsTrigger>
          <TabsTrigger value="errors">Error Reports</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="feedback">User Feedback</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <QADashboardOverview />
        </TabsContent>

        <TabsContent value="service-quality">
          <ServiceQualityDashboard />
        </TabsContent>

        <TabsContent value="quality-checks">
          <QualityChecksManager />
        </TabsContent>

        <TabsContent value="mystery-shopper">
          <MysteryShopperProgram />
        </TabsContent>

        <TabsContent value="continuous-improvement">
          <ContinuousImprovement />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceMonitoring />
        </TabsContent>

        <TabsContent value="processes">
          <FailedProcessesTracker />
        </TabsContent>

        <TabsContent value="errors">
          <ErrorReportsManager />
        </TabsContent>

        <TabsContent value="testing">
          <TestCaseManagement />
        </TabsContent>

        <TabsContent value="feedback">
          <UserFeedbackManager />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceMonitoringDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QA;