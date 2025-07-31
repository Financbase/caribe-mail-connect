import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load heavy components
const PredictiveAnalytics = lazy(() => import('./components/PredictiveAnalytics'));
const MachineLearningInsights = lazy(() => import('./components/MachineLearningInsights'));
const AnomalyDetection = lazy(() => import('./components/AnomalyDetection'));
const CohortAnalysis = lazy(() => import('./components/CohortAnalysis'));
const RetentionPredictions = lazy(() => import('./components/RetentionPredictions'));

export default function IntelligenceDashboard() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Business Intelligence Dashboard</h1>
        <p className="text-muted-foreground">Advanced analytics and insights for data-driven decisions</p>
      </div>

      <Tabs defaultValue="predictive" className="space-y-4">
        <TabsList>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="insights">ML Insights</TabsTrigger>
          <TabsTrigger value="anomaly">Anomaly Detection</TabsTrigger>
          <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
        </TabsList>

        <TabsContent value="predictive" className="space-y-4">
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <PredictiveAnalytics />
          </Suspense>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <MachineLearningInsights />
          </Suspense>
        </TabsContent>

        <TabsContent value="anomaly" className="space-y-4">
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <AnomalyDetection />
          </Suspense>
        </TabsContent>

        <TabsContent value="cohort" className="space-y-4">
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <CohortAnalysis />
          </Suspense>
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <RetentionPredictions />
          </Suspense>
        </TabsContent>
      </Tabs>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Data Mining</CardTitle>
            <CardDescription>Customer insights and patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>• Customer Segmentation</p>
              <p>• Basket Analysis</p>
              <p>• Churn Prediction</p>
              <p>• LTV Calculation</p>
              <p>• Cross-sell Opportunities</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Intelligence</CardTitle>
            <CardDescription>Competitive analysis and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>• Competitor Analysis</p>
              <p>• Market Share</p>
              <p>• Price Optimization</p>
              <p>• Demand Forecasting</p>
              <p>• Expansion Planning</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Optimization and strategy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>• Route Efficiency</p>
              <p>• Staff Scheduling</p>
              <p>• Inventory Management</p>
              <p>• Cost Reduction</p>
              <p>• Revenue Growth</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
