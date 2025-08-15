/**
 * Advanced AI Dashboard Component
 * Story 2.1: AI-Powered Automation & Intelligence
 * 
 * Comprehensive AI dashboard with natural language queries, document processing,
 * intelligent decision making, and AI automation management
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Brain,
  MessageSquare,
  FileText,
  Zap,
  Target,
  Search,
  Upload,
  Download,
  Settings,
  Eye,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Database,
  BarChart3,
  TrendingUp,
  Users,
  Package,
  Clock,
  RefreshCw,
  Play,
  Pause,
  Edit
} from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { NaturalLanguageQueryService } from '@/services/naturalLanguageQuery';
import { DocumentProcessingService } from '@/services/documentProcessing';
import { IntelligentDecisionEngine } from '@/services/intelligentDecisionEngine';
import { AIOrchestrator } from '@/services/aiIntegrations';

// =====================================================
// TYPES
// =====================================================

interface AIMetrics {
  queries_processed: number;
  documents_analyzed: number;
  decisions_made: number;
  automation_rules_active: number;
  average_confidence: number;
  processing_time_avg: number;
}

interface QueryResult {
  query: string;
  response: string;
  confidence: number;
  data_found: boolean;
  visualization?: any;
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export function AdvancedAIDashboard() {
  const { subscription } = useSubscription();
  const [metrics, setMetrics] = useState<AIMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Natural Language Query State
  const [nlQuery, setNlQuery] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  // Document Processing State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingResult, setProcessingResult] = useState<any>(null);
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);

  // Decision Engine State
  const [decisionRequest, setDecisionRequest] = useState('');
  const [decisionResult, setDecisionResult] = useState<any>(null);
  const [isDeciding, setIsDeciding] = useState(false);

  useEffect(() => {
    if (subscription) {
      fetchAIMetrics();
    }
  }, [subscription]);

  const fetchAIMetrics = async () => {
    if (!subscription?.id) return;

    setIsLoading(true);
    try {
      // Mock AI metrics - would come from actual AI services
      const mockMetrics: AIMetrics = {
        queries_processed: 1247,
        documents_analyzed: 89,
        decisions_made: 156,
        automation_rules_active: 23,
        average_confidence: 0.87,
        processing_time_avg: 1250
      };

      setMetrics(mockMetrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch AI metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNaturalLanguageQuery = async () => {
    if (!subscription?.id || !nlQuery.trim()) return;

    setIsQuerying(true);
    setError(null);

    try {
      const result = await NaturalLanguageQueryService.processQuery(
        nlQuery,
        subscription.id
      );

      setQueryResult({
        query: nlQuery,
        response: result.natural_response,
        confidence: result.confidence_score,
        data_found: result.data_results.length > 0,
        visualization: result.visualization_config
      });

      setNlQuery('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process query');
    } finally {
      setIsQuerying(false);
    }
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !subscription?.id) return;

    setSelectedFile(file);
    setIsProcessingDoc(true);
    setError(null);

    try {
      const fileData = await file.arrayBuffer();
      
      const result = await DocumentProcessingService.processDocument(
        {
          file_name: file.name,
          file_type: file.type,
          file_data: fileData,
          context: { source: 'dashboard_upload' },
          auto_execute_actions: false
        },
        subscription.id
      );

      setProcessingResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process document');
    } finally {
      setIsProcessingDoc(false);
    }
  };

  const handleDecisionRequest = async () => {
    if (!subscription?.id || !decisionRequest.trim()) return;

    setIsDeciding(true);
    setError(null);

    try {
      const result = await IntelligentDecisionEngine.makeDecision(
        {
          request_id: `req_${Date.now()}`,
          decision_type: 'general_business',
          description: decisionRequest,
          context: { source: 'dashboard' },
          decision_threshold: 0.7,
          auto_execute: false
        },
        subscription.id
      );

      setDecisionResult(result);
      setDecisionRequest('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to make decision');
    } finally {
      setIsDeciding(false);
    }
  };

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
          <h1 className="text-3xl font-bold">AI-Powered Automation & Intelligence</h1>
          <p className="text-muted-foreground">
            Advanced AI capabilities for natural language queries, document processing, and intelligent decision making
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Story 2.1: AI-Powered Automation & Intelligence
          </Badge>
          <Button variant="outline" onClick={fetchAIMetrics} disabled={isLoading}>
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

      {/* AI Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Queries Processed</p>
                  <p className="text-2xl font-bold">{metrics.queries_processed.toLocaleString()}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Documents Analyzed</p>
                  <p className="text-2xl font-bold">{metrics.documents_analyzed}</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Decisions Made</p>
                  <p className="text-2xl font-bold">{metrics.decisions_made}</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Rules</p>
                  <p className="text-2xl font-bold">{metrics.automation_rules_active}</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Confidence</p>
                  <p className="text-2xl font-bold">{(metrics.average_confidence * 100).toFixed(0)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Processing</p>
                  <p className="text-2xl font-bold">{metrics.processing_time_avg}ms</p>
                </div>
                <Clock className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="nlquery" className="space-y-6">
        <TabsList>
          <TabsTrigger value="nlquery">Natural Language Queries</TabsTrigger>
          <TabsTrigger value="documents">Document Processing</TabsTrigger>
          <TabsTrigger value="decisions">Intelligent Decisions</TabsTrigger>
          <TabsTrigger value="automation">AI Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="nlquery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Natural Language Query Interface
              </CardTitle>
              <CardDescription>
                Ask questions about your business data in plain English
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={nlQuery}
                  onChange={(e) => setNlQuery(e.target.value)}
                  placeholder="Ask me anything about your business data..."
                  onKeyPress={(e) => e.key === 'Enter' && handleNaturalLanguageQuery()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleNaturalLanguageQuery}
                  disabled={isQuerying || !nlQuery.trim()}
                >
                  {isQuerying ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Query
                </Button>
              </div>

              {queryResult && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Query Result</h4>
                      <Badge variant="outline">
                        {(queryResult.confidence * 100).toFixed(0)}% Confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>You asked:</strong> {queryResult.query}
                    </p>
                    <p className="text-sm">{queryResult.response}</p>
                    
                    {queryResult.data_found && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Data found and analyzed
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Example Queries</h4>
                  <div className="space-y-2">
                    {[
                      "How many packages were delivered this month?",
                      "Which customers have the highest value?",
                      "Show me revenue trends for the last quarter",
                      "What's our average delivery time?",
                      "Which carriers perform best?"
                    ].map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left h-auto p-2"
                        onClick={() => setNlQuery(example)}
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Query Capabilities</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Natural language to SQL conversion
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Intelligent data visualization
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Contextual business insights
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Follow-up question suggestions
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                AI Document Processing
              </CardTitle>
              <CardDescription>
                Upload documents for AI-powered analysis, classification, and content extraction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Upload Document</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports PDF, images, and text files
                  </p>
                  <input
                    type="file"
                    onChange={handleDocumentUpload}
                    accept=".pdf,.jpg,.jpeg,.png,.txt"
                    className="hidden"
                    id="document-upload"
                  />
                  <label htmlFor="document-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Choose File
                    </Button>
                  </label>
                </div>
              </div>

              {isProcessingDoc && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Processing document with AI...</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              )}

              {processingResult && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Processing Results</h4>
                      <Badge variant="outline">
                        {(processingResult.confidence_score * 100).toFixed(0)}% Confidence
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">Document Classification</h5>
                        <div className="space-y-2 text-sm">
                          <div>Type: <Badge variant="secondary">{processingResult.classification.document_type}</Badge></div>
                          <div>Category: {processingResult.classification.category}</div>
                          <div>Urgency: <Badge variant={processingResult.classification.urgency_level === 'high' ? 'destructive' : 'outline'}>
                            {processingResult.classification.urgency_level}
                          </Badge></div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Extracted Content</h5>
                        <div className="space-y-2 text-sm">
                          <div>Key Entities: {processingResult.extracted_content.key_entities.length}</div>
                          <div>Dates Found: {processingResult.extracted_content.important_dates.length}</div>
                          <div>Monetary Amounts: {processingResult.extracted_content.monetary_amounts.length}</div>
                        </div>
                      </div>
                    </div>

                    {processingResult.insights.summary && (
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="font-medium mb-2">AI Insights</h5>
                        <p className="text-sm text-muted-foreground">{processingResult.insights.summary}</p>
                      </div>
                    )}

                    {processingResult.automated_actions.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="font-medium mb-2">Recommended Actions</h5>
                        <div className="space-y-1">
                          {processingResult.automated_actions.map((action: any, index: number) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Lightbulb className="h-4 w-4 text-yellow-500" />
                              {action.type}: {action.data ? JSON.stringify(action.data) : 'No additional data'}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Intelligent Decision Engine
              </CardTitle>
              <CardDescription>
                Get AI-powered recommendations for business decisions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Describe your decision scenario:</label>
                <Textarea
                  value={decisionRequest}
                  onChange={(e) => setDecisionRequest(e.target.value)}
                  placeholder="e.g., Should we approve a refund request for customer John Doe who claims their package was damaged?"
                  rows={3}
                />
                <Button 
                  onClick={handleDecisionRequest}
                  disabled={isDeciding || !decisionRequest.trim()}
                  className="w-full"
                >
                  {isDeciding ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Brain className="h-4 w-4 mr-2" />}
                  Get AI Recommendation
                </Button>
              </div>

              {decisionResult && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Decision Recommendation</h4>
                      <Badge variant={
                        decisionResult.decision === 'approve' ? 'default' :
                        decisionResult.decision === 'review' ? 'secondary' : 'destructive'
                      }>
                        {decisionResult.decision.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-2">Confidence Score</h5>
                        <div className="flex items-center gap-2">
                          <Progress value={decisionResult.confidence_score * 100} className="flex-1" />
                          <span className="text-sm font-medium">
                            {(decisionResult.confidence_score * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Explanation</h5>
                        <p className="text-sm text-muted-foreground">
                          {decisionResult.explanation.summary}
                        </p>
                      </div>

                      {decisionResult.factors_considered.length > 0 && (
                        <div>
                          <h5 className="font-medium mb-2">Factors Considered</h5>
                          <div className="space-y-2">
                            {decisionResult.factors_considered.slice(0, 3).map((factor: any, index: number) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span>{factor.name}</span>
                                <Badge variant="outline">{factor.type}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {decisionResult.recommended_actions.length > 0 && (
                        <div>
                          <h5 className="font-medium mb-2">Recommended Actions</h5>
                          <div className="space-y-1">
                            {decisionResult.recommended_actions.map((action: string, index: number) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                {action}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Automation Management
              </CardTitle>
              <CardDescription>
                Monitor and manage AI-powered automation rules and workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Cpu className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">AI Automation Hub</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced automation management interface coming soon
                </p>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Automation Rules
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
