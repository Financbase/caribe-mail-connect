/**
 * Demo Data Dashboard Component
 * Story 10: Growth Infrastructure - Demo Data System
 * 
 * Dashboard for managing demo data sets, creating trial data,
 * and monitoring demo data usage
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database,
  Users,
  Package,
  MessageSquare,
  BarChart3,
  Play,
  Trash2,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { DemoDataService } from '@/services/demoData';
import type { DemoDataSet } from '@/services/demoData';

// =====================================================
// DEMO DATA DASHBOARD COMPONENT
// =====================================================

export function DemoDataDashboard() {
  const { subscription } = useSubscription();
  
  const [demoStats, setDemoStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCreated, setLastCreated] = useState<DemoDataSet | null>(null);

  // =====================================================
  // DATA LOADING
  // =====================================================

  const loadDemoStats = async () => {
    if (!subscription?.id) return;

    try {
      const stats = await DemoDataService.getDemoDataStats(subscription.id);
      setDemoStats(stats);
    } catch (error) {
      console.error('Error loading demo stats:', error);
    }
  };

  useEffect(() => {
    loadDemoStats();
  }, [subscription?.id]);

  // =====================================================
  // DEMO DATA ACTIONS
  // =====================================================

  const handleCreateDemoData = async (type: 'trial' | 'demo' | 'training' | 'testing') => {
    if (!subscription?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const demoDataSet = await DemoDataService.createDemoDataSet(subscription.id, type);
      
      if (demoDataSet) {
        setLastCreated(demoDataSet);
        await loadDemoStats();
      } else {
        setError('Failed to create demo data set');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create demo data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearDemoData = async () => {
    if (!subscription?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const success = await DemoDataService.clearDemoData(subscription.id);
      
      if (success) {
        await loadDemoStats();
        setLastCreated(null);
      } else {
        setError('Failed to clear demo data');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to clear demo data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTrialData = async () => {
    if (!subscription?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const success = await DemoDataService.createTrialData(subscription.id);
      
      if (success) {
        await loadDemoStats();
      } else {
        setError('Failed to create trial data');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create trial data');
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================================
  // RENDER HELPERS
  // =====================================================

  const renderStatsCard = (title: string, value: number, icon: React.ReactNode, color: string) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderQuickActions = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Button
        onClick={() => handleCreateDemoData('demo')}
        disabled={isLoading}
        className="h-auto p-4 flex flex-col items-center gap-2"
      >
        <Database className="h-6 w-6" />
        <span>Full Demo Data</span>
        <span className="text-xs opacity-75">Complete dataset</span>
      </Button>

      <Button
        onClick={() => handleCreateDemoData('trial')}
        disabled={isLoading}
        variant="outline"
        className="h-auto p-4 flex flex-col items-center gap-2"
      >
        <Zap className="h-6 w-6" />
        <span>Trial Data</span>
        <span className="text-xs opacity-75">Quick setup</span>
      </Button>

      <Button
        onClick={() => handleCreateDemoData('training')}
        disabled={isLoading}
        variant="outline"
        className="h-auto p-4 flex flex-col items-center gap-2"
      >
        <Target className="h-6 w-6" />
        <span>Training Data</span>
        <span className="text-xs opacity-75">For tutorials</span>
      </Button>

      <Button
        onClick={handleClearDemoData}
        disabled={isLoading || !demoStats?.has_demo_data}
        variant="destructive"
        className="h-auto p-4 flex flex-col items-center gap-2"
      >
        <Trash2 className="h-6 w-6" />
        <span>Clear All</span>
        <span className="text-xs opacity-75">Remove demo data</span>
      </Button>
    </div>
  );

  // =====================================================
  // MAIN RENDER
  // =====================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Demo Data Management</h1>
          <p className="text-muted-foreground">
            Create and manage realistic demo data for trials and demonstrations
          </p>
        </div>
        <Button
          onClick={loadDemoStats}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {lastCreated && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Demo data set "{lastCreated.name}" created successfully with {' '}
            {Object.values(lastCreated.record_counts).reduce((a, b) => a + b, 0)} total records.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="create">Create Data</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Current Stats */}
          {demoStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderStatsCard(
                'Demo Customers',
                demoStats.customers,
                <Users className="h-6 w-6 text-white" />,
                'bg-blue-500'
              )}
              {renderStatsCard(
                'Demo Packages',
                demoStats.packages,
                <Package className="h-6 w-6 text-white" />,
                'bg-green-500'
              )}
              {renderStatsCard(
                'Demo Communications',
                demoStats.communications,
                <MessageSquare className="h-6 w-6 text-white" />,
                'bg-purple-500'
              )}
              {renderStatsCard(
                'Analytics Events',
                demoStats.analytics_events,
                <BarChart3 className="h-6 w-6 text-white" />,
                'bg-orange-500'
              )}
            </div>
          )}

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Demo Data Status
              </CardTitle>
              <CardDescription>
                Current state of demo data in your subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {demoStats?.has_demo_data ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Demo data is active</span>
                      <Badge variant="secondary">
                        {Object.values(demoStats.record_counts || {}).reduce((a: number, b: number) => a + b, 0)} records
                      </Badge>
                    </>
                  ) : (
                    <>
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="text-muted-foreground">No demo data found</span>
                    </>
                  )}
                </div>
                
                {demoStats?.has_demo_data && (
                  <Button
                    onClick={handleClearDemoData}
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Data
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common demo data operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderQuickActions()}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Data Tab */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Demo Data Types */}
            <Card>
              <CardHeader>
                <CardTitle>Full Demo Data Set</CardTitle>
                <CardDescription>
                  Complete dataset with customers, packages, communications, and analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Customers:</span>
                    <Badge variant="outline">5 records</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Packages:</span>
                    <Badge variant="outline">5 records</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Communications:</span>
                    <Badge variant="outline">15 records</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Analytics Events:</span>
                    <Badge variant="outline">50 records</Badge>
                  </div>
                </div>
                <Button
                  onClick={() => handleCreateDemoData('demo')}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Create Full Demo Data
                </Button>
              </CardContent>
            </Card>

            {/* Trial Data */}
            <Card>
              <CardHeader>
                <CardTitle>Trial Data Set</CardTitle>
                <CardDescription>
                  Minimal dataset for quick trials and testing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Customers:</span>
                    <Badge variant="outline">3 records</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Packages:</span>
                    <Badge variant="outline">3 records</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Setup Time:</span>
                    <Badge variant="outline">~30 seconds</Badge>
                  </div>
                </div>
                <Button
                  onClick={handleCreateTrialData}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Create Trial Data
                </Button>
              </CardContent>
            </Card>

            {/* Training Data */}
            <Card>
              <CardHeader>
                <CardTitle>Training Data Set</CardTitle>
                <CardDescription>
                  Structured data for tutorials and training sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Purpose:</span>
                    <Badge variant="outline">Educational</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Scenarios:</span>
                    <Badge variant="outline">Multiple</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Complexity:</span>
                    <Badge variant="outline">Progressive</Badge>
                  </div>
                </div>
                <Button
                  onClick={() => handleCreateDemoData('training')}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Create Training Data
                </Button>
              </CardContent>
            </Card>

            {/* Testing Data */}
            <Card>
              <CardHeader>
                <CardTitle>Testing Data Set</CardTitle>
                <CardDescription>
                  Data for testing features and edge cases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Edge Cases:</span>
                    <Badge variant="outline">Included</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Scenarios:</span>
                    <Badge variant="outline">Yes</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Variety:</span>
                    <Badge variant="outline">High</Badge>
                  </div>
                </div>
                <Button
                  onClick={() => handleCreateDemoData('testing')}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Create Testing Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Manage Tab */}
        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Manage existing demo data and perform maintenance operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={loadDemoStats}
                  variant="outline"
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Stats
                </Button>

                <Button
                  onClick={handleClearDemoData}
                  variant="destructive"
                  disabled={isLoading || !demoStats?.has_demo_data}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>

                <Button
                  variant="outline"
                  disabled={!demoStats?.has_demo_data}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>

              {demoStats?.has_demo_data && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Demo data is currently active. Clearing it will permanently remove all demo records.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
