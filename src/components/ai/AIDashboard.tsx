/**
 * AI Dashboard Component
 * Story 2.1: AI-Powered Automation & Intelligence
 * 
 * Comprehensive AI dashboard for machine learning models, intelligent automation,
 * predictive analytics, and AI-powered insights with real-time monitoring
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Bot,
  Cpu,
  Activity,
  Target,
  Lightbulb,
  Settings,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  Network,
  Workflow,
  Sparkles,
  Eye,
  MessageSquare
} from 'lucide-react';
import { useAI, useMLModels, useIntelligentAutomation, useAIInsights } from '@/hooks/useAI';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { AIChatInterface } from './AIChatInterface';

// =====================================================
// ML MODELS OVERVIEW
// =====================================================

function MLModelsOverview() {
  const { models, isLoading } = useMLModels();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Machine Learning Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border rounded-lg">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Machine Learning Models
          </CardTitle>
          <CardDescription>
            AI models for predictive analytics and intelligent automation
          </CardDescription>
        </div>
        <Badge variant="outline">{models.length} Models</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {models.map((model) => (
            <div key={model.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{model.name}</h4>
                <Badge variant={model.status === 'deployed' ? 'default' : model.status === 'trained' ? 'secondary' : 'destructive'}>
                  {model.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{model.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium">Accuracy</div>
                  <div className="text-muted-foreground">{(model.accuracy * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <div className="font-medium">Type</div>
                  <div className="text-muted-foreground capitalize">{model.type.replace('_', ' ')}</div>
                </div>
                <div>
                  <div className="font-medium">Predictions</div>
                  <div className="text-muted-foreground">{model.prediction_count}</div>
                </div>
                <div>
                  <div className="font-medium">Avg Response</div>
                  <div className="text-muted-foreground">{model.average_prediction_time_ms}ms</div>
                </div>
              </div>

              {model.status === 'deployed' && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Model is live and processing requests
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {models.length === 0 && (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No ML Models</h3>
              <p className="text-muted-foreground">Create your first machine learning model to get started.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// INTELLIGENT AUTOMATION
// =====================================================

function IntelligentAutomationPanel() {
  const { rules, toggleRule, isLoading } = useIntelligentAutomation();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Intelligent Automation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border rounded-lg">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Intelligent Automation
          </CardTitle>
          <CardDescription>
            AI-powered automation rules and workflows
          </CardDescription>
        </div>
        <Badge variant="outline">{rules.filter(r => r.is_active).length} Active</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{rule.name}</h4>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleRule(rule.id, !rule.is_active)}
                  >
                    {rule.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                    {rule.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium">Executions</div>
                  <div className="text-muted-foreground">{rule.execution_count}</div>
                </div>
                <div>
                  <div className="font-medium">Success Rate</div>
                  <div className="text-muted-foreground">{(rule.success_rate * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <div className="font-medium">Avg Time</div>
                  <div className="text-muted-foreground">{rule.average_execution_time_ms}ms</div>
                </div>
                <div>
                  <div className="font-medium">Savings</div>
                  <div className="text-muted-foreground">${rule.cost_savings_estimate}</div>
                </div>
              </div>

              {rule.learning_enabled && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Sparkles className="h-4 w-4" />
                    AI Learning Enabled - Rule adapts based on performance
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {rules.length === 0 && (
            <div className="text-center py-8">
              <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Automation Rules</h3>
              <p className="text-muted-foreground">Create intelligent automation rules to streamline your operations.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// AI INSIGHTS PANEL
// =====================================================

function AIInsightsPanel() {
  const { insights, acknowledgeInsight, resolveInsight, isLoading } = useAIInsights();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border rounded-lg">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>
            Intelligent recommendations and business insights
          </CardDescription>
        </div>
        <Badge variant="outline">{insights.filter(i => i.status === 'new').length} New</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium">{insight.title}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    insight.priority === 'critical' ? 'destructive' :
                    insight.priority === 'high' ? 'default' :
                    insight.priority === 'medium' ? 'secondary' : 'outline'
                  }>
                    {insight.priority}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {insight.type.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <div className="font-medium">Confidence</div>
                  <div className="text-muted-foreground">{(insight.confidence_score * 100).toFixed(0)}%</div>
                </div>
                <div>
                  <div className="font-medium">Impact</div>
                  <div className="text-muted-foreground">{(insight.impact_score * 100).toFixed(0)}%</div>
                </div>
              </div>

              {insight.status === 'new' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => acknowledgeInsight(insight.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Acknowledge
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => resolveInsight(insight.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolve
                  </Button>
                </div>
              )}

              {insight.status === 'acknowledged' && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Eye className="h-4 w-4" />
                  Acknowledged - Under review
                </div>
              )}

              {insight.status === 'resolved' && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Resolved
                </div>
              )}
            </div>
          ))}
          
          {insights.length === 0 && (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No AI Insights</h3>
              <p className="text-muted-foreground">AI insights will appear here as they are generated.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// AI PERFORMANCE METRICS
// =====================================================

function AIPerformanceMetrics() {
  const { models, predictions } = useAI();

  const totalPredictions = models.reduce((sum, model) => sum + model.prediction_count, 0);
  const avgAccuracy = models.length > 0 ? models.reduce((sum, model) => sum + model.accuracy, 0) / models.length : 0;
  const avgResponseTime = models.length > 0 ? models.reduce((sum, model) => sum + model.average_prediction_time_ms, 0) / models.length : 0;
  const deployedModels = models.filter(m => m.status === 'deployed').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          AI Performance Metrics
        </CardTitle>
        <CardDescription>
          Real-time AI system performance and usage statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{deployedModels}</div>
            <div className="text-sm text-muted-foreground">Active Models</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">{totalPredictions.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Predictions</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{(avgAccuracy * 100).toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Avg Accuracy</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{avgResponseTime.toFixed(0)}ms</div>
            <div className="text-sm text-muted-foreground">Avg Response</div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>System Health</span>
              <span>98.5%</span>
            </div>
            <Progress value={98.5} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Model Performance</span>
              <span>{(avgAccuracy * 100).toFixed(1)}%</span>
            </div>
            <Progress value={avgAccuracy * 100} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Automation Efficiency</span>
              <span>94.2%</span>
            </div>
            <Progress value={94.2} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// MAIN AI DASHBOARD
// =====================================================

export function AIDashboard() {
  const { subscription } = useSubscription();
  const { error, refetch, isLoading } = useAI();

  useEffect(() => {
    if (subscription) {
      refetch();
    }
  }, [subscription, refetch]);

  if (!subscription) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No active subscription found. Please contact support or set up a subscription.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI & Machine Learning</h1>
          <p className="text-muted-foreground">
            Advanced AI-powered automation and intelligence platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Story 2.1: AI-Powered Automation & Intelligence
          </Badge>
          <Button variant="outline" onClick={refetch} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <AIPerformanceMetrics />

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList>
          <TabsTrigger value="chat">AI Assistant</TabsTrigger>
          <TabsTrigger value="models">ML Models</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AIChatInterface />
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Capabilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Brain className="h-4 w-4 text-blue-500" />
                    <span>LangChain Agents</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Network className="h-4 w-4 text-green-500" />
                    <span>LangGraph Workflows</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <span>Pydantic AI Validation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Cpu className="h-4 w-4 text-orange-500" />
                    <span>Hugging Face Models</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>Cloudflare AI</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Track Package
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Business Insights
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Customer Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <MLModelsOverview />
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <IntelligentAutomationPanel />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <AIInsightsPanel />
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                LangGraph Workflows
              </CardTitle>
              <CardDescription>
                Multi-agent workflows and complex business processes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Advanced Workflows</h3>
                <p className="text-muted-foreground">LangGraph workflow management interface coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
