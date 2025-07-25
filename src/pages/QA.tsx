import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QADashboardOverview } from '@/components/qa/QADashboardOverview';
import { FailedProcessesTracker } from '@/components/qa/FailedProcessesTracker';
import { ErrorReportsManager } from '@/components/qa/ErrorReportsManager';

const QA = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quality Assurance</h1>
        <p className="text-muted-foreground">
          Monitor system health, track errors, and manage testing processes
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="processes">Failed Processes</TabsTrigger>
          <TabsTrigger value="errors">Error Reports</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="feedback">User Feedback</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <QADashboardOverview />
        </TabsContent>

        <TabsContent value="processes">
          <FailedProcessesTracker />
        </TabsContent>

        <TabsContent value="errors">
          <ErrorReportsManager />
        </TabsContent>

        <TabsContent value="testing">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Testing management coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="feedback">
          <div className="text-center py-12">
            <p className="text-muted-foreground">User feedback system coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Performance monitoring coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QA;